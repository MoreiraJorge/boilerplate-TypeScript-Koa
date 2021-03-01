import Router from 'koa-router';
const router = new Router();

router.get('/', async (ctx, next) => {
    ctx.body = 'get a user';
});

export default router.routes();