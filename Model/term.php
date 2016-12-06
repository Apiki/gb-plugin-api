<?php

namespace GB\API;

if ( ! function_exists( 'add_action' ) ) {
	exit( 0 );
}

class Term
{
	/**
	 * Metas
	 *
	 * @since 1.1
	 * @var array
	 */
	public $metas = array();

	/**
	 * Term ID
	 *
	 * @since 1.0
	 * @var int
	 */
	private $term_id;

	/**
	 * Name
	 *
	 * @since 1.0
	 * @var string
	 */
	private $name;

	/**
	 * Slug
	 *
	 * @since 1.0
	 * @var string
	 */
	private $slug;

	/**
	 * Term Group
	 *
	 * @since 1.0
	 * @var string
	 */
	private $term_group;

	/**
	 * Term Taxonomy ID
	 *
	 * @since 1.0
	 * @var int
	 */
	private $term_taxonomy_id;

	/**
	 * Taxonomy
	 *
	 * @since 1.0
	 * @var string
	 */
	private $taxonomy;

	/**
	 * Description
	 *
	 * @since 1.0
	 * @var string
	 */
	private $description;

	/**
	 * Parent
	 *
	 * @since 1.0
	 * @var int
	 */
	private $parent;

	/**
	 * Count
	 *
	 * @since 1.0
	 * @var int
	 */
	private $count;

	/**
	 * Use in fields has literal names
	 *
	 * @since 1.0
	 * @var array
	 */
	private $default_fields = array(
		'term_id',
		'name',
		'slug',
		'term_group',
		'term_taxonomy_id',
		'taxonomy',
		'description',
		'parent',
		'count',
	);

	public function __construct( $term = false )
	{
		if ( false !== $term ) {
			$this->_populate_fields( $term );
		}
	}

	public function get_permalink()
	{
		return get_term_link( $this );
	}

	public function get_child()
	{
		return $this->find(
			array(
				'parent'     => $this->term_id,
				'hide_empty' => false,
			)
		);
	}

	public function get_children()
	{
		return $this->find(
			array(
				'parent'     => $this->term_id,
				'hide_empty' => false,
			)
		);
	}

	public function get_grandchildren()
	{
		return $this->find(
			array(
				'child_of'   => $this->term_id,
				'hide_empty' => false,
			)
		);
	}

	public function has_children()
	{
		return (bool) $this->get_children();
	}

	public function has_child()
	{
		return (bool) $this->get_child();
	}

	public function get_top_level_parent()
	{
		$parent = new $this( $this->term_id );

		while ( $parent->__get( 'parent' ) ) {
			$parent = new $this( $parent->__get( 'parent' ) );
		}

		return $parent;
	}

	public function get_depth()
	{
		$parent = $this;
		$depth  = 0;

		while ( $parent->__get( 'parent' ) ) {
			$parent = new $this( $parent->__get( 'parent' ) );
			$depth++;
		}

		return $depth;
	}

	public function get_depth_limit()
	{
		$args = array(
			'child_of' => $this->term_id,
		);

		$terms     = $this->find( $args );
		$depth_max = 0;

		if ( ! $terms ) {
			return $depth_max;
		}

		foreach ( $terms->list as $term ) {
			$depth = $term->get_depth();

			if ( $depth > $depth_max ) {
				$depth_max = $depth;
			}
		}

		return $depth_max;
	}

	public function find( $args = array(), $post_id = false )
	{
		$defaults = array();

		if ( $post_id ) {
			return $this->parse( Utils::wp_get_post_terms( $post_id, $this::SLUG, $args, $defaults ) );
		}

		return $this->parse( Utils::get_terms( $this::SLUG, $args, $defaults ) );
	}

	public function parse( $terms )
	{
		if ( ! $terms ) {
			return false;
		}

		if ( is_wp_error( $terms ) ) {
			return false;
		}

		foreach ( $terms as $term ) {
			$model  = new $this( $term );
			$list[] = $model;

			unset( $model );
		}

		$std        = new \stdClass();
		$std->list  = $list;
		$std->terms = $terms;

		return $std;
	}

