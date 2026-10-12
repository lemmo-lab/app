import { describe, it, expect } from 'vitest';
import { formatAgentErrorMessage } from '../utils/errorMapping';

describe('formatAgentErrorMessage', () => {
  it('maps WALLET_NOT_FOUND to friendly message in Persian and English', () => {
    const rawError = 'tools execution failed: rpc error: code = Internal desc = execution failed: quota reservation failed: rpc error: code = NotFound desc = WALLET_NOT_FOUND';
    
    const faMsg = formatAgentErrorMessage(rawError, 'fa');
    expect(faMsg).toBe('کیف‌پول این فضای کاری یافت نشد. لطفاً وضعیت اشتراک و فضای کاری خود را بررسی کنید.');

    const enMsg = formatAgentErrorMessage(rawError, 'en');
    expect(enMsg).toBe('Workspace wallet not found. Please check your workspace and subscription status.');
  });

  it('maps INSUFFICIENT_CREDITS to friendly message in Persian and English', () => {
    const rawError = 'quota reservation failed: rpc error: code = FailedPrecondition desc = INSUFFICIENT_CREDITS';

    const faMsg = formatAgentErrorMessage(rawError, 'fa');
    expect(faMsg).toBe('اعتبار حساب شما برای این عملیات کافی نیست.');

    const enMsg = formatAgentErrorMessage(rawError, 'en');
    expect(enMsg).toBe('Insufficient credits for this operation.');
  });

  it('handles empty or undefined error with default fallback', () => {
    expect(formatAgentErrorMessage(undefined, 'fa')).toBe('خطا در فرآیند تولید رخ داد.');
    expect(formatAgentErrorMessage('', 'en')).toBe('Generation failed');
  });

  it('returns raw error for other generic error strings', () => {
    const raw = 'Custom backend error occurred';
    expect(formatAgentErrorMessage(raw, 'en')).toBe(raw);
  });
});
