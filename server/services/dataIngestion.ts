import axios from 'axios';
import { OpenAI } from 'openai';
import { CPU, GPU, Chassis, CPUModel, GPUModel, ChassisModel } from '../models';
import { InferCreationAttributes } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

type CPUAttributes = InferCreationAttributes<CPUModel>;
type GPUAttributes = InferCreationAttributes<GPUModel>;
type ChassisAttributes = InferCreationAttributes<ChassisModel>;

class DataIngestionService {
  private sources = {
    cpu: [
      'https://www.amd.com/en/products/specifications/processors',
      'https://ark.intel.com/content/www/us/en/ark.html'
    ],
    gpu: [
      'https://www.nvidia.com/en-us/geforce/graphics-cards/',
      'https://www.amd.com/en/graphics/radeon-rx-graphics'
    ],
    chassis: [
      'https://www.supermicro.com/en/products/chassis',
      'https://www.dell.com/en-us/shop/server-chassis/sc/servers'
    ]
  };

  async scrapeAndParse() {
    try {
      await this.processCPUs();
      await this.processGPUs();
      await this.processChassis();
      console.log('Data ingestion completed successfully');
    } catch (error) {
      console.error('Data ingestion failed:', error);
    }
  }

  private async processCPUs() {
    for (const url of this.sources.cpu) {
      try {
        const html = await this.fetchPage(url);
        const specs = await this.parseWithGPT('cpu', html);
        await this.saveCPUs(specs);
      } catch (error) {
        console.error(`Failed to process CPUs from ${url}:`, error);
      }
    }
  }

  private async processGPUs() {
    for (const url of this.sources.gpu) {
      try {
        const html = await this.fetchPage(url);
        const specs = await this.parseWithGPT('gpu', html);
        await this.saveGPUs(specs);
      } catch (error) {
        console.error(`Failed to process GPUs from ${url}:`, error);
      }
    }
  }

  private async processChassis() {
    for (const url of this.sources.chassis) {
      try {
        const html = await this.fetchPage(url);
        const specs = await this.parseWithGPT('chassis', html);
        await this.saveChassis(specs);
      } catch (error) {
        console.error(`Failed to process chassis from ${url}:`, error);
      }
    }
  }

  private async fetchPage(url: string): Promise<string> {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch ${url}:`, error);
      throw error;
    }
  }

  private async parseWithGPT(type: 'cpu' | 'gpu' | 'chassis', html: string): Promise<any[]> {
    const promptTemplates = {
      cpu: `Extract CPU specifications from the following HTML. Return a JSON array of objects with these fields:
        model, manufacturer, tdp, cores, threads, baseSpeed, boostSpeed, price.
        HTML: ${html.substring(0, 4000)}`,
      gpu: `Extract GPU specifications from the following HTML. Return a JSON array of objects with these fields:
        model, manufacturer, tdp, vram, length, price.
        HTML: ${html.substring(0, 4000)}`,
      chassis: `Extract server chassis specifications from the following HTML. Return a JSON array of objects with these fields:
        model, manufacturer, formFactor, maxTDP, maxGPULength, driveBays, price.
        HTML: ${html.substring(0, 4000)}`
    };

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a hardware specification parser. Extract and structure hardware specifications from HTML content."
          },
          {
            role: "user",
            content: promptTemplates[type]
          }
        ],
        temperature: 0.2,
      });

      const response = completion.choices[0].message.content;
      return JSON.parse(response || '[]');
    } catch (error) {
      console.error('Failed to parse with GPT:', error);
      throw error;
    }
  }

  private async saveCPUs(specs: CPUAttributes[]) {
    for (const spec of specs) {
      try {
        await CPU.create(spec);
      } catch (error) {
        console.error('Failed to save CPU:', error);
      }
    }
  }

  private async saveGPUs(specs: GPUAttributes[]) {
    for (const spec of specs) {
      try {
        await GPU.create(spec);
      } catch (error) {
        console.error('Failed to save GPU:', error);
      }
    }
  }

  private async saveChassis(specs: ChassisAttributes[]) {
    for (const spec of specs) {
      try {
        await Chassis.create(spec);
      } catch (error) {
        console.error('Failed to save chassis:', error);
      }
    }
  }
}

export default new DataIngestionService(); 