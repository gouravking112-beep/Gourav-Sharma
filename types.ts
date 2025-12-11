export enum Role {
  USER = 'user',
  MODEL = 'model'
}

export interface ChatMessage {
  id: string;
  role: Role;
  text: string;
  timestamp: Date;
  isError?: boolean;
}

export enum AppMode {
  RELATIONSHIP = 'Relationship',
  BUSINESS = 'Business',
  WELLNESS = 'Wellness',
  EDC = 'EDC'
}

export enum AppTheme {
  ROSE = 'Rose',           // Pink/Feminine
  MIDNIGHT = 'Midnight',   // Cyber/Dark
  CORPORATE = 'Corporate', // Professional
  SERENITY = 'Serenity'    // Calm, nature
}

export interface ThemeConfig {
  bgApp: string;
  bgPanel: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
  accentHover: string;
  border: string;
  userBubble: string;
  modelBubble: string;
}