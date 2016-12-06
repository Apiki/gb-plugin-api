MONKEY.ComponentWrapper( 'Mask', function(Mask) {

	Mask.fn.init = function() {
		this.$el.mask( this.pattern, this.attr || {} );
	};

});
