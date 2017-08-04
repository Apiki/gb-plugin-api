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
		$this->_create_indexes();
	}

	/**
	 * Implement scripts for admin WordPress.
	 */
	public function scripts_admin()
	{
		wp_register_script(
			'admin-script-' . self::SLUG,
			self::plugins_url( '/assets/javascripts/built.js' ),
			array( 'jquery' ),
			self::filemtime( 'assets/javascripts/built.js' ),
			true
		);

		wp_localize_script(
			'admin-script-' . self::SLUG,
			'AdminGlobalVars',
			array(
				'urlAjax' => admin_url( 'admin-ajax.php' ),
			)
		);
	}

	/**
	 * Implement styles for admin WordPress.
	 */
	public function styles_admin()
	{
		wp_enqueue_style(
			'admin-css-' . self::SLUG,
			self::plugins_url( 'assets/stylesheets/style.css' ),
			array(),
			self::filemtime( 'assets/stylesheets/style.css' )
		);
	}

	/**
	 * Force load first
	 */
	public function force_load_first()
	{
		$path_plugin    = preg_replace( '/(.*)plugins\/(.*)$/', WP_PLUGIN_DIR."/$2", self::get_root_file() );
		$name_plugin    = plugin_basename( trim( $path_plugin ) );
		$active_plugins = get_option( 'active_plugins' );
		$key_plugin     = array_search( $name_plugin, $active_plugins );

		if ( $key_plugin ) {
			array_splice( $active_plugins, $key_plugin, 1 );
			array_unshift( $active_plugins, $name_plugin );
			update_option( 'active_plugins', $active_plugins );
		}
	}

	/**
	 * Create indexes to better performance of queries.
	 */
	private function _create_indexes()
	{
		global $wpdb;

		$indexes_data = array(
			$wpdb->posts => array(
				'post_status_post_type_post_date_gmt' => array(
					'post_date_gmt DESC',
					'post_status ASC',
					'post_type ASC',
				),
				'status_date_id' => array(
					'post_date ASC',
					'post_status ASC',
					'ID ASC',
				),
			),
			$wpdb->options => array(
				'autoload' => array(
					'autoload ASC',
					'option_name ASC',
					'option_value(10) ASC',
				),
			),
		);

		foreach ( $indexes_data as $table => $indexes ) {
			if ( ! $this->_table_exists( $table ) ) {
				continue;
			}

			foreach ( $indexes as $key => $data ) {
				if ( $this->_index_exists( $table, $key ) ) {
					continue;
				}

				$this->_create_index( $table, $key, $data );
			}
		}
	}

	/**
	 * Check if index exists.
	 *
	 * @param string $table the table name with prefix.
	 * @param string $key_name The name of index.
	 * @return boolean return if index exists.
	 */
	private function _index_exists( $table, $key_name )
	{
		global $wpdb;

		return $wpdb->get_var( "SHOW INDEX FROM {$table} WHERE Key_name = '{$key_name}'" ) ? true : false;
	}

	/**
	 * Check if table exists.
	 *
	 * @param string $table the table name with prefix.
	 * @return boolean return if table exists.
	 */
	private function _table_exists( $table )
	{
		global $wpdb;

		return $wpdb->get_var( "SHOW TABLES LIKE '{$table}'" ) == $table ? true : false;
	}

	/**
	 * Create each index.
	 *
	 * @param string $table the table name with prefix.
	 * @param string $key the index name.
	 * @param array $data fields of index.
	 */
	private function _create_index( $table, $key, $data )
	{
		global $wpdb;

		$wpdb->query( "ALTER TABLE {$table} ADD INDEX {$key} ( " . implode( ', ', $data ) . " )" );
	}
}
