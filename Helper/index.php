<?php

namespace GB\API;

// Avoid that files are directly loaded
if ( ! function_exists( 'add_action' ) ) {
	exit( 0 );
}

App::uses( 'Helper', 'utils' );
App::uses( 'Helper', 'attachment' );
App::uses( 'Helper', 'l10n' );
App::uses( 'Helper', 'validation' );
