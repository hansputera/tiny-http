# My Tiny HTTP Client

Simple HTTP Client built with zero dependency.

### Installation
> npm install hanif-tiny-http --only=prod

> yarn add hanif-tiny-http --production

### Basic usage

ES

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

### Stream Usage

Do you want to download a video or something with streaming mode?
Well, that's probably here.

Simply enter 'stream' in the request option, fill it with a boolean value.

**Example:**

```ts
client.get('https://somesite.com', { stream: true }).then((response) => {
    response.stream; // use it.
});
```

Also, if you want get download progress that's possible here.
> `onDownload` won't work without stream mode.

```ts
client.get('https://somesite.com', { stream: true }).then((response) => {
    response.onDownload((totalBytes, downloadedBytes) => {
        // stuff..
    });
});
```

**What's difference?**

If the stream option is enabled, you'll receive a response class instantly without having the response content load perfectly.

If the stream option is disabled, you'll need to wait until the response content loads correctly.

### Contribution
You are welcome to contribute this package.
~~if you want~~

### Note
This package is intended for personal use.
