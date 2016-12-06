MONKEY( 'Application', function(Application) {

	Application.init = function(container) {
		MONKEY.Translations.init();
		MONKEY.factory.create( container );
	};

}, {} );
