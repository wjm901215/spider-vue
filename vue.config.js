const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin');
const resolve = dir => {
    return path.join(__dirname, dir)
}

module.exports = {
    productionSourceMap: false,
    // 如果你不需要使用eslint，把lintOnSave设为false即可
    lintOnSave: false,
    chainWebpack: config => {
        config.resolve.alias
            .set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
            .set('_c', resolve('src/components'))
            .set('_cm', resolve('src/views/common'))
        config.module.rules.delete("svg");
        config.module
            .rule("svg-smart")
            .test(/\.svg$/)
            .include.add(resolve("src/assets/icons/svg"))
            .end()
            .use("svg-sprite-loader")
            .loader("svg-sprite-loader")
            .options({
                symbolId: "[name]"
            })
    },
    configureWebpack: {
        plugins: [
            new CopyWebpackPlugin([
                {from: 'node_modules/@liveqing/liveplayer/dist/component/crossdomain.xml'},
                {from: 'node_modules/@liveqing/liveplayer/dist/component/liveplayer.swf'},
                {from: 'node_modules/@liveqing/liveplayer/dist/component/liveplayer-lib.min.js', to: 'js/'},
            ])
        ]
    },
    //开发模式反向代理配置，生产模式请使用Nginx部署并配置反向代理
    devServer: {
        port: 9999,
        proxy: {
            '/api': {
                //本地服务接口地址
                target: 'http://127.0.0.1:10010/',
                ws: true,
                pathRewrite: {
                    '^/api': '/'
                }
            }
        }
    }

}
