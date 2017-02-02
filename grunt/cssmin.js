module.exports = {
	options: {
		shorthandCompacting: false,
		roundingPrecision: -1
	},
	target: {
		files: {
			'<%= paths.style %>/style.css': ['<%= paths.style %>/style.css']
		}
	}
};
