"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
_1.tinyHttp.get('https://rr5---sn-npoe7n7r.googlevideo.com/videoplayback?expire=1635627556&ei=pEF9YfZ6i7GSBq_0hKgL&ip=2a04:3543:1000:2310:30da:13ff:fead:6be6&id=fed381736f122efb&itag=18&source=blogger&mh=Up&mm=31&mn=sn-npoe7n7r&ms=au&mv=m&mvi=5&pl=32&susc=bl&mime=video/mp4&vprv=1&dur=1434.459&lmt=1628417619112876&mt=1635598375&txp=1311224&sparams=expire,ei,ip,id,itag,source,susc,mime,vprv,dur,lmt&sig=AOq0QJ8wRgIhAI5CdA7oacRJk6HFfZk57SdfYTRvc7D-DzXtZSFQI6wyAiEAjm8qsxBnwCq1kDwJhrje051Uq-r7VB9_Puck4eWDUBE%3D&lsparams=mh,mm,mn,ms,mv,mvi,pl&lsig=AG3C_xAwRgIhAM8fL4naTkCdYx_z4m_Jiwh1Y031Zo3UEiADHQIe0PSpAiEA4E9sv-0G_hePPtwwsd9ELhBybF2x2wmIm81vZnByzgs%3D')
    .then((resp) => {
    resp.stream.on('data', (ch) => {
        console.log('masuk:', new Blob([ch]).size);
    });
});
