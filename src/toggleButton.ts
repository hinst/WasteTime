const fs = require('fs');
const Vue = require('vue/dist/vue.common.js');

export const toggleButton = {
    template: fs.readFileSync('./src/toggleButton.html').toString(),
    props: ['title', 'value'],
    data: function() {
        return {
            enabled: false
        };
    },
    computed: {
        marker: function() {
            return this.enabled ? '▼' : '▶';
        }
    },
    methods: {
        receiveClick: function() {
            this.enabled = !this.enabled;
            this.$emit('input', this.enabled);
        }
    },
    created() {
        this.enabled = this.value;
    }
};
Vue.component('toggle-button', toggleButton);