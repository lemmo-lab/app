/**
 * SDK Types — قراردادهای تایپ مشترک
 *
 * این اینترفیس‌ها قرارداد بین لایه UI و لایه داده را تعریف می‌کنند.
 * هیچ کدام از این تایپ‌ها نباید به پیاده‌سازی mock یا live وابسته باشند.
 */

// ================================================================== //
// JOB TYPES                                                           //
// ================================================================== //

export type JobStatus = 'pending' | 'processing' | 'done' | 'failed';

export interface Job {
  id: string;
  toolId: string;
  status: JobStatus;
  progress: number; // 0 تا 100
  createdAt: number; // timestamp
  completedAt?: number;
  resultAssetId?: string;
  errorCode?: string;
}

// ================================================================== //
// ASSET TYPES                                                         //
// ================================================================== //

export type AssetType = 'image' | 'video' | 'audio' | 'text';

export interface Asset {
  id: string;
  type: AssetType;
  url: string;
  thumbnailUrl?: string;
  name: string;
  createdAt: number;
  toolId?: string;
  jobId?: string;
  /** نسبت ابعاد مثل '16:9', '1:1' */
  aspectRatio?: string;
  width?: number;
  height?: number;
}

// ================================================================== //
// TOOL MANIFEST TYPES                                                 //
// ================================================================== //

export type FieldType =
  | 'text'
  | 'textarea'
  | 'image-upload'
  | 'slider'
  | 'select'
  | 'toggle';

export interface FieldOption {
  label: string;
  value: string;
}

export interface ToolField {
  id: string;
  type: FieldType;
  label: string;
  labelFa?: string;
  placeholder?: string;
  placeholderFa?: string;
  required?: boolean;
  /** برای slider */
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: string | number | boolean;
  /** برای select */
  options?: FieldOption[];
}

export type OutputType = 'image' | 'video' | 'text';

export interface ToolManifest {
  id: string;
  name: string;
  nameFa: string;
  description: string;
  descriptionFa: string;
  icon?: string;
  category: string;
  inputFields: ToolField[];
  outputType: OutputType;
  /** تعداد توکن مصرفی تقریبی */
  estimatedTokenCost: number;
}

// ================================================================== //
// CHAT TYPES                                                          //
// ================================================================== //

export type MessageRole = 'user' | 'assistant' | 'system';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: number;
  attachments?: Asset[];
  /** شغل مرتبط با این پیام */
  jobId?: string;
}

export interface Thread {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

// ================================================================== //
// USER / BILLING TYPES                                                //
// ================================================================== //

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface BillingInfo {
  tokenBalance: number;
  plan: 'free' | 'pro' | 'enterprise';
  nextBillingDate?: string;
}

// ================================================================== //
// SDK CLIENT INTERFACE — قرارداد مشترک                               //
// ================================================================== //

export interface SdkClient {
  tools: {
    list: () => Promise<ToolManifest[]>;
    execute: (toolId: string, inputs: Record<string, unknown>) => Promise<{ jobId: string }>;
  };
  jobs: {
    get: (jobId: string) => Promise<Job>;
    list: () => Promise<Job[]>;
  };
  chat: {
    sendMessage: (threadId: string | null, content: string) => Promise<Message>;
    getThreads: () => Promise<Thread[]>;
    getThread: (threadId: string) => Promise<Thread>;
  };
  assets: {
    list: () => Promise<Asset[]>;
    get: (assetId: string) => Promise<Asset>;
  };
  user: {
    getProfile: () => Promise<UserProfile>;
    getBillingInfo: () => Promise<BillingInfo>;
  };
}
