module.exports = {
	options : {
		separator : ';'
	},
	dev : {
		src : [
			'<%= paths.js %>/libs/*.js',
			'<%= paths.js %>/templates/*.js',
			'<%= paths.js %>/vendor/*.js',
			'<%= paths.js %>/app/*.js'
		],
		dest : '<%= paths.js %>/built.js',
	}
};