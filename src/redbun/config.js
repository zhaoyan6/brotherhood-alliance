/**
 * Created by chenlei on 2016/9/22.
 */
module.exports = {
    jsChunk: {
        entry_1: './src/redbun/index.js'
    },
    htmlChunk: {
        index: {
            template: './src/redbun/index.html',
            chunks: ['entry_1']
        }
    }
};