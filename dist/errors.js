"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tooManyRedirectsError = exports.timeoutError = void 0;
exports.timeoutError = new Error('TIMEOUT_EXCEEDED');
exports.tooManyRedirectsError = new Error('TOO_MANY_REDIRECTS');