	public function __set( $prop_name, $value )
	{
		return $this->$prop_name = $value;
	}

	public function __get( $prop_name )
	{
		if ( isset( $this->$prop_name ) ) {
			return $this->$prop_name;
		}

		if ( in_array( $prop_name, $this->default_fields, true ) ) {
			$this->$prop_name = get_term_field( $prop_name, $this->term_id, $this::SLUG, false );
			return $this->$prop_name;
		}

		if ( array_key_exists( $prop_name, $this->metas ) ) {
			$this->$prop_name = $this->get_meta_value( $prop_name );
			return $this->$prop_name;
		}

		return $this->get_property( $prop_name );
	}

	public function get_meta_value( $meta_key )
	{
		$args  = $this->metas[ $meta_key ];
		$value = carbon_get_term_meta( $this->term_id, $meta_key, $args['type'] );

		if ( ! $value ) {
			return @$args['default'];
		}

		if ( @$args['sanitize'] && is_callable( $args['sanitize'] ) ) {
			return call_user_func( $args['sanitize'], $value );
		}

		return $value;
	}

	/**
	 * Update meta manager
	 *
	 * @since 1.0
	 * @return void
	 */
	public function update_meta( $meta_key, $value )
	{
		update_term_meta( $this->term_id, $meta_key, $value );
	}

	/**
	 * Deletes meta manager
	 *
	 * @since 1.0
	 * @return void
	 */
	public function delete_meta( $meta_key )
	{
		delete_term_meta( $this->term_id, $meta_key );
	}

	public function term_exists( $name, $taxonomy = 'category' )
	{
		global $wpdb;

		$query = $wpdb->prepare(
			"
			SELECT
				terms.term_id,
				term_tax.term_taxonomy_id
			FROM {$wpdb->terms} terms
			INNER JOIN {$wpdb->term_taxonomy} term_tax
				ON ( terms.term_id = term_tax.term_id )
			WHERE terms.slug        = '%s'
			AND   term_tax.taxonomy = '%s'
			LIMIT 1;
			",
			sanitize_title( $name ),
			$taxonomy
		);

		return $wpdb->get_row( $query, ARRAY_A );
	}

	public function create_in_object( $name, $post_id, $args = array() )
	{
		$slug = isset( $args['slug'] ) ? $args['slug'] : $name;
		$term = $this->term_exists( $slug, $this::SLUG );

		if ( $term ) {
			$this->set_object( $term['term_id'], $post_id );
			return $term;
		}

		return $this->insert( $name, $post_id, true, $args );
	}

	public function insert( $name, $post_id, $is_set = false, $args = array() )
	{
		$term = wp_insert_term( $name, $this::SLUG, $args );

		if ( ! $term || is_wp_error( $term ) ) {
			return false;
		}

		if ( $is_set ) {
			$this->set_object( $term['term_id'], $post_id );
		}

		return $term;
	}

	public function set_object( $ids, $post_id )
	{
		if ( ! is_array( $ids ) ) {
			$ids = array( $ids );
		}

		return wp_set_object_terms(
			$post_id,
			array_map( 'intval', $ids ),
			$this::SLUG
		);
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

	/**
	 * Populate the fields of this class
	 * @since  1.2.4
	 * @param mixed    $comment The ID of comment or associative array of fields
	 * @return void
	 */
	private function _populate_fields( $term )
	{
		if ( ! is_array( $term ) && ! is_object( $term ) ) {
			$term = get_term( $term, $this::SLUG );
		}

		foreach ( $this->default_fields as $prop_name ) {
			if ( ! $term ) {
				$this->$prop_name = false;
				continue;
			}

			if ( isset( $term->$prop_name ) ) {
				$this->$prop_name = $term->$prop_name;
			}
		}
	}
}
