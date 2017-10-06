<?php

namespace GB\API\Model;

if ( ! function_exists( 'add_action' ) ) {
	exit( 0 );
}

use GB\API\Helper\Utils;
use stdClass;

class Post
{
	/**
	 * The post metas.
	 *
	 * @var array
	 */
	public $metas = array();

	/**
	 * The post ID.
	 *
	 * @var integer
	 */
	protected $ID;

	/**
	 * The post title.
	 *
	 * @var string
	 */
	protected $title;

	/**
	 * The post excerpt.
	 *
	 * @var string
	 */
	protected $excerpt;

	/**
	 * The post content.
	 *
	 * @var string
	 */
	protected $content;

	/**
	 * The post date.
	 *
	 * @var string
	 */
	protected $date;

	/**
	 * The post date gmt.
	 *
	 * @var string
	 */
	protected $date_gmt;

	/**
	 * The post status.
	 *
	 * @var string
	 */
	protected $status;

	/**
	 * The post author.
	 *
	 * @var string
	 */
	protected $author;

	/**
	 * The post menu order.
	 *
	 * @var int
	 */
	protected $menu_order;

	/**
	 * The post parent.
	 *
	 * @var int
	 */
	protected $parent;

	/**
	 * Use in fields post has "post_" prefix.
	 *
	 * @var array
	 */
	protected $prefix_post_fields = array(
		'title',
		'excerpt',
		'content',
		'date',
		'date_gmt',
		'status',
		'author',
		'parent',
		'name',
	);

	/**
	 * Use in fields post has literal names.
	 *
	 * @var array
	 */
	protected $literal_post_fields = array(
		'menu_order',
	);

	/**
	 * Post Type name.
	 *
	 * @var string
	 */
	const POST_TYPE = 'post';

	/**
	 * Constructor of the class. Instantiate and incializate it.
	 *
	 * @param int $id
	 * @return void
	 */
	public function __construct( $id = false )
	{
		if ( is_numeric( $id ) ) {
			$this->ID = $id;
		}

		$this->initialize();
	}

	/**
	 * Replace the __construct use on child classes.
	 *
	 * @return void
	 */
	public function initialize()
	{

	}

	/**
	 * Return the post excerpt.
	 *
	 * @param integer $num_words
	 * @param string $more
	 * @return string
	 */
	public function get_excerpt( $num_words = 55, $more = '...' )
	{
		$text = $this->__get( 'excerpt' );

		if ( empty( $text ) ) {
			$text = $this->__get( 'content' );
		}

		return apply_filters( 'the_excerpt', wp_trim_words( $text, $num_words, $more ) );
	}

	/**
	 * Echo the post excerpt.
	 *
	 * @param integer $num_words
	 * @param string $more
	 * @return void
	 */
	public function the_excerpt( $num_words = 55, $more = '...' )
	{
		echo $this->get_excerpt( $num_words, $more );
	}

	/**
	 * Return the post content.
	 *
	 * @param integer $num_words
	 * @param string $more
	 * @return string
	 */
	public function get_content( $num_words = false, $more = '...' )
	{
		$content = $this->__get( 'content' );

		if ( ! $num_words ) {
			return apply_filters( 'the_content', $content );
		}

		return apply_filters( 'the_content', wp_trim_words( $content, $num_words, $more ) );
	}

	/**
	 * Echo the post content.
	 *
	 * @param integer $num_words
	 * @param string $more
	 * @return void
	 */
	public function the_content( $num_words = false, $more = '...' )
	{
		echo $this->get_content( $num_words, $more );
	}

	/**
	 * Return the parent from current model.
	 *
	 * @param boolean $is_empty_return_current
	 * @return Post
	 */
	public function get_parent_model( $is_empty_return_current = false )
	{
		if ( $is_empty_return_current && ! $this->has_parent() ) {
			return $this;
		}

		return new $this( $this->__get( 'parent' ) );
	}

	/**
	 * Ruturn if has parent.
	 *
	 * @return boolean
	 */
	public function has_parent()
	{
		return (bool) $this->__get( 'parent' );
	}

	/**
	 * Return if has post thumbnail.
	 *
	 * @return boolean
	 */
	public function has_post_thumbnail()
	{
		return has_post_thumbnail( $this->ID );
	}

	/**
	 * Return the thumbnail.
	 *
	 * @param string $size
	 * @return string
	 */
	public function get_the_thumbnail( $size = 'thumbnail' )
	{
		return get_the_post_thumbnail( $this->ID, $size );
	}

	/**
	 * Echo the thumbnail.
	 *
	 * @param string $size
	 * @return void
	 */
	public function the_thumbnail( $size = 'thumbnail' )
	{
		echo $this->get_the_thumbnail( $size );
	}

