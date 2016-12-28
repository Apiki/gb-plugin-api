<?php

namespace GB\API\Helper;

if ( ! function_exists( 'add_action' ) ) {
	exit( 0 );
}

class Validation
{
	/**
	* Verify nonce by $_POST param
	*
	* @return bool
	*/
	public static function verify_nonce_post( $name, $action )
	{
		return wp_verify_nonce( Utils::post( $name, false ), $action );
	}

	public static function verify_nonce_get( $name, $action )
	{
		return wp_verify_nonce( Utils::get( $name, false ), $action );
	}

	public static function is_name( $name )
	{
		$name = preg_replace( '/\d/', '', $name );
		$name = preg_replace( '/[\n\t\r]/', ' ', $name );
		$name = preg_replace( '/\s(?=\s)/', '', $name );
		$name = trim( $name );
		$name = explode( ' ', $name );

		return ( count( $name ) > 1 );
	}

	/**
	* Verify if CPF is valid
	* @param  string    $cpf The CPF
	* @return boolean        Result
	*/
	public static function is_cpf( $cpf = null )
	{
		$cpf = str_pad( preg_replace( '/[^0-9]/', '', $cpf ), 11, '0', STR_PAD_LEFT );

		if ( strlen( $cpf ) != 11 || $cpf == '00000000000' || $cpf == '11111111111' || $cpf == '22222222222' || $cpf == '33333333333' || $cpf == '44444444444' || $cpf == '55555555555' || $cpf == '66666666666' || $cpf == '77777777777' || $cpf == '88888888888' || $cpf == '99999999999' ) {
			return false;
		} else {
			for ( $t = 9; $t < 11; $t++ ) {
				for ( $d = 0, $c = 0; $c < $t; $c++ ) {
					$d += $cpf{$c} * (($t + 1) - $c);
				}
				$d = ((10 * $d) % 11) % 10;
				if ( $cpf{$c} != $d ) {
					return false;
				}
			}
		}

		return true;
	}

	public static function is_cnpj( $cnpj = null )
	{
		$cnpj = preg_replace( '/[^0-9]/', '', (string) $cnpj );

		// Valida tamanho
		if ( strlen( $cnpj ) != 14 ) {
			return false;
		}

		// Valida primeiro dígito verificador
		for ( $i = 0, $j = 5, $soma = 0; $i < 12; $i++ ) {
			$soma += $cnpj{$i} * $j;
			$j = ($j == 2) ? 9 : $j - 1;
		}

		$resto = $soma % 11;

		if ( $cnpj{12} != ( $resto < 2 ? 0 : 11 - $resto ) ) {
			return false;
		}

		// Valida segundo dígito verificador
		for ( $i = 0, $j = 6, $soma = 0; $i < 13; $i++ ) {
			$soma += $cnpj{$i} * $j;
			$j = ($j == 2) ? 9 : $j - 1;
		}

		$resto = $soma % 11;

		return $cnpj{13} == ( $resto < 2 ? 0 : 11 - $resto );
	}
}
