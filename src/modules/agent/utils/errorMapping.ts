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

  if (
    rawError.includes('WORKSPACE_FORBIDDEN') ||
    rawError.includes('PERMISSION_DENIED') ||
    rawError.includes('403') ||
    rawError.includes('Forbidden') ||
    rawError.includes('not a member')
  ) {
    return isFa
      ? 'شما به این فضای کاری دسترسی ندارید یا وضعیت عضویت نامعتبر است.'
      : 'You do not have access to this workspace or membership is invalid.';
  }

  if (
    rawError.includes('UNAUTHENTICATED') ||
    rawError.includes('401') ||
    rawError.includes('Unauthorized') ||
    rawError.includes('session')
  ) {
    return isFa
      ? 'نشست کاربری شما معتبر نیست. لطفاً مجدداً وارد حساب کاربری خود شوید.'
      : 'Your session is not valid. Please log in again.';
  }

  if (
    rawError.includes('INVALID_ARGUMENT') ||
    rawError.includes('400') ||
    rawError.includes('Bad Request')
  ) {
    return isFa
      ? 'درخواست ارسالی نامعتبر است. لطفاً گزینه‌ها و متن پرامپت را بررسی کنید.'
      : 'Invalid request. Please verify your prompt and generation options.';
  }

  if (
    rawError.includes('INTERNAL') ||
    rawError.includes('500') ||
    rawError.includes('Internal Server Error')
  ) {
    return isFa
      ? 'خطای داخلی سرویس. لطفاً لحظاتی بعد مجدداً تلاش نمایید.'
      : 'Internal service error. Please try again in a few moments.';
  }

  return rawError;
}
