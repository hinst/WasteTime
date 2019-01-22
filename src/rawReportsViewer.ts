import { uiMixin } from './uiMixin';
import './toggleButton';
import './rawReportViewer';
import { Stats } from './stats';
const Vue = require('vue/dist/vue.common.js');
const fs = require('fs');

const component = {
    template: fs.readFileSync('./src/rawReportsViewer.html').toString(),
    props: ['stats'],
    data: function() {
        return {};
    },
    computed: {
        filledReportCount() {
            const stats: Stats = this.stats;
            let filledCount = 0;
            stats.weeks.forEach(week => {
                if (week.totalDuration > 0)
                    ++filledCount;
            });
            return filledCount;
        }
    },
    mixins: [uiMixin]
};
Vue.component('raw-reports-viewer', component);