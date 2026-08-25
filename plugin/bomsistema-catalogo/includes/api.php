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

    register_rest_route('bomsistema/v1', '/categorias', [
        'methods'  => 'GET',
        'callback' => 'bomsistema_obter_categorias',
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

        // Busca as categorias do produto
        $categorias_produto = wp_get_post_terms(
            $produto->get_id(),
            'product_cat'
        );

        $categorias = [];

        if (!is_wp_error($categorias_produto)) {
            foreach ($categorias_produto as $categoria) {
                $categorias[] = [
                    'nome' => $categoria->name,
                    'slug' => $categoria->slug,
                ];
            }
        }

        $resultado[] = [
            'id'         => $produto->get_id(),
            'nome'       => $produto->get_name(),
            'slug'       => $produto->get_slug(),
            'url'        => $produto->get_permalink(),
            'imagem'     => wp_get_attachment_image_url(
                $produto->get_image_id(),
                'medium_large'
            ),
            'destaque'   => $produto->is_featured(),
            'categorias' => $categorias,
        ];
    }

    return rest_ensure_response($resultado);
}


function bomsistema_obter_categorias()
{
    if (!class_exists('WooCommerce')) {
        return new WP_Error(
            'woocommerce_inativo',
            'WooCommerce não está ativo.',
            ['status' => 500]
        );
    }

    $categorias = get_terms([
        'taxonomy'   => 'product_cat',
        'hide_empty' => true,
    ]);

    if (is_wp_error($categorias)) {
        return new WP_Error(
            'erro_categorias',
            'Não foi possível carregar as categorias.',
            ['status' => 500]
        );
    }

    $resultado = [];

    foreach ($categorias as $categoria) {
        $resultado[] = [
            'id'   => $categoria->term_id,
            'nome' => $categoria->name,
            'slug' => $categoria->slug,
        ];
    }

    return rest_ensure_response($resultado);
}