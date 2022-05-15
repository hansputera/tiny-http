import { TinyHttpClient } from '..';

describe('Hastebin post test', () => {
  const client = new TinyHttpClient({
    baseURL: 'https://www.toptal.com/developers/hastebin',
  });
  const content = 'hello world';

  it('Should have \'key\'', (done) => {
    expect(client.post('./documents', content)).resolves
      .toBe(expect.objectContaining({
        key: expect.any('string'),
      }));
    done();
  });
});
