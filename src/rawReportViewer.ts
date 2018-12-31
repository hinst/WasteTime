import { durationToText } from './stats'
const Vue = require('vue/dist/vue.common.js')
const fs = require('fs')
const component = {
    template: fs.readFileSync('./src/rawReportViewer.html').toString(),
    props: ['stats'],
    computed: {
        totalDuration: function() {
            return durationToText(this.stats.totalDuration);
        }
    }
}
Vue.component('raw-report-viewer', component);