/**
 * Canonical Platform Error Catalog
 * Generated/Aligned from contracts/platform/errors.proto
 * DO NOT EDIT MANUALLY — Subject to buf generate
 */

export enum ErrorReason {
  ERROR_REASON_UNSPECIFIED = 'ERROR_REASON_UNSPECIFIED',
  
  // Platform & Workspace Errors
  WORKSPACE_QUOTA_EXCEEDED = 'WORKSPACE_QUOTA_EXCEEDED',
  WORKSPACE_NOT_FOUND = 'WORKSPACE_NOT_FOUND',
  WORKSPACE_ACCESS_DENIED = 'WORKSPACE_ACCESS_DENIED',
  
  // Authentication & Authorization Errors
  UNAUTHENTICATED = 'UNAUTHENTICATED',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  
  // Validation & Input Errors
  INVALID_ARGUMENT = 'INVALID_ARGUMENT',
  INVALID_EMAIL_FORMAT = 'INVALID_EMAIL_FORMAT',
  BAD_REQUEST = 'BAD_REQUEST',
  
  // Project & Domain Errors
  PROJECT_NOT_FOUND = 'PROJECT_NOT_FOUND',
  NODE_NOT_FOUND = 'NODE_NOT_FOUND',
  CONFLICT = 'CONFLICT',
  NOT_FOUND = 'NOT_FOUND',
  
  // Workflow & Job Execution Errors
  WORKFLOW_EXECUTION_FAILED = 'WORKFLOW_EXECUTION_FAILED',
  JOB_FAILED = 'JOB_FAILED',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
}

export interface GoogleRpcErrorInfo {
  reason: ErrorReason | string;
  domain: string;
  metadata?: Record<string, string>;
}

export interface GoogleRpcStatus {
  code: number;
  message: string;
  details?: Array<{
    '@type': string;
    reason?: string;
    domain?: string;
    metadata?: Record<string, string>;
    field_violations?: Array<{ field: string; description: string }>;
    [key: string]: unknown;
  }>;
}

export interface PlatformErrorEnvelope {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  reason?: string;
  error?: string;
  instance?: string;
  invalid_params?: Array<{ name: string; reason: string; message?: string }>;
  [key: string]: unknown;
}

export class PlatformApiError extends Error {
  public readonly status: number;
  public readonly reason?: string;
  public readonly envelope: PlatformErrorEnvelope;

  constructor(status: number, envelope: PlatformErrorEnvelope) {
    super(envelope.detail || envelope.error || envelope.title || `Request failed with status ${status}`);
    this.name = 'PlatformApiError';
    this.status = status;
    this.reason = envelope.reason;
    this.envelope = envelope;
  }
}

/**
 * Extracts canonical ErrorReason from a google.rpc.Status or RFC 7807 response payload.
 */
export function extractErrorReason(status: GoogleRpcStatus | PlatformErrorEnvelope): ErrorReason | string | null {
  if ('details' in status && Array.isArray(status.details)) {
    const errorInfo = status.details.find(
      (d) => d['@type'] === 'type.googleapis.com/google.rpc.ErrorInfo'
    );
    return (errorInfo?.reason as ErrorReason) || null;
  }
  if ('reason' in status && status.reason) {
    return status.reason;
  }
  return null;
}

