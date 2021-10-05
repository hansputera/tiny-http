import { TinyHttpClient } from './index';
export declare class Util {
    static parseProtocol(url: URL | string): string | undefined;
    static validateURL(url: string | URL): boolean;
    static jsonDefault<T>(json: T): T;
    static resolveUri(uri: string, client: TinyHttpClient): string;
}
