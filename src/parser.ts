import {parseString} from 'xml2js';

type ParsedData = {
  subdomains: string[];
  cookies: Array<{
    name: string;
    host: string;
    value: string;
  }>;
};

async function parseXML(xml: string): Promise<ParsedData> {
  return new Promise((resolve, reject) => {
    parseString(xml, (err, result) => {
      if (err) {
        reject(err);
      }

      // Extract subdomains
      const subdomains =
        result?.config?.subdomains?.[0]?.subdomain?.map((s: any) =>
          s.toString()
        ) || [];

      // Extract cookies
      const cookies =
        result?.config?.cookies?.[0]?.cookie?.map((c: any) => {
          return {
            name: c.$.name,
            host: c.$.host,
            value: c._.toString(),
          };
        }) || [];

      resolve({subdomains, cookies});
    });
  });
}

export default parseXML;
