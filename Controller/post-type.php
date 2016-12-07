<?php

namespace GB\API;

if ( ! function_exists( 'add_action' ) ) {
	exit( 0 );
}

abstract class Post_Type
{
	/**
	 * name post type
	 *
	 * @var string
	 */
	public $name;

	/**
	 * model
	 *
	 * @var object
	 */
	public $model;

	/**
	 * messages
	 *
	 * @var array
	 */
	public $messages = array();

	/**
	 * Capability Type
	 *
	 * @var array
	 */
	public $capability_type = 'post';

	/**
	 * columns
	 *
	 * @var array
	 */
	public $columns = array();

	/**
	 * is register
	 *
	 * @var array
	 */
	public $is_register = true;

	public $rest_fields = array();

	/**
	 * Constructor of the class.
	 *
	 * @return null
	 */
	public function __construct( $activate = false )
	{
		if ( $activate ) {
			return true;
		}

		$this->set_hooks_fields();
		$this->set_hooks_for_register();
		$this->set_hooks_for_columns();
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
				$this->name,
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

	public function get_columns()
	{
		return $this->columns;
	}

	public function set_hooks_for_columns()
	{
		if ( ! $this->get_columns() ) {
			return;
		}

		add_filter( "manage_{$this->name}_posts_columns", array( &$this, 'list_head_columns' ) );
		add_action( "manage_{$this->name}_posts_custom_column", array( &$this, 'list_content_columns' ), 10, 2 );
	}

	public function set_hooks_for_register()
	{
		if ( ! $this->is_register ) {
			return;
		}

		add_action( 'init', array( &$this, 'register_post_type' ) );
		add_filter( 'post_updated_messages', array( &$this, 'set_post_updated_messages' ) );
	}

	public function add_image_size( $name, $width, $height, $crop = true )
	{
		$args = array(
			'name'      => $name,
			'width'     => $width,
			'height'    => $height,
			'crop'      => $crop,
			'post_type' => $this->name,
		);

		do_action( 'apiki_add_image_size', $args );
	}

	/**
	 * Sets the column in admin
	 *
	 * @param array $heads
	 * @return array Heads
	 */
	public function list_head_columns( $heads )
	{
		unset( $heads['date'] );

		$heads         = array_merge( $heads, $this->get_columns() );
		$heads['date'] = __( 'Date', App::PLUGIN_SLUG );

		return $heads;
	}

	/**
	 * Sets the column date content in admin
	 *
	 * @param string $column_name
	 * @param int $post_id
	 * @return void
	 */
	public function list_content_columns( $column_name, $post_id )
	{
		$columns = $this->get_columns();

		if ( is_object( $this->model ) ) {
			$this->model->ID = $post_id;
		}

		// This action is to generalize the columns content, to use in similar cases
		do_action( "apiki_{$this->name}_column", $post_id, $column_name );

		// This actions is specific to a column
		if ( isset( $columns[ $column_name ] ) ) {
			do_action( "apiki_{$this->name}_column_{$column_name}", $post_id );
		}
	}

	/**
	 * Register Meta Boxes
	 *
	 * @return void
	*/
	public function register_meta_boxes()
	{

	}

	/**
	 * Register acessory post type
	 *
	 * @return void
	 */
	public function register_post_type()
	{
		if ( ! $this->is_register ) {
			return;
		}

		$defaults = array(
			'labels'        => $this->get_labels(),
			'public'        => true,
			'menu_position' => 5,
		);

		register_post_type( $this->name, wp_parse_args( $defaults, $this->get_args_register_post_type() ) );
	}

	/**
	 * Sets the template updated message
	 *
	 * @param array $messages Messages
	 * @return array Messages
	 */
	public function set_post_updated_messages( $messages )
	{
		global $post;

		extract( $this->get_messages() );

		$messages[ $this->name ] = array(
			0  => '',
			1  => sprintf( _n( '%s updated.', "%s updated.", $is_female, App::PLUGIN_SLUG ), $label ),
			2  => __( 'Custom field updated.', App::PLUGIN_SLUG ),
			3  => __( 'Custom field deleted.', App::PLUGIN_SLUG ),
			4  => sprintf( _n( '%s updated.', '%s updated.', $is_female, App::PLUGIN_SLUG ), $label ),
			5  => isset( $_GET['revision'] ) ? sprintf( _n( '%s restored to revision from %s', '%s restored to revision from %s', $is_female, App::PLUGIN_SLUG ), $label, wp_post_revision_title( (int)$_GET['revision'], false ) ) : false,
			6  => sprintf( _n( '%s published.', '%s published.', $is_female, App::PLUGIN_SLUG ), $label ),
			7  => sprintf( _n( '%s saved.', '%s saved.', $is_female, App::PLUGIN_SLUG ), $label ),
			8  => sprintf( _n( '%s submited.', '%s submited.', $is_female, App::PLUGIN_SLUG ), $label ),
			9  => sprintf( _n( '%s scheduled for: %s%s%s.', '%s scheduled for: %s%s%s.', $is_female, App::PLUGIN_SLUG ), $label, '<strong>',  date_i18n( _x( 'M j, Y @ G:i', 'date of schedule', App::PLUGIN_SLUG ), strtotime( $post->post_date ) ), '</strong>' ),
			10 => sprintf( _n( '%s draft updated.', '%s draft updated.', $is_female, App::PLUGIN_SLUG ), $label ),
		);

		return $messages;
	}

	public function get_labels( $labels = array() )
	{
		return L10n::get_labels( $this->get_messages(), $labels );
	}

	public function get_capabilities( $capabilities = array() )
	{
		$defaults = array(
			'edit_post'              => "edit_{$this->capability_type}",
			'read_post'              => "read_{$this->capability_type}",
			'delete_post'            => "delete_{$this->capability_type}",
			'edit_posts'             => "edit_{$this->capability_type}s",
			'edit_others_posts'      => "edit_others_{$this->capability_type}s",
			'publish_posts'          => "publish_{$this->capability_type}s",
			'read_private_posts'     => "read_private_{$this->capability_type}s",
			'delete_posts'           => "delete_{$this->capability_type}s",
			'delete_private_posts'   => "delete_private_{$this->capability_type}s",
			'delete_published_posts' => "delete_published_{$this->capability_type}s",
			'delete_others_posts'    => "delete_others_{$this->capability_type}s",
			'edit_private_posts'     => "edit_private_{$this->capability_type}s",
			'edit_published_posts'   => "edit_published_{$this->capability_type}s",
			'create_posts'           => "edit_{$this->capability_type}s",
		);

		return wp_parse_args( $capabilities, $defaults );
	}

	public function add_capabilities( $roles, $capabilities = array() )
	{
		Utils::add_custom_capabilities( $roles, wp_parse_args( $capabilities, $this->get_capabilities() ) );
	}

	public function get_messages()
	{
		$defaults = array(
			'is_female' => false,
			'label'     => 'Post',
			'plural'    => 'Posts',
		);

		return wp_parse_args( $this->messages, $defaults );
	}

	public function get_args_register_post_type()
	{
		return array();
	}
}
