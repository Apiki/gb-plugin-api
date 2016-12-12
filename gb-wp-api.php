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

if ( ! function_exists( 'add_action' ) ) {
	exit( 0 );
}

class App
{
	const SLUG = 'gb-wp-api';
	const PATH = 'gb-plugin-api';

	public static function uses( $location, $class_name = 'index' )
	{
		include self::plugin_dir() . "{$location}/{$class_name}.php";
	}

	public static function plugins_url( $path )
	{
		return self::plugin_url() . $path;
	}

	public static function plugin_dir_path( $path )
	{
		return self::plugin_dir() . $path;
	}

	public static function plugin_dir()
	{
		return WP_PLUGIN_DIR . DIRECTORY_SEPARATOR . static::PATH . DIRECTORY_SEPARATOR;
	}

	public static function plugin_url()
	{
		return WP_PLUGIN_URL . '/' . static::PATH . '/';
	}

	public static function filemtime( $path )
	{
		return filemtime( self::plugin_dir_path( $path ) );
	}
}

App::uses( 'Config', 'core' );

$core = new Core();

register_activation_hook( __FILE__, array( $core, 'activate' ) );
