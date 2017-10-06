<?php

namespace GB\API\Helper;

if ( ! function_exists( 'add_action' ) ) {
	exit( 0 );
}

use WP_Comment_Query;
use WP_User_Query;
use WP_Query;

class Utils
{
	/**
	 * Sanitize value from custom method
	 *
	 * @since 2.0.0
	 * @param String $name
	 * @param Mixed $default
	 * @param Mixed $sanitize the function name for sanitize
	 * @return Mixed
	*/
	public static function request( $type, $name, $default, $sanitize = 'rm_tags' )
	{
		$request = filter_input_array( $type, FILTER_SANITIZE_SPECIAL_CHARS );

		if ( ! isset( $request[ $name ] ) || empty( $request[ $name ] ) ) {
			return $default;
		}

		return self::sanitize_type( $request[ $name ], $sanitize );
	}

	/**
	 * Sanitize value from method POST
	 *
	 * @since 2.0.0
	 * @param String $name
	 * @param Mixed $default
	 * @param Mixed $sanitize the function name for sanitize
	 * @return Mixed
	*/
	public static function post( $name, $default = '', $sanitize = 'rm_tags' )
	{
		return self::request( INPUT_POST, $name, $default, $sanitize );
	}

	/**
	 * Sanitize value from method GET
	 *
	 * @since 2.0.0
	 * @param String $name
	 * @param Mixed $default
	 * @param Mixed $sanitize the function name for sanitize
	 * @return Mixed
	*/
	public static function get( $name, $default = '', $sanitize = 'rm_tags' )
	{
		return self::request( INPUT_GET, $name, $default, $sanitize );
	}

	/**
	 * Sanitize value from method COOKIE
	 *
	 * @since 2.0.0
	 * @param String $name
	 * @param Mixed $default
	 * @param Mixed $sanitize the function name for sanitize
	 * @return Mixed
	*/
	public static function cookie( $name, $default = '', $sanitize = 'rm_tags' )
	{
		return self::request( INPUT_COOKIE, $name, $default, $sanitize );
	}

	/**
	 * Get filtered super global $_SERVER by key
	 *
	 * @since 2.0.0
	 * @param String $key
	 * @param Mixed $default
	 * @param Mixed $sanitize the function name for sanitize
	 * @return Mixed
	*/
	public static function server( $key, $default = '', $sanitize = 'rm_tags' )
	{
		$value = self::get_value_by( $_SERVER, strtoupper( $key ), $default );

		return self::sanitize_type( $value, $sanitize );
	}

	/**
	 * Verify request is valid by nonce
	 *
	 * @since 2.0.0
	 * @param String $name
	 * @param String $action
	 * @return false|int
	*/
	public static function verify_nonce_post( $name, $action )
	{
		return wp_verify_nonce( self::post( $name, false ), $action );
	}

	/**
	 * Sanitize requests
	 *
	 * @since 2.0.0
	 * @param String $value
	 * @param String|Array $type the function name
	 * @return Mixed
	*/
	public static function sanitize_type( $value, $type )
	{
		if ( ! is_callable( $type ) ) {
			return ( false === $type ) ? $value : self::rm_tags( $value );
		}

		if ( is_array( $value ) ) {
			return array_map( $type, $value );
		}

		return call_user_func( $type, $value );
	}

	/**
	 * Properly strip all HTML tags including script and style
	 *
	 * @since 2.0.0
	 * @param Mixed String|Array $value
	 * @param Boolean $remove_breaks
	 * @return Mixed String|Array
	 */
	public static function rm_tags( $value, $remove_breaks = false )
	{
		if ( empty( $value ) || is_object( $value ) ) {
			return $value;
		}

		if ( is_array( $value ) ) {
			return array_map( __METHOD__, $value );
		}

		return wp_strip_all_tags( $value, $remove_breaks );
	}

	/**
	 * Get value by array index
	 *
	 * @since 2.0.0
	 * @param Array $args
	 * @param String|int $index
	 * @return String
	 */
	public static function get_value_by( $args, $index, $default = '' )
	{
		if ( ! array_key_exists( $index, $args ) || empty( $args[ $index ] ) ) {
			return $default;
		}

		return $args[ $index ];
	}

