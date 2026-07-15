<?php

if (!defined('ABSPATH')) {
    exit;
}

function bomsistema_registrar_rotas_api()
{
    register_rest_route('bomsistema/v1', '/produtos', [
        'methods'  => 'GET',
        'callback' => 'bomsistema_obter_produtos',
        'permission_callback' => '__return_true',
    ]);
}

add_action('rest_api_init', 'bomsistema_registrar_rotas_api');


function bomsistema_obter_produtos()
{
    if (!class_exists('WooCommerce')) {
        return new WP_Error(
            'woocommerce_inativo',
            'WooCommerce não está ativo.',
            ['status' => 500]
        );
    }

    $produtos = wc_get_products([
        'status' => 'publish',
        'limit'  => -1,
    ]);

    $resultado = [];

    foreach ($produtos as $produto) {
        $resultado[] = [
            'id'        => $produto->get_id(),
            'nome'      => $produto->get_name(),
            'slug'      => $produto->get_slug(),
            'url'       => $produto->get_permalink(),
            'imagem'    => wp_get_attachment_image_url(
                $produto->get_image_id(),
                'medium_large'
            ),
        ];
    }

    return rest_ensure_response($resultado);
}