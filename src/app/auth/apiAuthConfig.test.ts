import { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { refresh } from './api';
import { provideAutoRefreshTokenHandler } from './apiAuthConfig';

jest.mock('./api');

describe('provideAutoRefreshTokenHandler', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    localStorage.clear();
  });

  const axionConfig: InternalAxiosRequestConfig = { headers: {} } as InternalAxiosRequestConfig;

  test('should not refresh token if it is not expired', async () => {
    //given
    const expiresAt = Date.now() / 1000 + 3600; // 1 hour in the future
    localStorage.setItem('access_token_expires_at', expiresAt.toString());

    //when
    const result = await provideAutoRefreshTokenHandler()(axionConfig);

    //then
    expect(result).toBe(axionConfig);
    expect(refresh).not.toHaveBeenCalled();
  });

  test('should refresh token if it is expired', async () => {
    //given
    const expiresAt = Date.now() / 1000 - 3600; // 1 hour in the past
    localStorage.setItem('access_token_expires_at', expiresAt.toString());

    const newExpiresAt = Date.now() / 1000 + 3600; // 1 hours in the future
    jest.mocked(refresh).mockResolvedValue({ token_expire_at: newExpiresAt });

    //when
    const result = await provideAutoRefreshTokenHandler()(axionConfig);

    //then
    expect(result).toBe(axionConfig);
    expect(refresh).toHaveBeenCalled();
    expect(localStorage.getItem('access_token_expires_at')).toBe(newExpiresAt.toString());
  });

  test('should handle refresh token failure with 403 error', async () => {
    //given
    const expiresAt = Date.now() / 1000 - 3600; // 1 hour in the past
    localStorage.setItem('access_token_expires_at', expiresAt.toString());

    const mockError = new AxiosError('Request failed', 'ERR_BAD_REQUEST', undefined, undefined, {
      status: 403,
    } as any);
    jest.mocked(refresh).mockRejectedValue(mockError);

    //when
    await provideAutoRefreshTokenHandler()(axionConfig);

    //then
    expect(refresh).toHaveBeenCalled();
    expect(localStorage.getItem('access_token_expires_at')).toBeNull();
  });
});
