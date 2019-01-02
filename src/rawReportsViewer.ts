import { uiMixin } from './uiMixin';
import './toggleButton'
import './rawReportViewer'
const Vue = require('vue/dist/vue.common.js')
const fs = require('fs')
const component = {
    template: fs.readFileSync('./src/rawReportsViewer.html').toString(),
    props: ['stats'],
    data: function() {
        return {}
    },
    computed: {
    },
    mixins: [uiMixin]
}
Vue.component('raw-reports-viewer', component);