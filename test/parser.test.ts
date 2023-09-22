import parseXML from '../src/parser';

test('parseXML should return parsed object', async () => {
  const xml = `<root><element>value</element></root>`;
  const result = await parseXML(xml);
  expect(result).toEqual({root: {element: ['value']}});
});
