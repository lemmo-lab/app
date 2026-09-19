/**
 * Feed Data Source — Production Mock Data
 * High-fidelity AI generative showcase items, featured banner slides, and quick tools.
 * All image assets map to local /images/feed/ assets copied from img-base.
 */

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
  category: 'photoreal' | 'stylized' | 'architecture' | 'concept';
  aspectRatio: '16:9' | '9:16' | '1:1' | '3:4' | '4:5';
  width: number;
  height: number;
  likes: number;
  views: number;
  model: string;
  createdAt: string;
}

export const FEATURED_SLIDES: BannerSlide[] = [
  {
    id: 'slide-1',
    title: 'Solari Metropolis: Biophilic Hyper-Structure',
    titleFa: 'کلان‌شهر سولاری: هایپراستراکچر بایوفیلیک',
    prompt: 'Futuristic solarpunk city with towering mushroom-shaped biophilic structures, glass sky-bridges, warm dusk sunlight, 8k cinematic render',
    promptFa: 'شهر آینده‌نگرانه سولارپانک با سازه‌های قارچی‌شکل عظیم، پل‌های معلق شیشه‌ای، نور ملایم غروب، رندر سینمایی ۸K',
    image: '/images/feed/futuristic-solarpunk-city-towering-mushroom-shaped.webp',
    author: 'Elena Rostova',
    model: 'Lemmo Diffusion XL v4.2',
    aspectRatio: '16:9',
    remixCount: 1420,
    likes: 3890,
  },
  {
    id: 'slide-2',
    title: 'Dormant Cyclinder: Forgotten Orbital Titan',
    titleFa: 'استوانه خفته: تایتان مداری فراموش‌شده',
    prompt: 'Massive cylindrical spacecraft wreckage engulfed by dense emerald vegetation, misty alien atmosphere, volumetric god-rays',
    promptFa: 'لاشه غول‌پیکر فضاپیمای استوانه‌ای در آغوش پوشش گیاهی متراکم زمردین، اتمسفر مه‌آلود فرازمینی با تابش پرتوهای حجمی نور',
    image: '/images/feed/massive-cylindrical-spacecraft-wreckage-engulfed-by-dense.webp',
    author: 'Kaelen Vance',
    model: 'Lemmo CyberSynth 2.0',
    aspectRatio: '16:9',
    remixCount: 980,
    likes: 2450,
  },
  {
    id: 'slide-3',
    title: 'Emerald Monolith: Aerial Archipelago',
    titleFa: 'تک‌سنگ زمردین: مجمع‌الجزایر هوایی',
    prompt: 'Aerial photograph of a steep vibrant green island surrounded by crystal-clear turquoise ocean reefs, drone perspective, ultra-detailed',
    promptFa: 'عکس هوایی از جزیره صخره‌ای سرسبز و شاداب در میان آب‌سنگ‌های فیروزه‌ای و زلال اقیانوس، پرسپکتیو پهپاد با جزییات فوق‌العاده',
    image: '/images/feed/aerial-photograph-of-a-steep-vibrant-green-island-surrounded.webp',
    author: 'Sora Tanaka',
    model: 'Lemmo Photoreal Prime',
    aspectRatio: '16:9',
    remixCount: 2150,
    likes: 5120,
  },
];

