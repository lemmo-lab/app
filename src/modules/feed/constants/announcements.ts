export interface FeatureAnnouncement {
  id: string;
  type: 'premium' | 'model' | 'workspace';
  tag: string;
  tagFa: string;
  title: string;
  titleFa: string;
  description: string;
  descriptionFa: string;
  primaryActionLabel: string;
  primaryActionLabelFa: string;
  primaryActionHref: string;
  secondaryActionLabel: string;
  secondaryActionLabelFa: string;
  secondaryActionHref: string;
  image: string;
}

export const DEFAULT_FEATURE_ANNOUNCEMENTS: FeatureAnnouncement[] = [
  {
    id: 'feat-1',
    type: 'model',
    tag: 'NEW ENGINE',
    tagFa: 'موتور جدید',
    title: 'Lemmo Diffusion 4.5 Turbo',
    titleFa: 'موتور نسل جدید لمو توربو ۴.۵',
    description:
      'Ultra-fast 4K generation in under 3 seconds with native spatial lighting and character consistency across styles.',
    descriptionFa:
      'تولید فوق‌سریع تصاویر با کیفیت ۴K در کمتر از ۳ ثانیه همراه با پایداری کامل کاراکتر و نورپردازی طبیعی.',
    primaryActionLabel: 'Try Turbo Engine',
    primaryActionLabelFa: 'شروع با توربو',
    primaryActionHref: '/app/agent',
    secondaryActionLabel: 'Quick Demo',
    secondaryActionLabelFa: 'مشاهده ویدیو',
    secondaryActionHref: '/app/tools',
    image:
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: 'feat-2',
    type: 'premium',
    tag: 'PRO WORKSPACE',
    tagFa: 'امکانات ویژه',
    title: 'Infinite Multi-Layer Canvas',
    titleFa: 'بوم طراحی چندلایه‌ای بی‌نهایت',
    description:
      'Outpaint, composite, and blend AI assets seamlessly on an expansive, non-destructive vector design workspace.',
    descriptionFa:
      'ترکیب، گسترش کادر و مدیریت لایه‌ها به صورت نامحدود در محیط طراحی تعاملی و برداری استودیو.',
    primaryActionLabel: 'Launch Canvas',
    primaryActionLabelFa: 'ورود به بوم',
    primaryActionHref: '/app/canvas',
    secondaryActionLabel: 'View Tutorial',
    secondaryActionLabelFa: 'راهنمای کار',
    secondaryActionHref: '/app/canvas',
    image:
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: 'feat-3',
    type: 'workspace',
    tag: 'AI COPILOT',
    tagFa: 'دستیار هوشمند',
    title: 'Autonomous Creative Agent',
    titleFa: 'دستیار هوشمند و خودکار طراحی',
    description:
      'Direct the studio copilot in conversational natural language to orchestrate multi-step image pipelines and variations.',
    descriptionFa:
      'هدایت هوش مصنوعی به زبان طبیعی برای اجرای سناریوهای چندمرحله‌ای، تولید مشتقات و بهینه‌سازی پروژه‌ها.',
    primaryActionLabel: 'Chat with Agent',
    primaryActionLabelFa: 'شروع گفتگو',
    primaryActionHref: '/app/agent',
    secondaryActionLabel: 'Learn More',
    secondaryActionLabelFa: 'جزییات قابلیت‌ها',
    secondaryActionHref: '/app/tools',
    image:
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1600&q=80',
  },
];
