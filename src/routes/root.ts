import Router from 'koa-router';
import UserRouter from './usersRoutes/userRoutes';

const apiRouter = new Router();

apiRouter.get('/', async (ctx, next) => {
    ctx.body = 'Hello World';
});

apiRouter.use('/users', UserRouter);

export default apiRouter.routes();