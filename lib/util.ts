import { TinyHttpClient } from './index';

/**
 * Utiltiy for Tiny HTTP Client
 * 
 */
export class Util {
  /**
     * Parse protocol from an url.
     * 
     * @param url - An URL want to get the protocol.
     */
  static parseProtocol(url: URL | string): string | undefined {
    if (!this.validateURL) return undefined;
    else {
      return (new URL(url)).protocol.slice(0, -1);
    }
  }

  /**
     * Validate url using 'URL' instance.
     * 
     * @param url - An URL want to validate.
     */
  static validateURL(url: string | URL): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  static jsonDefault<T>(json: T): T {
    return json as typeof json;
  }

  /**
     * Resolve URI when using get, post, put, delete, and options method.
     * 
     * @param {string} uri - An URI want to resolve
     * @param {TinyHttpClient?} client - Tiny HTTP Instance
     * @return {URL}
     */
  static resolveUri(uri: string, client?: TinyHttpClient): URL {
    if (client && typeof client.clientOptions.baseURL === 'string' && client.clientOptions.baseURL.length) {
      return new URL(uri, client.clientOptions.baseURL);
    } else {
      if (!this.validateURL(uri)) throw new TypeError('Invalid URL');
      return new URL(uri);
    }
  }
}
