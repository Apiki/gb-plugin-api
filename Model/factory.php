<?php

namespace GB\API;

if ( ! function_exists( 'add_action' ) ) {
	exit( 0 );
}

class Factory
{
	public static function create( $ids, $model_name, $table = false )
	{
		$model_name = '\\' . $model_name;
		$instances  = array();

		foreach ( $ids as $id ) {
			if ( $table && ! self::_is_exist_data( $id, $model_name, $table ) ) {
				continue;
			}

			$instances[] = new $model_name( intval( $id ) );
		}

		return $instances;
	}

	private static function _is_exist_data( $id, $model_name, $table )
	{
		global $wpdb;

		$exists = array(
			'users'    => 'ID',
			'posts'    => 'ID',
			'terms'    => 'term_id',
			'comments' => 'comment_ID',
		);

		return (bool) $wpdb->get_var(
			$wpdb->prepare(
				"SELECT COUNT(*) FROM {$wpdb->$table} WHERE {$exists[ $table ]} = %d",
				$id
			)
		);
	}
}