	/**
	 * Return the thumbnail url.
	 *
	 * @param string $size
	 * @return string
	 */
	public function get_the_thumbnail_url( $size = 'thumbnail' )
	{
		return Utils::get_thumbnail_url( get_post_thumbnail_id( $this->ID ), $size );
	}

	/**
	 * Return the post permalink.
	 *
	 * @return string
	 */
	public function get_permalink()
	{
		return get_permalink( $this->ID );
	}

	/**
	 * Echo the post permalink.
	 *
	 * @return void
	 */
	public function the_permalink()
	{
		echo esc_url( apply_filters( 'the_permalink', $this->get_permalink(), $this->ID ) );
	}

	/**
	 * Return a list of models.
	 *
	 * @param array $args
	 * @return stdClass
	 */
	public function find( $args = array() )
	{
		$defaults = array(
			'post_type'     => $this::POST_TYPE,
			'fields'        => 'ids',
			'no_found_rows' => true,
		);

		return $this->parse( Utils::get_query( $args, $defaults ) );
	}

	/**
	 * Return a model.
	 *
	 * @param array $args
	 * @return Post
	 */
	public function find_one( $args = array() )
	{
		$defaults = array(
			'post_type'      => $this::POST_TYPE,
			'fields'         => 'ids',
			'no_found_rows'  => true,
			'posts_per_page' => 1,
		);

		$query = Utils::get_query( $args, $defaults );

		if ( ! $query->have_posts() ) {
			return false;
		}

		return $this->make_model( $query->posts[0] );
	}

	/**
	 * Magic function to set the value of the attribute more easily.
	 *
	 * @param string $prop_name
	 * @param mixed $value
	 * @return void
	 */
	public function __set( $prop_name, $value )
	{
		$this->$prop_name = $value;
	}

	/**
	 * Magic function to retrieve the value of the attribute more easily.
	 *
	 * @param string $prop_name
	 * @return mixed
	 */
	public function __get( $prop_name )
	{
		if ( isset( $this->$prop_name ) ) {
			return $this->$prop_name;
		}

		if ( in_array( $prop_name, $this->prefix_post_fields, true ) ) {
			$this->$prop_name = get_post_field( "post_{$prop_name}", $this->ID );
			return $this->$prop_name;
		}

		if ( in_array( $prop_name, $this->literal_post_fields, true ) ) {
			$this->$prop_name = get_post_field( $prop_name, $this->ID );
			return $this->$prop_name;
		}

		if ( array_key_exists( $prop_name, $this->metas ) ) {
			$this->$prop_name = $this->get_meta_value( $prop_name );
			return $this->$prop_name;
		}

		return $this->get_property( $prop_name );
	}

	/**
	 * Return the meta value.
	 *
	 * @param string $meta_key
	 * @return mixed
	 */
	public function get_meta_value( $meta_key )
	{
		$defaults = array(
			'default'  => '',
			'sanitize' => '',
		);

		$args  = wp_parse_args( $this->metas[ $meta_key ], $defaults );
		$value = carbon_get_post_meta( $this->ID, $meta_key );

		if ( ! $value ) {
			return $args['default'];
		}

		if ( $args['sanitize'] && is_callable( $args['sanitize'] ) ) {
			return call_user_func( $args['sanitize'], $value );
		}

		return $value;
	}

	/**
	 * Update the post meta.
	 *
	 * @param string $meta_key
	 * @param mixed $value
	 * @return void
	 */
	public function update_meta( $meta_key, $value )
	{
		if ( ! isset( $this->ID ) ) {
			return false;
		}

		update_post_meta( $this->ID, $meta_key, $value );
	}

	/**
	 * Parse the query.
	 *
	 * @param WP_Query $wp_query
	 * @return stdClass
	 */
	public function parse( $wp_query )
	{
		if ( ! $wp_query->have_posts() ) {
			return false;
		}

		foreach ( $wp_query->posts as $post ) {
			$model  = $this->make_model( $post );
			$list[] = $model;

			unset( $model );
		}

		$std           = new stdClass();
		$std->list     = $list;
		$std->wp_query = $wp_query;

		return $std;
	}

	/**
	 * Transform a post on a model of this class.
	 *
	 * @param Post $post
	 * @return Post
	 */
	protected function make_model( $post )
	{
		if ( is_object( $post ) ) {
			return new $this( $post->ID );
		}

		return new $this( $post );
	}

	/**
	 * Return a property of this class.
	 *
	 * @param string $prop_name
	 * @return mixed
	 */
	protected function get_property( $prop_name )
	{
		return $this->$prop_name;
	}
}
