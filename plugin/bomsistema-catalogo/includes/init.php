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

    if (!isset($manifest['index.html'])) {
        return;
    }

    $entry = $manifest['index.html'];

    wp_enqueue_script(
        'bomsistema-react',
        BOMSISTEMA_CATALOGO_URL . 'build/' . $entry['file'],
        [],
        null,
        true
    );
}

add_action('wp_enqueue_scripts', 'bomsistema_catalogo_enqueue_assets');