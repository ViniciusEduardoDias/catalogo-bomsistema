<?php
/**
 * Plugin Name: Bomsistema Catálogo
 * Plugin URI: https://bomsistema.com.br
 * Description: Catálogo de produtos em React.
 * Version: 1.0.0
 * Author: Bomsistema
 * Author URI: https://bomsistema.com.br
 */

if (!defined('ABSPATH')) {
    exit;
}

define('BOMSISTEMA_CATALOGO_PATH', plugin_dir_path(__FILE__));
define('BOMSISTEMA_CATALOGO_URL', plugin_dir_url(__FILE__));

require_once BOMSISTEMA_CATALOGO_PATH . 'includes/init.php';