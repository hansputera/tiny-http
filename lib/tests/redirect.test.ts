import { tinyHttp } from "..";

describe('Redirect', () => {
    it('should redirected', (dn) => {
        tinyHttp.get('https://rr5---sn-npoeens7.googlevideo.com/videoplayback?expire=1635580185&ei=mYh8Ye7TLuK_n88Pq4CvwAg&ip=2a04:3543:1000:2310:30da:13ff:fead:6be6&id=fed381736f122efb&itag=18&source=blogger&mh=Up&mm=31&mn=sn-npoeens7&ms=au&mv=m&mvi=5&pl=32&susc=bl&mime=video/mp4&vprv=1&dur=1434.459&lmt=1628417619112876&mt=1635551088&txp=1311224&sparams=expire,ei,ip,id,itag,source,susc,mime,vprv,dur,lmt&sig=AOq0QJ8wRAIgDbqelKQQKslDk7NzWwOrIV-gVmilyEwsGl5hGv7m8sYCIGvsz0AetoaX3PArp1RvRlx1xGEjUCqfrt7IsSHZVNzZ&lsparams=mh,mm,mn,ms,mv,mvi,pl&lsig=AG3C_xAwRgIhAPyZ45qvfRdyl5-6Ahc-kOv276dL5bu9Rt06DgMIo2uwAiEAoym8ST6ZbPOCWTaMFGb9WdX9oSRm_VZQSj7AgI9StcU%3D')
        .then((response) => {
            dn();
        }).catch((e) => dn(e));
    });
});