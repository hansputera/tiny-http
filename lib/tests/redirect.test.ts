import { Response, tinyHttp } from '..';

describe('it should redirected', () => {
  it('Zhycorp discord route redirect to discord site', (dn) => {
    expect(tinyHttp.get('https://zhycorp.net/discord')).resolves
      .toBeInstanceOf(Response);
    dn();
  });
});