/**
 * Mock Data — Base seed data for the mock SDK adapter.
 *
 * In M4 this file will be split into mock-tools.ts, mock-jobs.ts, mock-user.ts
 * and a full Job Simulator with timers will be implemented.
 * For M1, only minimal stubs are required.
 */

import type {
  Asset,
  BannerSlide,
  BillingInfo,
  FeedItem,
  Job,
  Message,
  QuickTool,
  Thread,
  ToolManifest,
  UserProfile,
} from '../types';

// ================================================================== //
// USER                                                                //
// ================================================================== //

export const MOCK_USER: UserProfile = {
  id: 'mock-user-001',
  name: 'Lemmo Demo User',
  email: 'demo@lemmo.ai',
  avatarUrl: undefined,
};

export const MOCK_BILLING: BillingInfo = {
  tokenBalance: 10_000,
  plan: 'pro',
  nextBillingDate: '2026-10-16',
};

// ================================================================== //
// TOOLS — 4 test manifests (TODO M4: full implementation)            //
// ================================================================== //

export const MOCK_TOOLS: ToolManifest[] = [
  {
    id: 'flux-dev',
    name: 'Flux Dev',
    nameFa: 'فلوکس — تولید تصویر',
    description: 'Generate high-quality images from text prompts using the Flux model',
    descriptionFa: 'تولید تصویر با کیفیت بالا از متن با مدل Flux',
    category: 'image-generation',
    outputType: 'image',
    estimatedTokenCost: 10,
    inputFields: [
      {
        id: 'prompt',
        type: 'textarea',
        label: 'Prompt',
        labelFa: 'توضیح تصویر',
        placeholder: 'Describe the image you want to generate...',
        placeholderFa: 'تصویری که می‌خواهید بسازید را توضیح دهید...',
        required: true,
      },
      {
        id: 'steps',
        type: 'slider',
        label: 'Steps',
        labelFa: 'تعداد مراحل',
        min: 10,
        max: 50,
        step: 1,
        defaultValue: 28,
      },
      {
        id: 'aspect_ratio',
        type: 'select',
        label: 'Aspect Ratio',
        labelFa: 'نسبت ابعاد',
        defaultValue: '1:1',
        options: [
          { label: '1:1 (Square)', value: '1:1' },
          { label: '16:9 (Landscape)', value: '16:9' },
          { label: '9:16 (Portrait)', value: '9:16' },
          { label: '4:3', value: '4:3' },
          { label: '3:2', value: '3:2' },
        ],
      },
    ],
  },
  {
    id: 'remove-background',
    name: 'Remove Background',
    nameFa: 'حذف پس‌زمینه',
    description: 'Remove the background from any image with a single click',
    descriptionFa: 'حذف پس‌زمینه تصویر با یک کلیک',
    category: 'image-editing',
    outputType: 'image',
    estimatedTokenCost: 5,
    inputFields: [
      {
        id: 'image',
        type: 'image-upload',
        label: 'Input Image',
        labelFa: 'تصویر ورودی',
        required: true,
      },
    ],
  },
  {
    id: 'upscale-ultra',
    name: 'Upscale Ultra',
    nameFa: 'افزایش رزولوشن',
    description: 'Upscale your images up to 4x with AI super-resolution',
    descriptionFa: 'افزایش رزولوشن تصویر تا ۴ برابر با هوش مصنوعی',
    category: 'image-editing',
    outputType: 'image',
    estimatedTokenCost: 8,
    inputFields: [
      {
        id: 'image',
        type: 'image-upload',
        label: 'Input Image',
        labelFa: 'تصویر ورودی',
        required: true,
      },
      {
        id: 'scale',
        type: 'select',
        label: 'Scale Factor',
        labelFa: 'ضریب بزرگ‌نمایی',
        defaultValue: '2',
        options: [
          { label: '2x', value: '2' },
          { label: '4x', value: '4' },
        ],
      },
    ],
  },
  {
    id: 'face-swap',
    name: 'Face Swap',
    nameFa: 'تعویض چهره',
    description: 'Swap faces between two images with natural blending',
    descriptionFa: 'تعویض چهره بین دو تصویر با ترکیب طبیعی',
    category: 'image-editing',
    outputType: 'image',
    estimatedTokenCost: 15,
    inputFields: [
      {
        id: 'target_image',
        type: 'image-upload',
        label: 'Target Image',
        labelFa: 'تصویر هدف',
        required: true,
      },
      {
        id: 'source_image',
        type: 'image-upload',
        label: 'Source Face Image',
        labelFa: 'تصویر منبع (چهره)',
        required: true,
      },
    ],
  },
];

