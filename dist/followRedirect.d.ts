/// <reference types="node" />
import { Response, TinyHttpClient, TinyHttpOptions } from '.';
import type { ClientRequest, IncomingMessage } from 'http';
import type { TinyResolveFunction, TinyRejectFunction } from './types';
export declare class FollowRedirect {
    private client;
    private pureReq?;
    protected maxRedirects: number;
    private currentRedirects;
    private _responses;
    constructor(client: TinyHttpClient);
    handle(resolveFunc: TinyResolveFunction, rejectFunc: TinyRejectFunction, opts: TinyHttpOptions, res: IncomingMessage): void;
    private redirectFunc;
    private dontRedirectFunc;
    getResponses(): Response[];
    getCurrentRedirects(): number;
    setMaxRedirects(redirects?: number): FollowRedirect;
    setPureRequest(req: ClientRequest): FollowRedirect;
}
