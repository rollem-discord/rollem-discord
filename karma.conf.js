module.exports = config => {
	config.set(
		{
			basePath: '',
			frameworks: ['jasmine', 'browserify'],
			preprocessors: {
				'app/tests/*.js': [ 'browserify' ]
			},
			plugins: [
				require('karma-jasmine')
			],
			files: [
				{pattern: './test/*.js', watched: false}
			]
		}
	);
};