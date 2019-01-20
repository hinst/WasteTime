import * as Vue from 'vue/dist/vue.common.js';
import * as fs from 'fs';
import { Stats } from './stats';
import { createVueComponent } from './vueClass';

class RawLeaderViewer {
    propStats: Stats = null;
    template: string = fs.readFileSync('./src/rawLeaderViewer.html').toString();
    test() {
    }
    created() {
        if (false) console.log('created: RawLeaderViewer', this.propStats);
    }
}
const component = createVueComponent(new RawLeaderViewer());
Vue.component('raw-leader-viewer', component);