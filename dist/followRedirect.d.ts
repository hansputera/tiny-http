import { Response } from '.';
declare type ShouldTryBackFunc = (newUrl: string) => void;
declare type DontRedirectFunc = () => void;
export declare class FollowRedirect {
    private res;
    private shouldTryFunc;
    private dontRedirectFunc;
    protected maxRedirects: number;
    private currentRedirects;
    private _responses;
    constructor(res: Response, shouldTryFunc: ShouldTryBackFunc, dontRedirectFunc: DontRedirectFunc);
    private handle;
    getResponses(): Response[];
    getCurrentRedirects(): number;
    setMaxRedirects(redirects?: number): FollowRedirect;
}
export {};
