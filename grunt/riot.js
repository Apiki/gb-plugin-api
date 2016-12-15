module.exports = {
	options: {
		concat : true
	},
	dist: {
		src: 'riot/**/*.tag',
		dest: '<%= paths.js %>/templates/tags.js'
	}
};
