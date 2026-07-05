import { Injectable } from '@nestjs/common';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Ollama } from 'ollama';

@Injectable()
export class OllamaService {
  private readonly ollama: Ollama;

  constructor() {
    this.ollama = new Ollama({
      host: 'https://ollama.com',
      headers: {
        Authorization: `Bearer ${process.env.OLLAMA_API_KEY}`,
      },
    });
  }

  async chat(messages: { role: string; content: string }[]) {
    try {
      const response = await this.ollama.chat({
        model: 'gemma4:cloud',
        messages,
        stream: false,
      });

      return response;
    } catch (error: any) {
      console.error('AI API Error:', error?.message || error);
      throw new HttpException(
        error?.message || 'Failed to communicate with AI API',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
