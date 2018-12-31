console.log('Now starting app...')
const Vue = require('vue/dist/vue.common.js')
const { dialog } = require('electron').remote
import {Stats} from './stats';
import './rawReportViewer'
const appObject = {
    el: '#app',
    data: {
        nodeVersion: process.versions.node,
        chromeVersion: process.versions['chrome'],
        electronVersion: process.versions['electron'],
        debugInfoVisible: false,

        stats: null as Stats,
    },
    methods: {
        toggleDebugInfo: function() {
            this.debugInfoVisible = !this.debugInfoVisible;
        },
        openRepo: async function() {
            const files: string[] = dialog.showOpenDialog({properties: ['openDirectory']});
            if (files.length == 1) {
                const directory = files[0];
                console.log('loading', directory);
                const stats = new Stats();
                await stats.loadDir(directory);
                this.stats = stats;
            } else {
                alert('You need to select one directory');
            }
        },
        openRepoHistory: function() {
        }
    }
};
const app = new Vue(appObject);