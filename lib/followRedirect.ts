import { OmittedResponse, Response, tinyHttp, TinyHttpClient, TinyHttpOptions } from '.';
import { tooManyRedirectsError } from './errors';


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

    constructor(private client: TinyHttpClient, private opts: TinyHttpOptions, private res: Response, private resolveFunc: (value: OmittedResponse) => void, private rejectFunc: (reason?: unknown) => void) {}

    // Reference: https://developer.mozilla.org/en-US/docs/Web/HTTP/Redirections
    private handle(res: Response): void {
        const statusCode = res.getStatusCode();
        console.log(this.currentRedirects);
        if (this.currentRedirects >= this.maxRedirects) throw tooManyRedirectsError;
        if (statusCode > 300 && statusCode < 303 && this.currentRedirects <= this.maxRedirects) {
            this.currentRedirects += 1;
            // TODO
        } else {
            this.dontRedirectFunc();
        }
    }

    private redirectFunc(newUrl: string) {
        if (newUrl.startsWith('/')) {
            this.client.get(newUrl, this.opts).then((res) => {
                this.resolveFunc(res);
            }).catch((err) => this.rejectFunc(err));
        } else {
            tinyHttp.get(newUrl, this.opts).then((res) => {
                this.resolveFunc(res);
            }).catch((err) => this.rejectFunc(err));
        }
    }

    private dontRedirectFunc() {
        // TODO
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