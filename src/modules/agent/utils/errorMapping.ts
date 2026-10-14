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

  let traceId: string | undefined;
  const traceMatch = rawError.match(/(?:request_id|trace_id|correlation_id)[:=]\s*([a-zA-Z0-9_-]+)/i);
  if (traceMatch) {
    traceId = traceMatch[1];
  }

  let baseMessage = '';

  if (rawError.includes('PROVIDER_URL_EXPIRED')) {
    baseMessage = isFa
      ? 'لینک موقت تصویر منقضی شده است. لطفاً درخواست تولید را مجدداً ثبت نمایید.'
      : 'Temporary provider image URL expired. Please re-submit the generation request.';
  } else if (rawError.includes('SERVICE_DEGRADED') || rawError.includes('DEGRADED')) {
    baseMessage = isFa
      ? 'سرویس در حالت محدودیت موقت (Degraded) است؛ ایجاد تولید جدید متوقف شده اما مطالعه تاریخچه در دسترس است.'
      : 'Service is operating in degraded mode; new generation is paused while history remains accessible.';
  } else if (rawError.includes('WALLET_NOT_FOUND')) {
    baseMessage = isFa
      ? 'کیف‌پول این فضای کاری یافت نشد. لطفاً وضعیت اشتراک و فضای کاری خود را بررسی کنید.'
      : 'Workspace wallet not found. Please check your workspace and subscription status.';
  } else if (rawError.includes('INSUFFICIENT_CREDITS') || rawError.includes('insufficient credits') || rawError.includes('insufficient funds')) {
    baseMessage = isFa
      ? 'اعتبار حساب شما برای این عملیات کافی نیست.'
      : 'Insufficient credits for this operation.';
  } else if (rawError.includes('PRICE_CHANGED')) {
    baseMessage = isFa
      ? 'هزینه تولید تغییر کرده است. لطفاً دوباره تلاش کنید.'
      : 'Execution price changed. Please try again.';
  } else if (rawError.includes('RATE_LIMIT_EXCEEDED') || rawError.includes('RESOURCE_EXHAUSTED')) {
    baseMessage = isFa
      ? 'محدودیت تعداد درخواست. لطفاً کمی صبر کنید.'
      : 'Rate limit exceeded. Please wait a moment.';
  } else if (rawError.includes('DEADLINE_EXCEEDED') || rawError.includes('timeout')) {
    baseMessage = isFa
      ? 'مهلت پردازش به پایان رسید. لطفاً مجدداً تلاش کنید.'
      : 'Operation timed out. Please try again.';
  } else if (
    rawError.includes('WORKSPACE_FORBIDDEN') ||
    rawError.includes('PERMISSION_DENIED') ||
    rawError.includes('403') ||
    rawError.includes('Forbidden') ||
    rawError.includes('not a member')
  ) {
    baseMessage = isFa
      ? 'شما به این فضای کاری دسترسی ندارید یا وضعیت عضویت نامعتبر است.'
      : 'You do not have access to this workspace or membership is invalid.';
  } else if (
    rawError.includes('UNAUTHENTICATED') ||
    rawError.includes('401') ||
    rawError.includes('Unauthorized') ||
    rawError.includes('session')
  ) {
    baseMessage = isFa
      ? 'نشست کاربری شما معتبر نیست. لطفاً مجدداً وارد حساب کاربری خود شوید.'
      : 'Your session is not valid. Please log in again.';
  } else if (
    rawError.includes('INVALID_ARGUMENT') ||
    rawError.includes('400') ||
    rawError.includes('Bad Request')
  ) {
    baseMessage = isFa
      ? 'درخواست ارسالی نامعتبر است. لطفاً گزینه‌ها و متن پرامپت را بررسی کنید.'
      : 'Invalid request. Please verify your prompt and generation options.';
  } else if (
    rawError.includes('INTERNAL') ||
    rawError.includes('500') ||
    rawError.includes('Internal Server Error')
  ) {
    baseMessage = isFa
      ? 'خطای داخلی سرویس. لطفاً لحظاتی بعد مجدداً تلاش نمایید.'
      : 'Internal service error. Please try again in a few moments.';
  } else {
    baseMessage = rawError;
  }

  if (traceId) {
    return isFa ? `${baseMessage} (کد پیگیری: ${traceId})` : `${baseMessage} (Tracking ID: ${traceId})`;
  }

  return baseMessage;
}
