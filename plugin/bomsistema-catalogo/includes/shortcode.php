<?php

if (!defined('ABSPATH')) {
    exit;
}

function bomsistema_catalogo_shortcode()
{
    return '<div id="bomsistema-catalogo"></div>';
}

add_shortcode(
    'bomsistema_catalogo',
    'bomsistema_catalogo_shortcode'
);