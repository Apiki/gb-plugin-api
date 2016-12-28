<?php

namespace GB\API\View;

if ( ! function_exists( 'add_action' ) ) {
	exit( 0 );
}

abstract class Implement_View
{
	public static function render_options( $list, $field_value, $field_text, $current )
	{
		foreach ( $list as $item ) {
			printf(
				'<option value="%1$s" %3$s>%2$s</option>',
				$item->$field_value,
				$item->$field_text,
				Utils::selected( $item->$field_value, $current )
			);
		}
	}

	public static function render_options_by_list( $list, $current )
	{
		foreach ( $list as $key => $text ) {
			printf(
				'<option value="%1$s" %3$s>%2$s</option>',
				$key,
				$text,
				Utils::selected( $key, $current )
			);
		}
	}
}
