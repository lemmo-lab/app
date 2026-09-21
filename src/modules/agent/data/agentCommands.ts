export interface AgentCommandItem {
  id: string;
  command: string;
  name: string;
  nameFa: string;
  description: string;
  descriptionFa: string;
  iconName: 'Scissors' | 'AiMagicWand01' | 'Brush02' | 'Sun01' | 'LayersThree' | 'Crop01';
  badge: string;
  badgeFa: string;
  credits: number;
  aliases?: string[];
}

export const AGENT_COMMANDS: AgentCommandItem[] = [
  {
    id: 'remove_background',
    command: '/remove_background',
    name: 'Background Remover',
    nameFa: 'حذف هوشمند پس‌زمینه',
    description: 'Instant zero-loss subject cutout with hair alpha-matting',
    descriptionFa: 'جداسازی فوری سوژه با تفکیک مو و لبه‌های پیچیده با خروجی شفاف',
    iconName: 'Scissors',
    badge: 'Vision',
    badgeFa: 'بینایی',
    credits: 1,
    aliases: ['/remove_bg', '/bg_remove', '/cutout'],
  },
  {
    id: 'upscale',
    command: '/upscale',
    name: 'Vector & HD Upscaler',
    nameFa: 'ارتقای وضوح و وکتورساز',
    description: 'Up to 8x generative resolution multiplier without blur',
    descriptionFa: 'افزایش رزولوشن تا ۸ برابر بدون تار شدن جزییات با هوش مصنوعی',
    iconName: 'AiMagicWand01',
    badge: 'Enhance',
    badgeFa: 'ارتقا',
    credits: 2,
    aliases: ['/hd_upscale', '/super_res', '/clarity'],
  },
  {
    id: 'inpaint',
    command: '/inpaint',
    name: 'Generative Inpainter',
    nameFa: 'قلم جادویی و بازآفرینی',
    description: 'Context-aware subject replacement & area restoration',
    descriptionFa: 'حذف اشیای ناخواسته و بازسازی طبیعی بافت‌ها با پرامپت هدایت‌شده',
    iconName: 'Brush02',
    badge: 'Generative',
    badgeFa: 'مولد',
    credits: 3,
    aliases: ['/magic_brush', '/replace', '/fill'],
  },
  {
    id: 'relight',
    command: '/relight',
    name: 'Lighting Synthesizer',
    nameFa: 'تنظیم مجدد نورپردازی',
    description: 'Relocate scene light source with physical ray-tracing',
    descriptionFa: 'تغییر جهت تابش نور، سایه‌های دقیق و بازتنظیم هارمونی محیط',
    iconName: 'Sun01',
    badge: 'Lighting',
    badgeFa: 'نورپردازی',
    credits: 2,
    aliases: ['/lighting', '/sunlight', '/shadows'],
  },
  {
    id: 'depth_map',
    command: '/depth_map',
    name: 'Depth Map Generator',
    nameFa: 'تولید نقشه عمق سه‌بعدی',
    description: 'Monocular 3D depth extraction for parallax & shaders',
    descriptionFa: 'استخراج هندسه سه‌بعدی و لایه‌های عمق برای انیمیشن‌های پارالاکس',
    iconName: 'LayersThree',
    badge: '3D Depth',
    badgeFa: 'سه‌بعدی',
    credits: 1,
    aliases: ['/depth', '/3d_map'],
  },
  {
    id: 'segment',
    command: '/segment',
    name: 'Object Segmenter',
    nameFa: 'جداسازی هوشمند آبجکت‌ها',
    description: 'Semantic multi-layer isolation with single point click',
    descriptionFa: 'ماسک‌گذاری هوشمند هر عنصر تصویر جهت انتقال لایه‌ای به کانواس',
    iconName: 'Crop01',
    badge: 'Vision',
    badgeFa: 'بینایی',
    credits: 1,
    aliases: ['/segment_anything', '/mask', '/isolate'],
  },
];

/**
 * Extracts all matched agent tool commands from a prompt string.
 */
export function getCommandsFromPrompt(prompt?: string): AgentCommandItem[] {
  if (!prompt) return [];
  const matches = prompt.match(/\/([a-zA-Z0-9_\u0600-\u06FF]+)/g);
  if (!matches) return [];

  const found: AgentCommandItem[] = [];
  matches.forEach((token) => {
    const cmd = AGENT_COMMANDS.find(
      (c) =>
        c.command.toLowerCase() === token.toLowerCase() ||
        c.aliases?.some((a) => a.toLowerCase() === token.toLowerCase())
    );
    if (cmd && !found.some((f) => f.id === cmd.id)) {
      found.push(cmd);
    }
  });

  return found;
}

/**
 * Removes slash commands from the user prompt text so clean text can be shown underneath tool badges.
 */
export function cleanPromptText(prompt?: string): string {
  if (!prompt) return '';
  return prompt.replace(/\/([a-zA-Z0-9_\u0600-\u06FF]+)/g, '').replace(/\s+/g, ' ').trim();
}
