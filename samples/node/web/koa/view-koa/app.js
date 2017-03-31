const Koa = require('koa');

const bodyParser = require('koa-bodyparser');

const controller = require('./controller');

const templating = require('./templating');

const app = new Koa();

//Node.js在全局变量process中定义了一个环境变量env.NODE_ENV
//开发的时候环境变量应该设置为'development'或空，而部署到服务器时，环境变量应该设置为'production'。
//在编写代码的时候，要根据当前环境作不同的判断。
const isProduction = process.env.NODE_ENV === 'production';

// log request URL:
app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    var
        start = new Date().getTime(),
        execTime;
    await next();
    execTime = new Date().getTime() - start;
    ctx.response.set('X-Response-Time', `${execTime}ms`);
});

// static file support:
//这是因为在生产环境下，静态文件是由部署在最前面的反向代理服务器（如Nginx）处理的，
//Node程序不需要处理静态文件。而在开发环境下，我们希望koa能顺带处理静态文件，
//否则，就必须手动配置一个反向代理服务器，这样会导致开发环境非常复杂。
if (! isProduction) {
    let staticFiles = require('./static-files');
    app.use(staticFiles('/static/', __dirname + '/static'));
}

// parse request body:
app.use(bodyParser());

// add nunjucks as view:
app.use(templating('views', {
    noCache: !isProduction,
    watch: !isProduction
}));

// add controller:
app.use(controller());

app.listen(3000);
console.log('app started at port 3000...');
