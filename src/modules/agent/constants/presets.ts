import {
  AgentModel,
  AgentStylePreset,
  AgentReferenceItem,
} from '../types';

export const AGENT_MODELS: AgentModel[] = [
  {
    id: 'flux-1-dev',
    name: 'FLUX.1 [dev]',
    provider: 'Black Forest Labs',
    badge: 'Flagship',
    isDefault: true,
  },
  {
    id: 'lemmo-realism-v2',
    name: 'Lemmo Realism v2',
    provider: 'Lemmo Studio Engine',
    badge: 'Pro',
  },
  {
    id: 'sdxl-turbo',
    name: 'SDXL Turbo Lightning',
    provider: 'Stability AI',
    badge: 'Fast',
  },
  {
    id: 'midjourney-v6',
    name: 'Midjourney v6.1 Refined',
    provider: 'Midjourney Proxy',
    badge: 'Artistic',
  },
];

export const AGENT_STYLE_PRESETS: AgentStylePreset[] = [
  {
    id: 'style-photoreal',
    titleEn: 'Photoreal Analog',
    titleFa: 'آنالوگ واقع‌گرایانه',
    categoryEn: 'Photography',
    categoryFa: 'عکاسی حرفه‌ای',
    coverImage:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    promptSuggestionEn:
      '35mm portrait in a sunlit retro studio, warm Kodachrome tones, shallow depth of field, 8k mastery',
    promptSuggestionFa:
      'پرتره نگاتیو ۳۵ میلی‌متری در استودیوی آفتاب‌گیر رترو، رنگ‌های گرم کداکروم و عمق میدان سینمایی',
    aspectRatio: '3:4',
    tiltAngle: -13.5,
  },
  {
    id: 'style-cyberpunk',
    titleEn: 'Cyberpunk Neon',
    titleFa: 'سایبرپانک نئونی',
    categoryEn: 'Sci-Fi Art',
    categoryFa: 'هنر آینده‌نگر',
    coverImage:
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
    promptSuggestionEn:
      'Futuristic anime character with iridescent glowing wings, rainy neo-tokyo backdrop, volumetric lighting',
    promptSuggestionFa:
      'کاراکتر انیمه‌ای آینده‌نگرانه با بال‌های درخشان شفاف، پس‌زمینه بارانی نئو توکیو و نورپردازی حجمی',
    aspectRatio: '1:1',
    tiltAngle: -2.1,
  },
  {
    id: 'style-cinematic',
    titleEn: 'Cinematic Scale',
    titleFa: 'مقیاس سینمایی',
    categoryEn: 'Architecture',
    categoryFa: 'معماری و لندسکیپ',
    coverImage:
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    promptSuggestionEn:
      'Epic multi-level metropolitan interchange at twilight, neon light trails, anamorphic cinema lens 2.39:1',
    promptSuggestionFa:
      'تقاطع چندطبقه کلان‌شهر در گرگ و میش، خطوط نوری پرسرعت، لنز آنامورفیک سینمایی و زاویه واید',
    aspectRatio: '16:9',
    tiltAngle: 2.5,
  },
  {
    id: 'style-concept',
    titleEn: 'Dreamscape 3D',
    titleFa: 'مفهومی سه‌بعدی',
    categoryEn: 'Concept Art',
    categoryFa: 'کانسپت آرت',
    coverImage:
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    promptSuggestionEn:
      'Avant-garde surrealist sculpture with marble texture, organic lighting, museum exhibition aesthetic',
    promptSuggestionFa:
      'مجسمه سورئال آوانگارد با بافت مرمر سفید، نورپردازی طبیعی مینیمال و حس گالری مدرن',
    aspectRatio: '3:4',
    tiltAngle: 9.8,
  },
];

export const DEFAULT_REFERENCES: AgentReferenceItem[] = [
  {
    id: 'ref-1',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    name: 'lighting-ref.jpg',
  },
  {
    id: 'ref-2',
    url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
    name: 'palette-ref.jpg',
  },
];
