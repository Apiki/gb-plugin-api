<?php

namespace GB\API;

// Avoid that files are directly loaded
if ( ! function_exists( 'add_action' ) ) {
	exit( 0 );
}

App::uses( 'factory', 'Model' );
App::uses( 'post', 'Model' );
App::uses( 'term', 'Model' );
App::uses( 'user', 'Model' );
App::uses( 'comment', 'Model' );
