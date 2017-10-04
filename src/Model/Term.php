<?php

namespace GB\API\Model;

if ( ! function_exists( 'add_action' ) ) {
	exit( 0 );
}

use GB\API\Helper\Utils;

class Term
{
	/**
	 * The term metas.
	 *
	 * @var array
	 */
	public $metas = array();

	/**
	 * The term id.
	 *
	 * @var integer
	 */
	protected $term_id;

	/**
	 * The term name.
	 *
	 * @var string
	 */
	protected $name;

	/**
	 * The term slug.
	 *
	 * @var string
	 */
	protected $slug;

	/**
	 * The term group.
	 *
	 * @var string
	 */
	protected $term_group;

	/**
	 * The term taxonomy id.
	 *
	 * @var int
	 */
	protected $term_taxonomy_id;

	/**
	 * The term taxonomy.
	 *
	 * @var string
	 */
	protected $taxonomy;

	/**
	 * The term description.
	 *
	 * @var string
	 */
	protected $description;

	/**
	 * The term parent.
	 *
	 * @var int
	 */
	protected $parent;

	/**
	 * The term count.
	 *
	 * @var int
	 */
	protected $count;

	/**
	 * Use in fields has literal names.
	 *
	 * @var array
	 */
	protected $default_fields = array(
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

	/**
	 * Post Type name
	 *
	 * @since 1.0
	 * @var string
	 */
	const SLUG = 'category';

	/**
	 * Constructor of the class. Instantiate and incializate it.
	 *
	 * @param mixed $term
	 * @return void
	 */
	public function __construct( $term = false )
	{
		if ( false !== $term ) {
			$this->_populate_fields( $term );
		}
	}

	/**
	 * Return the permalink of list posts by this term.
	 *
	 * @return string
	 */
	public function get_permalink()
	{
		$value = get_term_link( $this->term_id );

		if ( is_wp_error( $value ) ) {
			return false;
		}

		return $value;
	}

	/**
	 * Return the terms child.
	 *
	 * @return stdClass
	 */
	public function get_children()
	{
		return $this->find(
			array(
				'parent'     => $this->term_id,
				'hide_empty' => false,
			)
		);
	}

	/**
	 * Return the terms grandchildren.
	 *
	 * @return stdClass
	 */
	public function get_grandchildren()
	{
		return $this->find(
			array(
				'child_of'   => $this->term_id,
				'hide_empty' => false,
			)
		);
	}

	/**
	 * Ruturn if has children.
	 *
	 * @return boolean
	 */
	public function has_children()
	{
		return (bool) $this->get_children();
	}

	/**
	 * Return the top level parent.
	 *
	 * @return Term
	 */
	public function get_top_level_parent()
	{
		$parent = new $this( $this->term_id );

		while ( $parent->__get( 'parent' ) ) {
			$parent = new $this( $parent->__get( 'parent' ) );
		}

		return $parent;
	}

	/**
	 * Return the depth of this term.
	 *
	 * @return int
	 */
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

	/**
	 * Return the depth limit.
	 *
	 * @return int
	 */
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

	/**
	 * Find terms with get_terms or wp_get_post_terms if post_id is defined.
	 *
	 * @param array $args
	 * @param int $post_id
	 * @return stdClass
	 */
	public function find( $args = array(), $post_id = false )
	{
		if ( $post_id ) {
			return $this->parse( Utils::wp_get_post_terms( $post_id, $this::SLUG, $args ) );
		}

		return $this->parse( Utils::get_terms( $this::SLUG, $args ) );
	}

	/**
	 * Parse terms results.
	 *
	 * @param array $terms
	 * @return stdClass
	 */
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
			'type'     => '',
			'sanitize' => '',
		);

		$args  = wp_parse_args( $this->metas[ $meta_key ], $defaults );
		$value = carbon_get_term_meta( $this->term_id, $meta_key, $args['type'] );

		if ( ! $value ) {
			return $args['default'];
		}

		if ( $args['sanitize'] && is_callable( $args['sanitize'] ) ) {
			return call_user_func( $args['sanitize'], $value );
		}

		return $value;
	}

	/**
	 * Update the term meta.
	 *
	 * @param string $meta_key
	 * @param mixed $value
	 * @return void
	 */
	public function update_meta( $meta_key, $value )
	{
		update_term_meta( $this->term_id, $meta_key, $value );
	}

	/**
	 * Delete the term meta.
	 *
	 * @param string $meta_key
	 * @return void
	 */
	public function delete_meta( $meta_key )
	{
		delete_term_meta( $this->term_id, $meta_key );
	}

	/**
	 * Return if term exists.
	 *
	 * @param string $name
	 * @return array
	 */
	public function term_exists( $name )
	{
		global $wpdb;

		return $wpdb->get_row(
			$wpdb->prepare(
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
				$this::SLUG
			),
			ARRAY_A
		);
	}

	/**
	 * Insert term.
	 *
	 * @param string $name
	 * @param int $post_id
	 * @param boolean $is_set
	 * @param array $args
	 * @return object $term
	 */
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

	/**
	 * Associate term in post.
	 *
	 * @param int|array $ids
	 * @param int $post_id
	 * @return mixed return default wp_set_object_terms.
	 */
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
	 * Return property fallback.
	 *
	 * @param string $prop_name
	 * @return mixed
	 */
	protected function get_property( $prop_name )
	{
		return $this->$prop_name;
	}

	/**
	 * Populate the fields of this class.
	 *
	 * @param mixed
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
