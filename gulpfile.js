var gulp = require('gulp'), // gulp打包工具
    less = require('gulp-less'), // less编译插件
    plumber = require('gulp-plumber'), // 报错并继续执行
    cssmin = require('gulp-clean-css'), // css压缩插件
    autoprefix = require('gulp-autoprefixer'), // css补全前缀
    uglify = require('gulp-uglify'), // js压缩插件
    rename = require('gulp-rename'), // 重命名
    concat = require("gulp-concat"); // 文件合并

var autoprefixOptions = {
    browsers: ['last 2 versions', '>1%', 'Android >= 3.2'],
}
var game = 'demo';

// 合并所有js到all.js
gulp.task('concat', function () {
    gulp.src('js/*.js')
    .pipe(concat('all.js'))
    .pipe(gulp.dest('dist/js'));
});

// 编译less并压缩输出css
gulp.task('less', function() {
    return gulp.src(game + '/css/*.less')
        .pipe(less())
        .pipe(plumber())
        .pipe(autoprefix(autoprefixOptions))
        .pipe(cssmin())
        .pipe(gulp.dest(game + '/css/'));
});

// 压缩js
gulp.task('js', function() {
    return gulp.src([game + '/js/*.js','!' + game + '/js/*.min.js'])
        .pipe(plumber())
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(game + '/js/'));
});

// 开启监控，当这些文件变化时自动执行任务
gulp.task('watch', function() {
    gulp.watch(game + '/css/**/*.less', ['less']);
    gulp.watch(game + '/js/*.js', ['js']);
});

// 默认执行所有任务
gulp.task('default',['less','js'], function() {

});