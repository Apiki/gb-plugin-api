<?php
/**
 * Vendor Index Include
 *
 * @package GB WP API
 * @subpackage Vendor
 */
namespace GB\API;

// Avoid that files are directly loaded
if ( ! function_exists( 'add_action' ) ) {
	exit( 0 );
}

App::uses( 'autoload', 'vendor' );
App::uses( 'metaboxes', 'vendor' );
App::uses( 'images-intermediate', 'vendor' );
