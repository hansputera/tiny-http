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
    method: RequestMethod;
    json?: Record<string, unknown>;
    content?: string;
} & http.RequestOptions & https.RequestOptions;
export declare class Response {
    private res;
    constructor(res: http.IncomingMessage);
    protected data: Buffer;
    stream: PassThrough;
    addData(data: Buffer): void;
    getData(): Buffer;
    getContent(encoding?: BufferEncoding): string;
    getJSON<T>(): Promise<T>;
    getHeaders(): http.IncomingHttpHeaders;
    get isOk(): boolean;
    get statusMessage(): string;
    get statusCode(): number;
    get url(): string;
}
export declare const getPureRequest: (url: URL | string, options?: TinyHttpOptions, handleResponse?: ((res: http.IncomingMessage) => void) | undefined) => http.ClientRequest;
export declare class TinyHttpClient {
    clientOptions: TinyHttpBase;
    constructor(clientOptions: TinyHttpBase);
    get(url: string, opts?: TinyHttpOptions): Promise<OmittedResponse>;
    post(url: string, body?: string | TinyHttpOptions['json'], opts?: TinyHttpOptions): Promise<OmittedResponse>;
    delete(url: string, opts?: TinyHttpOptions): Promise<OmittedResponse>;
    put(url: string, body?: string | TinyHttpOptions['json'], opts?: TinyHttpOptions): Promise<OmittedResponse>;
    options(url: string, opts?: TinyHttpOptions): Promise<OmittedResponse>;
    private handleMessage;
}
export declare const tinyHttp: TinyHttpClient;
