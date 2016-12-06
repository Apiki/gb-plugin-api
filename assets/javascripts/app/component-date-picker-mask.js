MONKEY.ComponentWrapper( 'DatePickerMask', function(DatePickerMask) {

	DatePickerMask.fn.init = function() {
		this.$el.datepicker( this.datePickerAttr || {} );
		this.$el.mask( this.maskPattern, this.maskAttr || {} );
	};

});