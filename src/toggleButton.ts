const fs = require('fs')
const Vue = require('vue/dist/vue.common.js')

export const toggleButton = {
    template: fs.readFileSync('./src/toggleButton.html').toString(),
    props: ['title'],
    data: function() {
        return {
            enabled: false
        }
    },
    computed: {
        marker: function() {
            return this.enabled ? '▼' : '▶';
        }
    },
    methods: {
        receiveClick: function() {
            this.enabled = !this.enabled;
            this.$emit('toggled', this.enabled);
        }
    }
}
Vue.component('toggle-button', toggleButton);