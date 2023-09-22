// redisOps.test.ts
import {RedisOps} from '../src/redisOps';

const mockSet = jest.fn();

// Mocking the Redis client instance
jest.mock('@redis/client', () => {
  return {
    RedisClient: jest.fn(() => {
      return {set: mockSet};
    }),
  };
});

describe('Redis Operations', () => {
  beforeEach(() => {
    mockSet.mockClear();
  });

  const redisOps = new RedisOps();
  const {setSubdomains, setCookie} = redisOps;

  it('should set subdomains correctly', async () => {
    const subdomains = ['http://example.com', 'http://test.com'];
    await setSubdomains(subdomains);
    expect(mockSet).toHaveBeenCalledTimes(2);
    expect(mockSet).toHaveBeenCalledWith('subdomain:http://example.com', '1');
    expect(mockSet).toHaveBeenCalledWith('subdomain:http://test.com', '1');
  });
});
