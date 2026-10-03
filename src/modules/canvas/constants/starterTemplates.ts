import { CanvasStarterTemplate } from '../types';

/**
 * Curated Starter Templates for Onboarding
 * Recommended to new users to get familiar with canvas workflows without starting from scratch.
 * All image assets use remote Unsplash URLs (Zero-Mock client architecture).
 */
export const CANVAS_STARTER_TEMPLATES: CanvasStarterTemplate[] = [
  {
    id: 'starter-01',
    title: 'Text-to-Image with 4K Upscale',
    titleFa: 'تولید تصویر با آپ‌اسکیل ۴K',
    description: 'Learn node connections: prompt text node into Flux generator, then to neural upscaler.',
    descriptionFa: 'آشنایی با اتصال نودها: اتصال پرامپت متنی به ژنراتور تصویر و سپس نود افزایش وضوح ۴K.',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    tag: 'Beginner',
    tagFa: 'مبتدی / پایه',
  },
  {
    id: 'starter-02',
    title: 'Subject Cutout & Ambient Relighting',
    titleFa: 'جداسازی سوژه و بازآفرینی نور',
    description: 'Combine background removal with depth maps and auto-relighting for commercial composites.',
    descriptionFa: 'حذف خودکار پس‌زمینه و ترکیب هوشمند نور محیطی برای تولید خروجی‌های تبلیغاتی یکپارچه.',
    thumbnail: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    tag: 'Composite',
    tagFa: 'ترکیب لایه‌ها',
  },
  {
    id: 'starter-03',
    title: 'Character Turnaround & Pose Sheet',
    titleFa: 'طراحی زاویه‌های شخصیت و ژست‌ها',
    description: 'Keep face and wardrobe consistent across multiple poses, angles, and facial expressions.',
    descriptionFa: 'حفظ استمرار چهره و استایل لباس کاراکتر در زوایای مختلف و ژست‌های حرکتی متوالی.',
    thumbnail: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
    tag: 'Character',
    tagFa: 'طراحی کاراکتر',
  },
  {
    id: 'starter-04',
    title: 'Neural Line Art to Vector SVG',
    titleFa: 'تبدیل طرح خطی به وکتور SVG',
    description: 'Convert raster drawings and sketches into layered, clean vector paths.',
    descriptionFa: 'تبدیل اسکچ‌ها و نقاشی‌های خطی به مسیرهای برداری و لایه‌بندی‌شده وکتور SVG.',
    thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    tag: 'Vector',
    tagFa: 'وکتور و SVG',
  },
];
