<?php

namespace GB\API;

// Avoid that files are directly loaded
if ( ! function_exists( 'add_action' ) ) {
	exit( 0 );
}

App::uses( 'Model', 'factory' );
App::uses( 'Model', 'post' );
App::uses( 'Model', 'term' );
App::uses( 'Model', 'user' );
App::uses( 'Model', 'comment' );
