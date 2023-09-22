"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// redisOps.test.ts
const redisOps_1 = require("../src/redisOps");
const mockSet = jest.fn();
// Mocking the Redis client instance
jest.mock('@redis/client', () => {
    return {
        RedisClient: jest.fn(() => {
            return { set: mockSet };
        }),
    };
});
describe('Redis Operations', () => {
    beforeEach(() => {
        mockSet.mockClear();
    });
    const redisOps = new redisOps_1.RedisOps();
    const { setSubdomains, setCookie } = redisOps;
    it('should set subdomains correctly', () => __awaiter(void 0, void 0, void 0, function* () {
        const subdomains = ['http://example.com', 'http://test.com'];
        yield setSubdomains(subdomains);
        expect(mockSet).toHaveBeenCalledTimes(2);
        expect(mockSet).toHaveBeenCalledWith('subdomain:http://example.com', '1');
        expect(mockSet).toHaveBeenCalledWith('subdomain:http://test.com', '1');
    }));
});
