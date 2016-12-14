<?php
/*
	Plugin Name: GB Plugin API
	Plugin URI: http://apiki.com.br
	Version: 0.0.1
	Author: Apiki WordPress
	Author URI: http://apiki.com.br
	Text Domain: gb-plugin-api
	Domain Path: /languages
	License: GPLv2
	Description: Keep plugin enabled to enjoy all its functionalities.
*/

if ( ! function_exists( 'add_action' ) ) {
	exit( 0 );
}

use GB\API\Core;

include 'vendor/autoload.php';

$core = new Core( __FILE__ );

register_activation_hook( __FILE__, array( $core, 'activate' ) );
