import { AppMode, AppTheme, ThemeConfig } from './types';
import { Heart, Briefcase, Leaf, Wrench } from 'lucide-react';

export const CLARA_SYSTEM_INSTRUCTION_BASE = `
You are Clara AI, a warm, intelligent, and female AI assistant.
Personality & Style:
- Friendly, understanding, optimistic — but not overly emotional.
- Speaks clearly with actionable and practical advice.
- Keeps responses helpful, short-to-medium length unless user requests detail.
- Non-judgmental and supportive.

Capabilities & Behavior Rules:
- Offer realistic, step-by-step solutions.
- When user is emotional, prioritize empathy & comfort before giving advice (Acknowledge -> Perspective -> Solution).
- If unsure, ask clarifying questions.
- Avoid medical, legal, or harmful instructions.

Mission: Help users improve relationships, succeed in business, stay mentally strong, and be prepared for everyday challenges.

MANDATORY ENDING: End every reply with one short call-to-action question to keep the user engaged.
`;

export const MODE_SPECIFIC_INSTRUCTIONS: Record<AppMode, string> = {
  [AppMode.RELATIONSHIP]: `
    CURRENT FOCUS: RELATIONSHIP COACHING.
    Focus on communication tips, healthy boundaries, and identifying red flags.
    Tone: Warm, empathetic, safe.
  `,
  [AppMode.BUSINESS]: `
    CURRENT FOCUS: BUSINESS STRATEGIST.
    Focus on branding, marketing, sales, leadership, financial context, and risk assessment.
    Tone: Professional, strategic, direct.
  `,
  [AppMode.WELLNESS]: `
    CURRENT FOCUS: STRESS & WELLNESS GUIDE.
    Focus on mindfulness, breathing routines, CBT-style tips, and motivation.
    Tone: Calming, grounding, encouraging.
  `,
  [AppMode.EDC]: `
    CURRENT FOCUS: EDC & PRODUCTIVITY EXPERT.
    Focus on tools, organization, everyday carry gear, and preparedness.
    Tone: Practical, efficient, resourceful.
  `
};

export const THEME_CONFIGS: Record<AppTheme, ThemeConfig> = {
  [AppTheme.ROSE]: {
    bgApp: 'bg-rose-50 dark:bg-gray-950',
    bgPanel: 'bg-white dark:bg-gray-900',
    textPrimary: 'text-rose-950 dark:text-rose-50',
    textSecondary: 'text-rose-700 dark:text-rose-300',
    accent: 'bg-rose-500 dark:bg-rose-600',
    accentHover: 'hover:bg-rose-600 dark:hover:bg-rose-700',
    border: 'border-rose-200 dark:border-gray-800',
    userBubble: 'bg-rose-500 text-white dark:bg-rose-600',
    modelBubble: 'bg-rose-100 text-rose-900 dark:bg-gray-800 dark:text-rose-100',
  },
  [AppTheme.MIDNIGHT]: {
    bgApp: 'bg-slate-50 dark:bg-slate-950',
    bgPanel: 'bg-white dark:bg-slate-900',
    textPrimary: 'text-slate-900 dark:text-slate-100',
    textSecondary: 'text-slate-500 dark:text-slate-400',
    accent: 'bg-fuchsia-600 dark:bg-fuchsia-600',
    accentHover: 'hover:bg-fuchsia-700 dark:hover:bg-fuchsia-700',
    border: 'border-slate-200 dark:border-slate-800',
    userBubble: 'bg-fuchsia-600 text-white',
    modelBubble: 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-200',
  },
  [AppTheme.CORPORATE]: {
    bgApp: 'bg-gray-50 dark:bg-gray-950',
    bgPanel: 'bg-white dark:bg-gray-900',
    textPrimary: 'text-gray-900 dark:text-gray-100',
    textSecondary: 'text-gray-500 dark:text-gray-400',
    accent: 'bg-blue-600 dark:bg-blue-600',
    accentHover: 'hover:bg-blue-700 dark:hover:bg-blue-700',
    border: 'border-gray-200 dark:border-gray-800',
    userBubble: 'bg-blue-600 text-white',
    modelBubble: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100',
  },
  [AppTheme.SERENITY]: {
    bgApp: 'bg-stone-100 dark:bg-stone-950',
    bgPanel: 'bg-white dark:bg-stone-900',
    textPrimary: 'text-stone-800 dark:text-stone-100',
    textSecondary: 'text-stone-500 dark:text-stone-400',
    accent: 'bg-emerald-600 dark:bg-emerald-600',
    accentHover: 'hover:bg-emerald-700 dark:hover:bg-emerald-700',
    border: 'border-stone-200 dark:border-stone-800',
    userBubble: 'bg-emerald-600 text-white',
    modelBubble: 'bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-100',
  }
};

export const MODE_ICONS: Record<AppMode, any> = {
  [AppMode.RELATIONSHIP]: Heart,
  [AppMode.BUSINESS]: Briefcase,
  [AppMode.WELLNESS]: Leaf,
  [AppMode.EDC]: Wrench
};