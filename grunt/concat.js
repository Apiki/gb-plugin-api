module.exports = {
	options : {
		separator : ';'
	},
	dev : {
		src : [
			'<%= paths.js %>/libs/*.js',
			'<%= paths.js %>/templates/*.js',
			'<%= paths.js %>/vendor/*.js',
			'<%= paths.js %>/app/*.js',
			'<%= paths.js %>/boot.js'
		],
		dest : '<%= paths.js %>/built.js',
	}
};
