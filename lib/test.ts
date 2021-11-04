import { tinyHttp } from '.';

tinyHttp.get('https://raznar.id').then((resp) => {
    console.log(resp.getContent());
});