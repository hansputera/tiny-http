"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowRedirect = void 0;
const _1 = require(".");
const errors_1 = require("./errors");
class FollowRedirect {
    constructor(client) {
        this.client = client;
        this.maxRedirects = 5;
        this.currentRedirects = 0;
        this._responses = [];
    }
    handle(resolveFunc, rejectFunc, opts, res) {
        const statusCode = res.statusCode || 200;
        if (this.currentRedirects >= this.maxRedirects)
            throw errors_1.tooManyRedirectsError;
        else if (statusCode > 300 && statusCode < 309 && this.currentRedirects <= this.maxRedirects && res.headers.location) {
            this.currentRedirects += 1;
            this.redirectFunc(resolveFunc, rejectFunc, opts, res.headers['location']);
        }
        else {
            this.dontRedirectFunc(resolveFunc, rejectFunc, res, opts.stream);
        }
    }
    redirectFunc(resolveFunc, rejectFunc, opts, newUrl) {
        if (newUrl.startsWith('/')) {
            this.client.get(newUrl, opts).then((res) => {
                resolveFunc(res);
            }).catch((err) => rejectFunc(err));
        }
        else {
            _1.tinyHttp.get(newUrl, opts).then((res) => {
                resolveFunc(res);
            }).catch((err) => rejectFunc(err));
        }
    }
    dontRedirectFunc(resolveFunc, rejectFunc, res, stream = false) {
        this.client._handle(this.pureReq, res, resolveFunc, rejectFunc, stream);
    }
    getResponses() {
        return this._responses;
    }
    getCurrentRedirects() {
        return this.currentRedirects;
    }
    setMaxRedirects(redirects = 5) {
        this.maxRedirects = redirects;
        return this;
    }
    setPureRequest(req) {
        this.pureReq = req;
        return this;
    }
}
exports.FollowRedirect = FollowRedirect;
