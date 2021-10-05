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
			const protocol = new URL(url).protocol.slice(0, -1);
			return protocol;
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
     * @param uri - An URI want to resolve
     * @param client - Tiny HTTP Instance
     */
	static resolveUri(uri: string, client: TinyHttpClient): string {
		if (typeof client.clientOptions.baseURL === 'string' && client.clientOptions.baseURL.length) {
			const url = new URL(uri, client.clientOptions.baseURL);
			return url.href;
		} else {
			if (!this.validateURL(uri)) throw new TypeError('Invalid URL');
			const url = new URL(uri);
			return url.href;
		}
	}
}