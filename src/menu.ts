import * as Vue from 'vue/dist/vue.common.js';
import * as fs from 'fs';

export class MenuItem {
    title: string;
    id: any;
    onClick: Function;
}
export class Menu {
    template: String = fs.readFileSync('./src/menu.html').toString();
    propItems: MenuItem[] = [];
}