// ================================================================== //
// ASSETS                                                              //
// ================================================================== //

export const MOCK_ASSETS: Asset[] = [];

// ================================================================== //
// JOBS                                                                //
// ================================================================== //

export const MOCK_JOBS: Map<string, Job> = new Map();

// ================================================================== //
// THREADS                                                             //
// ================================================================== //

export const MOCK_THREADS: Thread[] = [
  {
    id: 'thread-001',
    title: 'Demo Thread',
    messages: [] as Message[],
    createdAt: Date.now() - 3600_000,
    updatedAt: Date.now(),
  },
];

// ================================================================== //
// FEED                                                                //
// ================================================================== //

export const MOCK_FEATURED_SLIDES: BannerSlide[] = [
  {
    id: 'slide-1',
    title: 'Solari Metropolis: Biophilic Hyper-Structure',
    titleFa: 'کلان‌شهر سولاری: هایپراستراکچر بایوفیلیک',
    prompt: 'Futuristic solarpunk city with towering mushroom-shaped biophilic structures',
    promptFa: 'شهر آینده‌نگرانه سولارپانک با سازه‌های قارچی‌شکل عظیم',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
    author: 'Elena Rostova',
    model: 'Flux Dev',
    aspectRatio: '16:9',
    remixCount: 1420,
    likes: 3890,
  },
];

export const MOCK_QUICK_TOOLS: QuickTool[] = [
  {
    id: 'tool-bg-remove',
    name: 'Remove Background',
    nameFa: 'حذف پس‌زمینه',
    category: 'image-editing',
    categoryFa: 'ویرایش تصویر',
    description: 'Instantly isolate subject with one click',
    descriptionFa: 'جداسازی فوری سوژه با یک کلیک',
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=400&q=80',
    href: '/app/tools?tool=remove-background',
    badge: 'Free',
  },
  {
    id: 'tool-flux',
    name: 'Flux Image Generation',
    nameFa: 'تولید تصویر فلوکس',
    category: 'image-generation',
    categoryFa: 'تولید تصویر',
    description: 'High quality text to image rendering',
    descriptionFa: 'تولید تصویر با کیفیت بالا از متن',
    image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=400&q=80',
    href: '/app/tools?tool=flux-dev',
    badge: 'Popular',
  },
];

export const MOCK_FEED_ITEMS: FeedItem[] = [
  {
    id: 'feed-1',
    title: 'Neon Solarpunk Metropolis',
    titleFa: 'کلان‌شهر نئونی سولارپانک',
    prompt: 'Futuristic solarpunk city with towering biophilic mushroom architecture',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    author: 'Elena Rostova',
    authorHandle: 'elena_r',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    category: 'photoreal',
    aspectRatio: '16:9',
    width: 1920,
    height: 1080,
    likes: 3890,
    views: 14200,
    model: 'Flux Dev',
    createdAt: '2026-10-01T12:00:00Z',
  },
  {
    id: 'feed-2',
    title: 'Titan Wreckage in Emerald Fog',
    titleFa: 'لاشه تایتان در مه زمردین',
    prompt: 'Massive orbital spacecraft wreckage engulfed by dense emerald vegetation',
    image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    author: 'Kaelen Vance',
    authorHandle: 'kaelen_v',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    category: 'concept',
    aspectRatio: '16:9',
    width: 1920,
    height: 1080,
    likes: 2450,
    views: 8900,
    model: 'Lemmo CyberSynth 2.0',
    createdAt: '2026-10-01T14:30:00Z',
  },
  {
    id: 'feed-3',
    title: 'Ethereal Silk Butterfly Maiden',
    titleFa: 'بانوی پروانه‌ای حریرگون',
    prompt: 'Anime style portrait with translucent moth wings and delicate lighting',
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
    author: 'Aria Tanaka',
    authorHandle: 'aria_t',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    category: 'stylized',
    aspectRatio: '9:16',
    width: 1080,
    height: 1920,
    likes: 4120,
    views: 18900,
    model: 'Flux Dev',
    createdAt: '2026-10-02T09:15:00Z',
  },
  {
    id: 'feed-4',
    title: 'Parametric Pavilion of Light',
    titleFa: 'پاویون پارامتریک نور',
    prompt: 'Ultra modern architectural pavilion with fluid concrete arches and warm dusk lighting',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    author: 'Marcus Stone',
    authorHandle: 'marcus_arch',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
    category: 'architecture',
    aspectRatio: '3:4',
    width: 1200,
    height: 1600,
    likes: 1980,
    views: 7400,
    model: 'Flux Dev',
    createdAt: '2026-10-02T16:45:00Z',
  },
];

