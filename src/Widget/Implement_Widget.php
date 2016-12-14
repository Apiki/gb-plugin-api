<?php

namespace GB\API\Widget;

if ( ! function_exists( 'add_action' ) ) {
	exit( 0 );
}

use ReflectionClass;
use Carbon_Fields\Widget;

class Implement_Widget extends Widget
{
	private $instance;

	protected function get_prop( $prop, $default = '' )
	{
		if ( ! isset( $this->instance[ $prop ] ) ) {
			return $default;
		}

		return ( $this->instance[ $prop ] ) ? $this->instance[ $prop ] : $default;
	}

	public function front_end( $args, $instance )
	{
		$name = ( new ReflectionClass( $this ) )->getShortName();
		$name = str_replace( '_', '-', strtolower( $name ) );

		$this->instance = $instance;

		include TEMPLATEPATH . "/widgets/{$name}.php";
	}
}
