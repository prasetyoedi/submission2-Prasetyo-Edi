const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');

module.exports = merge(common, {
    mode: 'development',
    devServer: {
        static: path.join(__dirname, 'dist'),
        compress: true,
        port: 9000,
        proxy: {
            '/v2': {
                target: 'https://notes-api.dicoding.dev',
                changeOrigin: true,
                pathRewrite: { '^/v2': '' },
                open: true,
            },
        },
    },
    devtool: 'inline-source-map',
});
