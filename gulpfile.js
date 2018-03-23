/**
 * Created by yiwei on 16/8/10.
 */
var gulp =require('gulp'),
    webp = require('gulp-webp'),
//命令行的参数
    argv = require('yargs').argv,
    webpack_path = {
        src:'./src',
        page:'./pages/',
        dev:'./dev/'
    };
//默认根据模块名生成webp图片  webpack module src目录生成webp
gulp.task('webp',function () {
    var m = argv.m;
    if(!m)return;
    return gulp.src(webpack_path.src+'/'+m+'/assets/img/**/*')
        .pipe(webp())
        .pipe(gulp.dest(webpack_path.src+'/'+m+'/assets/webp'));
});
