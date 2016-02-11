'use strict';

let gulp = require('gulp'),
    vulcanize = require('gulp-vulcanize'),
    babel = require('gulp-babel'),
    crisper = require('gulp-crisper'),
    connect = require('gulp-connect');

gulp.task('serve', () => {
    return connect.server({
        root: 'www',
        port: 4000,
        fallback: './www/index.html'
    });
});

gulp.task('serve-src', () => {
    return connect.server({
        root: 'src',
        port: 4000 || process.env.PORT,
        fallback: './src/index.html'
    });
});

gulp.task('js', () => {
    return gulp.src('src/index.html')
        .pipe(vulcanize({ inlineScripts: true}))
        .pipe(crisper({ scriptInHead: false}))
        .pipe(gulp.dest('www'));
});

gulp.task('babel', ['js'], () => {
    gulp.src('www/index.js')
        .pipe(babel({ presets: ['es2015'] }))
        .pipe(gulp.dest('www'));
});


gulp.task('watch', () => {
    var watcher = gulp.watch(['./src/index.html','./src/lib/**/*.{js,html}'], ['js']);
    watcher.on('change', function(event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
});

gulp.task('default', ['js', 'serve', 'watch']);
gulp.task('build', ['babel']);
gulp.task('production', ['babel', 'serve']);
