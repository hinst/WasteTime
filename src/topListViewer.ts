const fs = require('fs');
const Vue = require('vue/dist/vue.common.js');
import {uiMixin} from './uiMixin';

export const topListViewer = {
    template: fs.readFileSync('./src/topListViewer.html').toString(),
    mixins: [uiMixin],
    props: ['stats'],
    data: function() {
        return {
            rows: [],
            currentDayType: false,
            currentDayType24: false,
            currentDayType8: true,
        };
    },
    created: function() {
        console.log('topListViewer created');
        this.rows = this.stats.getTopProjects();
    },
    methods: {
        changeCurrentDayType() {
            this.currentDayType = !this.currentDayType;
        }
    },
    computed: {
        currentDayTypeAsString() {
            return this.currentDayType ? "8h day" : "24h day";
        }
    }
};
Vue.component('top-list-viewer', topListViewer);
