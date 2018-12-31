console.log('Now starting app...')
const Vue = require('vue/dist/vue.common.js')
const { dialog } = require('electron').remote
const appObject = {
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
        },
        openRepo: function() {
            console.log(dialog.showOpenDialog({properties: ['openDirectory']}));
        },
        openRepoHistory: function() {
        }    
    }
};
const app = new Vue(appObject);