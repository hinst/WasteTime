console.log('Now starting app...')
const Vue = require('vue/dist/vue.common.js')
const electronRemote = require('electron').remote
const { Menu, MenuItem, dialog } = electronRemote
import {Stats} from './stats';
import './rawReportsViewer'
const component = {
    el: '#app',
    data: function() {
        return {
            nodeVersion: process.versions.node,
            chromeVersion: process.versions['chrome'],
            electronVersion: process.versions['electron'],
            debugInfoVisible: false,

            loading: false,
            stats: null as Stats,
            viewIndex: 0,
            viewIndexStats: 0,
        }
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
        openBarsMenu: function() {
            const menu = new Menu();
            menu.append(new MenuItem({
                label: "Raw view", 
                click: () => { this.viewIndex = 0 }
            }));
            menu.append(new MenuItem({
                label: "Top view", 
                click: () => { this.viewIndex = 1 }
            }));
            menu.popup({ window: electronRemote.getCurrentWindow() });
        }
    }
};
new Vue(component);