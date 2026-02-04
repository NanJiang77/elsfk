/**
 * 设备检测工具
 */

/**
 * 检测是否为移动设备
 */
export function isMobile(): boolean {
  // 用户代理检测
  const userAgent = navigator.userAgent;

  // 移动设备关键词
  const mobileKeywords = [
    'Android',
    'iPhone',
    'iPad',
    'iPod',
    'BlackBerry',
    'Windows Phone',
    'webOS',
    'Mobile',
    'tablet',
  ];

  const hasMobileKeyword = mobileKeywords.some(keyword =>
    userAgent.includes(keyword)
  );

  // 屏幕宽度检测（小于768px认为是移动设备）
  const hasSmallScreen = window.innerWidth <= 768;

  // 触摸支持检测
  const hasTouchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  return hasMobileKeyword || (hasSmallScreen && hasTouchSupport);
}

/**
 * 检测是否为平板设备
 */
export function isTablet(): boolean {
  const userAgent = navigator.userAgent;
  const screenWidth = window.innerWidth;

  // iPad 检测
  const isiPad = userAgent.includes('iPad') ||
    (userAgent.includes('Mac') && navigator.maxTouchPoints > 0);

  // Android 平板
  const isAndroidTablet = userAgent.includes('Android') && !userAgent.includes('Mobile');

  // 屏幕宽度检测（768px - 1024px认为是平板）
  const isTabletScreen = screenWidth >= 768 && screenWidth <= 1024;

  return isiPad || isAndroidTablet || isTabletScreen;
}

/**
 * 检测是否为桌面设备
 */
export function isDesktop(): boolean {
  return !isMobile() && !isTablet();
}

/**
 * 获取设备类型
 */
export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export function getDeviceType(): DeviceType {
  if (isMobile()) return 'mobile';
  if (isTablet()) return 'tablet';
  return 'desktop';
}

/**
 * 监听窗口大小变化
 */
export function onResize(callback: () => void): () => void {
  window.addEventListener('resize', callback);
  return () => window.removeEventListener('resize', callback);
}
