<?php

namespace GB\API;

if ( ! function_exists( 'add_action' ) ) {
	exit( 0 );
}

use stdClass;

abstract class User
{
	/**
	 * Metas
	 *
	 * @since 1.1
	 * @var array
	 */
	public $metas = array();

	/**
	 * ID
	 *
	 * @since 1.0
	 * @var int
	 */
	private $ID;

	/**
	 * Activation Key
	 *
	 * @since 1.0
	 * @var string
	 */
	private $activation_key;

	/**
	 * Email
	 *
	 * @since 1.0
	 * @var string
	 */
	private $email;

	/**
	 * Login
	 *
	 * @since 1.0
	 * @var string
	 */
	private $login;

	/**
	 * Nicename
	 *
	 * @since 1.0
	 * @var string
	 */
	private $nicename;

	/**
	 * pass
	 *
	 * @since 1.0
	 * @var string
	 */
	private $pass;

	/**
	 * Registered
	 *
	 * @since 1.0
	 * @var string
	 */
	private $registered;

	/**
	 * Registered
	 *
	 * @since 1.0
	 * @var string
	 */
	private $status;

	/**
	 * Url
	 *
	 * @since 1.0
	 * @var string
	 */
	private $url;

	/**
	 * Admin Color
	 *
	 * @since 1.0
	 * @var string
	 */
	private $admin_color;

	/**
	 * Aim
	 *
	 * @since 1.0
	 * @var string
	 */
	private $aim;

	/**
	 * Comment Shortcuts
	 *
	 * @since 1.0
	 * @var string
	 */
	private $comment_shortcuts;

	/**
	 * Description
	 *
	 * @since 1.0
	 * @var string
	 */
	private $description;

	/**
	 * Display Name
	 *
	 * @since 1.0
	 * @var string
	 */
	private $display_name;

	/**
	 * First Name
	 *
	 * @since 1.0
	 * @var string
	 */
	private $first_name;

	/**
	 * Last Name
	 *
	 * @since 1.0
	 * @var string
	 */
	private $last_name;

	/**
	 * Google Plus
	 *
	 * @since 1.0
	 * @var string
	 */
	private $googleplus;

	/**
	 * Jabber
	 *
	 * @since 1.0
	 * @var string
	 */
	private $jabber;

	/**
	 * Level
	 *
	 * @since 1.0
	 * @var string
	 */
	private $level;

	/**
	 * Nickname
	 *
	 * @since 1.0
	 * @var string
	 */
	private $nickname;

	/**
	 * Plugins Last View
	 *
	 * @since 1.0
	 * @var string
	 */
	private $plugins_last_view;

	/**
	 * Plugins Per Page
	 *
	 * @since 1.0
	 * @var string
	 */
	private $plugins_per_page;

	/**
	 * Rich Editing
	 *
	 * @since 1.0
	 * @var string
	 */
	private $rich_editing;

	/**
	 * Roles
	 *
	 * @since 1.0
	 * @var string
	 */
	private $roles;

	/**
	 * Twitter
	 *
	 * @since 1.0
	 * @var string
	 */
	private $twitter;

	/**
	 * Yim
	 *
	 * @since 1.0
	 * @var string
	 */
	private $yim;

	/**
	 * Use in fields user has "user_" prefix
	 *
	 * @since 1.0
	 * @var array
	 */
	private $prefix_user_fields = array(
		'activation_key',
		'email',
		'login',
		'nicename',
		'pass',
		'registered',
		'status',
		'level',
		'url',
	);

	/**
	 * Use in fields user has literal names
	 *
	 * @since 1.0
	 * @var array
	 */
	private $literal_user_fields = array(
		'admin_color',
		'aim',
		'comment_shortcuts',
		'description',
		'display_name',
		'first_name',
		'googleplus',
		'jabber',
		'last_name',
		'nickname',
		'plugins_last_view',
		'plugins_per_page',
		'rich_editing',
		'roles',
		'twitter',
	);

	/**
	 * Constructor of the class. Instantiate and incializate it.
	 *
	 * @since 1.0.0
	 *
	 * @param int $ID - The ID of the Customer
	 * @return null
	 */
	public function __construct( $id = false )
	{
		if ( false !== $id ) :
			$this->ID = $id;
		endif;
	}

	public function find( $args = array() )
	{
		$defaults = array(
			'fields' => 'ID',
		);

		return $this->parse( Utils::get_user_query( $args, $defaults ) );
	}

	public function parse( $wp_user_query )
	{
		if ( ! $wp_user_query->results ) {
			return false;
		}

		foreach ( $wp_user_query->results as $id ) {
			$model  = new $this( $id );
			$list[] = $model;

			unset( $model );
		}

		$std                = new stdClass();
		$std->list          = $list;
		$std->wp_user_query = $wp_user_query;

		return $std;
	}

	public function __get( $prop_name )
	{
		if ( isset( $this->$prop_name ) ) {
			return $this->$prop_name;
		}

		if ( in_array( $prop_name, $this->prefix_user_fields, true ) ) {
			$this->$prop_name = get_the_author_meta( "user_{$prop_name}", $this->ID );
			return $this->$prop_name;
		}

		if ( in_array( $prop_name, $this->literal_user_fields, true ) ) {
			$this->$prop_name = get_the_author_meta( $prop_name, $this->ID );
			return $this->$prop_name;
		}

		if ( array_key_exists( $prop_name, $this->metas ) ) :
			$this->$prop_name = $this->get_meta_value( $prop_name );
			return $this->$prop_name;
		endif;

		return $this->get_property( $prop_name );
	}

	public function get_meta_value( $meta_key )
	{
		$args  = $this->metas[ $meta_key ];
		$value = carbon_get_user_meta( $this->ID, $meta_key, @$args['type'] );

		if ( ! $value ) {
			return @$args['default'];
		}

		if ( @$args['sanitize'] && is_callable( $args['sanitize'] ) ) {
			return call_user_func( $args['sanitize'], $value );
		}

		return $value;
	}

	/**
	 * Whether user has capability or role.
	 * @since  1.4.7
	 * @param  string    $capability capability or role name.
	 * @return boolean   user has capability or role.
	 */
	public function user_can( $capability )
	{
		return user_can( $this->ID, $capability );
	}

	protected function get_property( $prop_name )
	{
		return $this->$prop_name;
	}
}
