import * as http from 'node:http';
import * as https from 'node:https';
import { PassThrough } from 'node:stream';
import { Util } from './util';

export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS';
export type OmittedResponse = Omit<Response, 'addData'>;
export type TinyHttpBase = {
    baseURL: string;
    headers?: Record<string, string>;
    agent?: http.Agent;
};
export type TinyHttpOptions = Omit<TinyHttpBase, 'baseURL'> & {
    method: RequestMethod;
    json?: Record<string, unknown>;
    content?: string;
} & http.RequestOptions & https.RequestOptions;

/**
 * Tiny HTTP Response class.
 */
export class Response {
	constructor(private res: http.IncomingMessage) {}

    protected data = Buffer.alloc(0);
    /**
     * Here you could track stream data.
     */
    public stream = new PassThrough();

    public addData(data: Buffer): void {
        this.data = Buffer.concat([this.data, data]);
    }

    /**
     * Get buffer response data
     */
    public getData(): Buffer {
        return this.data;
    }
    /**
     * Get response content with encoding support.
     * 
     * @param encoding - Encoding content type you want. Like hex, baseurl, etc.
     */
    public getContent(encoding: BufferEncoding = 'utf8'): string {
        return this.data.toString(encoding);
    }
    /**
     * Get response content with JSON.parse
     */
    public async getJSON<T>(): Promise<T> {
        return JSON.parse(this.getContent());
    }
    /**
     * Get response headers
     */
    public getHeaders(): http.IncomingHttpHeaders {
        return this.res.headers;
    }
    /**
     * Is response ok?
     */
    public get isOk(): boolean {
        return this.res.statusCode ? this.res.statusCode >= 200 && this.res.statusCode < 300 : false;
    }
    /**
     * Get response status message
     */
    public get statusMessage(): string {
        return this.statusMessage as string;
    }
    /**
     * Get response status code like 200, 204, 403, 401, 301, etc.
     */
    public get statusCode(): number {
        return this.statusCode;
    }
    /**
     * Get response url.
     */
    public get url(): string {
        return this.res.url || '';
    }
}

/**
 * Pure HTTP Client Request
 * 
 * @param url - An URL want to send request
 * @param options - Client HTTP Options
 * @param handleResponse - A callback could handle your response.
 */
export const getPureRequest = (url: URL | string, options = Util.jsonDefault<TinyHttpOptions>({
	headers: {},
	method: 'GET',
}), handleResponse?: (res: http.IncomingMessage) => void): http.ClientRequest => {
	const protocol = Util.parseProtocol(url);
	if (!protocol) throw new TypeError('Invalid URL');

	if (typeof options.json === 'object') options.headers = {
		...options.headers,
		'Content-Type': 'application/json',
	};

	const request = protocol.toLowerCase() === 'http'
		? http.request(url, { ...options, }, handleResponse && handleResponse) : https.request(url, { ...options, }, handleResponse && handleResponse);
	if (typeof options.json === 'object') request.write(JSON.stringify(options.json));
	else if (typeof options.content === 'string') request.write(options.content);
	request.end();
	return request;
};

/**
 * Tiny HTTP Client Instance.
 * 
 * Here you can create your tiny http instance.
 * Example:
 * ```typescript
 * import { TinyHttpClient } from "../index";
 * 
 * const client = new TinyHttpClient({ baseURL: "https://hastebin.com" });
 * const content = "hello world";
 * 
 * client.post("documents", content).then((response) => {
 *  response.getJSON().then(console.log);
 * });
 * ```
 */
export class TinyHttpClient {
    /**
     * 
     * @param clientOptions - Fill your option here
     */
	constructor(public clientOptions: TinyHttpBase) {} 

    /**
     * Here, you could receive response with GET method.
     * 
     * @param url - A valid URL want to request
     * @param opts - Request Options
     * 
     * Example:
     * ```typescript
     * TinyHttpClient.get("https://hastebin.com", { ... });
     * ```
     */
	public async get(url: string, opts = Util.jsonDefault<TinyHttpOptions>({
        method: 'GET',
        headers: this.clientOptions.headers ?? {},
    })): Promise<OmittedResponse> {
		return await new Promise((resolve, reject) => {
			if (url.startsWith('/')) throw new TypeError('URL must-not start with slash');

			const completeUrl = Util.resolveUri(url, this);
			getPureRequest(completeUrl, opts, (res) => this.handleMessage(res, resolve, reject));
		});
	}

