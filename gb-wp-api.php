<?php
/*
	Plugin Name: GB WP API
	Plugin URI: http://apiki.com.br
	Version: 0.0.1
	Author: Apiki WordPress
	Author URI: http://apiki.com.br
	Text Domain: gb-wp-api
	Domain Path: /languages
	License: GPLv2
	Description: Keep plugin enabled to enjoy all its functionalities.
*/
namespace GB\API;

// Avoid that files are directly loaded
if ( ! function_exists( 'add_action' ) ) {
	exit( 0 );
}

class App
{
	const PLUGIN_SLUG = 'gb-wp-api';

	public static function uses( $location, $class_name = 'index' )
	{
		include "{$location}/{$class_name}.php";
	}

	public static function plugins_url( $path )
	{
		return plugins_url( $path, __FILE__ );
	}

	public static function plugin_dir_path( $path )
	{
		return plugin_dir_path( __FILE__ ) . $path;
	}

	public static function filemtime( $path )
	{
		return filemtime( self::plugin_dir_path( $path ) );
	}

	public static function load_textdomain()
	{
		load_plugin_textdomain( self::PLUGIN_SLUG, false, plugin_basename( dirname( __FILE__ ) ) . '/languages' );
	}
}

App::uses( 'Config', 'core' );

$core = new Core();

register_activation_hook( __FILE__, array( $core, 'activate' ) );
