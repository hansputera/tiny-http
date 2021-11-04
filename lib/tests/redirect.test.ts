import { tinyHttp } from '..';

describe('it should redirected', () => {
  it('Zhycorp discord route redirect to discord site', (dn) => {
    tinyHttp.get('https://zhycorp.net/discord').then((resp) => {
      expect(resp.statusCode).toBe(200);
      dn();
    });
  });
});