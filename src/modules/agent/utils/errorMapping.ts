/**
 * AIP-193 Agent & Financial Error Mapping Helper
 *
 * Maps backend AIP-193 error reasons (e.g. WALLET_NOT_FOUND, INSUFFICIENT_CREDITS)
 * to user-friendly bilingual messages.
 */

export function formatAgentErrorMessage(rawError?: string | null, locale = 'en'): string {
  if (!rawError || typeof rawError !== 'string') {
    return locale === 'fa' ? 'خطا در فرآیند تولید رخ داد.' : 'Generation failed';
  }

  const isFa = locale === 'fa';

  if (rawError.includes('WALLET_NOT_FOUND')) {
    return isFa
      ? 'کیف‌پول این فضای کاری یافت نشد. لطفاً وضعیت اشتراک و فضای کاری خود را بررسی کنید.'
      : 'Workspace wallet not found. Please check your workspace and subscription status.';
  }

  if (rawError.includes('INSUFFICIENT_CREDITS') || rawError.includes('insufficient credits') || rawError.includes('insufficient funds')) {
    return isFa
      ? 'اعتبار حساب شما برای این عملیات کافی نیست.'
      : 'Insufficient credits for this operation.';
  }

  if (rawError.includes('PRICE_CHANGED')) {
    return isFa
      ? 'هزینه تولید تغییر کرده است. لطفاً دوباره تلاش کنید.'
      : 'Execution price changed. Please try again.';
  }

  if (rawError.includes('RATE_LIMIT_EXCEEDED') || rawError.includes('RESOURCE_EXHAUSTED')) {
    return isFa
      ? 'محدودیت تعداد درخواست. لطفاً کمی صبر کنید.'
      : 'Rate limit exceeded. Please wait a moment.';
  }

  if (rawError.includes('DEADLINE_EXCEEDED') || rawError.includes('timeout')) {
    return isFa
      ? 'مهلت پردازش به پایان رسید. لطفاً مجدداً تلاش کنید.'
      : 'Operation timed out. Please try again.';
  }

  return rawError;
}
