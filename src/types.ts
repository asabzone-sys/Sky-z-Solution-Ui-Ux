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
