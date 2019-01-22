import * as Vue from 'vue/dist/vue.common.js';
import * as fs from 'fs';
import { LeaderboardWeekInfo } from "./stats";
import { createVueComponent } from './vueClass';
import { uiMixin } from './uiMixin';

class RawLeaderViewerItem {
    template: string = fs.readFileSync('./src/rawLeaderViewerItem.html').toString();
    propItem: LeaderboardWeekInfo = null;
    dataLeaderListVisible = false;
    mixins = [uiMixin];
}
Vue.component('raw-leader-viewer-item', createVueComponent(new RawLeaderViewerItem()));