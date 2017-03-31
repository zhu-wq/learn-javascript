const nunjucks = require('nunjucks');

//nunjucks.render 通常会使用最近一次调用nunjucks.configure时的配置。由于这种做法是隐性的，它可能会渲染出意料之外的结果，
//所以在大多数情况下我们不推荐使用这类简单的API(特别是用到configure的情况);列如：
//var template = nunjucks.compile('Hello {{ username }}');
//template.render({ username: 'James' });
//我们推荐使用var env = nunjucks.configure(...)创建一个独立的环境，并调用env.render(...)进行渲染。列如：
//nunjucks.configure('/views');// 在浏览器端最好使用绝对地址
//nunjucks.configure({ autoescape: true });
//nunjucks.configure('views', {
//    autoescape: true,
//    express: app,
//    watch: true
//});
//var env = nunjucks.configure('views');

function createEnv(path, opts) {
    var
        autoescape = opts.autoescape === undefined ? true : opts.autoescape,
        noCache = opts.noCache || false,
        watch = opts.watch || false, //如果为 true，当文件系统上的模板变化了，系统会自动更新他。使用前请确保已安装可选依赖 chokidar。
        throwOnUndefined = opts.throwOnUndefined || false,
        env = new nunjucks.Environment(
            new nunjucks.FileSystemLoader(path, {
                noCache: noCache,
                watch: watch,
            }), {
                autoescape: autoescape,
                throwOnUndefined: throwOnUndefined
            });
    if (opts.filters) {
        for (var f in opts.filters) {
            env.addFilter(f, opts.filters[f]);
        }
    }
    return env;
}

var env = createEnv('views', {
    watch: true,
    filters: {
        hex: function (n) {
            return '0x' + n.toString(16);
        }
    }
});

var s = env.render('hello.html', {
    name: '<Nunjucks>',
    fruits: ['Apple', 'Pear', 'Banana'],
    count: 12000
});

console.log(s);

console.log(env.render('extend.html', {
    header: 'Hello',
    body: 'bla bla bla...'
}));
