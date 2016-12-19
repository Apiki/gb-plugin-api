<?php

namespace GB\API\Widget;

if ( ! function_exists( 'add_action' ) ) {
	exit( 0 );
}

use ReflectionClass;
use Carbon_Fields\Widget;

class Implement_Widget extends Widget
{
	/**
	 * Instance fields with props.
	 *
	 * @var array
	 */
	private $instance;

	/**
	 * Get prop by instance.
	 *
	 * @param string $prop name of prop.
	 * @return mixed value of instance by index.
	 */
	protected function get_prop( $prop, $default = '' )
	{
		if ( ! isset( $this->instance[ $prop ] ) ) {
			return $default;
		}

		return ( $this->instance[ $prop ] ) ? $this->instance[ $prop ] : $default;
	}

	/**
	 * Used for html front-end in theme.
	 * To work is need to create an file in theme.
	 * Like class name Box_Tags_Widget create file in widgets folder box-tags-widget.php.
	 *
	 * @param array $args
	 * @return array $instance
	 */
	public function front_end( $args, $instance )
	{
		$name = ( new ReflectionClass( $this ) )->getShortName();
		$name = str_replace( '_', '-', strtolower( $name ) );

		$this->instance = $instance;

		include TEMPLATEPATH . "/widgets/{$name}.php";
	}
}
