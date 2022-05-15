import { Response, tinyHttp } from '..';

describe('it should redirected', () => {
    it('should redirected to https://google.com', (done) => {
		expect(tinyHttp.get('http://localhost:3000/redirect?to=https://google.com')).resolves
           .toHaveProperty('url', 'https://www.google.com');
        done();
	});
});
