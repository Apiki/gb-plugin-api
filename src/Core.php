<?php

namespace GB\API;

if ( ! function_exists( 'add_action' ) ) {
	exit( 0 );
}

class Core extends Loader
{
	public function activate()
	{
		$this->_create_indexes();
	}

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
	 * Create indexes to better performance of queries
	 * @since  1.5.7
	 * @return void
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
	 * Check if index exists
	 * @since  1.5.7
	 * @param  string    $table    The table name with prefix
	 * @param  string    $key_name The name of index
	 * @return boolean             Return if index exists
	 */
	private function _index_exists( $table, $key_name )
	{
		global $wpdb;

		return $wpdb->get_var( "SHOW INDEX FROM {$table} WHERE Key_name = '{$key_name}'" ) ? true : false;
	}

	/**
	 * Check if table exists
	 * @since  1.5.7
	 * @param  string    $table The table name with prefix
	 * @return boolean          Return if table exists
	 */
	private function _table_exists( $table )
	{
		global $wpdb;

		return $wpdb->get_var( "SHOW TABLES LIKE '{$table}'" ) == $table ? true : false;
	}

	/**
	 * Create each index
	 * @since  1.5.7
	 * @param  string    $table The table name with prefix
	 * @param  string    $key   The index name
	 * @param  array     $data  Array of fields of index
	 * @return void
	 */
	private function _create_index( $table, $key, $data )
	{
		global $wpdb;

		$wpdb->query( "ALTER TABLE {$table} ADD INDEX {$key} ( " . implode( ', ', $data ) . " )" );
	}
}
