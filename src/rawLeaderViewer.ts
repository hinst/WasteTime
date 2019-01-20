import * as Vue from 'vue/dist/vue.common.js';
import * as fs from 'fs';
import { Stats } from './stats';

class RawLeaderViewer {
    propStats: Stats = null;
    template: string = fs.readFileSync('./src/rawLeaderViewer.html').toString();
}

class VueComponentObject {
    props: string[] = [];
    template: string;
}

function createVueComponent(proto: any) {
    const component = new VueComponentObject();
    for (let propKey in proto) {
        if (propKey.startsWith('prop')) {
            component.props.push(propKey);
        }
    }
    component.template = proto.template;
    return component;
}

const component = createVueComponent(new RawLeaderViewer());
console.log(component);
Vue.component('raw-leader-viewer', component);