	/**
	 * ID of a template page
	 *
	 * Retrieve the ID from a page that use a specific Template Page.
	 *
	 * @param string $template_page The file name of the template page to check.
	 * @return int Return the page ID if exists a page with the $template_page. If more than one
	 * pages uses the $template_page is returned only ID of the first returned by mysql.
	 */
	public static function get_template_page_id( $template_page )
	{
		global $wpdb;

		if ( empty( $template_page ) ) {
			return 0;
		}

		return (int) $wpdb->get_var(
			$wpdb->prepare(
				"SELECT post_id
					FROM $wpdb->postmeta
					WHERE meta_key = '_wp_page_template'
					  AND meta_value = %s
				",
				$template_page
			)
		);
	}

	/**
	 * Permalink of a template page
	 *
	 * Retrieve the permalink from a page that use a specific Template Page.
	 *
	 * @param string $template_page The file name of the template to check If the page is inside a folder.
	 * @return Mixed The permalink for the page that uses the $template_page or false if failure
	 */
	public static function get_template_page_permalink( $template_page )
	{
		$template_id = self::get_template_page_id( $template_page );

		if ( $template_id ) {
			return get_permalink( $template_id );
		}

		return false;
	}

	public static function get_blog_page_permalink()
	{
		return get_permalink( get_option( 'page_for_posts' ) );
	}

	/**
	* Print html dencode
	*
	* @return bool
	*/
	public static function html( $text )
	{
		$text = htmlspecialchars_decode( $text );
		$text = str_replace( '\\', '', $text );

		return strip_tags( $text, '<p><strong><span><br><a>' );
	}

	/**
	* Change pipe for markup
	*
	* @return bool
	*/
	public static function title_pipe( $title, $element = 'strong' )
	{
		if ( strpos( $title, '|' ) === false ) {
			return $title;
		}

		$title = explode( '|', $title );

		return sprintf( "<{$element}>%s</{$element}>%s", trim( $title[0] ), $title[1] );
	}

	/**
	 * Gets the post ID
	 *
	 * Gets the post ID when the page screen is loaded
	 * and when the post is saved.
	 *
	 * @return int returns the post ID
	 */
	public static function get_post_id()
	{
		$post_id = self::get( 'post' );

		if ( $post_id ) {
			return intval( $post_id );
		}

		$post_id = self::post( 'post_ID' );

		if ( $post_id ) {
			return intval( $post_id );
		}

		return 0;
	}

	/**
	* Retrieves the database charset do create new tables.
	*
	* @global type $wpdb
	* @return type
	*/
	public static function get_charset()
	{
		global $wpdb;

		$charset_collate = '';

		if ( ! $wpdb->has_cap( 'collation' ) ) {
			return;
		}

		if ( ! empty( $wpdb->charset ) ) {
			$charset_collate = "DEFAULT CHARACTER SET $wpdb->charset";
		}

		if ( ! empty( $wpdb->collate ) ) {
			$charset_collate .= "\nCOLLATE $wpdb->collate";
		}

		return $charset_collate;
	}

	/**
	 *
	 * Get Ip Host Machine Access
	 *
	 * Use this function for get ip
	 *
	 * @param Null
	 * @since 2.0.0
	 * @return Mixed IP address if success or false if failure
	 */
	public static function get_ipaddress()
	{
		$headers = array(
			'HTTP_CLIENT_IP',
			'HTTP_X_FORWARDED_FOR',
			'HTTP_X_FORWARDED',
			'HTTP_X_CLUSTER_CLIENT_IP',
			'HTTP_FORWARDED_FOR',
			'HTTP_FORWARDED',
			'REMOTE_ADDR',
		);

		foreach ( $headers as $header ) {
			if ( ! array_key_exists( $header, $_SERVER ) ) {
				continue;
			}

			return self::sanitize_ipaddress( $_SERVER[ $header ] );
		}

		return false;
	}

	/**
	 *
	 * Sanitize the IP address
	 *
	 * @param String $ip
	 * @since 2.0.0
	 * @return Mixed string if success of false if failure
	 */
	public static function sanitize_ipaddress( $ip )
	{
		if ( self::indexof( $ip, ',' ) ) {
			$address = explode( ',', $ip );
			$ip      = trim( $address[0] );
		}

		return filter_var( $ip, FILTER_VALIDATE_IP );
	}

	/**
	 *
	 * Search for specific value in string
	 *
	 * @since 2.0.0
	 * @param String $string
	 * @param String $search
	 * @return Bool
	 */
	public static function indexof( $string, $search )
	{
		return ( false !== strpos( $string, $search ) );
	}

