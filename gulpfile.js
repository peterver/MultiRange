'use strict';

//
//  SETUP
//

    const gulp = require('gulp');
    const $ = require('gulp-load-plugins')({
        pattern: ['*'],
        replaceString: /\bgulp[\-.]/
    });

    const onError = (err) => {
        $.notify({
            title : 'Gulp',
            message : 'Error: <%= err.message %='
        });
    };

    const config = {
        eslintrc : '.eslintrc',
        scsslint : '.scss-lint.yml',
        js : {
            src : ['src/js/**/**.js'],
            dest : 'dist/js/'
        },
        scss : {
            src : ['src/sass/**/**.scss'],
            dest : 'dist/css/'
        }
    };

//
//  TASKS : JAVASCRIPT
//

    gulp.task('js', (cb) => gulp.src(config.js.src)
        .pipe($.plumber({
            errorHandler : onError
        }))
        .pipe($.eslint(config.eslintrc))
        .pipe($.eslint.format())
        .pipe($.babel({
            presets : ['es2015'],
            plugins : [
                'check-es2015-constants',
                'transform-minify-booleans',
                'transform-property-literals',
                'transform-member-expression-literals',
                'transform-merge-sibling-variables'
            ]
        }))
        .pipe($.uglify())
        .pipe($.rename({
            suffix : '.min'
        }))
        .pipe(gulp.dest(config.js.dest))
    );

//
//  TASKS : SCSS
//

    gulp.task('scss', (cb) => gulp.src(config.scss.src)
        .pipe($.plumber({
            errorHandler : onError
        }))
        .pipe($.scssLint({
            config : config.scsslint
        }))
        .pipe($.sass({
            outputStyle : 'compressed'
        }))
        .pipe($.autoprefixer())
        .pipe($.rename({
            suffix : '.min'
        }))
        .pipe(gulp.dest(config.scss.dest)));

//
//  WATCH
//

    gulp.task('watch', (cb) => {
        gulp.watch(config.js.src, ['js']);
        gulp.watch(config.scss.src, ['scss']);
    });

//
//  GROUPED TASKS
//

    gulp.task('build', [],
        (cb) => $.runSequence(['js', 'scss'], cb)
    );

    gulp.task('default',
        (cb) => $.runSequence('build', 'watch')
    );

    gulp.task('production', [],
        (cb) => $.runSequence('build', cb)
    );