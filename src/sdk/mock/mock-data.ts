/**
 * Mock Data — Base seed data for the mock SDK adapter.
 *
 * In M4 this file will be split into mock-tools.ts, mock-jobs.ts, mock-user.ts
 * and a full Job Simulator with timers will be implemented.
 * For M1, only minimal stubs are required.
 */

import type {
  Asset,
  BillingInfo,
  Job,
  Message,
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
