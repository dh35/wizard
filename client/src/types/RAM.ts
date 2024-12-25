export interface RAM {
  id: number;
  type: string;
  capacity: number;
  speed: number;
  price: number;
  generation: string;
  ecc: boolean;
  compatibleWith: string[];
} 