export const FEATURE_ANNOUNCEMENTS: FeatureAnnouncement[] = [
  {
    id: 'feat-1',
    type: 'model',
    tag: 'NEW ENGINE',
    tagFa: 'موتور جدید',
    title: 'Lemmo Diffusion 4.5 Turbo',
    titleFa: 'موتور نسل جدید لمو توربو ۴.۵',
    description: 'Ultra-fast 4K generation in under 3 seconds with native spatial lighting and character consistency across styles.',
    descriptionFa: 'تولید فوق‌سریع تصاویر با کیفیت ۴K در کمتر از ۳ ثانیه همراه با پایداری کامل کاراکتر و نورپردازی طبیعی.',
    primaryActionLabel: 'Try Turbo Engine',
    primaryActionLabelFa: 'شروع با توربو',
    primaryActionHref: '/app/agent',
    secondaryActionLabel: 'Quick Demo',
    secondaryActionLabelFa: 'مشاهده ویدیو',
    secondaryActionHref: '/app/tools',
    image: '/images/feed/futuristic-solarpunk-city-towering-mushroom-shaped.webp',
  },
  {
    id: 'feat-2',
    type: 'premium',
    tag: 'PRO WORKSPACE',
    tagFa: 'امکانات ویژه',
    title: 'Infinite Multi-Layer Canvas',
    titleFa: 'بوم طراحی چندلایه‌ای بی‌نهایت',
    description: 'Outpaint, composite, and blend AI assets seamlessly on an expansive, non-destructive vector design workspace.',
    descriptionFa: 'ترکیب، گسترش کادر و مدیریت لایه‌ها به صورت نامحدود در محیط طراحی تعاملی و برداری استودیو.',
    primaryActionLabel: 'Launch Canvas',
    primaryActionLabelFa: 'ورود به بوم',
    primaryActionHref: '/app/canvas',
    secondaryActionLabel: 'View Tutorial',
    secondaryActionLabelFa: 'راهنمای کار',
    secondaryActionHref: '/app/canvas',
    image: '/images/feed/massive-cylindrical-spacecraft-wreckage-engulfed-by-dense.webp',
  },
  {
    id: 'feat-3',
    type: 'workspace',
    tag: 'AI COPILOT',
    tagFa: 'دستیار هوشمند',
    title: 'Autonomous Creative Agent',
    titleFa: 'دستیار هوشمند و خودکار طراحی',
    description: 'Direct the studio copilot in conversational natural language to orchestrate multi-step image pipelines and variations.',
    descriptionFa: 'هدایت هوش مصنوعی به زبان طبیعی برای اجرای سناریوهای چندمرحله‌ای، تولید مشتقات و بهینه‌سازی پروژه‌ها.',
    primaryActionLabel: 'Chat with Agent',
    primaryActionLabelFa: 'شروع گفتگو',
    primaryActionHref: '/app/agent',
    secondaryActionLabel: 'Learn More',
    secondaryActionLabelFa: 'جزییات قابلیت‌ها',
    secondaryActionHref: '/app/tools',
    image: '/images/feed/aerial-photograph-of-a-steep-vibrant-green-island-surrounded.webp',
  },
];

export const QUICK_TOOLS: QuickTool[] = [
  {
    id: 'tool-bg-remove',
    name: 'Background Remover',
    nameFa: 'حذف هوشمند پس‌زمینه',
    category: 'AI Vision',
    categoryFa: 'بینایی ماشین',
    description: 'Ultra-precise alpha matte extraction and cutout in 1 click',
    descriptionFa: 'استخراج دقیق ماسک آلفا و جداسازی سوژه با یک کلیک',
    image: '/images/feed/a-ripe-yellow-banana-wrapped-tightly-in-clear-bubble-wrap.webp',
    href: '/app/tools',
    badge: 'v2.4 Neural',
    isNew: true,
  },
  {
    id: 'tool-upscale',
    name: 'Vector & Super Upscaler',
    nameFa: 'ارتقای کیفیت و وکتورایزر',
    category: 'Enhance',
    categoryFa: 'ارتقای کیفیت',
    description: 'Up to 8K resolution boost with zero artifact preservation',
    descriptionFa: 'افزایش وضوح تا رزولوشن ۸K بدون افت جزییات و نویز',
    image: '/images/feed/a-stylized-vector-illustration-of-a-dense-metropolis-bathed.webp',
    href: '/app/tools',
    badge: '4x Detail',
    isNew: false,
  },
  {
    id: 'tool-segmenter',
    name: 'Object Segmenter',
    nameFa: 'قطعه‌بندی اجزای تصویر',
    category: 'Editing',
    categoryFa: 'ویرایش ساختاری',
    description: 'Interactive zero-shot multi-layer element selection',
    descriptionFa: 'انتخاب چندلایه‌ای عناصر و جداسازی بخش‌ها با اشاره ماوس',
    image: '/images/feed/a-layered-canape-rests-on-a-glossy-white-ceramic-surface-in.webp',
    href: '/app/tools',
    badge: 'SAM-2 Core',
    isNew: true,
  },
  {
    id: 'tool-lighting',
    name: 'Lighting Synthesizer',
    nameFa: 'شبیه‌ساز نور و اتمسفر',
    category: 'Volumetric',
    categoryFa: 'نورپردازی حجمی',
    description: 'Dynamic studio re-lighting and directional shadows',
    descriptionFa: 'تنظیم زاویه تابش، کلوین رنگی و سایه‌های حجمی استودیو',
    image: '/images/feed/two-minimalist-wristwatches-laid-diagonally-on-a-smooth-off.webp',
    href: '/app/tools',
    badge: 'HDR Relight',
    isNew: true,
  },
];

