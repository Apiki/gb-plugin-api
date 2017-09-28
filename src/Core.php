<?php

namespace GB\API;

if ( ! function_exists( 'add_action' ) ) {
	exit( 0 );
}

use Carbon_Fields;

class Core extends Loader
{
	/**
	 * Initialize class in __construct Loader
	 */
	public function initialize()
	{
		add_action( 'activated_plugin', array( &$this, 'force_load_first' ) );
		add_action( 'after_setup_theme', array( &$this, 'init_carbon_fields' ) );
	}

	public function init_carbon_fields()
	{
		Carbon_Fields\Carbon_Fields::boot();
	}

	/**
	 * Activate plugin.
	 */
	public function activate()
	{

	}

	/**
	 * Force load first
	 */
	public function force_load_first()
	{
		$path_plugin    = preg_replace( '/(.*)plugins\/(.*)$/', WP_PLUGIN_DIR . '/$2', self::get_root_file() );
		$name_plugin    = plugin_basename( trim( $path_plugin ) );
		$active_plugins = get_option( 'active_plugins' );
		$key_plugin     = array_search( $name_plugin, $active_plugins, true );

		if ( $key_plugin ) {
			array_splice( $active_plugins, $key_plugin, 1 );
			array_unshift( $active_plugins, $name_plugin );
			update_option( 'active_plugins', $active_plugins );
		}
	}
}
