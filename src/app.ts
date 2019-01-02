console.log('Now starting app...')
const Vue = require('vue/dist/vue.common.js')
const { dialog } = require('electron').remote
import {Stats} from './stats';
import './rawReportsViewer'
const appObject = {
    el: '#app',
    data: {
        nodeVersion: process.versions.node,
        chromeVersion: process.versions['chrome'],
        electronVersion: process.versions['electron'],
        debugInfoVisible: false,

        loading: false,
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
                const stats = new Stats();
                this.loading = true;
                try {
                    await stats.loadDir(directory);
                    this.stats = stats;
                } finally {
                    this.loading = false;
                }
            } else {
                alert('You need to select one directory');
            }
        },
        openRepoHistory: function() {
        }
    }
};
const app = new Vue(appObject);