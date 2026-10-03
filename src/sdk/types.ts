/**
 * SDK Types — Shared type contracts for the data access layer.
 *
 * These interfaces define the contract between the UI layer and the data layer.
 * None of these types should depend on mock or live implementation details.
 */

// ================================================================== //
// JOB TYPES                                                           //
// ================================================================== //

export type JobStatus = 'pending' | 'processing' | 'done' | 'failed';

export interface Job {
  id: string;
  toolId: string;
  status: JobStatus;
  progress: number; // 0 to 100
  createdAt: number; // unix timestamp
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
  /** Aspect ratio string, e.g. '16:9', '1:1' */
  aspectRatio?: string;
  width?: number;
  height?: number;
  title?: string;
  titleFa?: string;
  prompt?: string;
  model?: string;
  dimensions?: string;
  fileSize?: string;
  isFavorite?: boolean;
  category?: string;
  categoryFa?: string;
  tags?: string[];
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
  /** For slider fields */
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: string | number | boolean;
  /** For select fields */
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
  /** Approximate token cost per execution */
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
  /** Associated job ID if this message triggered a tool execution */
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
// CONTEXT, WORKSPACE & PROJECT TYPES                                  //
// ================================================================== //

export interface UserContext {
  id: string;
  email: string;
  handle?: string;
  display_name?: string;
  avatar_url?: string;
  status?: string;
  preferences?: Record<string, unknown>;
}

export interface WorkspaceSummary {
  id: string;
  name: string;
  type: string; // PERSONAL, TEAM
  role: string; // OWNER, ADMIN, EDITOR, RUNNER, VIEWER
}

export interface EntitlementContext {
  tier: 'FREE' | 'PRO' | 'ENTERPRISE';
  wallet_balance: number;
  features: string[];
}

export interface OnboardingProgress {
  completed: boolean;
  steps: Record<string, boolean>;
  next_action: string;
}

export interface ContextResult {
  user: UserContext;
  active_workspace?: WorkspaceSummary | null;
  workspaces: WorkspaceSummary[];
  entitlements: EntitlementContext;
  onboarding: OnboardingProgress;
  session?: {
    expires_at?: number;
  };
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  version?: number;
  createdAt?: number;
  updatedAt?: number;
}

export interface Workspace {
  id: string;
  name: string;
  type: string;
  role?: string;
}

export interface JobEvent {
  type: string;
  jobId: string;
  status: string;
  progressPercent?: number;
  step?: number;
  results?: Record<string, unknown>;
  completedAt?: string;
  raw?: unknown;
}

// ================================================================== //
// FEED TYPES                                                          //
// ================================================================== //

export interface BannerSlide {
  id: string;
  title: string;
  titleFa: string;
  prompt: string;
  promptFa: string;
  image: string;
  author: string;
  model: string;
  aspectRatio: string;
  remixCount: number;
  likes: number;
}

export interface QuickTool {
  id: string;
  name: string;
  nameFa: string;
  category: string;
  categoryFa: string;
  description: string;
  descriptionFa: string;
  image: string;
  href: string;
  badge: string;
  isNew?: boolean;
}

export interface FeedItem {
  id: string;
  title: string;
  titleFa: string;
  prompt: string;
  image: string;
  author: string;
  authorHandle: string;
  avatar: string;
  category: string;
  aspectRatio: string;
  width: number;
  height: number;
  likes: number;
  views: number;
  model: string;
  createdAt: string;
}

export interface FeedResult {
  items: FeedItem[];
  featured?: BannerSlide[];
  quick_tools?: QuickTool[];
  next_cursor?: string;
  has_more?: boolean;
}

// ================================================================== //
// SDK CLIENT INTERFACE — shared contract                              //
// ================================================================== //

export interface SdkClient {
  context: {
    get: () => Promise<ContextResult>;
  };
  projects: {
    list: () => Promise<Project[]>;
    get: (id: string) => Promise<Project>;
    create: (input: { name: string; description?: string }) => Promise<Project>;
  };
  workspaces: {
    list: () => Promise<Workspace[]>;
    create: (input: { name: string; type?: string }) => Promise<Workspace>;
  };
  tools: {
    list: () => Promise<ToolManifest[]>;
    execute: (toolId: string, inputs: Record<string, unknown>) => Promise<{ jobId: string }>;
  };
  jobs: {
    get: (jobId: string) => Promise<Job>;
    list: () => Promise<Job[]>;
    subscribe: (jobId: string, onEvent: (event: JobEvent) => void) => () => void;
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
  feed: {
    list: (params?: { category?: string; limit?: number; cursor?: string }) => Promise<FeedResult>;
    get: (id: string) => Promise<FeedItem>;
  };
  user: {
    getProfile: () => Promise<UserProfile>;
    getBillingInfo: () => Promise<BillingInfo>;
  };
}
