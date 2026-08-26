<?php

if (!defined('ABSPATH')) {
    exit;
}

function bomsistema_catalogo_shortcode()
{
    return '<div id="bomsistema-catalogo" data-pagina="catalogo"></div>';
}

add_shortcode(
    'bomsistema_catalogo',
    'bomsistema_catalogo_shortcode'
);


function bomsistema_orcamento_shortcode()
{
    return '<div id="bomsistema-catalogo" data-pagina="orcamento"></div>';
}

add_shortcode(
    'bomsistema_orcamento',
    'bomsistema_orcamento_shortcode'
);