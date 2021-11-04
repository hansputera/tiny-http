import { TinyHttpClient } from '../index';

interface HastebinOutput {
    key: string;
}

describe('Hastebin', () => {
	const client = new TinyHttpClient({
		baseURL: 'https://haste.zann.my.id',
	});
	let key = '';
	const content = 'hello world';
	it('Post data', (dn) => {
		client.post('documents', content).then((resp) => {
			resp.getJSON<HastebinOutput>().then((json) => {
				expect(json).toBeDefined();
				key = json.key;
				dn();
			});
		});
	});
	it('Get Data', (dn) => {
		client.get('raw/' + key).then((resp) => {
			const content = resp.getContent();
			expect(content).toBe(content);
			dn();
		});
	});
});