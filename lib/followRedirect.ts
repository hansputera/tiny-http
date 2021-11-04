import { Response, tinyHttp, TinyHttpClient, TinyHttpOptions } from '.';
import { tooManyRedirectsError } from './errors';
import type { IncomingMessage } from 'http';
import type { TinyResolveFunction, TinyRejectFunction } from './types';


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
     * Current redirect count
     */
    private currentRedirects = 0;
    /**
     * Collected response from redirect response.
     */
    private _responses: Response[] = [];

    constructor(private client: TinyHttpClient) {}

    // Reference: https://developer.mozilla.org/en-US/docs/Web/HTTP/Redirections
    public handle(resolveFunc: TinyResolveFunction, rejectFunc: TinyRejectFunction, opts: TinyHttpOptions, res: IncomingMessage): void {
        const statusCode = res.statusCode || 200;
        if (this.currentRedirects >= this.maxRedirects) throw tooManyRedirectsError;
        if (statusCode > 300 && statusCode < 303 && this.currentRedirects <= this.maxRedirects) {
            this.currentRedirects += 1;

            this.redirectFunc(resolveFunc, rejectFunc, opts, res.headers['location'] as string);
        } else {
            this.dontRedirectFunc(resolveFunc, rejectFunc, res);
        }
    }

    private redirectFunc(resolveFunc: TinyResolveFunction, rejectFunc: TinyRejectFunction, opts: TinyHttpOptions, newUrl: string) {
        if (newUrl.startsWith('/')) {
            this.client.get(newUrl, opts).then((res) => {
                resolveFunc(res);
            }).catch((err) => rejectFunc(err));
        } else {
            tinyHttp.get(newUrl, opts).then((res) => {
                resolveFunc(res);
            }).catch((err) => rejectFunc(err));
        }
    }

    private dontRedirectFunc(resolveFunc: TinyResolveFunction, rejectFunc: TinyRejectFunction, res: IncomingMessage) {
        this.client._handle(res, resolveFunc, rejectFunc);
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
        return this.currentRedirects;
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