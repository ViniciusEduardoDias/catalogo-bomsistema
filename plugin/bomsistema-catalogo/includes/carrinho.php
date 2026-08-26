<?php

if (!defined('ABSPATH')) {
    exit;
}

function bomsistema_carregar_script_orcamento()
{
    if (is_product()) {
        wp_enqueue_script(
            'bomsistema-orcamento',
            BOMSISTEMA_CATALOGO_URL . 'assets/js/orcamento.js',
            [],
            '1.0.0',
            true
        );
    }
}

add_action(
    'wp_enqueue_scripts',
    'bomsistema_carregar_script_orcamento'
);