import { TinyHttpClient } from '../index';

describe('Hastebin', () => {
  const client = new TinyHttpClient({
    baseURL: 'https://www.toptal.com/developers/hastebin',
  });
  const content = 'hello world';
  it('Should returned key data', (dn) => {
    expect(client.post('./documents', content)).resolves
      .toBe(expect.objectContaining({
        key: expect.any('string'),
      }));
    dn();
  });
});