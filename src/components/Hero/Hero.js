import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Play, Copy01, Check01, AiMagicWand01, ArrowRight } from 'synthline/react';
import styles from './Hero.module.css';
const PROMPT_EXAMPLES = [
    {
        id: 'cinematic',
        category: 'Video 3.0 Omni',
        prompt: 'In-car POV, handheld shot through neon rain, cinematic golden reflections on wet asphalt.',
        badge: '4K Native',
        image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600&auto=format&fit=crop',
    },
    {
        id: 'vector',
        category: 'Canvas Generative Fill',
        prompt: 'Surreal levitating architectural glass pavilion in desert dunes, warm sunset rim lighting.',
        badge: 'Canvas Edit',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop',
    },
    {
        id: 'studio',
        category: 'Style Transfer & Icon',
        prompt: 'Futuristic geometric brand mascot, holographic metallic finish, isolated vector studio lighting.',
        badge: 'Vector SVG',
        image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop',
    },
];
export const Hero = () => {
    const [activePromptIndex, setActivePromptIndex] = useState(0);
    const [copied, setCopied] = useState(false);
    const activeExample = PROMPT_EXAMPLES[activePromptIndex] ?? PROMPT_EXAMPLES[0];
    const handleCopy = () => {
        navigator.clipboard.writeText(activeExample.prompt);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (_jsxs("section", { className: styles.heroSection, "aria-labelledby": "hero-title", children: [_jsxs("div", { className: styles.heroBackground, children: [_jsx("div", { className: styles.gridOverlay }), _jsx("div", { className: styles.glowLime }), _jsx("div", { className: styles.glowCyan }), _jsx("div", { className: styles.glowViolet })] }), _jsx("div", { style: { zIndex: 1, marginTop: 'var(--lemmo-space-400, 1rem)' }, children: _jsxs("div", { className: styles.tagBadge, children: [_jsx("span", { className: styles.badgeDot }), _jsx("span", { children: "All-New LEMMO 2.0 Studio Series" })] }) }), _jsxs("div", { className: styles.centerContent, children: [_jsx("h1", { id: "hero-title", className: styles.mainTitle, children: "All-in-One, One for All" }), _jsx("p", { className: styles.subHeadline, children: "Bridging Generative AI & Infinite Canvas Control" }), _jsx("p", { className: styles.description, children: "Experience an integrated creative suite where generative AI models and manual pixel-level precision coexist. Generate, blend, and edit multimodal assets on an infinite canvas." }), _jsxs("div", { className: styles.ctaRow, children: [_jsxs("a", { href: "#create", className: styles.primaryHeroBtn, children: [_jsx("span", { children: "Create Now" }), _jsx(ArrowRight, { size: 18, strokeWidth: 1.5 })] }), _jsxs("a", { href: "#demo", className: styles.secondaryHeroBtn, children: [_jsx(Play, { size: 16, strokeWidth: 1.5 }), _jsx("span", { children: "Watch Demo" })] })] })] }), _jsxs("div", { className: styles.promptBarWrapper, children: [_jsxs("div", { className: styles.promptCard, children: [_jsxs("div", { className: styles.promptLeft, children: [_jsxs("div", { className: styles.thumbnailPreview, children: [_jsx("img", { src: activeExample.image, alt: activeExample.prompt, className: styles.thumbnailImg, loading: "eager" }), _jsx("span", { className: styles.thumbnailBadge, children: activeExample.badge })] }), _jsxs("div", { className: styles.promptTextContent, children: [_jsxs("span", { className: styles.promptTag, children: [_jsx(AiMagicWand01, { size: 12, strokeWidth: 1.5 }), activeExample.category] }), _jsx("span", { className: styles.promptText, title: activeExample.prompt, children: activeExample.prompt })] })] }), _jsxs("div", { className: styles.promptRight, children: [_jsx("button", { type: "button", className: styles.promptActionBtn, onClick: handleCopy, "aria-label": "Copy prompt text", title: "Copy prompt", children: copied ? (_jsxs(_Fragment, { children: [_jsx(Check01, { size: 14, strokeWidth: 1.5 }), _jsx("span", { children: "Copied" })] })) : (_jsxs(_Fragment, { children: [_jsx(Copy01, { size: 14, strokeWidth: 1.5 }), _jsx("span", { children: "Copy Prompt" })] })) }), _jsxs("a", { href: "#canvas", className: styles.promptTryBtn, children: [_jsx("span", { children: "Generate on Canvas" }), _jsx(ArrowRight, { size: 14, strokeWidth: 1.5 })] })] })] }), _jsx("div", { className: styles.promptTabsRow, role: "tablist", children: PROMPT_EXAMPLES.map((item, idx) => (_jsx("button", { role: "tab", "aria-selected": idx === activePromptIndex, type: "button", className: `${styles.promptTab} ${idx === activePromptIndex ? styles.promptTabActive : ''}`, onClick: () => {
                                setActivePromptIndex(idx);
                                setCopied(false);
                            }, children: item.category }, item.id))) })] })] }));
};
