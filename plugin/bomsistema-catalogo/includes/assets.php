
<?php

if (!defined('ABSPATH')) {
    exit;
}

function bomsistema_catalogo_enqueue_assets()
{
    $manifest_path = BOMSISTEMA_CATALOGO_PATH . 'build/.vite/manifest.json';

    if (!file_exists($manifest_path)) {
        return;
    }

    $manifest = json_decode(file_get_contents($manifest_path), true);

    if (!$manifest || !isset($manifest['index.html'])) {
        return;
    }

    $entry = $manifest['index.html'];

    wp_enqueue_script(
        'bomsistema-react',
        BOMSISTEMA_CATALOGO_URL . 'build/' . $entry['file'],
        ['jquery', 'wp-util'],
        null,
        true
    );

    if (!empty($entry['css'])) {
        foreach ($entry['css'] as $css) {
            wp_enqueue_style(
                'bomsistema-react-style',
                BOMSISTEMA_CATALOGO_URL . 'build/' . $css,
                [],
                null
            );
        }
    }
}

add_action('wp_enqueue_scripts', 'bomsistema_catalogo_enqueue_assets');

// Carrega nosso React como módulo JavaScript.
add_filter('script_loader_tag', function ($tag, $handle, $src) {

    if ($handle === 'bomsistema-react') {
        return '<script type="module" src="' . esc_url($src) . '"></script>';
    }

    return $tag;

}, 10, 3);
