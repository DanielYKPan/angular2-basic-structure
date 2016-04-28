/**
 * gulpfile
 */

(function () {
    'use strict';

    var gulp = require('gulp'),
        sass = require('gulp-sass'),
        scssLint = require('gulp-scss-lint'),
        cache = require('gulp-cached'),
        sourcemaps = require('gulp-sourcemaps'),
        autoprefixer = require('gulp-autoprefixer'),
        pixrem = require('gulp-pixrem'),
        cssnano = require('gulp-cssnano'),
        ts = require('gulp-typescript'),
        tslint = require('gulp-tslint'),
        Config = require('./gulpfile.config'),
        browserSync = require('browser-sync').create(),
        historyApiFallback = require('connect-history-api-fallback'); // For SPA reload


    var config = new Config();
    var tsProject = ts.createProject('tsconfig.json');

    /**
     * Lint all custom TypeScript files.
     */
    gulp.task('tslint', function () {
        return gulp.src(config.allTypeScript)
            .pipe(tslint())
            .pipe(tslint.report('prose'));
    });

    /**
     * Compile all TypeScript files.
     */
    gulp.task('scripts', function () {
        var tsResult = tsProject.src(config.allTypeScript)
            .pipe(ts(tsProject));

        return tsResult.js.pipe(gulp.dest(config.tsOutputPath));
    });

    /**
     * Compile all sass files, generate pixel fallbacks for rem unit,
     * generate vendor prefix, and minify css files.
     */
    gulp.task('sass', function () {
        return gulp.src(config.mainSass)
            .pipe(sass())
            .pipe(sourcemaps.init())
            .pipe(pixrem())
            .pipe(autoprefixer({
                browsers: ["last 8 version", "> 1%", "ie 9", "ie 8", "ie 7", "ios 6", 'Firefox <= 20'],
                cascade: false
            }))
            .pipe(cssnano())
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(config.scssOutputPath))
            .pipe(browserSync.stream());
    });

    /**
     * Lint all Sass/Scss files
     */
    gulp.task('sass-lint', function () {
        return gulp.src(config.allSass)
            .pipe(cache('scssLint'))
            .pipe(scssLint());
    });


    gulp.task('ts-watch', ['tslint', 'scripts'], function () {
        browserSync.reload();
    });

    gulp.task('serve', ['tslint', 'scripts', 'sass-lint', 'sass'], function () {

        browserSync.init([config.allTypeScript], {
            server: {
                baseDir: "./",
                middleware: [historyApiFallback()]
            }
        });

        // watch all custom typescript files
        gulp.watch(config.allTypeScript, ['ts-watch']);

        // watch all custom sass/scss files
        gulp.watch(config.allSass, ['sass-lint', 'sass']);
    });

})();
