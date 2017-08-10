<?php

namespace GB\API\Controller;

if ( ! function_exists( 'add_action' ) ) {
	exit( 0 );
}

use GB\API\Helper\L10n;
use GB\API\Helper\Utils;

abstract class Taxonomy
{
	public $name;
	public $messages        = array();
	public $object_type     = array( 'post' );
	public $capability_type = 'term';
	public $defaults        = array();
	public $hierarchical    = true;

	public function __construct( $activate = false )
	{
		if ( $activate ) :
			return true;
		endif;

		$this->set_hooks_fields();
		$this->set_hooks_for_register();
		$this->initialize();
	}

	public function initialize()
	{

	}

	public function set_hooks_fields()
	{
		add_action( 'carbon_fields_register_fields', array( &$this, 'register_meta_boxes' ) );
	}

	public function register_meta_boxes()
	{

	}

	public function set_hooks_for_register()
	{
		add_action( 'init', array( &$this, 'register_taxonomy' ) );
	}

	public function register_taxonomy()
	{
		$defaults = array(
			'labels'            => $this->get_labels(),
			'public'            => true,
			'show_admin_column' => true,
			'hierarchical'      => $this->hierarchical,
			'capabilities'      => $this->get_capabilities(),
		);

		register_taxonomy( $this->name, $this->object_type, wp_parse_args( $this->get_args_register_taxonomy(), $defaults ) );
	}

	public function get_args_register_taxonomy()
	{
		return array();
	}

	public function get_labels( $labels = array() )
	{
		return L10n::get_labels( $this->get_messages(), $labels );
	}

	public function get_messages()
	{
		$defaults = array(
			'is_female' => true,
			'label'     => 'Taxonomia',
			'plural'    => 'Taxonomias',
		);

		return wp_parse_args( $this->messages, $defaults );
	}

	public function get_capabilities()
	{
		return array(
			'manage_terms' => "manage_{$this->capability_type}",
			'edit_terms'   => "edit_{$this->capability_type}",
			'delete_terms' => "delete_{$this->capability_type}",
			'assign_terms' => "assign_{$this->capability_type}",
		);
	}

	public function add_capabilities( $roles )
	{
		Utils::add_custom_capabilities( $roles, $this->get_capabilities() );
	}
}
