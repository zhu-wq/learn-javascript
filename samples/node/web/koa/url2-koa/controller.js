
const fs = require('fs');

// add url-route in /controllers:
function addMapping(router, mapping) {
    for (var url in mapping) {
        if (url.startsWith('GET ')) {
            // 如果url类似"GET xxx":
            var path = url.substring(4);
            router.get(path, mapping[url]);
            console.log(`register URL mapping: GET ${path}`);
        } else if (url.startsWith('POST ')) {
            // 如果url类似"GET xxx":
            var path = url.substring(5);
            router.post(path, mapping[url]);
            console.log(`register URL mapping: POST ${path}`);
        } else if (url.startsWith('PUT ')) {
            // 如果url类似"PUT xxx":
            var path = url.substring(4);
            router.put(path, mapping[url]);
            console.log(`register URL mapping: PUT ${path}`);
        } else if (url.startsWith('DELETE ')) {
            // 如果url类似"DELETE xxx":
            var path = url.substring(7);
            router.del(path, mapping[url]);
            console.log(`register URL mapping: DELETE ${path}`);
        } else {
            // 无效的URL:
            console.log(`invalid URL: ${url}`);
        }
    }
}

function addControllers(router, dir) {
    // 用readdirSync列出文件,这里可以用sync是因为启动时只运行一次，不存在性能问题
    fs.readdirSync(__dirname + '/' + dir).filter((f) => {
        // 过滤出.js文件:
        return f.endsWith('.js');
    }).forEach((f) => {
        // 处理每个js文件:
        console.log(`process controller: ${f}...`);
        // 导入js文件:
        let mapping = require(__dirname + '/' + dir + '/' + f);
        // 注册每个URL
        addMapping(router, mapping);
    });
}

module.exports = function (dir) {
    let
        controllers_dir = dir || 'controllers',
        router = require('koa-router')();
    //自动扫描controllers目录，找到所有js文件，导入，然后注册每个URL：
    addControllers(router, controllers_dir);
    return router.routes();
};
