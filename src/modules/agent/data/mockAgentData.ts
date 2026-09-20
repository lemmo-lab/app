import {
  AgentModel,
  AgentStylePreset,
  AgentConversation,
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
    coverImage: '/images/feed/a-young-woman-stands-in-a-sunlit-retro-interior-holding-a.webp',
    promptSuggestionEn: '35mm portrait in a sunlit retro studio, warm Kodachrome tones, shallow depth of field, 8k mastery',
    promptSuggestionFa: 'پرتره نگاتیو ۳۵ میلی‌متری در استودیوی آفتاب‌گیر رترو، رنگ‌های گرم کداکروم و عمق میدان سینمایی',
    aspectRatio: '3:4',
    tiltAngle: -13.5,
  },
  {
    id: 'style-cyberpunk',
    titleEn: 'Cyberpunk Neon',
    titleFa: 'سایبرپانک نئونی',
    categoryEn: 'Sci-Fi Art',
    categoryFa: 'هنر آینده‌نگر',
    coverImage: '/images/feed/an-anime-style-girl-with-translucent-moth-wings-and-fluffy.webp',
    promptSuggestionEn: 'Futuristic anime character with iridescent glowing wings, rainy neo-tokyo backdrop, volumetric lighting',
    promptSuggestionFa: 'کاراکتر انیمه‌ای آینده‌نگرانه با بال‌های درخشان شفاف، پس‌زمینه بارانی نئو توکیو و نورپردازی حجمی',
    aspectRatio: '1:1',
    tiltAngle: -2.1,
  },
  {
    id: 'style-cinematic',
    titleEn: 'Cinematic Scale',
    titleFa: 'مقیاس سینمایی',
    categoryEn: 'Architecture',
    categoryFa: 'معماری و لندسکیپ',
    coverImage: '/images/feed/complex-multi-level-urban-highway-interchange-captured-using.webp',
    promptSuggestionEn: 'Epic multi-level metropolitan interchange at twilight, neon light trails, anamorphic cinema lens 2.39:1',
    promptSuggestionFa: 'تقاطع چندطبقه کلان‌شهر در گرگ و میش، خطوط نوری پرسرعت، لنز آنامورفیک سینمایی و زاویه واید',
    aspectRatio: '16:9',
    tiltAngle: 2.5,
  },
  {
    id: 'style-concept',
    titleEn: 'Dreamscape 3D',
    titleFa: 'مفهومی سه‌بعدی',
    categoryEn: 'Concept Art',
    categoryFa: 'کانسپت آرت',
    coverImage: '/images/feed/futuristic-solarpunk-city-towering-mushroom-shaped.webp',
    promptSuggestionEn: 'Avant-garde surrealist sculpture with marble texture, organic lighting, museum exhibition aesthetic',
    promptSuggestionFa: 'مجسمه سورئال آوانگارد با بافت مرمر سفید، نورپردازی طبیعی مینیمال و حس گالری مدرن',
    aspectRatio: '3:4',
    tiltAngle: 9.8,
  },
];

export const DEFAULT_REFERENCES: AgentReferenceItem[] = [
  {
    id: 'ref-1',
    url: '/images/feed/a-young-woman-stands-in-a-sunlit-retro-interior-holding-a.webp',
    name: 'lighting-ref.webp',
  },
  {
    id: 'ref-2',
    url: '/images/feed/an-anime-style-girl-with-translucent-moth-wings-and-fluffy.webp',
    name: 'palette-ref.webp',
  },
];

export const MOCK_CONVERSATIONS: Record<string, AgentConversation> = {
  'chat-01': {
    id: 'chat-01',
    title: 'Neon Tokyo & Studio Portrait',
    updatedAt: 'Just now',
    messages: [
      {
        id: 'msg-1',
        sender: 'user',
        timestamp: '14:23',
        prompt:
          'Create a cinematic editorial portrait of an elegant futuristic model in a sunlit retro space. Natural sunlight shafts, delicate grain, high fashion studio aesthetic.',
        references: [
          {
            id: 'ref-1',
            url: '/images/feed/a-young-woman-stands-in-a-sunlit-retro-interior-holding-a.webp',
            name: 'lighting-ref.webp',
          },
        ],
      },
      {
        id: 'msg-2',
        sender: 'assistant',
        timestamp: '14:24',
        resultMediaUrl:
          '/images/feed/a-young-woman-stands-in-a-sunlit-retro-interior-holding-a.webp',
        contentType: 'image',
        aspectRatio: '3:4',
        modelUsed: 'FLUX.1 [dev]',
        seed: 849204812,
        generationDurationSec: 3.4,
        creditsUsed: 5,
        isFavorite: false,
      },
    ],
  },
};