	public static function unshift_array( &$list, $insert, $field )
	{
		$values = array_column( $list, $field );

		if ( in_array( $insert[ $field ], $values, true ) ) {
			return;
		}

		array_unshift( $list, $insert );
	}

	/**
	 * Verify the request is ajax
	 *
	 * @since 2.0.0
	 * @param null
	 * @return Boolean
	*/
	public static function is_request_ajax()
	{
		return ( strtolower( self::server( 'HTTP_X_REQUESTED_WITH' ) ) === 'xmlhttprequest' );
	}

	public static function convert_date_for_sql( $date, $format = 'Y-m-d H:i' )
	{
		return ( ! empty( $date ) ) ? self::convert_date( $date, $format, '/', '-' ) : false;
	}

	public static function convert_date_human( $date, $format = 'd/m/Y' )
	{
		return ( ! empty( $date ) ) ? self::convert_date( $date, $format, false ) : false;
	}

	public static function convert_date( $date, $format = 'Y-m-d H:i', $search = '/', $replace = '-' )
	{
		if ( $search && $replace ) {
			$date = str_replace( $search, $replace, $date );
		}

		return date_i18n( $format, strtotime( $date ) );
	}

	public static function convert_float_for_sql( $value )
	{
		$value = str_replace( '.', '', $value );
		$value = str_replace( ',', '.', $value );

		return $value;
	}

	public static function get_user_agent()
	{
		return self::server( 'HTTP_USER_AGENT', 'none' );
	}

	public static function get_thumbnail_url( $thumbnail_id, $size )
	{
		$attachment = wp_get_attachment_image_src( $thumbnail_id, $size );

		if ( ! $attachment ) {
			return false;
		}

		return $attachment[0];
	}

	public static function get_term_field( $post_id, $taxonomy, $field )
	{
		$terms = get_the_terms( $post_id, $taxonomy );

		if ( ! is_array( $terms ) || is_wp_error( $terms ) ) {
			return false;
		}

		$term_first = array_shift( $terms );
		return $term_first->$field;
	}

	public static function get_terms_field( $post_id, $taxonomy, $field, $args = array() )
	{
		$terms   = wp_get_object_terms( $post_id, $taxonomy, $args );
		$results = array();

		if ( ! is_array( $terms ) || is_wp_error( $terms ) ) {
			return false;
		}

		foreach ( $terms as $term ) {
			$results[] = $term->$field;
		}

		return $results;
	}

	public static function get_query( $args = array(), $defaults = array() )
	{
		return new WP_Query( wp_parse_args( $args, $defaults ) );
	}

	public static function get_user_query( $args = array(), $defaults = array() )
	{
		return new WP_User_Query( wp_parse_args( $args, $defaults ) );
	}

	public static function get_terms( $taxonomy, $args = array(), $defaults = array() )
	{
		return get_terms( $taxonomy, wp_parse_args( $args, $defaults ) );
	}

	/**
	 * Get result from comment query
	 * @param  array     $args     Custom params
	 * @param  array     $defaults Default params
	 * @return mixed               The result of query
	 */
	public static function get_comment_query( $args = array(), $defaults = array() )
	{
		return new WP_Comment_Query( wp_parse_args( $args, $defaults ) );
	}

	public static function wp_get_post_terms( $post_id, $taxonomy, $args = array(), $defaults = array() )
	{
		return wp_get_post_terms( $post_id, $taxonomy, wp_parse_args( $args, $defaults ) );
	}

	public static function maybe_create_term( $term, $taxonomy, $args = array() )
	{
		$obj_term = get_term_by( 'name', $term, $taxonomy );

		if ( ! empty( $obj_term ) ) {
			return;
		}

		$response = wp_insert_term( $term, $taxonomy, $args );
	}

	public static function maybe_create_page( $post_name, $postdata = array() )
	{
		$defaults = array(
			'post_status' => 'publish',
			'post_type'   => 'page',
			'post_title'  => isset( $postdata['title'] ) ? $postdata['title'] : $post_name,
			'post_name'   => $post_name,
		);

		$args     = wp_parse_args( $postdata, $defaults );
		$obj_page = get_page_by_path( $post_name );

		if ( ! empty( $obj_page ) ) {
			return $obj_page->ID;
		}

		$new_page = wp_insert_post( $args );

		if ( is_wp_error( $new_page ) ) {
			return false;
		}

		return $new_page;
	}

