import { durationToText } from './stats'
import { uiMixin } from './uiMixin';
import { Toggler } from './toggler';
const Vue = require('vue/dist/vue.common.js')
const fs = require('fs')
const component = {
    template: fs.readFileSync('./src/rawReportViewer.html').toString(),
    props: ['week'],
    data: function() {
        return {
            projectsPanelVisible: false,
            languagesPanelVisible: false,
        }
    },
    methods: {
        hideSubPanel() {
            this.projectsPanelVisible = false;
        },
        toggleProjectsPanel(visible) {
            this.projectsPanelVisible = visible;
        },
        toggleLanguagesPanel(visible) {
            this.languagesPanelVisible = visible;
        }
    },
    mixins: [uiMixin]
}
Vue.component('raw-report-viewer', component)