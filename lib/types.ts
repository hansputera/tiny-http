import type {
	RequestOptions as HttpRequestOptions,
	Agent,
	IncomingMessage,
} from 'node:http';
import type { RequestOptions as HttpsRequestOptions } from 'node:https';

import type { Response } from './http';

export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS';
export type OmittedResponse = Omit<Response, 'addData'>;
export type TinyHttpBase = {
    baseURL: string;
    headers?: Record<string, string>;
    agent?: Agent;
};
export type TinyHttpOptions = Omit<TinyHttpBase, 'baseURL'> & {
    method?: RequestMethod;
    json?: Record<string, unknown>;
    content?: string;
    maxRedirects?: number;
    timeout?: number;
    stream?: boolean;
    params?: URLSearchParams;
} & HttpRequestOptions & HttpsRequestOptions;
export type OnDownloadProgressCallback = (dlBytes: number, chunkSize: number) => void;

export type HandleResponseFunc = (res: IncomingMessage, requestedUrl: URL) => void;

export type TinyResolveFunction = 
(response: OmittedResponse) => void;

export type TinyRejectFunction =
(reason?: unknown) => void;
