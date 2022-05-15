import type {
	ClientRequest, IncomingMessage,
	IncomingHttpHeaders
} from 'node:http';
import type { OnDownloadProgressCallback } from '../types';
import { PassThrough } from 'node:stream';
import { Blob } from 'node:buffer';

/**
 * Tiny HTTP Response class.
 */
export class Response {
  constructor(public responseRaw: IncomingMessage) {}

    protected data = Buffer.alloc(0);
    /**
     * Here you could track stream data.
     */
    public stream = new PassThrough();

    /**
     * @ignore
     * You may not use this.
     * 
     * @param data - Chunk buffer
     */
    public addData(data: Buffer): void {
      this.data = Buffer.concat([this.data, data]);
    }

    /**
     * Here you could track download progress.
     * @param {OnDownloadProgressCallback} cb - Callback function for download progress 
     */
    public onDownload(cb: OnDownloadProgressCallback): void {
      this.stream.on('data', (chunk) => {
        cb(new Blob([this.data]).size, new Blob([chunk]).size);
      });
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
    public get headers(): IncomingHttpHeaders {
      return this.responseRaw.headers;
    }
    /**
     * Is response ok?
     */
    public get isOk(): boolean {
      return this.responseRaw.statusCode ?
		this.responseRaw.statusCode >= 200 && this.responseRaw.statusCode < 300 : false;
    }
    /**
     * Get response status message
     */
    public get statusMessage(): string {
      return this.responseRaw.statusMessage || '';
    }
    /**
     * Get response status code like 200, 204, 403, 401, 301, etc.
     */
    public get statusCode(): number {
      return this.responseRaw.statusCode || 200;
    }
}
