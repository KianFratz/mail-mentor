import { version } from '../package.json';

export const appMetadata = {
  app: 'mail-mentor-api',
  version: process.env.APP_VERSION?.trim() || version,
};
