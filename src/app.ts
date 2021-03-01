import koa from "koa";
import rootRoute from './routes/root';

const HOST = 'localhost';
const PORT = 3000;

const app= new koa();

app.use(rootRoute);

app.listen(3000, () => {
    console.log(`Server running on http://${ HOST }:${ PORT }/`);
});
