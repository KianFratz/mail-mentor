import { Injectable, Logger } from '@nestjs/common';
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
      new Logger(OllamaService.name).error({ event: 'ai_provider_failed' });
      throw new HttpException(
        'Failed to communicate with AI API',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
