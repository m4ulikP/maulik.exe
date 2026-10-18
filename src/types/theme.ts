export type ThemeId = 'obsidian' | 'amber' | 'midnight';
export type AppearanceMode = 'light' | 'dark';

export interface ThemeOption {
  id: ThemeId;
  label: string;
  code: string;
  accentColor: string;
  secondaryColor: string;
  glowColor: string;
  gradient: string;
  description: string;
}

export const THEMES: ThemeOption[] = [
  {
    id: 'obsidian',
    label: 'Obsidian',
    code: '01',
    accentColor: '#34d399',
    secondaryColor: '#22d3ee',
    glowColor: 'rgba(52, 211, 153, 0.45)',
    gradient: 'linear-gradient(135deg, #34d399 0%, #059669 100%)',
    description: 'Mint / Obsidian',
  },
  {
    id: 'amber',
    label: 'Amber',
    code: '02',
    accentColor: '#f59e0b',
    secondaryColor: '#fb923c',
    glowColor: 'rgba(245, 158, 11, 0.45)',
    gradient: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)',
    description: 'Phosphor Gold / Carbon',
  },
  {
    id: 'midnight',
    label: 'Midnight',
    code: '03',
    accentColor: '#38bdf8',
    secondaryColor: '#818cf8',
    glowColor: 'rgba(56, 189, 248, 0.45)',
    gradient: 'linear-gradient(135deg, #38bdf8 0%, #2563eb 100%)',
    description: 'Nordic Cobalt / Cyan',
  },
];
