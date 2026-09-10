export interface PortfolioCard {
  id: string;
  index: number;
  title: string;
  subtitle: string;
  category: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  subtextColor: string;
  tags?: string[];
}

export interface CapabilityItem {
  number: string;
  category: 'BUILD' | 'GROW' | 'AUTOMATE';
  title: string;
  description: string;
  services: string[];
}

export interface MethodologyStep {
  number: string;
  title: string;
  description: string;
  deliverable: string;
}

export interface CreedItem {
  word: string;
  pillar: string;
  description: string;
}
