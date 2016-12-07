<?php

namespace GB\API;

// Avoid that files are directly loaded
if ( ! function_exists( 'add_action' ) ) {
	exit( 0 );
}

App::uses( 'vendor', 'autoload' );
App::uses( 'vendor', 'metaboxes' );
App::uses( 'vendor', 'images-intermediate' );
