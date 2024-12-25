export interface GPU {
  id: number;
  model: string;
  manufacturer: string;
  vram: number;
  tdp: number;
  price: number;
  formFactor: string;
  supplementaryPower: boolean;
  length: number;
}

export interface GPUQuantity {
  gpu: GPU;
  quantity: number;
} 