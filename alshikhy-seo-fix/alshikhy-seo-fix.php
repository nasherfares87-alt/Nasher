<?php
/**
 * Plugin Name: Alshikhy SEO Fix
 * Description: إصلاحات فهرسة جوجل: توحيد النطاق، إعادة توجيه المرفقات، noindex للوسوم، منع معاملات ?v= من التكرار، إضافة خريطة الموقع إلى robots.txt (متوافق مع Yoast)
 * Version: 1.1
 */

if (!defined('ABSPATH')) exit;

// 1) توحيد النطاق: تحويل www إلى non-www بـ 301
add_action('template_redirect', function () {
    $host = strtolower($_SERVER['HTTP_HOST'] ?? '');
    if ($host === 'www.alshikhy.com' && !is_admin()) {
        wp_redirect('https://alshikhy.com' . $_SERVER['REQUEST_URI'], 301);
        exit;
    }
});

// 2) إعادة توجيه صفحات المرفقات إلى المقال الأص
add_action('template_redirect', function () {
    if (is_attachment()) {
        $parent = get_post(get_post()->post_parent);
        $target = $parent ? get_permalink($parent->ID) : home_url('/');
        wp_redirect($target, 301);
        exit;
    }
});

// 3) noindex لصفحات الوسوم والأرشيفات الرقيقة
add_filter('wpseo_robots', function ($robots) {
    if (is_tag() || is_date() || is_search()) {
        return 'noindex, follow';
    }
    return $robots;
});

// 4) تنظيف معاملات ?v= من روابط المرفقات
add_filter('wp_get_attachment_url', function ($url) {
    return strtok($url, '?');
});

// 5) إزالة صفحة المرفقات من خرائط Yoast نهائياً
add_filter('wpseo_sitemap_exclude_post_type', function ($exclude, $post_type) {
    if ($post_type === 'attachment') {
        return true;
    }
    return $exclude;
}, 10, 2);

// 6) إضافة خريطة الموقع إلى robots.txt — عبر فلتر Yoast أولاً ثم الفلتر القياسي
if (defined('WPSEO_VERSION')) {
    add_filter('wpseo_robots_txt', function ($output) {
        if (strpos($output, 'Sitemap:') === false) {
            $output .= "Sitemap: https://alshikhy.com/sitemap.xml\r\n";
        }
        return $output;
    });
} else {
    add_filter('robots_txt', function ($output) {
        if (strpos($output, 'Sitemap:') === false) {
            $output .= "Sitemap: https://alshikhy.com/sitemap.xml\r\n";
        }
        return $output;
    });
}
