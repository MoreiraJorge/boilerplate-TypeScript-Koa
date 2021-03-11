/* eslint-disable no-case-declarations */
import Router from "koa-router";
import Stripe from "stripe";
import koabody from "koa-body";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY as string;
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET as string;

const stripe = new Stripe(STRIPE_SECRET_KEY, {
    apiVersion: "2020-08-27",
    typescript: true
});

const router = new Router();

router.post("/webhook", 
    koabody({ includeUnparsed : true }), 
    async (ctx) => {
    
    // get the webhook signature for verification
    const sig = ctx.request.headers['stripe-signature'] as string;

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        // get the rawBody
        ctx.request.body[Symbol.for("unparsedBody")],
        sig, 
        WEBHOOK_SECRET
        );
    }
    catch (err) {
        console.log(`⚠️ Webhook signature verification failed.`);
        ctx.status = 400;
        ctx.response.body = `Webhook Error: ${err.message}`;
        return;
    }

    // Extract the data from the event.
    const data: Stripe.Event.Data = event.data;

    // Handle the event types you want, these are just examples
    switch (event.type) {
        case 'payment_intent.succeeded':
            // Cast the event into a PaymentIntent to make use of the types.
            const pi: Stripe.PaymentIntent = data.object as Stripe.PaymentIntent;
            // Funds have been captured
            // Fulfill any orders, e-mail receipts, etc
            console.log(`🔔  Webhook received: ${pi.object} ${pi.status}!`);
            console.log("💰 Payment captured!");
            break;
        case 'payment_method.attached':
            console.log('PaymentMethod was attached to a Customer!');
            break;
        // ... handle other event types
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    // Return a response to acknowledge receipt of the event
    ctx.status = 200;
});

router.get("/checkout-session", async (ctx) => {
  const sessionParam = ctx.request.query;
  const sessionId:string = sessionParam.sessionId as string;
  const session = await stripe.checkout.sessions.retrieve(sessionId); 
  ctx.status = 200;
  ctx.response.body = session;
});

router.post("/create-checkout-session", koabody(), async (ctx) => {
    const domainURL = process.env.DOMAIN;
    const { priceId, customerMail } = ctx.request.body;

    console.log(priceId);
    console.log(customerMail);
  
    // Create new Checkout Session for the order
    // Other optional params include:
    // [billing_address_collection] - to display billing address details on the page
    // [customer] - if you have an existing Stripe Customer ID
    // [customer_email] - lets you prefill the email input in the form
    // For full details see https://stripe.com/docs/api/checkout/sessions/create
    try {
      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        payment_method_types: ["card"],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        customer_email: customerMail,
        // ?session_id={CHECKOUT_SESSION_ID} means the redirect will have the session ID set as a query param
        success_url: `${domainURL}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${domainURL}/canceled`,
      });
  
      ctx.response.body = { sessionId: session.id };

    } catch (e) {
        ctx.status = 400;
        ctx.response.body = { error: { message: e.message, }};
    }
  });

  router.get("/setup", (ctx) => {
    ctx.status = 200;
    ctx.response.body = { publishableKey: process.env.STRIPE_PUBLISHABLE_KEY, basicPrice: process.env.BASIC_PRICE_ID, proPrice: process.env.PRO_PRICE_ID };
  });

  router.post('/customer-portal', async (ctx) => {
    // For demonstration purposes, we're using the Checkout session to retrieve the customer ID. 
    // Typically this is stored alongside the authenticated user in your database.
    const { sessionId } = ctx.request.body;
    const checkoutsession = await stripe.checkout.sessions.retrieve(sessionId);
  
    // This is the url to which the customer will be redirected when they are done
    // managing their billing with the portal.
    const returnUrl = process.env.DOMAIN;
  
    const portalsession = await stripe.billingPortal.sessions.create({
      customer : `${ checkoutsession.customer }`,
      return_url: returnUrl,
    });
    
    ctx.status = 200;
    ctx.response.body = `url: ${portalsession.url}`;
  });

  export default router;




