MONKEY.ComponentWrapper( 'FormAjax', function(FormAjax) {

	FormAjax.fn.init = function() {
		this.addEventListener();
	};

	FormAjax.fn.addEventListener = function() {
		this.$el
			.on( 'submit', this._onSubmit.bind( this ) )
		;
	};

	FormAjax.fn._onSubmit = function(event) {
		event.preventDefault();
		this.fire( 'before-submit' );
		this.send();
	};

	FormAjax.fn.beforeSend = function() {
		this.elements.submit.attr( 'disabled', 'disabled' );
		this.elements.submit.spinnerShow( 'after' );
	};

	FormAjax.fn.send = function() {
		var url    = this.$el.attr( 'action' )
		  , params = this.$el.serialize()
		;

		var ajax = jQuery.ajax({
			url       : url,
			data      : params,
			dataType  : 'json',
			type      : 'POST'
		});

		this.beforeSend();
		ajax.done( this._done.bind( this ) );
		ajax.fail( this._fail.bind( this ) );
	};

	FormAjax.fn._done = function(response) {
		this.elements.submit.removeAttr( 'disabled' );
		this.elements.submit.spinnerHide();
		this.$el.messageShowBefore( 'updated', response.message, true );
	};

	FormAjax.fn._fail = function(throwError, status) {
		var response = ( throwError.responseJSON || {} );

		this.elements.submit.removeAttr( 'disabled' );
		this.elements.submit.spinnerHide();
		this.$el.messageShowBefore( 'error', response.message, true );
	};

});
