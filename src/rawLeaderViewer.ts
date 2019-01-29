import * as Vue from 'vue/dist/vue.common.js';
import * as fs from 'fs';
import { Stats } from './stats';
import { createVueComponent } from './vueClass';
import './rawLeaderViewerItem';

class RawLeaderViewer {
    template: string = fs.readFileSync('./src/rawLeaderViewer.html').toString();
    propStats: Stats = null;
}
const component = createVueComponent(new RawLeaderViewer());
Vue.component('raw-leader-viewer', component);