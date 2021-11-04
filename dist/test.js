"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
_1.tinyHttp.get('https://raznar.id').then((resp) => {
    console.log(resp.getContent());
});
