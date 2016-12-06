<?php

namespace GB\API;

// Avoid that files are directly loaded
if ( ! function_exists( 'add_action' ) ) {
	exit( 0 );
}

class Loader
{
	/**
	 * Namespace
	 *
	 * @since 1.1
	 * @var string
	 */
	public $namespace = 'Apiki\API';

	/**
	 * Pages Enqueue Media
	 *
	 * @since 1.1
	 * @var array
	 */
	public $pages_enqueue_media = array(
		'post.php',
		'post-new.php',
		'themes.php',
	);

	public function __construct()
	{
		add_action( 'admin_enqueue_scripts', array( &$this, 'scripts_admin' ) );
		add_action( 'admin_enqueue_scripts', array( &$this, 'styles_admin' ) );

		$this->initialize();
	}

	public function initialize()
	{

	}

	public function load_controllers( $controllers, $activate = false )
	{
		foreach ( $controllers as $name ) {
			$class = sprintf( "{$this->namespace}\%s_Controller", $name );
			$this->_handle_instance( $class, $activate );
		}
	}

	public function load_wp_media()
	{
		global $pagenow;

		if ( did_action( 'wp_enqueue_media' ) ) {
			return;
		}

		if ( in_array( $pagenow, $this->pages_enqueue_media ) ) {
			wp_enqueue_media();
		}
	}

	public function scripts_admin()
	{

	}

	public function styles_admin()
	{

	}

	private function _handle_instance( $class, $activate = false )
	{
		if ( ! $activate ) {
			$instance = new $class();
			return;
		}

		$instance = new $class( true );
		$instance->add_capabilities( array( 'administrator', 'editor' ) );
		unset( $instance );
	}
}
