"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tinyHttp = exports.TinyHttpClient = exports.getPureRequest = exports.Response = void 0;
const http = __importStar(require("node:http"));
const https = __importStar(require("node:https"));
const node_stream_1 = require("node:stream");
const util_1 = require("./util");
class Response {
    constructor(res) {
        this.res = res;
        this.data = Buffer.alloc(0);
        this.stream = new node_stream_1.PassThrough();
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
exports.Response = Response;
const getPureRequest = (url, options = util_1.Util.jsonDefault({
    headers: {},
    method: 'GET',
}), handleResponse) => {
    const protocol = util_1.Util.parseProtocol(url);
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
exports.getPureRequest = getPureRequest;
class TinyHttpClient {
    constructor(clientOptions) {
        this.clientOptions = clientOptions;
    }
    get(url, opts) {
        var _a;
        if (opts === void 0) { opts = util_1.Util.jsonDefault({
            method: 'GET',
            headers: (_a = this.clientOptions.headers) !== null && _a !== void 0 ? _a : {},
        }); }
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                if (url.startsWith('/'))
                    throw new TypeError('URL must-not start with slash');
                const completeUrl = util_1.Util.resolveUri(url, this);
                (0, exports.getPureRequest)(completeUrl, opts, (res) => this.handleMessage(res, resolve, reject));
            });
        });
    }
    post(url, body, opts) {
        var _a;
        if (opts === void 0) { opts = util_1.Util.jsonDefault({
            method: 'POST',
            headers: (_a = this.clientOptions.headers) !== null && _a !== void 0 ? _a : {},
        }); }
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                if (url.startsWith('/'))
                    throw new TypeError('URL must-not start with slash');
                const completeUrl = util_1.Util.resolveUri(url, this);
                const postOpts = Object.assign(Object.assign({}, opts), { json: typeof body === 'object' ? body : undefined, content: typeof body === 'string' ? body : undefined, method: 'POST' });
                (0, exports.getPureRequest)(completeUrl, postOpts, (res) => this.handleMessage(res, resolve, reject));
            });
        });
    }
    delete(url, opts) {
        var _a;
        if (opts === void 0) { opts = util_1.Util.jsonDefault({
            headers: (_a = this.clientOptions.headers) !== null && _a !== void 0 ? _a : {},
            method: 'DELETE',
        }); }
        return this.get(url, Object.assign(Object.assign({}, opts), { method: 'DELETE' }));
    }
    put(url, body, opts) {
        var _a;
        if (opts === void 0) { opts = util_1.Util.jsonDefault({
            method: 'PUT',
            headers: (_a = this.clientOptions.headers) !== null && _a !== void 0 ? _a : {},
        }); }
        return this.post(url, body, Object.assign(Object.assign({}, opts), { method: 'PUT' }));
    }
    options(url, opts) {
        var _a;
        if (opts === void 0) { opts = util_1.Util.jsonDefault({
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
exports.TinyHttpClient = TinyHttpClient;
exports.tinyHttp = new TinyHttpClient({
    baseURL: '',
});
