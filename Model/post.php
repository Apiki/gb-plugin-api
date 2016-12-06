<?php

namespace GB\API;

// Avoid that files are directly loaded
if ( ! function_exists( 'add_action' ) ) {
	exit( 0 );
}

use Exception;
use stdClass;

class Post
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
	 * @var string
	 */
	private $ID;

	/**
	 * Title
	 *
	 * @since 1.0
	 * @var string
	 */
	private $title;

	/**
	 * Excerpt
	 *
	 * @since 1.0
	 * @var string
	 */
	private $excerpt;

	/**
	 * Content
	 *
	 * @since 1.0
	 * @var string
	 */
	private $content;

	/**
	 * Date
	 *
	 * @since 1.0
	 * @var string
	 */
	private $date;

	/**
	 * Date GMT
	 *
	 * @since 1.0
	 * @var string
	 */
	private $date_gmt;

	/**
	 * Status
	 *
	 * @since 1.0
	 * @var string
	 */
	private $status;

	/**
	 * Status
	 *
	 * @since 1.0
	 * @var string
	 */
	private $author;

	/**
	 * menu order
	 *
	 * @since 1.0
	 * @var int
	 */
	private $menu_order;

	/**
	 * parent
	 *
	 * @since 1.0
	 * @var int
	 */
	private $parent;

	/**
	 * Use in fields post has "post_" prefix
	 *
	 * @since 1.0
	 * @var array
	 */
	private $prefix_post_fields = array(
		'title',
		'excerpt',
		'content',
		'date',
		'date_gmt',
		'status',
		'author',
		'parent',
	);

	/**
	 * Use in fields post has literal names
	 *
	 * @since 1.0
	 * @var array
	 */
	private $literal_post_fields = array(
		'menu_order',
	);

	/**
	 * data
	 *
	 * @since 1.1
	 * @var array
	 */
	private $data = array();

	/**
	 * Post Type name
	 *
	 * @since 1.0
	 * @var string
	 */
	const POST_TYPE = 'post';

	/**
     * Constructor of the class. Instantiate and incializate it.
     *
     * @since 1.0.0
     *
     * @param int $ID - The ID of the Customer
     * @return null
     */
	public function __construct( $ID = false )
	{
		if ( false != $ID ) :
			$this->ID = $ID;
		endif;

		$this->initialize();
	}

	public function initialize()
	{

	}

	public function get_excerpt( $num_words = 55, $more = '...' )
	{
		$text = $this->__get( 'excerpt' );

		if ( empty( $text ) )
			$text = $this->__get( 'content' );

		return apply_filters( 'the_excerpt', wp_trim_words( $text, $num_words, $more ) );
	}

	public function get_content( $num_words = false, $more = '...' )
	{
		$content = $this->__get( 'content' );

		if ( ! $num_words )
			return apply_filters( 'the_content', $content );

		return apply_filters( 'the_content', wp_trim_words( $content, $num_words, $more ) );
	}

	public function get_model_parent( $is_empty_return_current = false )
	{
		if ( $is_empty_return_current && ! $this->has_parent() )
			return $this;

		return new $this( $this->__get( 'parent' ) );
	}

	public function get_children( $is_page = false )
	{
		return $this->find(
			array(
				'post_parent'    => $this->ID,
				'post_type'      => ( $is_page ) ? 'page' : $this::POST_TYPE,
				'posts_per_page' => -1,
			)
		);
	}

	public function has_parent()
	{
		return (bool)$this->__get( 'parent' );
	}

	public function has_post_thumbnail()
	{
		return has_post_thumbnail( $this->ID );
	}

	public function get_the_thumbnail( $size = 'thumbnail' )
	{
		return get_the_post_thumbnail( $this->ID, $size );
	}

	public function get_the_thumbnail_url( $size = 'thumbnail' )
	{
		return Utils::get_thumbnail_url( get_post_thumbnail_id( $this->ID ), $size );
	}

	public function get_permalink()
	{
		return get_permalink( $this->ID );
	}

	public function find( $args = array() )
	{
		$defaults = array(
			'post_type'     => $this::POST_TYPE,
			'fields'        => 'ids',
			'no_found_rows' => true,
		);

		return $this->parse( Utils::get_query( $args, $defaults ) );
	}

	public function find_one( $args = array() )
	{
		$defaults = array(
			'post_type'      => $this::POST_TYPE,
			'fields'         => 'ids',
			'no_found_rows'  => true,
			'posts_per_page' => 1,
		);

		$query = Utils::get_query( $args, $defaults );

		if ( ! $query->have_posts() )
			return false;

		return $this->make_model( $query->posts[0] );
	}

	/**
	 * Magic function to set the value of the attribute more easily.
	 *
	 * @since 1.0
	 * @param string $prop_name The attribute name
	 * @param mixed $value
	 * @return void
	 */
	public function __set( $prop_name, $value )
	{
		return $this->$prop_name = $value;
	}

	/**
	 * Magic function to retrieve the value of the attribute more easily.
	 *
	 * @since 1.0
	 * @param string $prop_name The attribute name
	 * @return mixed The attribute value
	 */
	public function __get( $prop_name )
	{
		if ( isset( $this->$prop_name ) ) :
			return $this->$prop_name;
		endif;

		if ( in_array( $prop_name, $this->prefix_post_fields ) ) :
			$this->$prop_name = get_post_field( "post_{$prop_name}", $this->ID );
			return $this->$prop_name;
		endif;

		if ( in_array( $prop_name, $this->literal_post_fields ) ) :
			$this->$prop_name = get_post_field( $prop_name, $this->ID );
			return $this->$prop_name;
		endif;

		if ( array_key_exists( $prop_name, $this->metas ) ) :
			$this->$prop_name = $this->get_meta_value( $prop_name );
			return $this->$prop_name;
		endif;

		return $this->get_property( $prop_name );
	}

	public function get_meta_value( $meta_key )
	{
		$args     = wp_parse_args( $this->metas[$meta_key], array( 'single' => true ) );
		$meta_key = $this::POST_TYPE . '-' . $meta_key;
		$value    = get_post_meta( $this->ID, $meta_key, $args['single'] );

		if ( isset( $args['default'] ) && empty( $value ) )
			return $args['default'];

		if ( isset( $args['sanitize'] ) && is_callable( $args['sanitize'] ) )
			return call_user_func( $args['sanitize'], $value );

		return $value;
	}

	public function get_meta_name( $meta_key )
	{
		if ( ! array_key_exists( $meta_key, $this->metas ) )
			throw new Exception( 'the meta_key passed is not defined', 100 );

		return $this::POST_TYPE . '-' . $meta_key;
	}

	public function update_meta( $meta_key, $value )
	{
		if ( ! isset( $this->ID ) )
			return false;

		update_post_meta( $this->ID, $this->get_meta_name( $meta_key ), $value );
	}

	public function parse( $wp_query )
	{
		if ( ! $wp_query->have_posts() )
			return false;

		foreach ( $wp_query->posts as $post ) :
			$model  = $this->make_model( $post );
			$list[] = $model;

			unset( $model );
		endforeach;

		$std           = new stdClass();
		$std->list     = $list;
		$std->wp_query = $wp_query;

		return $std;
	}

	protected function make_model( $post )
	{
		if ( is_object( $post ) )
			return new $this( $post->ID );

		return new $this( $post );
	}

	/**
	 * Get Property per name
	 *
	 * @since 1.0
	 * @return void
	*/
	protected function get_property( $prop_name )
	{
		return $this->$prop_name;
	}
}
