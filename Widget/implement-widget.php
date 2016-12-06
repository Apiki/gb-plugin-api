<?php

namespace GB\API;

// Avoid that files are directly loaded
if ( ! function_exists( 'add_action' ) ) {
	exit( 0 );
}

use WP_Widget;
use ReflectionClass;

class Implement_Widget extends WP_Widget
{
	protected function get_property( $instance, $property, $default = '' )
	{
		return ( isset( $instance[ $property ] ) && ! empty( $instance[ $property ] ) ) ? $instance[ $property ] : $default;
	}

	/**
	 * Front-end display of widget.
	 *
	 * @see WP_Widget::widget()
	 *
	 * @param array $args     Widget arguments.
	 * @param array $instance Saved values from database.
	 */
	public function widget( $args, $instance )
	{
		$file_name = str_replace( '_', '-', strtolower( (new ReflectionClass( $this ) )->getShortName() ) ) . '.php';

		include TEMPLATEPATH . '/widgets/' . $file_name;
	}
}
