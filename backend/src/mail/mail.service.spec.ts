import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';
import { ConfigService } from '@nestjs/config';

describe('MailService', () => {
  let service: MailService;
  const originalResendApiKey = process.env.RESEND_API_KEY;

  beforeEach(async () => {
    process.env.RESEND_API_KEY = 're_test_key';

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        { provide: ConfigService, useValue: { get: jest.fn() } },
      ],
    }).compile();

    service = module.get<MailService>(MailService);
  });

  afterEach(() => {
    process.env.RESEND_API_KEY = originalResendApiKey;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
