MONKEY.ComponentWrapper( 'UploadUrl', function(UploadUrl, utils, $) {

	if ( !wp.media ) {
		return;
	}

	var upload = wp.media({
		title     : 'Arquivo',
		frame     : 'select',
        multiple  : false,		
		button    : {
			text : 'Selecione um arquivo'
		}
	});

	upload.on( 'select', function() {
		var model = upload.state().get( 'selection' ).first().toJSON();

		if ( typeof upload.control == 'object' ) {
			upload.control.select.call( upload.control, model );
		}

		upload.control = null;
	});

	/*File*/
	var FieldFile = function(container) {
		this.container = container;
		this.value     = this.container.data( 'attr-input-value' );
		this.name      = this.container.data( 'attr-input-name' );
		this.position  = this.container.data( 'attr-input-position' );
		this.$el       = null;
		this.inserted  = false;
		this.create();
	};

	FieldFile.prototype.create = function() {
		this.$el = $( '<input>', {
			type  : 'text',
			class : 'file-input-create-component large-text',
			value : this.value,
			name  : this.name
		});

		!this.inserted && this.insert();
	};

	FieldFile.prototype.insert = function() {
		this.inserted = true;
		this.container[this.position || 'after']( this.$el );
		this.container.addClass( 'create-input-text' );
	};

	FieldFile.prototype.val = function(value) {
		this.value = value;
		this.$el.val( value );
	};

	/*Component*/
	UploadUrl.fn.initialize = function(container) {
		this.container = container;
		this.file      = null;
		this.init();
	};

	UploadUrl.fn.init = function() {
		this.setElements();
		this.addEventListener();
	};

	UploadUrl.fn.setElements = function() {
		this.file = new FieldFile( this.container );
	};

	UploadUrl.fn.addEventListener = function() {
		this.container.on( 'click', this._onClickOpen.bind( this ) );
	};

	UploadUrl.fn._onClickOpen = function(event) {
		this.open();
	};

	UploadUrl.fn.open = function() {
		upload.control = this;
		upload.open();
	};

	UploadUrl.fn.select = function(model) {
		this.file.val( model.url );
	};

});