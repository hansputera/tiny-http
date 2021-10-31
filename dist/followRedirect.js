"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowRedirect = void 0;
const errors_1 = require("./errors");
class FollowRedirect {
    constructor(res, shouldTryFunc, dontRedirectFunc) {
        this.res = res;
        this.shouldTryFunc = shouldTryFunc;
        this.dontRedirectFunc = dontRedirectFunc;
        this.maxRedirects = 5;
        this.currentRedirects = 0;
        this._responses = [];
        this.handle(res);
    }
    handle(res) {
        const statusCode = res.getStatusCode();
        console.log(this.currentRedirects);
        if (this.currentRedirects >= this.maxRedirects)
            throw errors_1.tooManyRedirectsError;
        if (statusCode > 300 && statusCode < 303 && this.currentRedirects <= this.maxRedirects) {
            this.currentRedirects += 1;
            console.log(this.res.getHeaders());
            this.shouldTryFunc(this.res.getHeaders()['location']);
        }
        else {
            this.dontRedirectFunc();
        }
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
}
exports.FollowRedirect = FollowRedirect;
