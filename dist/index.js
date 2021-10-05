var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as http from 'node:http';
import * as https from 'node:https';
import { PassThrough } from 'node:stream';
import { Util } from './util';
export class Response {
    constructor(res) {
        this.res = res;
        this.data = Buffer.alloc(0);
        this.stream = new PassThrough();
    }
    addData(data) {
        this.data = Buffer.concat([this.data, data]);
    }
    getData() {
        return this.data;
    }
    getContent(encoding = 'utf8') {
        return this.data.toString(encoding);
    }
    getJSON() {
        return __awaiter(this, void 0, void 0, function* () {
            return JSON.parse(this.getContent());
        });
    }
    getHeaders() {
        return this.res.headers;
    }
    get isOk() {
        return this.res.statusCode ? this.res.statusCode >= 200 && this.res.statusCode < 300 : false;
    }
    get statusMessage() {
        return this.statusMessage;
    }
    get statusCode() {
        return this.statusCode;
    }
    get url() {
        return this.res.url || '';
    }
}
export const getPureRequest = (url, options = Util.jsonDefault({
    headers: {},
    method: 'GET',
}), handleResponse) => {
    const protocol = Util.parseProtocol(url);
    if (!protocol)
        throw new TypeError('Invalid URL');
    if (typeof options.json === 'object')
        options.headers = Object.assign(Object.assign({}, options.headers), { 'Content-Type': 'application/json' });
    const request = protocol.toLowerCase() === 'http'
        ? http.request(url, Object.assign({}, options), handleResponse && handleResponse) : https.request(url, Object.assign({}, options), handleResponse && handleResponse);
    if (typeof options.json === 'object')
        request.write(JSON.stringify(options.json));
    else if (typeof options.content === 'string')
        request.write(options.content);
    request.end();
    return request;
};
export class TinyHttpClient {
    constructor(clientOptions) {
        this.clientOptions = clientOptions;
    }
    get(url, opts) {
        var _a;
        if (opts === void 0) { opts = Util.jsonDefault({
            method: 'GET',
            headers: (_a = this.clientOptions.headers) !== null && _a !== void 0 ? _a : {},
        }); }
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                if (url.startsWith('/'))
                    throw new TypeError('URL must-not start with slash');
                const completeUrl = Util.resolveUri(url, this);
                getPureRequest(completeUrl, opts, (res) => this.handleMessage(res, resolve, reject));
            });
        });
    }
    post(url, body, opts) {
        var _a;
        if (opts === void 0) { opts = Util.jsonDefault({
            method: 'POST',
            headers: (_a = this.clientOptions.headers) !== null && _a !== void 0 ? _a : {},
        }); }
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                if (url.startsWith('/'))
                    throw new TypeError('URL must-not start with slash');
                const completeUrl = Util.resolveUri(url, this);
                const postOpts = Object.assign(Object.assign({}, opts), { json: typeof body === 'object' ? body : undefined, content: typeof body === 'string' ? body : undefined, method: 'POST' });
                getPureRequest(completeUrl, postOpts, (res) => this.handleMessage(res, resolve, reject));
            });
        });
    }
    delete(url, opts) {
        var _a;
        if (opts === void 0) { opts = Util.jsonDefault({
            headers: (_a = this.clientOptions.headers) !== null && _a !== void 0 ? _a : {},
            method: 'DELETE',
        }); }
        return this.get(url, Object.assign(Object.assign({}, opts), { method: 'DELETE' }));
    }
    put(url, body, opts) {
        var _a;
        if (opts === void 0) { opts = Util.jsonDefault({
            method: 'PUT',
            headers: (_a = this.clientOptions.headers) !== null && _a !== void 0 ? _a : {},
        }); }
        return this.post(url, body, Object.assign(Object.assign({}, opts), { method: 'PUT' }));
    }
    options(url, opts) {
        var _a;
        if (opts === void 0) { opts = Util.jsonDefault({
            method: 'OPTIONS',
            headers: (_a = this.clientOptions.headers) !== null && _a !== void 0 ? _a : {},
        }); }
        return this.get(url, Object.assign(Object.assign({}, opts), { method: 'OPTIONS' }));
    }
    handleMessage(res, resolveFunc, rejectFunc) {
        const response = new Response(res);
        res.on('data', (chunk) => {
            response.addData(Buffer.from(chunk));
            response.stream.push(Buffer.from(chunk));
        });
        res.on('close', () => {
            resolveFunc(response);
        });
        res.on('error', (err) => rejectFunc(err));
    }
}
export const tinyHttp = new TinyHttpClient({
    baseURL: '',
});
