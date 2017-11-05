<?php

namespace GB\API\Controller;

if ( ! function_exists( 'add_action' ) ) {
	exit( 0 );
}

abstract class Users
{
	public $model;

	public $rest_fields = array();

	public function __construct()
	{
		$this->set_hooks_fields();
		$this->initialize();
	}

	public function initialize()
	{

	}

	public function set_hooks_fields()
	{
		add_action( 'carbon_register_fields', array( &$this, 'register_meta_boxes' ) );
		add_action( 'rest_api_init', array( &$this, 'rest_register_fields' ) );
	}

	public function rest_register_fields()
	{
		foreach ( $this->rest_fields as $field ) {
			register_rest_field(
				'user',
				$field,
				array(
					'get_callback'    => array( &$this, 'get_rest_fields_contents' ),
					'update_callback' => null,
					'schema'          => null,
				)
			);
		}
	}

	public function get_rest_fields_contents( $object, $field_name, $request )
	{

	}

	public function register_meta_boxes()
	{

	}
}