export const FEED_ITEMS: FeedItem[] = [
  {
    id: 'feed-1',
    title: 'Sunlit Retro Sanctuary',
    titleFa: 'پناهگاه رترو در تابش نور آفتاب',
    prompt: 'A young woman stands in a sunlit retro interior holding a vintage ceramic vase, warm analog film grain, Kodachrome 64 vibes',
    image: '/images/feed/a-young-woman-stands-in-a-sunlit-retro-interior-holding-a.webp',
    author: 'Maryam Mir',
    authorHandle: '@maryam_mir',
    avatar: 'MM',
    category: 'photoreal',
    aspectRatio: '3:4',
    width: 600,
    height: 800,
    likes: 842,
    views: 3200,
    model: 'Lemmo Analog Pro',
    createdAt: '2 hours ago',
  },
  {
    id: 'feed-2',
    title: 'Nocturnal Wolves of Caldera',
    titleFa: 'گرگ‌های شب‌گرد کالدرا',
    prompt: 'Three silhouetted wolves with glowing yellow eyes stand atop a rugged obsidian cliff under a starry aurora borealis',
    image: '/images/feed/three-silhouetted-wolves-with-glowing-yellow-eyes-stand-atop.webp',
    author: 'Arash K.',
    authorHandle: '@arash_k',
    avatar: 'AK',
    category: 'concept',
    aspectRatio: '16:9',
    width: 900,
    height: 506,
    likes: 1250,
    views: 4900,
    model: 'Lemmo Fantasy XL',
    createdAt: '3 hours ago',
  },
  {
    id: 'feed-3',
    title: 'Translucent Moth Maiden',
    titleFa: 'دوشیزه شاپرک بلورین',
    prompt: 'An anime-style girl with translucent moth wings, fluffy antennae, and pastel iridescent kimono against night sky',
    image: '/images/feed/an-anime-style-girl-with-translucent-moth-wings-and-fluffy.webp',
    author: 'Reza V.',
    authorHandle: '@rezav',
    avatar: 'RV',
    category: 'stylized',
    aspectRatio: '9:16',
    width: 500,
    height: 888,
    likes: 2190,
    views: 7400,
    model: 'Lemmo Anime v3',
    createdAt: '4 hours ago',
  },
  {
    id: 'feed-4',
    title: 'Descending Stone Pathway in Bloom',
    titleFa: 'گذرگاه سنگی رو به پایین در شکوفایی',
    prompt: 'A steeply descending stone pathway blanketed in vibrant crimson and violet autumn petals, ancient Japanese zen garden',
    image: '/images/feed/a-steeply-descending-stone-pathway-blanketed-in-vibrant.webp',
    author: 'Kimihiro S.',
    authorHandle: '@kimi_s',
    avatar: 'KS',
    category: 'photoreal',
    aspectRatio: '4:5',
    width: 640,
    height: 800,
    likes: 1680,
    views: 5120,
    model: 'Lemmo Photoreal Prime',
    createdAt: '5 hours ago',
  },
  {
    id: 'feed-5',
    title: 'Horus-Winged Serpent Titan',
    titleFa: 'اژدهای شاخدار کهکشانی',
    prompt: 'A serpentine creature with large curved horns ascends into a dramatic cosmic cloudscape, golden filigree scales',
    image: '/images/feed/a-serpentine-creature-with-large-curved-horns-ascends-into-a.webp',
    author: 'Leila Farhadi',
    authorHandle: '@leila_art',
    avatar: 'LF',
    category: 'concept',
    aspectRatio: '3:4',
    width: 600,
    height: 800,
    likes: 920,
    views: 3800,
    model: 'Lemmo Mythos v1',
    createdAt: '6 hours ago',
  },
  {
    id: 'feed-6',
    title: 'Minimalist Line Contour Study',
    titleFa: 'مطالعه خطوط پیوسته مینیمال',
    prompt: 'A minimalist black ink contour drawing of an abstract continuous-line face on textured organic paper',
    image: '/images/feed/a-minimalist-black-ink-contour-drawing-of-an-abstract.webp',
    author: 'Nima D.',
    authorHandle: '@nima_d',
    avatar: 'ND',
    category: 'stylized',
    aspectRatio: '1:1',
    width: 600,
    height: 600,
    likes: 640,
    views: 2900,
    model: 'Lemmo Vector Pen',
    createdAt: '7 hours ago',
  },
  {
    id: 'feed-7',
    title: 'Solitude at Ocean Dusk',
    titleFa: 'تنهایی در گرگ‌ومیش ساحل',
    prompt: 'Young woman on a beach gazing at the ocean at dusk, long dark trenchcoat, soft ocean spray, cinematic low-key lighting',
    image: '/images/feed/young-woman-on-a-beach-gazing-at-the-ocean-at-dusk-long-dark.webp',
    author: 'David Chen',
    authorHandle: '@dchen',
    avatar: 'DC',
    category: 'photoreal',
    aspectRatio: '16:9',
    width: 900,
    height: 506,
    likes: 3100,
    views: 8900,
    model: 'Lemmo Cinema Prime',
    createdAt: '8 hours ago',
  },
  {
    id: 'feed-8',
    title: 'The Brass Helm Voyagers',
    titleFa: 'مسافران کلاه‌خود برنجی',
    prompt: 'Three figures in pastel trench coats and vintage brass diving helmets standing before a pastel desert dune landscape',
    image: '/images/feed/three-figures-in-pastel-trench-coats-and-brass-diving.webp',
    author: 'Saman T.',
    authorHandle: '@saman_t',
    avatar: 'ST',
    category: 'stylized',
    aspectRatio: '16:9',
    width: 900,
    height: 506,
    likes: 1840,
    views: 6200,
    model: 'Lemmo Surrealist',
    createdAt: '9 hours ago',
  },
  {
    id: 'feed-9',
    title: 'Knight of the Radiant Blade',
    titleFa: 'شوالیه شمشیر درخشان',
    prompt: 'Kneeling knight in full ornate plate armor holding a glowing cyan sword into damp stone cavern ground',
    image: '/images/feed/kneeling-knight-in-full-plate-armor-holding-glowing-sword.webp',
    author: 'Torbjorn V.',
    authorHandle: '@torbjorn',
    avatar: 'TV',
    category: 'concept',
    aspectRatio: '3:4',
    width: 600,
    height: 800,
    likes: 2750,
    views: 9400,
    model: 'Lemmo Knightfall',
    createdAt: '10 hours ago',
  },
  {
    id: 'feed-10',
    title: 'Biophilic Coral Window Arch',
    titleFa: 'پنجره هلالی مرجان‌های زرد',
    prompt: 'Interior view through a yellow-framed window framed by coral-pink organic architecture overlooking lush tropical jungle',
    image: '/images/feed/interior-view-through-a-yellow-framed-window-framed-by-coral.webp',
    author: 'Hana Al-Zahrani',
    authorHandle: '@hana_arch',
    avatar: 'HA',
    category: 'architecture',
    aspectRatio: '4:5',
    width: 640,
    height: 800,
    likes: 1420,
    views: 4500,
    model: 'Lemmo ArchViz Studio',
    createdAt: '12 hours ago',
  },
  {
    id: 'feed-11',
    title: 'Pine Forest Dark Meander',
    titleFa: 'پیچ‌وخم تیره رودخانه در جنگل کاج',
    prompt: 'Aerial top-down view of a dark winding river cutting through dense deep-green pine forest, moody fog',
    image: '/images/feed/aerial-view-of-a-dark-winding-river-through-dense-pine.webp',
    author: 'Morteza B.',
    authorHandle: '@morteza',
    avatar: 'MB',
    category: 'photoreal',
    aspectRatio: '16:9',
    width: 900,
    height: 506,
    likes: 1980,
    views: 5700,
    model: 'Lemmo EarthScope',
    createdAt: '14 hours ago',
  },
  {
    id: 'feed-12',
    title: 'Gargantuan Armored Rhinoceros',
    titleFa: 'کرگدن غول‌پیکر زره‌پوش',
    prompt: 'A stylized gargantuan grey rhinoceros towers over a tiny human traveler in an arid canyon landscape',
    image: '/images/feed/a-stylized-gargantuan-grey-rhinoceros-towers-over-a-small.webp',
    author: 'Alexandre Roy',
    authorHandle: '@alex_roy',
    avatar: 'AR',
    category: 'concept',
    aspectRatio: '3:4',
    width: 600,
    height: 800,
    likes: 1110,
    views: 3900,
    model: 'Lemmo Colossus',
    createdAt: '16 hours ago',
  },
  {
    id: 'feed-13',
    title: 'Abstract Flat Collage Forms',
    titleFa: 'کلاژ انتزاعی فرم‌های تخت',
    prompt: 'Abstract collage of flat layered organic shapes in warm ochre, muted sage, and terracotta on off-white matte background',
    image: '/images/feed/abstract-collage-of-flat-layered-shapes-on-a-white.webp',
    author: 'Yuki Morita',
    authorHandle: '@yuki_m',
    avatar: 'YM',
    category: 'stylized',
    aspectRatio: '1:1',
    width: 600,
    height: 600,
    likes: 780,
    views: 2600,
    model: 'Lemmo Bauhaus Flat',
    createdAt: '18 hours ago',
  },
  {
    id: 'feed-14',
    title: 'Deep Abyss Submersible',
    titleFa: 'زیردریایی اعماق تاریک اقیانوس',
    prompt: 'Murky deep underwater scene with dark silhouette of a rounded exploration vessel, glowing headlights illuminating oceanic trench',
    image: '/images/feed/murky-deep-underwater-scene-dark-silhouette-of-a-rounded.webp',
    author: 'Arman Nazari',
    authorHandle: '@arman_n',
    avatar: 'AN',
    category: 'concept',
    aspectRatio: '16:9',
    width: 900,
    height: 506,
    likes: 2340,
    views: 6800,
    model: 'Lemmo Abyss Engine',
    createdAt: '1 day ago',
  },
  {
    id: 'feed-15',
    title: 'Nighttime Encampment Sentinel',
    titleFa: 'دیده‌بان اردوگاه شبانه',
    prompt: 'A shadowy foreground figure observes a nighttime campfire encampment nestled inside rocky misty valley',
    image: '/images/feed/a-shadowy-foreground-figure-observes-a-nighttime-encampment.webp',
    author: 'Farhad S.',
    authorHandle: '@farhad_s',
    avatar: 'FS',
    category: 'concept',
    aspectRatio: '3:4',
    width: 600,
    height: 800,
    likes: 1530,
    views: 4700,
    model: 'Lemmo NightWatch',
    createdAt: '1 day ago',
  },
  {
    id: 'feed-16',
    title: 'Weathered Red-Shingle Barn',
    titleFa: 'انبار چوبی روستایی با سقف سفالی',
    prompt: 'A weathered wooden barn with a steep reddish-brown shingled roof amid golden wheat fields in morning mist',
    image: '/images/feed/a-weathered-wooden-barn-with-a-steep-reddish-brown-shingled.webp',
    author: 'Clara Oswald',
    authorHandle: '@clara_o',
    avatar: 'CO',
    category: 'architecture',
    aspectRatio: '4:5',
    width: 640,
    height: 800,
    likes: 990,
    views: 3100,
    model: 'Lemmo Heritage v2',
    createdAt: '2 days ago',
  },
];
