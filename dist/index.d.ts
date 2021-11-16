/// <reference types="node" />
import * as http from 'node:http';
import * as https from 'node:https';
import { PassThrough } from 'node:stream';
export declare type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS';
export declare type OmittedResponse = Omit<Response, 'addData'>;
export declare type TinyHttpBase = {
    baseURL: string;
    headers?: Record<string, string>;
    agent?: http.Agent;
};
export declare type TinyHttpOptions = Omit<TinyHttpBase, 'baseURL'> & {
    method?: RequestMethod;
    json?: Record<string, unknown>;
    content?: string;
    maxRedirects?: number;
    timeout?: number;
    stream?: boolean;
} & http.RequestOptions & https.RequestOptions;
declare type OnDownloadProgressCallback = (dlBytes: number, chunkSize: number) => void;
export declare class Request {
    private req;
    response?: Response;
    constructor(req: http.ClientRequest);
    get method(): RequestMethod;
    get url(): string;
    get socket(): http.OutgoingMessage['socket'];
    get headers(): Record<string, unknown>;
    get raw(): http.ClientRequest;
    setResponse(resp: Response): Request;
}
export declare class Response {
    private req;
    private res;
    constructor(req: http.ClientRequest, res: http.IncomingMessage);
    protected data: Buffer;
    stream: PassThrough;
    addData(data: Buffer): void;
    raw: http.IncomingMessage;
    onDownload(cb: OnDownloadProgressCallback): void;
    getData(): Buffer;
    getContent(encoding?: BufferEncoding): string;
    getJSON<T>(): Promise<T>;
    get headers(): http.IncomingHttpHeaders;
    get isOk(): boolean;
    get statusMessage(): string;
    get statusCode(): number;
    get request(): Request;
}
export declare const getPureRequest: (url: URL | string, options?: TinyHttpOptions, handleResponse?: ((res: http.IncomingMessage) => void) | undefined, callbackReq?: ((req: http.ClientRequest) => void) | undefined) => void;
export declare class TinyHttpClient {
    clientOptions: TinyHttpBase;
    constructor(clientOptions: TinyHttpBase);
    get(url: string, opts?: TinyHttpOptions): Promise<OmittedResponse>;
    post(url: string, body?: string | TinyHttpOptions['json'], opts?: TinyHttpOptions): Promise<OmittedResponse>;
    delete(url: string, opts?: TinyHttpOptions): Promise<OmittedResponse>;
    put(url: string, body?: string | TinyHttpOptions['json'], opts?: TinyHttpOptions): Promise<OmittedResponse>;
    options(url: string, opts?: TinyHttpOptions): Promise<OmittedResponse>;
    private handleMessage;
    _handle: (req: http.ClientRequest, res: http.IncomingMessage, resolveFunc: (value: OmittedResponse) => void, rejectFunc: (reason?: unknown) => void, isStream?: boolean) => void;
}
export declare const tinyHttp: TinyHttpClient;
export {};
