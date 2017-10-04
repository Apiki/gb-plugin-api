<?php

namespace GB\API\Model;

if ( ! function_exists( 'add_action' ) ) {
	exit( 0 );
}

use stdClass;

abstract class User
{
	/**
	 * The user metas.
	 *
	 * @var array
	 */
	public $metas = array();

	/**
	 * The user id.
	 *
	 * @var int
	 */
	protected $ID;

	/**
	 * The user activation key.
	 *
	 * @var string
	 */
	protected $activation_key;

	/**
	 * The user email.
	 *
	 * @var string
	 */
	protected $email;

	/**
	 * The user login.
	 *
	 * @var string
	 */
	protected $login;

	/**
	 * The user nicename.
	 *
	 * @var string
	 */
	protected $nicename;

	/**
	 * The user password.
	 *
	 * @var string
	 */
	protected $pass;

	/**
	 * The user registered.
	 *
	 * @var string
	 */
	protected $registered;

	/**
	 * The user status.
	 *
	 * @var string
	 */
	protected $status;

	/**
	 * The user url.
	 *
	 * @var string
	 */
	protected $url;

	/**
	 * The user admin color.
	 *
	 * @var string
	 */
	protected $admin_color;

	/**
	 * The user aim account.
	 *
	 * @var string
	 */
	protected $aim;

	/**
	 * The user comment shortcuts.
	 *
	 * @var string
	 */
	protected $comment_shortcuts;

	/**
	 * Description
	 *
	 * @var string
	 */
	protected $description;

	/**
	 * Display name
	 *
	 * @var string
	 */
	protected $display_name;

	/**
	 * First name
	 *
	 * @var string
	 */
	protected $first_name;

	/**
	 * Last name
	 *
	 * @var string
	 */
	protected $last_name;

	/**
	 * Google Plus account
	 *
	 * @var string
	 */
	protected $googleplus;

	/**
	 * Jabber account
	 *
	 * @var string
	 */
	protected $jabber;

	/**
	 * Level
	 *
	 * @var string
	 */
	protected $level;

	/**
	 * Nickname
	 *
	 * @var string
	 */
	protected $nickname;

	/**
	 * Plugins last view
	 *
	 * @var string
	 */
	protected $plugins_last_view;

	/**
	 * Plugins per page
	 *
	 * @var string
	 */
	protected $plugins_per_page;

	/**
	 * Rich editing
	 *
	 * @var string
	 */
	protected $rich_editing;

	/**
	 * Roles
	 *
	 * @var string
	 */
	protected $roles;

	/**
	 * Twitter account
	 *
	 * @var string
	 */
	protected $twitter;

	/**
	 * Yim account
	 *
	 * @var string
	 */
	protected $yim;

	/**
	 * Use in fields user has "user_" prefix.
	 *
	 * @var array
	 */
	protected $prefix_user_fields = array(
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
	 * Use in fields user has literal names.
	 *
	 * @var array
	 */
	protected $literal_user_fields = array(
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
	 * @param int $ID the ID of the customer.
	 */
	public function __construct( $id = false )
	{
		if ( false !== $id ) {
			$this->ID = $id;
		}
	}

	/**
	 * Find users by WP_User_Query.
	 *
	 * @param array $args
	 * @return stdClass object|boolean An object attr list Array<User>, wp_user_query WP_User_Query
	 */
	public function find( $args = array() )
	{
		$defaults = array(
			'fields' => 'ID',
		);

		return $this->parse( Utils::get_user_query( $args, $defaults ) );
	}

	/**
	 * Parse WP_User_Query results to Array<User>.
	 *
	 * @param array $wp_user_query
	 * @return stdClass object|boolean An object attr list Array<User>, wp_user_query WP_User_Query.
	 */
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

	/**
	 * Magic method __get properties
	 *
	 * @param string $prop_name
	 * @return mixed property
	 */
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

		if ( array_key_exists( $prop_name, $this->metas ) ) {
			$this->$prop_name = $this->get_meta_value( $prop_name );
			return $this->$prop_name;
		}

		return $this->get_property( $prop_name );
	}

	/**
	 * Get meta value by key
	 *
	 * @param string $meta_key
	 * @return mixed $value
	 */
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
	 *
	 * @param string $capability capability or role name.
	 * @return boolean user has capability or role.
	 */
	public function user_can( $capability )
	{
		return user_can( $this->ID, $capability );
	}

	/**
	 * Get property fallback
	 *
	 * @param string $prop_name
	 * @return mixed property
	 */
	protected function get_property( $prop_name )
	{
		return $this->$prop_name;
	}
}
