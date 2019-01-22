import { durationToText } from './stats';
import { uiMixin } from './uiMixin';
const Vue = require('vue/dist/vue.common.js');
const fs = require('fs')
const component = {
    template: fs.readFileSync('./src/rawReportViewer.html').toString(),
    props: ['week'],
    data: function() {
        return {
            projectsPanelVisible: false,
            languagesPanelVisible: false,
        };
    },
    mixins: [uiMixin]
};
Vue.component('raw-report-viewer', component);