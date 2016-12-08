<?php

namespace GB\API;

if ( ! function_exists( 'add_action' ) ) {
	exit( 0 );
}

App::uses( 'Controller', 'post-type' );
App::uses( 'Controller', 'taxonomy' );
App::uses( 'Controller', 'widget' );
App::uses( 'Controller', 'users' );

