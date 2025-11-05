import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Ensure frontend code sees a safe test API setup
process.env.NEXT_PUBLIC_USE_MOCKS = 'true';
process.env.NEXT_PUBLIC_API_URL = 'http://localhost';

jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: {},
      asPath: '',
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    };
  },
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  })
) as jest.Mock;
