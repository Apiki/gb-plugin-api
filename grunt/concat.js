module.exports = {
	options : {
		separator : ';'
	},
	dist : {
		src : [
			'<%= paths.js %>/libs/*.js',
			'<%= paths.js %>/templates/*.js',
			'<%= paths.js %>/vendor/*.js',
			'<%= paths.js %>/custom/*.js',
			'<%= paths.js %>/boot.js'
		],
		dest : '<%= paths.js %>/built.js',
	}
};
