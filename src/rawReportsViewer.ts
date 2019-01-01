import { durationToText } from './stats'
import { uiMixin } from './uiMixin';
import './toggleButton'
const Vue = require('vue/dist/vue.common.js')
const fs = require('fs')
const component = {
    template: fs.readFileSync('./src/rawReportViewer.html').toString(),
    props: ['stats'],
    data: function() {
        return {
            projectsVisible: false,
        }
    },
    computed: {
        totalDuration: function() {
            return durationToText(this.stats.totalDuration);
        }
    },
    mixins: [uiMixin]
}
Vue.component('raw-report-viewer', component);