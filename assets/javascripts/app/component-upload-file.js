MONKEY.ComponentWrapper( 'UploadFile', function(UploadFile, utils, $) {

	if ( !wp.media ) {
		return;
	}

	var upload = wp.media({
		title     : 'Imagem',
		frame     : 'select',
        multiple  : false,
		library   : {
			type: 'image'
		},
		button    : {
			text : 'Selecione uma imagem'
		}
	});

	upload.on( 'select', function() {
		var model = upload.state().get( 'selection' ).first().toJSON();

		if ( typeof upload.control == 'object' ) {
			upload.control.select.call( upload.control, model );
		}

		upload.control = null;
	});

	upload.on( 'open', function() {
		var attachment = wp.media.attachment( upload.current )
		  , selection  = upload.state().get( 'selection' )
		;
  		
  		selection.add( attachment ? [attachment] : [] );
	});

	/*Image*/
	var FieldImage = function(container) {
		this.container = container;
		this.src       = this.container.data( 'attr-image-src' );
		this.empty     = this.container.data( 'attr-image-empty' );
		this.position  = this.container.data( 'attr-image-position' );
		this.$el       = $( '<img>' );
		this.on        = $.proxy( this.$el, 'on' );
		this.fire      = $.proxy( this.$el, 'trigger' );
		this.inserted  = false;
		this.create();
	};

	FieldImage.prototype.create = function() {
		if ( !this.src && !this.empty ) {
			return;
		}

		this.$el
			.addClass( 'image-create-component' )
			.attr( 'src', this.getSrc() )
		;

		!this.inserted && this.insert();
	};

	FieldImage.prototype.getSrc = function() {
		return ( this.src || this.empty );
	};

	FieldImage.prototype.setEmptyImage = function() {
		if ( this.empty ) {
			this.$el.attr( 'src', this.empty );
			return;
		}

		this.$el.hide();
	};

	FieldImage.prototype.insert = function() {
		this.inserted = true;
		this.container[this.position || 'before']( this.$el );
		this.container.addClass( 'created-image' );
	};

	FieldImage.prototype.reload = function(src) {
		this.src = src;
		this.create();
		this.$el.show();
	};

	/*Hidden*/
	var FieldHidden = function(container) {
		this.container = container;
		this.value     = this.container.data( 'attr-hidden-value' );
		this.name      = this.container.data( 'attr-hidden-name' );
		this.$el       = null;
		this.create();
	};

	FieldHidden.prototype.create = function() {
		this.$el = $( '<input>', {
			type  : 'hidden',
			class : 'hidden-create-component',
			value : this.value,
			name  : this.name
		});

		this.container.before( this.$el );
	};

	FieldHidden.prototype.val = function(value) {
		this.value = value;
		this.$el.val( value );
	};

	FieldHidden.prototype.isEmpty = function() {
		return ( !this.value );
	};

	/*Remove*/
	var FieldRemove = function(container) {
		this.container = container;
		this.className = this.container.data( 'attr-remove-class' );
		this.text      = this.container.data( 'attr-remove-text' );
		this.$el       = $( '<a href="javascript:void(0);">' );
		this.on        = $.proxy( this.$el, 'on' );
		this.fire      = $.proxy( this.$el, 'trigger' );
		this.create();
	};

	FieldRemove.prototype.create = function() {
		this.$el
			.addClass( this.className || 'button-remove' )
			.text( this.text || 'Remover imagem destacada' )
			.hide()
		;

		this.container.after( this.$el );
	};

	/*Component*/
	UploadFile.fn.initialize = function(container) {
		this.container = container;
		this.image     = null;
		this.hidden    = null;
		this.remove    = null;
		this.init();
	};

	UploadFile.fn.init = function() {
		this.setElements();
		this.setControlButtonRemove();
		this.addEventListener();
	};

	UploadFile.fn.setElements = function() {
		this.image  = new FieldImage( this.container );
		this.hidden = new FieldHidden( this.container );
		this.remove = new FieldRemove( this.container ); 
	};

	UploadFile.fn.setControlButtonRemove = function() {
		if ( this.hidden.isEmpty() ) {
			return;
		}
		
		this.setVisibleActions();
	};

	UploadFile.fn.setVisibleActions = function() {
		this.remove.$el.show();
		this.container.hide();
	};

	UploadFile.fn.addEventListener = function() {
		this.container.on( 'click', this._onClickOpen.bind( this ) );
		this.image.on( 'click', this._onClickOpen.bind( this ) );
		this.remove.on( 'click', this._onClickRemove.bind( this ) );
	};

	UploadFile.fn._onClickOpen = function(event) {
		this.open();
	};

	UploadFile.fn._onClickRemove = function() {
		this.reset();
	};

	UploadFile.fn.reset = function() {
		this.hidden.val( '' );
		this.image.setEmptyImage();
		this.container.show();
		this.remove.$el.hide();
	};

	UploadFile.fn.open = function() {
		upload.control = this;
		upload.current = this.hidden.$el.val();
		upload.open();
	};

	UploadFile.fn.select = function(model) {
		this.image.reload( model.url );
		this.hidden.val( model.id );
		this.setVisibleActions();
	};

});