    /**
     * Well, you could receive response with 'POST' method.
     * 
     * @param url - A valid URL
     * @param body - Body or content want to send.
     * @param opts - Request Options
     * 
     * Do you want send JSON? Sure, you could.
     * ```typescript
     * TinyHttpClient.post("https://somesite.com", { hello: "world" });
     * ```
     * 
     * Or, just a text?
     * ```typescript
     * TinyHttpClient.post("https://hastebin.com/documents", "hello world");
     * ```
     */
	public async post(url: string, body?: string | TinyHttpOptions['json'], opts = Util.jsonDefault<TinyHttpOptions>({
        method: 'POST',
        headers: this.clientOptions.headers ?? {},
    })): Promise<OmittedResponse> {
		return await new Promise((resolve, reject) => {
			if (url.startsWith('/')) throw new TypeError('URL must-not start with slash');
			const completeUrl = Util.resolveUri(url, this);
			const postOpts: TinyHttpOptions = {
				...opts,
				json: typeof body === 'object' ? body as Record<string, unknown> : undefined,
				content: typeof body === 'string' ? body as string : undefined,
				method: 'POST',
			};
			getPureRequest(completeUrl, postOpts, (res) => this.handleMessage(res, resolve, reject));
		});
	}

    /**
     * Alias 'get' function, but with 'DELETE' method.
     * 
     * @param url - A valid URL
     * @param opts - Request Options
     * 
     * Example:
     * ```typescript
     * TinyHttpClient.delete("https://somesite.com/users/40");
     * ```
     */
	public delete(url: string, opts = Util.jsonDefault<TinyHttpOptions>({
        headers: this.clientOptions.headers ?? {},
        method: 'DELETE',
    })): Promise<OmittedResponse> {
		return this.get(url, {
			...opts,
			method: 'DELETE',
		});
	}

    /**
     * Alias 'post' function, but with 'PUT' method.
     * 
     * @param url - A valid URL
     * @param body - Body or content want to send.
     * @param opts - Request options
     * 
     * Example:
     * ```typescript
     * TinyHttpClient.put("https://somesite.com/users/20", { ... });
     * ```
     * 
     * Or,
     * ```typescript
     * TinyHttpClient.put("https://somesite.com/users/20/note", "hello world");
     * ```
     */
	public put(url: string, body?: string | TinyHttpOptions['json'], opts = Util.jsonDefault<TinyHttpOptions>({
        method: 'PUT',
        headers: this.clientOptions.headers ?? {},
    })): Promise<OmittedResponse> {
		return this.post(url, body, {
			...opts,
			method: 'PUT',
		});
	}

    /**
     * Alias 'get' function, but with 'OPTIONS' method.
     * 
     * @param url - A valid URL
     * @param opts - Request options
     * 
     * Example:
     * ```typescript
     * TinyHttpClient.options("https://somesite.com", { ... });
     * ```
     */
	public options(url: string, opts = Util.jsonDefault<TinyHttpOptions>({
        method: 'OPTIONS',
        headers: this.clientOptions.headers ?? {},
    })): Promise<OmittedResponse> {
		return this.get(url, {
			...opts,
			method: 'OPTIONS',
		});
	}

    /**
     * Handling response
     * 
     * @param res - IncomingMessage Response
     * @param resolveFunc - Resolve function
     * @param rejectFunc - Reject function
     */
	private handleMessage(res: http.IncomingMessage, resolveFunc: (value: OmittedResponse) => void, rejectFunc: (reason?: unknown) => void) {
		const response = new Response(res);
		res.on('data', (chunk) => {
			response.addData(Buffer.from(chunk));
			response.stream.push(Buffer.from(chunk));
		});
		res.on('close', () => {
			resolveFunc(response as OmittedResponse);
		});
		res.on('error', (err) => rejectFunc(err));
	}
}

/**
 * Simple HTTP Client
 */
export const tinyHttp = new TinyHttpClient({
	baseURL: '',
});
