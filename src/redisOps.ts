import {RedisClientType} from 'redis';
import {createClient} from '@redis/client';
import {promisify} from 'util';

export class RedisOps {
  private client: RedisClientType;
  private asyncGet: any;
  private asyncSet: any;
  private asyncKeys: any;
  private isConnected: boolean = false;

  constructor() {
    this.client = createClient();

    this.client.on('connect', () => {
      console.log('Connected to Redis');
      this.isConnected = true;
    });

    this.client.on('error', (err) => {
      console.error('Error connecting to Redis:', err);
      this.isConnected = false;
    });

    this.asyncGet = promisify(this.client.get).bind(this.client);
    this.asyncSet = promisify(this.client.set).bind(this.client);
    this.asyncKeys = promisify(this.client.keys).bind(this.client);
  }

  async connect() {
    if (this.isConnected) return;
    await new Promise((resolve, reject) => {
      this.client.once('connect', resolve);
      this.client.once('error', reject);
      this.client.connect();
    });
  }

  private ensureConnected() {
    if (!this.isConnected) {
      throw new Error('Redis client is not connected.');
    }
  }

  async setSubdomains(subdomains: string[]) {
    this.ensureConnected();
    const value = JSON.stringify(subdomains);
    console.log('Setting subdomains:', value);
    await this.asyncSet('subdomains', value);
  }

  async setCookie(name: string, host: string, value: string) {
    this.ensureConnected();
    const key = `cookie:${name}:${host}`;
    await this.asyncSet(key, value);
  }

  async getAllKeys(): Promise<string[]> {
    this.ensureConnected();
    return this.asyncKeys('*');
  }

  close() {
    this.client.quit();
    this.isConnected = false;
  }
}
