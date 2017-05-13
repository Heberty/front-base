var gulp        = require('gulp');
var sass        = require('gulp-sass');
var browserSync = require('browser-sync').create();
var concat      = require('gulp-concat');
var cssnano     = require('gulp-cssnano');
var uglify      = require('gulp-uglify');
var sourcemaps  = require('gulp-sourcemaps');
var jshint      = require('gulp-jshint');
var plumber     = require('gulp-plumber');
var stylish     = require('jshint-stylish');
var mkdirp 		= require('mkdirp');

var reload      = browserSync.reload;

var path = {
	sass : {
		src : [
			'./src/sass/app.scss'
		],
		watch : [
			'./src/sass/*.scss',
			'./src/sass/**/*.scss'
		],
	},
	css : {
		src : [
			'./bower_components/bootstrap/dist/css/bootstrap.min.css',
			'./bower_components/font-awesome/css/font-awesome.min.css',
		],
		watch : [
			'./assets/css/*.css'
		],
		output : './assets/css/'
	},
	fonts : {
		src : [
			'./bower_components/bootstrap/dist/fonts/*',
			'./bower_components/font-awesome/fonts/*',
		],
		output : './assets/fonts/'
	},
	js : {
		vendor : [
		 	'./bower_components/jquery/dist/jquery.min.js',
		 	'./bower_components/bootstrap/dist/js/bootstrap.min.js'
		],
		app : [
			'./src/js/*.js'
		],
		watch : [
			'./assets/js/*.js'
		],
		output : './assets/js'
	},
	html : {
		watch : [
			'*.html'
		]
	},
	deploy : {
		css : [
			'./assets/css/vendor.css',
			'./assets/css/app.css'
		],
		js : [
			'./assets/js/vendor.js',
			'./assets/js/app.js'
		]
	}
};



gulp.task('start-paths', function(){
	mkdirp('./src/sass/', function (err) {
		if (err) console.error(err)
		else console.log('srs/sass/ created!')
	});
	mkdirp('./src/js/', function (err) {
		if (err) console.error(err)
		else console.log('src/js/ created!')
	});
	mkdirp('./assets/css/', function (err) {
		if (err) console.error(err)
		else console.log('assets/css/ created!')
	});
	mkdirp('./assets/js/', function (err) {
		if (err) console.error(err)
		else console.log('assets/js/ created!')
	});
	mkdirp('./assets/fonts/', function (err) {
		if (err) console.error(err)
		else console.log('assets/fonts/ created!')
	});
	mkdirp('./assets/images/', function (err) {
		if (err) console.error(err)
		else console.log('assets/images/ created!')
	});

})

gulp.task ('sass', function() {
	return gulp.src(path.sass.src)
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(sass())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(path.css.output));
});

gulp.task ('css', function() {
	return gulp.src(path.css.src)
		.pipe(concat('vendor.css'))
		.pipe(gulp.dest(path.css.output));
});

gulp.task ('js:vendor', function() {
	return gulp.src(path.js.vendor)
		.pipe(concat('vendor.js'))
		.pipe(gulp.dest(path.js.output));
});

gulp.task ('js:app', function() {
	return gulp.src(path.js.app)
		.pipe(sourcemaps.init())
		.pipe(plumber())
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'))
		.pipe(concat('app.js'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(path.js.output));
});

gulp.task ('deploy:css', function() {
	return gulp.src(path.deploy.css)
		.pipe(concat('style.min.css'))
		.pipe(cssnano({
		    discardComments: {
		        removeAll: true
		    }
		}))
		.pipe(gulp.dest(path.css.output));
});

gulp.task ('deploy:js', function() {
	return gulp.src(path.deploy.js)
		.pipe(concat('script.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest(path.js.output));
});

gulp.task ('fonts', function() {
	return gulp.src(path.fonts.src)
		.pipe(gulp.dest(path.fonts.output));
});

gulp.task('sync', function(){
	browserSync.init({
		proxy : 'localhost'
	})
});

gulp.task('watch', function(){
	gulp.watch(path.sass.watch, ['sass']);
	gulp.watch(path.css.watch).on('change', reload);
	gulp.watch(path.js.app, ['js:app']);
	gulp.watch(path.js.watch).on('change', reload);
	gulp.watch(path.html.watch).on('change', reload);

});

gulp.task('deploy', ['deploy:css', 'deploy:js']);

gulp.task('js', ['js:app', 'js:vendor']);

gulp.task('default', ['start-paths', 'css' ,'sass', 'js' , 'sync', 'watch']);