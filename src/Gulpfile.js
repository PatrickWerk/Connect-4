// gulp.js einbauen
var gulp = require('gulp'); 

// Plugins einbauen
var gutil = require('gulp-util');
var minifyhtml = require ('gulp-minify-html');
    
// Gulp default task
gulp.task('default', ['scripts','minHtml', 'copyPixi']);

gulp.task('scripts', function() {
    gulp.src('scripts/*')
    .pipe(gulp.dest('../build/scripts/'));
});

gulp.task('copyPixi', function() {
   gulp.src('./libs/pixi.js-master/bin/pixi.js')
   .pipe(gulp.dest('../build/libs/pixi.js-master/bin/'));
});

gulp.task('minHtml', function(){
  gulp.src('./index.html')
  .pipe(minifyhtml())
  .pipe(gulp.dest('../build'));
});