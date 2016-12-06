<?php

namespace GB\API;

// Avoid that files are directly loaded
if ( ! function_exists( 'add_action' ) ) {
	exit( 0 );
}

App::uses( 'post-type', 'Controller' );
App::uses( 'taxonomy', 'Controller' );
App::uses( 'widget', 'Controller' );
