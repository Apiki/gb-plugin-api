MONKEY( 'Translations', function(Translations) {

	Translations.init = function() {
		this.datePicker();
		this.timePicker();
	};

	Translations.datePicker = function() {
		if ( !jQuery.datepicker ) {
			return;
		}

		jQuery.datepicker.regional['pt-BR'] = {
			closeText		: 'Fechar',
			prevText		: '&#x3c;Anterior',
			nextText		: 'Pr&oacute;ximo&#x3e;',
			currentText		: 'Hoje',
			monthNames 		: ['Janeiro','Fevereiro','Mar&ccedil;o','Abril','Maio','Junho', 'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
			monthNamesShort : ['Jan','Fev','Mar','Abr','Mai','Jun', 'Jul','Ago','Set','Out','Nov','Dez'],
			dayNames 		: ['Domingo','Segunda-feira','Ter&ccedil;a-feira','Quarta-feira','Quinta-feira','Sexta-feira','Sabado'],
			dayNamesShort 	: ['Dom','Seg','Ter','Qua','Qui','Sex','Sab'],
			dayNamesMin 	: ['Dom','Seg','Ter','Qua','Qui','Sex','Sab'],
			weekHeader 		: 'Sm',
			dateFormat 		: 'dd/mm/yy',
			firstDay 		: 0,
			isRTL 			: false,
			yearSuffix 		: '',
			showMonthAfterYear: false
		};

		jQuery.datepicker.setDefaults(jQuery.datepicker.regional['pt-BR']);
	};

	Translations.timePicker = function() {
		if ( !jQuery.timepicker ) {
			return;
		}

		jQuery.timepicker.regional['pt-BR'] = {
			timeOnlyTitle: 'Escolha o horário',
			timeText: 'Horário',
			hourText: 'Hora',
			minuteText: 'Minutos',
			secondText: 'Segundos',
			millisecText: 'Milissegundos',
			timezoneText: 'Fuso horário',
			currentText: 'Agora',
			closeText: 'Fechar',
			timeFormat: 'HH:mm',
			amNames: ['a.m.', 'AM', 'A'],
			pmNames: ['p.m.', 'PM', 'P'],
			isRTL: false
		};

		jQuery.timepicker.setDefaults(jQuery.timepicker.regional['pt-BR']);
	};

}, {} );
