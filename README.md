# My Tiny HTTP Client

Simple HTTP Client built with zero dependency.

### Installation
> npm install hanif-tiny-http

> yarn add hanif-tiny-http

### Basic usage

ES6

```typescript
import { TinyHttpClient } from "hanif-tiny-http";

const client = new TinyHttpClient({
    baseURL: "https://hastebin.com"
});

interface HastebinOut {
    key: string;
}

client.post("documents", "hello-world").then((response) => {
    response.getJSON<HastebinOut>().then((json) => {
        console.log(json.key);
    });
});
```

CJS

```javascript
const { TinyHttpClient } = require("hanif-tiny-http");

const client = new TinyHttpClient({
    baseURL: "https://hastebin.com"
});

client.post("documents", "hello-world").then((response) => {
    response.getJSON().then((json) => {
        console.log(json.key);
    });
});
```

### Note
This package is intended for personal use.
