<?php

namespace GB\API;

// Avoid that files are directly loaded
if ( ! function_exists( 'add_action' ) ) {
	exit( 0 );
}

App::uses( 'utils', 'Helper' );
App::uses( 'attachment', 'Helper' );
App::uses( 'l10n', 'Helper' );
App::uses( 'validation', 'Helper' );
