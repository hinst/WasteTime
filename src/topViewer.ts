{
    const fs = require('fs')
    const Vue = require('vue/dist/vue.common.js')

    const component = {
        template: fs.readFileSync('./src/toggleButton.html').toString(),
        props: ['stats'],
        data: function() {
            return {

            }
        }
    }
}