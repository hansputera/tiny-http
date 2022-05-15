import { tinyHttp, TinyHttpClient } from '.';
import { Response } from './http';
import { tooManyRedirectsError } from './errors';
import type { ClientRequest, IncomingMessage } from 'http';
import type { TinyHttpOptions, TinyResolveFunction, TinyRejectFunction } from './types';


/**
 * @class FollowRedirect
 * 
 * Follow redirect class to handle redirected response
 */
export class FollowRedirect {
    /**
     * Default max redirect
     */
    protected maxRedirects = 5;
    
    /**
     * Collected response from redirect response.
     */
    private _responses: Response[] = [];

    constructor(private client: TinyHttpClient) {}

    // Reference: https://developer.mozilla.org/en-US/docs/Web/HTTP/Redirections
    public handle(resolveFunc: TinyResolveFunction, rejectFunc: TinyRejectFunction, opts: TinyHttpOptions, res: IncomingMessage, reqUrl: URL): void {
      const statusCode = res.statusCode || 200;
      if (this._responses.length > this.maxRedirects) throw tooManyRedirectsError;
      // Ref: https://stackoverflow.com/questions/42136829/whats-the-difference-between-http-301-and-308-status-codes
      else if (statusCode > 300 && statusCode < 309 && this._responses.length <= this.maxRedirects && res.headers.location) {
        this.redirectFunc(resolveFunc, rejectFunc, opts, res.headers['location'] as string, reqUrl);
      } else {
        this.dontRedirectFunc(resolveFunc, rejectFunc, res, opts.stream);
      }
    }

    private redirectFunc(resolveFunc: TinyResolveFunction, rejectFunc: TinyRejectFunction, opts: TinyHttpOptions, newUrl: string, reqUrl: URL) {
      if (newUrl.startsWith('/') || newUrl.startsWith('./')) {
        this.client.get(new URL(newUrl, reqUrl).href, opts).then((res) => {
          resolveFunc(res);
        }).catch((err) => rejectFunc(err));
      } else {
        tinyHttp.get(newUrl, opts).then((res) => {
          resolveFunc(res);
        }).catch((err) => rejectFunc(err));
      }
    }

    private dontRedirectFunc(resolveFunc: TinyResolveFunction, rejectFunc: TinyRejectFunction, res: IncomingMessage, stream = false) {
      this.client.handleMessage(res, resolveFunc, rejectFunc, stream);
    }

    /**
     * Get collected response.
     * 
     * @return {Response[]}
     */
    public getResponses(): Response[] {
      return this._responses;
    }

    /**
     * Get current redirect count.
     * 
     * @return {Number}
     */
    public getCurrentRedirects(): number {
      return this._responses.length;
    }

    /**
     * Set max redirects to limit redirect count.
     * 
     * @param redirects - Limit redirect count.
     * @return {FollowRedirect}
     */
    public setMaxRedirects(redirects = 5): FollowRedirect {
      this.maxRedirects = redirects;
      return this;
    }
} 
