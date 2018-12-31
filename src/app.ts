console.log('Now starting app...')
const Vue = require('vue/dist/vue.common.js')
const app = new Vue({
    el: '#app',
    data: {
        nodeVersion: process.versions.node,
        chromeVersion: process.versions['chrome'],
        electronVersion: process.versions['electron'],
        debugInfoVisible: false,
    },
    methods: {
        toggleDebugInfo: function() {
            this.debugInfoVisible = !this.debugInfoVisible;
        }
    }
})