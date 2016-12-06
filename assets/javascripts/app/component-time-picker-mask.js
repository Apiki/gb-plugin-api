MONKEY.ComponentWrapper( 'TimePickerMask', function(TimePickerMask) {

	TimePickerMask.fn.init = function() {
		this.$el.timepicker( this.timePickerAttr || {} );
		this.$el.mask( this.maskPattern, this.maskAttr || {} );
	};

});