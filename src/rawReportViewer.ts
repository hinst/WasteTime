const Vue = require('vue/dist/vue.common.js')
const fs = require('fs')
const component = {
    template: fs.readFileSync('./src/rawReportViewer.html').toString(),
    props: ['weeks']
}
Vue.component('raw-report-viewer', component);