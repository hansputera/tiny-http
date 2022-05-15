import * as http from 'node:http';
import * as https from 'node:https';

import { FollowRedirect } from './followRedirect';
import { Util } from './util';

import { Response, getRawRequest } from './http';

import type {
	TinyHttpOptions,
	TinyHttpBase,
	OmittedResponse
} from './types';

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
	 * Follow redirect instance.
	 */
   private followRedirect?: FollowRedirect;
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
    timeout: 15 * 1000,
  })): Promise<OmittedResponse> {
    return await new Promise((resolve, reject) => {
      if (url.startsWith('/')) throw new TypeError('URL must-not start with slash');
      
      if (!this.followRedirect)
		this.followRedirect = new FollowRedirect(this);
	
      if (opts.maxRedirects && typeof opts.maxRedirects === 'number')
        this.followRedirect?.setMaxRedirects(opts.maxRedirects);
      getRawRequest(Util.resolveUri(url, this).href, opts, (res, reqUrl) => {
        this.followRedirect?.handle(resolve, reject, opts, res, reqUrl);
      });
      
      this.followRedirect = undefined;
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
    timeout: 15 * 1000,
  })): Promise<OmittedResponse> {
    return await new Promise((resolve, reject) => {
      if (url.startsWith('/')) throw new TypeError('URL must-not start with slash');
      const postOpts: TinyHttpOptions = {
        ...opts,
        json: typeof body === 'object' ? body as Record<string, unknown> : undefined,
        content: typeof body === 'string' ? body as string : undefined,
        method: 'POST',
      };
      
      if (!this.followRedirect)
		this.followRedirect = new FollowRedirect(this);
      
      if (opts.maxRedirects && typeof opts.maxRedirects === 'number')
        this.followRedirect?.setMaxRedirects(opts.maxRedirects);
      getRawRequest(Util.resolveUri(url, this).href, postOpts, (res, reqUrl) => {
        this.followRedirect?.handle(resolve, reject, opts, res, reqUrl);
      });
      
      this.followRedirect = undefined;
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
     * Handling response.
     * 
     * @param res - IncomingMessage Response
     * @param resolveFunc - Resolve function.
     * @param rejectFunc - Reject function
     */
  public handleMessage(res: http.IncomingMessage, resolveFunc: (value: OmittedResponse) => void, rejectFunc: (reason?: unknown) => void, isStream = false): void {
    const response = new Response(res);
    res.on('data', (chunk) => {
      response.addData(Buffer.from(chunk));
      response.stream.push(Buffer.from(chunk));
    });
    res.on('close', () => {
      if (!isStream) resolveFunc(response as OmittedResponse);
    });
    res.on('error', (err) => rejectFunc(err));

    if (isStream) resolveFunc(response);
  }
}

/**
 * Simple HTTP Client
 */
export const tinyHttp = new TinyHttpClient({
  baseURL: '',
});

export * from './types';
export * from './http';

