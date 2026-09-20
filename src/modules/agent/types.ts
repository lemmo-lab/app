export type AgentContentType = 'image' | 'video';

export type AgentAspectRatio = '1:1' | '16:9' | '9:16' | '4:3' | '3:4';

export interface AgentModel {
  id: string;
  name: string;
  provider: string;
  badge?: string;
  isDefault?: boolean;
}

export interface AgentStylePreset {
  id: string;
  titleEn: string;
  titleFa: string;
  categoryEn: string;
  categoryFa: string;
  coverImage: string;
  promptSuggestionEn: string;
  promptSuggestionFa: string;
  aspectRatio: AgentAspectRatio;
  tiltAngle: number;
}

export interface AgentReferenceItem {
  id: string;
  url: string;
  name?: string;
}

export interface AgentGenerationConfig {
  contentType: AgentContentType;
  aspectRatio: AgentAspectRatio;
  modelId: string;
  batchCount: 1 | 2 | 4;
}

export interface AgentChatMessageItem {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  // User prompt details
  prompt?: string;
  references?: AgentReferenceItem[];
  // Assistant response details
  resultMediaUrl?: string;
  contentType?: AgentContentType;
  aspectRatio?: AgentAspectRatio;
  modelUsed?: string;
  seed?: number;
  generationDurationSec?: number;
  creditsUsed?: number;
  isFavorite?: boolean;
}

export interface AgentConversation {
  id: string;
  title: string;
  messages: AgentChatMessageItem[];
  updatedAt: string;
}
