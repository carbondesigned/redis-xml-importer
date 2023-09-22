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
exports.RedisOps = void 0;
const client_1 = require("@redis/client");
const util_1 = require("util");
class RedisOps {
    constructor() {
        this.isConnected = false;
        this.client = (0, client_1.createClient)();
        this.client.on('connect', () => {
            console.log('Connected to Redis');
            this.isConnected = true;
        });
        this.client.on('error', (err) => {
            console.error('Error connecting to Redis:', err);
            this.isConnected = false;
        });
        this.asyncGet = (0, util_1.promisify)(this.client.get).bind(this.client);
        this.asyncSet = (0, util_1.promisify)(this.client.set).bind(this.client);
        this.asyncKeys = (0, util_1.promisify)(this.client.keys).bind(this.client);
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isConnected)
                return;
            yield new Promise((resolve, reject) => {
                this.client.once('connect', resolve);
                this.client.once('error', reject);
                this.client.connect();
            });
        });
    }
    ensureConnected() {
        if (!this.isConnected) {
            throw new Error('Redis client is not connected.');
        }
    }
    setSubdomains(subdomains) {
        return __awaiter(this, void 0, void 0, function* () {
            this.ensureConnected();
            const value = JSON.stringify(subdomains);
            console.log('Setting subdomains:', value);
            yield this.asyncSet('subdomains', value);
        });
    }
    setCookie(name, host, value) {
        return __awaiter(this, void 0, void 0, function* () {
            this.ensureConnected();
            const key = `cookie:${name}:${host}`;
            yield this.asyncSet(key, value);
        });
    }
    getAllKeys() {
        return __awaiter(this, void 0, void 0, function* () {
            this.ensureConnected();
            return this.asyncKeys('*');
        });
    }
    close() {
        this.client.quit();
        this.isConnected = false;
    }
}
exports.RedisOps = RedisOps;
