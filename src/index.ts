import parseXML from './parser';
import {RedisOps} from './redisOps';
import * as fs from 'fs';

// Parse command line arguments
const args = process.argv.slice(2);
const verbose = args.includes('-v');
const filePathIndex = args.indexOf('-v') === 0 ? 1 : 0;
const filePath = args[filePathIndex];

// Check if file exists
if (!fs.existsSync(filePath)) {
  console.error('XML file not found at provided path.');
  process.exit(1);
}

// Read the XML
const xmlData = fs.readFileSync(filePath, 'utf-8');

(async () => {
  try {
    // Parse the XML
    const {subdomains, cookies} = await parseXML(xmlData);
    console.log('Parsed subdomains:', subdomains);
    console.log('Parsed cookies:', cookies);

    // Initialize Redis operations instance
    const redisOps = new RedisOps();
    await redisOps.connect();

    // Save subdomains to Redis
    await redisOps.setSubdomains(subdomains);

    // Save cookies to Redis
    for (const cookie of cookies) {
      await redisOps.setCookie(cookie.name, cookie.host, cookie.value);
    }

    if (verbose) {
      // Print keys
      const keys = await redisOps.getAllKeys();
      console.log('Keys saved to Redis:', keys);
    }

    // Close Redis connection
    redisOps.close();
  } catch (error) {
    console.error('Error encountered:');
    console.error(error); // Print the raw error object.
  }
})();
