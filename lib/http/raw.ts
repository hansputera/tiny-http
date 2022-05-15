import * as http from 'node:http';
import * as https from 'node:https';

import type {
	TinyHttpOptions,
	HandleResponseFunc,
} from '../types';

import { timeoutError } from '../errors';

import { Util } from '../util';

export const getRawRequest = async (
	url: URL | string,
	options: TinyHttpOptions = Util.jsonDefault<TinyHttpOptions>({
		headers: {
			'User-Agent': 'TinyHttp/1.0',
		},
		'timeout': 15_000,
		'method': 'GET',
	}),
	responseFunc?: HandleResponseFunc
): Promise<void> => {
	const protocol = Util.parseProtocol(url);
	if (!protocol || !['http', 'https'].includes(protocol.toLowerCase()))
		throw new TypeError('Invalid URL Protocol!');
	
	if (typeof options.json === 'object')
		options.headers = {
			...options.headers,
			'Content-Type': 'application/json',
		};
	
	const resolvedUri = Util.resolveUri(url instanceof URL ? url.href : url);
	if (resolvedUri.hostname.toLowerCase() === 'localhost')
		resolvedUri.hostname = '127.0.0.1';
	if (options.params instanceof URLSearchParams)
		resolvedUri.search = (new URLSearchParams({
			...Object.fromEntries(resolvedUri.searchParams.entries()),
			...Object.fromEntries(options.params.entries()),
		})).toString();
	if (typeof options.port === 'number')
		resolvedUri.port = options.port.toString();
	
	const request = protocol.toLowerCase() === 'http'
	?
		http.request(resolvedUri, { ...options }, (r) => responseFunc && responseFunc(r, resolvedUri))
	:
		https.request(resolvedUri, { ...options }, (r) => responseFunc && responseFunc(r, resolvedUri));
	request.setTimeout(options.timeout ?? 15_000);
	request.on('timeout', () => {
		request.destroy(timeoutError);
	});
	if (typeof options.json === 'object')
		request.write(JSON.stringify(options.json));
	else if (typeof options.content === 'string' || typeof options.content === 'number')
		request.write(options.content);
	request.end();
}
