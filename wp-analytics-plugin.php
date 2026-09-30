<?php
/**
 * Plugin Name: ALTR Analytics
 * Description: Lightweight analytics collector for the ALTR Next.js frontend. Stores events in a dedicated MySQL table and exposes a REST API consumed by the frontend dashboard.
 * Version: 1.0.0
 */

if (!defined('ABSPATH')) exit;

// ── Table name ───────────────────────────────────────────────────────────────
function altr_analytics_table(): string {
    global $wpdb;
    return $wpdb->prefix . 'altr_analytics';
}

// ── Activation: create table ─────────────────────────────────────────────────
register_activation_hook(__FILE__, 'altr_analytics_activate');
function altr_analytics_activate(): void {
    global $wpdb;
    $table = altr_analytics_table();
    $charset_collate = $wpdb->get_charset_collate();
    $sql = "CREATE TABLE IF NOT EXISTS {$table} (
        id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        event_type      VARCHAR(50)  NOT NULL,
        session_id      VARCHAR(100) NOT NULL DEFAULT '',
        page_path       VARCHAR(500) NOT NULL DEFAULT '/',
        page_title      VARCHAR(300) DEFAULT NULL,
        referrer        VARCHAR(500) DEFAULT NULL,
        referrer_domain VARCHAR(200) DEFAULT NULL,
        utm_source      VARCHAR(100) DEFAULT NULL,
        utm_medium      VARCHAR(100) DEFAULT NULL,
        utm_campaign    VARCHAR(200) DEFAULT NULL,
        utm_content     VARCHAR(200) DEFAULT NULL,
        utm_term        VARCHAR(200) DEFAULT NULL,
        traffic_source  VARCHAR(50)  DEFAULT NULL,
        device_type     VARCHAR(20)  DEFAULT NULL,
        os              VARCHAR(50)  DEFAULT NULL,
        browser         VARCHAR(50)  DEFAULT NULL,
        screen_width    SMALLINT UNSIGNED DEFAULT NULL,
        is_new_session  TINYINT(1)   NOT NULL DEFAULT 0,
        element_tag     VARCHAR(20)  DEFAULT NULL,
        element_text    VARCHAR(120) DEFAULT NULL,
        element_href    VARCHAR(500) DEFAULT NULL,
        order_id        VARCHAR(100) DEFAULT NULL,
        order_value     DECIMAL(10,2) DEFAULT NULL,
        order_currency  VARCHAR(3)   DEFAULT NULL,
        created_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        KEY idx_created_at     (created_at),
        KEY idx_event_type     (event_type),
        KEY idx_session_id     (session_id),
        KEY idx_page_path      (page_path(100)),
        KEY idx_traffic_source (traffic_source)
    ) {$charset_collate};";
    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    dbDelta($sql);
}

// ── Auth helper ───────────────────────────────────────────────────────────────
function altr_analytics_check_auth(WP_REST_Request $request): bool {
    $secret = defined('ALTR_ANALYTICS_SECRET') ? ALTR_ANALYTICS_SECRET : '';
    if (!$secret) return true; // no secret configured = open (dev)
    return $request->get_header('X-Analytics-Key') === $secret;
}

// ── REST routes ───────────────────────────────────────────────────────────────
add_action('rest_api_init', function (): void {
    // Ingest
    register_rest_route('altr/v1', '/analytics', [
        'methods'             => 'POST',
        'callback'            => 'altr_analytics_collect',
        'permission_callback' => 'altr_analytics_check_auth',
    ]);
    // Query
    register_rest_route('altr/v1', '/analytics', [
        'methods'             => 'GET',
        'callback'            => 'altr_analytics_query',
        'permission_callback' => 'altr_analytics_check_auth',
    ]);
});

// ── Ingest ────────────────────────────────────────────────────────────────────
function altr_analytics_collect(WP_REST_Request $request): WP_REST_Response {
    global $wpdb;
    $b = $request->get_json_params();
    if (empty($b) || empty($b['event_type'])) {
        return new WP_REST_Response(['ok' => false], 400);
    }

    $allowed = ['pageview', 'click', 'purchase'];
    if (!in_array($b['event_type'], $allowed, true)) {
        return new WP_REST_Response(['ok' => false], 400);
    }

    $s = function($v, $max = 200) { return $v ? substr((string)$v, 0, $max) : null; };

    $wpdb->insert(altr_analytics_table(), [
        'event_type'      => $s($b['event_type'], 50),
        'session_id'      => $s($b['session_id'], 100) ?? '',
        'page_path'       => $s($b['page_path'], 500) ?? '/',
        'page_title'      => $s($b['page_title'], 300),
        'referrer'        => $s($b['referrer'], 500),
        'referrer_domain' => $s($b['referrer_domain'], 200),
        'utm_source'      => $s($b['utm_source'], 100),
        'utm_medium'      => $s($b['utm_medium'], 100),
        'utm_campaign'    => $s($b['utm_campaign'], 200),
        'utm_content'     => $s($b['utm_content'], 200),
        'utm_term'        => $s($b['utm_term'], 200),
        'traffic_source'  => $s($b['traffic_source'], 50),
        'device_type'     => $s($b['device_type'], 20),
        'os'              => $s($b['os'], 50),
        'browser'         => $s($b['browser'], 50),
        'screen_width'    => isset($b['screen_width']) ? (int)$b['screen_width'] : null,
        'is_new_session'  => !empty($b['is_new_session']) ? 1 : 0,
        'element_tag'     => $s($b['element_tag'], 20),
        'element_text'    => $s($b['element_text'], 120),
        'element_href'    => $s($b['element_href'], 500),
        'order_id'        => $s($b['order_id'], 100),
        'order_value'     => isset($b['order_value']) ? round((float)$b['order_value'], 2) : null,
        'order_currency'  => $s($b['order_currency'], 3),
    ]);

    return new WP_REST_Response(['ok' => true], 200);
}

// ── Query (returns raw rows; Next.js aggregates) ──────────────────────────────
function altr_analytics_query(WP_REST_Request $request): WP_REST_Response {
    global $wpdb;
    $table = altr_analytics_table();

    $from = sanitize_text_field($request->get_param('from') ?? '');
    $to   = sanitize_text_field($request->get_param('to')   ?? '');

    if (!$from || !$to) {
        return new WP_REST_Response([], 200);
    }

    $rows = $wpdb->get_results(
        $wpdb->prepare(
            "SELECT * FROM {$table} WHERE created_at >= %s AND created_at <= %s ORDER BY created_at DESC LIMIT 50000",
            $from,
            $to
        ),
        ARRAY_A
    );

    // Cast numeric fields so JSON types match what Next.js expects
    foreach ($rows as &$row) {
        $row['id']           = (int)$row['id'];
        $row['screen_width'] = $row['screen_width'] !== null ? (int)$row['screen_width'] : null;
        $row['is_new_session'] = (bool)(int)$row['is_new_session'];
        $row['order_value']  = $row['order_value'] !== null ? (float)$row['order_value'] : null;
    }
    unset($row);

    return new WP_REST_Response($rows, 200);
}
