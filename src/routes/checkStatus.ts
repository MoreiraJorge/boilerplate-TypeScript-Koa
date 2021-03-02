import Router from "koa-router";
const router = new Router();

router.get('/', async(ctx) => {
    try{
        ctx.body = "I am Alive!"
    }catch(e){
        console.error(e);
    }
});

export default router;