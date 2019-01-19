console.log('Now starting app...')
const Vue = require('vue/dist/vue.common.js')
const electronRemote = require('electron').remote
const { Menu, MenuItem, dialog } = electronRemote
import {Stats} from './stats';
import './rawReportsViewer'
import './topListViewer'
const nightStyleSheetClass = 'hwt-night'
const appComponent = {
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
            viewIndexRaws: 0,
            viewIndexTops: 1,
            darkUiEnabled: false,
        }
    },
    watch: {
        darkUiEnabled: function(value) {
            const body = document.getElementsByTagName('body')[0];
            if (value)
                body.classList.add(nightStyleSheetClass);
            else
                body.classList.remove(nightStyleSheetClass);
            localStorage.setItem('darkUiEnabled', '' + value);
        }
    },
    methods: {
        toggleDebugInfo: function() {
            this.debugInfoVisible = !this.debugInfoVisible;
        },
        openRepo: async function() {
            const files: string[] = dialog.showOpenDialog({properties: ['openDirectory']});
            if (files && files.length == 1) {
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
                alert(`Selected directories found: ${files.length}. Please select one directory.`);
            }
        },
        openBarsMenu: function() {
            const menu = new Menu();
            menu.append(new MenuItem({
                label: "Raw view", 
                click: () => { this.viewIndex = this.viewIndexRaws }
            }));
            menu.append(new MenuItem({
                label: "Top view", 
                click: () => { this.viewIndex = this.viewIndexTops }
            }));
            menu.popup({ window: electronRemote.getCurrentWindow() });
        },
    },
    created: function() {
        console.log('created')
        this.darkUiEnabled = localStorage.getItem('darkUiEnabled') == ''+true
    }
};
new Vue(appComponent);