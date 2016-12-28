<?php

namespace GB\API\Helper;

if ( ! function_exists( 'add_action' ) ) {
	exit( 0 );
}

use GB\API\Core;

class L10n
{
	public static function get_labels( $messages, $labels = array() )
	{
		extract( $messages );

		$label_lower        = strtolower( $label );
		$plural_lower       = strtolower( $plural );
		$plural_lower_limit = Utils::limit_text( $plural_lower, 12 );

		$defaults = array(
			'name'                       => $plural,
			'singular_name'              => $label,
			'menu_name'                  => $plural,
			'all_items'                  => sprintf( _n( 'All %s', 'All %s', $is_female, Core::SLUG ), $plural_lower_limit ),
			'edit_item'                  => sprintf( __( 'Edit %s', Core::SLUG ), $label ),
			'view_item'                  => sprintf( __( 'View %s', Core::SLUG ), $label ),
			'update_item'                => sprintf( __( 'Update %s', Core::SLUG ), $label ),
			'add_new_item'               => sprintf( _n( 'Add New %s', 'Add New %s', $is_female, Core::SLUG ), $label_lower ),
			'new_item_name'              => sprintf( _n( 'New %s Name', 'New %s Name', $is_female, Core::SLUG ), $label ),
			'parent_item'                => sprintf( __( 'Parent %s', Core::SLUG ), $label ),
			'parent_item_colon'          => sprintf( __( 'Parent %s:', Core::SLUG ), $label ),
			'search_items'               => sprintf( __( 'Search %s', Core::SLUG ), $plural ),
			'popular_items'              => sprintf( __( 'Popular %s', Core::SLUG ), $plural ),
			'separate_items_with_commas' => sprintf( __( 'Separate %s with commas', Core::SLUG ), $plural_lower ),
			'add_or_remove_items'        => sprintf( __( 'Add or remove %s', Core::SLUG ), $plural_lower ),
			'choose_from_most_used'      => sprintf( _n( 'Choose from the most used %s', 'Choose from the most used %s', $is_female, Core::SLUG ), $plural_lower ),
			'not_found'                  => sprintf( _n( 'No %s found.', 'No %s found.', $is_female, Core::SLUG ), $plural_lower ),
			'add_new'                    => _n( 'Add New', 'Add New', $is_female, Core::SLUG ),
			'new_item'                   => sprintf( _n( 'New %s', 'New %s', $is_female, Core::SLUG ), $label ),
			'not_found_in_trash'         => sprintf( _n( 'No %s found in Trash.', 'No %s found in Trash.', $is_female, Core::SLUG ), $plural_lower ),
		);

		return wp_parse_args( $labels, $defaults );
	}
}
