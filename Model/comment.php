<?php

namespace GB\API;

// Avoid that files are directly loaded
if ( ! function_exists( 'add_action' ) ) {
	exit( 0 );
}

use Exception;
use stdClass;

abstract class Comment
{
	/**
	 * The comment ID
	 * @var integer
	 * @since 1.2.4
	 */
	private $ID;

	/**
	 * The ID of the post/page that this comment responds to
	 * @var integer
	 * @since 1.2.4
	 */
	private $post_ID;

	/**
	 * The comment author's name
	 * @var string
	 * @since 1.2.4
	 */
	private $author;

	/**
	 * The comment author's email
	 * @var string
	 * @since 1.2.4
	 */
	private $author_email;

	/**
	 * The comment author's webpage
	 * @var string
	 * @since 1.2.4
	 */
	private $author_url;

	/**
	 * The comment author's IP
	 * @var string
	 * @since 1.2.4
	 */
	private $author_IP;

	/**
	 * The datetime of the comment (YYYY-MM-DD HH:MM:SS)
	 * @var string
	 * @since 1.2.4
	 */
	private $date;

	/**
	 * The GMT datetime of the comment (YYYY-MM-DD HH:MM:SS)
	 * @var string
	 * @since 1.2.4
	 */
	private $date_gmt;

	/**
	 * The comment's content
	 * @var string
	 * @since 1.2.4
	 */
	private $content;

	/**
	 * The comment's karma
	 * @var integer
	 * @since 1.2.4
	 */
	private $karma;

	/**
	 * The comment approval level (0, 1 or "spam")
	 * @var string
	 * @since 1.2.4
	 */
	private $approved;

	/**
	 * The commenter's user agent (browser, operating system, etc.)
	 * @var string
	 * @since 1.2.4
	 */
	private $agent;

	/**
	 * The comment's type if meaningfull (pingback|trackback), empty for normal comments
	 * @var string
	 * @since 1.2.4
	 */
	private $type;

	/**
	 * The parent comment's ID for nested comments (0 for top level)
	 * @var string
	 * @since 1.2.4
	 */
	private $parent;

	/**
	 * The comment author's ID if s/he is registered (0 otherwise)
	 * @var integer
	 * @since 1.2.4
	 */
	private $user_id;

	/**
	 * Use in fields comment has "comment_" prefix
	 * @var array
	 * @since 1.2.4
	 */
	private $fields_associate = array(
		'comment_ID'           => 'ID',
		'comment_post_ID'      => 'post_ID',
		'comment_author'       => 'author',
		'comment_author_email' => 'author_email',
		'comment_author_url'   => 'author_url',
		'comment_author_IP'    => 'author_IP',
		'comment_date'         => 'date',
		'comment_date_gmt'     => 'date_gmt',
		'comment_content'      => 'content',
		'comment_karma'        => 'karma',
		'comment_approved'     => 'approved',
		'comment_agent'        => 'agent',
		'comment_type'         => 'type',
		'comment_parent'       => 'parent',
		'user_id'              => 'user_id',
	);

	/**
	 * Constructor of the class. Instantiate and incializate it.
	 * @since 1.2.4
	 * @param mixed    $comment The ID of comment or associative array of fields
	 */
	public function __construct( $comment = false )
	{
		if ( false != $comment ) {
			$this->_populate_fields( $comment );
		}
	}

	/**
	 * Magic function to retrieve the value of the attribute more easily.
	 * @since  1.2.4
	 * @param  string    $prop_name The attribute name
	 * @return mixed               The attribute value
	 */
	public function __get( $prop_name )
	{
		if ( isset( $this->$prop_name ) ) {
			return $this->$prop_name;
		}

		return $this->get_property( $prop_name );
	}

	/**
	 * Get Property per name
	 * @since  1.2.4
	 * @param  string    $prop_name The property name
	 * @return mixed               The property value
	 */
	protected function get_property( $prop_name )
	{

	}

	/**
	 * Find instances of this class
	 * @since  1.2.4
	 * @param  array     $args Params of WP_Comment_Query
	 * @return mixed          Result of the find
	 */
	public function find( $args = array() )
	{
		return $this->parse( Utils::get_comment_query( $args ) );
	}

	/**
	 * Parse the find result
	 * @since  1.2.4
	 * @param  WP_Comment_Query    $comments The result of WP_Comment_Query
	 * @return mixed              The result of the parse
	 */
	public function parse( $wp_comment_query )
	{
		if ( ! $wp_comment_query->comments ) {
			return false;
		}

		foreach ( $wp_comment_query->comments as $comment ) {
			$model  = new $this( $comment );
			$list[] = $model;

			unset( $model );
		}

		$std                   = new stdClass();
		$std->list             = $list;
		$std->wp_comment_query = $wp_comment_query;

		return $std;
	}

	/**
	 * Populate the fields of this class
	 * @since  1.2.4
	 * @param mixed    $comment The ID of comment or associative array of fields
	 * @return void
	 */
	private function _populate_fields( $comment )
	{
		if ( ! is_array( $comment ) ) {
			$comment = get_comment( $comment, ARRAY_A );
		}

		foreach ( $this->fields_associate as $key => $field_associate ) {
			if ( isset( $comment[ $key ] ) ) {
				$this->$field_associate = $comment[ $key ];
			}
		}
	}
}
