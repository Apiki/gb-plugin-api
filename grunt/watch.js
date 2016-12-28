module.exports =  {
	styles : {
		files : ['<%= paths.style %>/**/*.scss'],
		tasks : ['sass:dev']
	},
	templates : {
		files: ['riot/**/*.tag'],
		tasks: ['riot:dist']
	},
	scripts : {
		files : '<%= concat.dist.src %>',
		tasks : ['jshint', 'concat:dist']
	}
};
