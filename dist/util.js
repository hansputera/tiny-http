"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Util = void 0;
class Util {
    static parseProtocol(url) {
        if (!this.validateURL)
            return undefined;
        else {
            const protocol = new URL(url).protocol.slice(0, -1);
            return protocol;
        }
    }
    static validateURL(url) {
        try {
            new URL(url);
            return true;
        }
        catch (_a) {
            return false;
        }
    }
    static jsonDefault(json) {
        return json;
    }
    static resolveUri(uri, client) {
        if (typeof client.clientOptions.baseURL === 'string' && client.clientOptions.baseURL.length) {
            const url = new URL(uri, client.clientOptions.baseURL);
            return url.href;
        }
        else {
            if (!this.validateURL(uri))
                throw new TypeError('Invalid URL');
            const url = new URL(uri);
            return url.href;
        }
    }
}
exports.Util = Util;
