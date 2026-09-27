/**
 * Canonical Node and Port Schema Types
 * Generated/Aligned from contracts/lemmo/v1/node.proto
 * DO NOT EDIT MANUALLY — Subject to buf generate
 */

export enum PortType {
  PORT_TYPE_UNSPECIFIED = 'PORT_TYPE_UNSPECIFIED',
  PORT_TYPE_IMAGE = 'PORT_TYPE_IMAGE',
  PORT_TYPE_VIDEO = 'PORT_TYPE_VIDEO',
  PORT_TYPE_AUDIO = 'PORT_TYPE_AUDIO',
  PORT_TYPE_TEXT = 'PORT_TYPE_TEXT',
  PORT_TYPE_NUMBER = 'PORT_TYPE_NUMBER',
  PORT_TYPE_BOOLEAN = 'PORT_TYPE_BOOLEAN',
}

export interface NodeSocket {
  id: string;
  label: string;
  labelFa?: string;
  type: PortType | string;
  required?: boolean;
  description?: string;
}

export enum NodeCategory {
  NODE_CATEGORY_UNSPECIFIED = 'NODE_CATEGORY_UNSPECIFIED',
  NODE_CATEGORY_GENERATION = 'NODE_CATEGORY_GENERATION',
  NODE_CATEGORY_TRANSFORMATION = 'NODE_CATEGORY_TRANSFORMATION',
  NODE_CATEGORY_INPUT = 'NODE_CATEGORY_INPUT',
  NODE_CATEGORY_OUTPUT = 'NODE_CATEGORY_OUTPUT',
  NODE_CATEGORY_UTILITY = 'NODE_CATEGORY_UTILITY',
}

export interface CanvasNodeContract {
  id: string;
  toolId: string;
  type: string;
  label: string;
  labelFa: string;
  category: NodeCategory | string;
  inputs: NodeSocket[];
  outputs: NodeSocket[];
  estimatedTokenCost: number;
  metadata?: Record<string, string>;
}
