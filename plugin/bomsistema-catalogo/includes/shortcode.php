<?php

if (!defined('ABSPATH')) {
    exit;
}


/* =========================
   CATÁLOGO
========================= */

function bomsistema_catalogo_shortcode()
{
    return '<div id="bomsistema-catalogo" data-pagina="catalogo"></div>';
}

add_shortcode(
    'bomsistema_catalogo',
    'bomsistema_catalogo_shortcode'
);


/* =========================
   ORÇAMENTO
========================= */

function bomsistema_orcamento_shortcode()
{
    return '<div id="bomsistema-catalogo" data-pagina="orcamento"></div>';
}

add_shortcode(
    'bomsistema_orcamento',
    'bomsistema_orcamento_shortcode'
);


/* =========================
   PRODUTOS POR CATEGORIA
========================= */

function bomsistema_produtos_shortcode($atts)
{
    $atts = shortcode_atts(
        array(
            'categoria' => '',
            'modo'      => 'grid',
        ),
        $atts,
        'bomsistema_produtos'
    );

    $categoria = implode(
        ',',
        array_filter(
            array_map(
                'sanitize_title',
                explode(',', $atts['categoria'])
            )
        )
    );

    $modo = strtolower(sanitize_text_field($atts['modo']));

    if (!in_array($modo, array('grid', 'carousel'), true)) {
        $modo = 'grid';
    }

    return sprintf(
        '<div id="bomsistema-catalogo" data-pagina="produtos" data-categoria="%s" data-modo="%s"></div>',
        esc_attr($categoria),
        esc_attr($modo)
    );
}

add_shortcode(
    'bomsistema_produtos',
    'bomsistema_produtos_shortcode'
);