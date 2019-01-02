const fs = require('fs')
const Vue = require('vue/dist/vue.common.js')
import {uiMixin} from './uiMixin'

export const topListViewer = {
    template: fs.readFileSync('./src/topListViewer.html').toString(),
    mixins: [uiMixin],
    props: ['stats'],
    data: function() {
        return {
            rows: []
        }
    },
    created: function() {
        console.log('topListViewer created')
        this.rows = this.stats.getTopProjects()
    }
}
Vue.component('top-list-viewer', topListViewer)
