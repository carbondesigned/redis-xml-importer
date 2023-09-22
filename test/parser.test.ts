import parseXML from '../src/parser';

test('parseXML should return parsed object', async () => {
  const xml = `
        <config>
        <subdomains>
            <subdomain>http://example.com</subdomain>
            <subdomain>http://test.com</subdomain>
        </subdomains>
        <cookies>
            <cookie name="cookie1" host="http://example.com">value1</cookie>
            <cookie name="cookie2" host="http://test.com">value2</cookie>
        </cookies>
        </config>
    `;

  const {subdomains, cookies} = await parseXML(xml);

  expect(subdomains).toEqual(['http://example.com', 'http://test.com']);
  expect(cookies).toEqual([
    {name: 'cookie1', host: 'http://example.com', value: 'value1'},
    {name: 'cookie2', host: 'http://test.com', value: 'value2'},
  ]);
});
