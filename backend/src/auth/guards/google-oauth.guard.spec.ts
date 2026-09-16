import { ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleOAuthGuard } from './google-oauth.guard';

describe('GoogleOAuthGuard', () => {
  it('rejects requests when Google OAuth is not configured', () => {
    const config = { get: jest.fn().mockReturnValue(undefined) };
    const guard = new GoogleOAuthGuard(config as unknown as ConfigService);

    expect(() => guard.canActivate({} as never)).toThrow(
      ServiceUnavailableException,
    );
  });
});
