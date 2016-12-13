<?php

namespace GB\API;

if ( ! function_exists( 'add_action' ) ) {
	exit( 0 );
}

use ReflectionClass;

abstract class Loader
{
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
		add_action( 'init', array( &$this, 'load_textdomain' ) );

		$this->initialize();
	}

	public function initialize()
	{

	}

	public function load_textdomain()
	{

	}

	public function load_controllers( $controllers, $activate = false )
	{
		$namespace = $this->get_namespace();

		foreach ( $controllers as $name ) {
			$this->_handle_instance( sprintf( "{$namespace}\%s_Controller", $name ), $activate );
		}
	}

	public function get_namespace()
	{
		return ( new ReflectionClass( $this ) )->getNamespaceName();
	}

	public function load_wp_media()
	{
		global $pagenow;

		if ( did_action( 'wp_enqueue_media' ) ) {
			return;
		}

		if ( in_array( $pagenow, $this->pages_enqueue_media, true ) ) {
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
		$instance = new $class( $activate );

		if ( $activate ) {
			$instance->add_capabilities( array( 'administrator', 'editor' ) );
		}

		unset( $instance );
	}
}
