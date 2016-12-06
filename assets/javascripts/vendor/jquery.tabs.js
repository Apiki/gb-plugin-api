;(function($, window) {

	var Tabs = function(container, attrs) {
		this.container            = container;
		this.header               = this.container.find( '.contextual-tabs-header' );
		this.content              = this.container.find( '.contextual-tabs-content' );
		this._currentActiveHeader = null;
		this.afterShowCallback    = null;
		this.defaultIndex         = 1;
		this.assign( attrs );
	};

	Tabs.prototype.init = function() {
		this.showDefaultIndex();
		this.addEventListener();
	};

	Tabs.prototype.addEventListener = function() {
		this.header
			.on( 'click', '[data-action="change"]', this._onClickChangeTabs.bind( this ) )
		;
	};

	Tabs.prototype.showDefaultIndex = function() {
		var target = this.header.find( '[href=#' + this.defaultIndex + ']' );
		var active = target.parent();

		this.setCurrentAll( this.defaultIndex, active );
		this.content.fadeIn( 200 );
	};

	Tabs.prototype._onClickChangeTabs = function(event) {
		var target = $( event.currentTarget );
		var index  = target.attr( 'href' ).replace( '#', '' );
		var active = target.parent();

		this.setCurrentAll( index, active );
	};

	Tabs.prototype.setCurrentAll = function(index, active) {
		this.removeCurrentActiveHeader( active );
		this.show( index );

		//callback active tab
		( this.afterShowCallback || $.noop ).call( null, index, active );

		active.addClass( 'active' );
	};

	Tabs.prototype.removeCurrentActiveHeader = function(current) {
		if ( this._currentActiveHeader ) {
			this._currentActiveHeader.removeClass('active');
		}

		this._currentActiveHeader = current;
	};

	Tabs.prototype.show = function(index) {
		this.content
			.find( '.tab-item' )
				.addClass( 'hide' )
				.filter( '[data-index="' + index + '"]' )
				.removeClass( 'hide' )
		;
	};

	Tabs.prototype.assign = function(attrs) {
		for ( var item in attrs ) {
			if ( !this.hasOwnProperty(item) || this[item] != attrs[item] ) {
				this[item] = attrs[item];
			}
		}
	};

	$.fn.apikiTabs = function(options) {
		var tabs = new Tabs( this, options );
		tabs.init();
	};

})( jQuery, window );
