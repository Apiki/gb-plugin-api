<?php

namespace GB\API\Controller;

if ( ! function_exists( 'add_action' ) ) {
	exit( 0 );
}

abstract class Users
{
	public $model;

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
	}
}