	public static function error_server_json( $code, $message = 'Generic Message Error', $echo = true )
	{
		$response = wp_json_encode(
			array(
				'status'  => 'error',
				'code'    => $code,
				'message' => $message,
			)
		);

		if ( ! $echo ) {
			return $response;
		}

		echo $response;
	}

	public static function success_server_json( $code, $message = 'Generic Message Success', $echo = true )
	{
		$response = wp_json_encode(
			array(
				'status'  => 'success',
				'code'    => $code,
				'message' => $message,
			)
		);

		if ( ! $echo ) {
			return $response;
		}

		echo $response;
	}

	public static function limit_text( $text, $limit, $more = '...' )
	{
		if ( strlen( $text ) > $limit ) {
			$text = mb_substr( $text, 0, $limit ) . $more;
		}

		return $text;
	}

	public static function json_decode_quoted( $data, $is_assoc = true )
	{
		return json_decode( str_replace( '&quot;', '"', $data ), $is_assoc );
	}

	public static function json_encode_html( $value )
	{
		return wp_json_encode( $value, JSON_HEX_APOS );
	}

	public static function add_custom_capabilities( $roles, array $caps )
	{
		foreach ( (array) $roles as $role ) {
			$current_role = get_role( $role );
			if ( ! empty( $current_role ) ) {
				array_map( array( &$current_role, 'add_cap' ), $caps );
			}
		}
	}

	public static function get_term_meta( $term_id, $section, $field )
	{
		$meta = get_option( $section );

		if ( ! $meta ) {
			return false;
		}

		if ( ! isset( $meta[ $term_id ] ) ) {
			return false;
		}

		if ( ! isset( $meta[ $term_id ][ $field ] ) ) {
			return false;
		}

		return $meta[ $term_id ][ $field ];
	}

	/**
	 * Escape html entities
	 * @param  string    $text The text to escape html entities
	 * @return string          The text escaped
	 */
	public static function esc_html( $text )
	{
		$safe_text = htmlentities( $text );
		return apply_filters( 'esc_html', $safe_text, $text );
	}

	public static function has_key( $list, $key )
	{
		return isset( $list[ $key ] ) && (bool) $list[ $key ];
	}

	public static function selected( $selected, $current )
	{
		if ( is_array( $current ) ) {
			return in_array( $selected, $current, true ) ? 'selected="selected"' : '';
		}

		return selected( $selected, $current, false );
	}

	/**
	 *
	 * Verify the current field input is checked
	 *
	 * @since 2.0.0
	 * @param Mixed $checked
	 * @param Mixed $current
	 * @param Bool $echo
	 * @return String
	 */
	public static function checked( $checked, $current, $echo = false )
	{
		if ( is_array( $current ) ) {
			return in_array( $checked, $current, true ) ? 'checked="checked"' : '';
		}

		return checked( $checked, $current, $echo );
	}

	public static function get_excerpt( $num_words = 55, $more = '...', $post_object = null )
	{
		global $post;

		if ( ! $post_object ) {
			$post_object = $post;
		}

		$text = $post_object->post_excerpt;

		if ( empty( $text ) ) {
			$text = $post_object->post_content;
		}

		return apply_filters( 'the_excerpt', wp_trim_words( $text, $num_words, $more ) );
	}

	public static function is_localhost()
	{
		return ( self::server( 'SERVER_NAME' ) === 'localhost' );
	}

	/**
	 *
	 * Get the request data
	 *
	 * @since 2.0.0
	 * @param Null
	 * @return Mixed Object if success of false if failure
	 */
	public static function get_json_post_data()
	{
		if ( function_exists( 'phpversion' ) && version_compare( phpversion(), '5.6', '>=' ) ) {
			$post_data = file_get_contents( 'php://input' );
		} else {
			global $HTTP_RAW_POST_DATA;
			$post_data = $HTTP_RAW_POST_DATA;
		}

		return empty( $post_data ) ? false : json_decode( $post_data );
	}

	/**
	 *
	 * Get the current user real IP address info via API request
	 *
	 * @since 2.0.0
	 * @param Null
	 * @return Mixed Object if success of null if failure
	 */
	public static function get_ipinfo()
	{
		$response = wp_safe_remote_get(
			'https://ipinfo.io/json',
			array(
				'httpversion' => '1.1',
			)
		);

		return json_decode( wp_remote_retrieve_body( $response ) );
	}
}
