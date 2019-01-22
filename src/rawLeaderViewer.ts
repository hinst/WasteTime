import * as Vue from 'vue/dist/vue.common.js';
import * as fs from 'fs';
import { Stats } from './stats';
import { createVueComponent } from './vueClass';
import './rawLeaderViewerItem';

class RawLeaderViewer {
    propStats: Stats = null;
    template: string = fs.readFileSync('./src/rawLeaderViewer.html').toString();
}
const component = createVueComponent(new RawLeaderViewer());
Vue.component('raw-leader-viewer', component);