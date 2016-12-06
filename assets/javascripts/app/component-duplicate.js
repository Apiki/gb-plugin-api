MONKEY.ComponentWrapper( 'Duplicate', function(Duplicate, utils, $) {

	Duplicate.fn.init = function() {
		this.cloned = this.$el.find( this.closest ).eq( 0 ).clone();
		this.load();
	};

	Duplicate.fn.load = function() {
		this.setDefaultSortable();
		this.addEventListener();
	};

	Duplicate.fn.addEventListener = function() {
		this.addEvent( 'click', 'add-item' );
		this.addEvent( 'click', 'remove-item' );
		MONKEY.vars.body.on( 'submit', this._onSubmitForm.bind( this ) );
	};

	Duplicate.fn._onSubmitForm = function(event) {
		this.$el
			.find( this.closest )
				.each( this.setIterateRows.bind( this ) )
		;
	};

	Duplicate.fn.setIterateRows = function(index, element) {
		$( element )
			.find( this.fields )
				.each( $.proxy( this, 'setIterateItems', index ) )
		;
	};

	Duplicate.fn.setIterateItems = function(origin, index, element) {
		var name = element.name;

		if ( !~name.indexOf( '#' ) ) {
			return;
		}

		element.name = name.replace( '#', origin );
	};

	Duplicate.fn._onClickAddItem = function(event) {
		this.addRow( $( event.currentTarget ) );
	};

	Duplicate.fn._onClickRemoveItem = function(event) {
		this.removeRow( $( event.currentTarget ) );
	};

	Duplicate.fn.removeRow = function(target) {
		if ( this.isLastRow() ) {
			return;
		}

		if ( window.confirm( 'Você realmente deseja apagar esse item?' ) ) {
			target.closest( this.closest ).remove();
		}
	};

	Duplicate.fn.addRow = function(target) {
		target.closest( this.closest )
		      .after( this.getClone() )
		;
	};

	Duplicate.fn.getClone = function() {
		var clone = this.cloned.clone();

		clone.find( this.fields ).val( '' );
		this.setComponents( clone );

		return clone;
	};

	Duplicate.fn.isLastRow = function() {
		return ( this.$el.find( this.closest ).length == 1 );
	};

	Duplicate.fn.setComponents = function(clone) {
		MONKEY.factory.create( clone );
	};

	Duplicate.fn.setDefaultSortable = function() {
		this.$el.sortable({
			handle      : this.handle,
			placeholder : 'sortable-placeholder',
			cursor      : 'move',
			opacity     : 0.65,
			start       : function(e, ui) {
				ui.placeholder.height( ui.helper.outerHeight() - 2 );
			},
		});
	};

});