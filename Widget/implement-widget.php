<?php

namespace GB\API;

if ( ! function_exists( 'add_action' ) ) {
	exit( 0 );
}

use ReflectionClass;
use Carbon_Fields\Widget;

class Implement_Widget extends Widget
{
	protected function get_property( $instance, $property, $default = '' )
	{
		return ( isset( $instance[ $property ] ) && ! empty( $instance[ $property ] ) ) ? $instance[ $property ] : $default;
	}

	public function front_end( $args, $instance )
	{
		$name = ( new ReflectionClass( $this ) )->getShortName();
		$name = str_replace( '_', '-', strtolower( $name ) );

		include TEMPLATEPATH . "/widgets/{$name}.php";
	}
}
