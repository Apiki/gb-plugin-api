MONKEY.ComponentWrapper( 'DateTimePicker', function(DateTimePicker) {

	DateTimePicker.fn.init = function() {
		this.$el.datetimepicker();
	};

});