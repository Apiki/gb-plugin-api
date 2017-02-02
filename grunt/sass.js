module.exports = {
	dev: {
		options: {
			style: 'expanded',
		},
		files: {
			'<%= paths.style %>/style.css': '<%= paths.style %>/style.scss'
		}
	},
};
