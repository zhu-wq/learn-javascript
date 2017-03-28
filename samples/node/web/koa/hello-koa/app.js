const Koa = require('koa');
// 创建一个Koa对象表示web app本身:
const app = new Koa();
// 对于任何请求，app将调用该异步函数处理请求：
// 其中，参数ctx是由koa传入的封装了request和response的变量，可以通过它访问request和response，next是koa传入的将要处理的下一个异步函数。
app.use(async (ctx, next) => {
    // 当前时间
    const start = new Date().getTime();
    // 调用下一个middleware
    await next();
    // 耗费时间
    const ms = new Date().getTime() - start;
    // 打印URL
    console.log(`${ctx.request.method} ${ctx.request.url}: ${ms}ms`);
    // 打印耗费时间
    ctx.response.set('X-Response-Time', `${ms}ms`);
});
//如果一个middleware没有调用await next(),后续的middleware将不再执行了
app.use(async (ctx, next) => {
    await next();
    ctx.response.type = 'text/html';
    ctx.response.body = '<h1>Hello, koa2!</h1>';
});
// 在端口3000监听:
app.listen(3000);
// 控制台打印服务启用，和监听的端口号
console.log('app started at port 3000...');
