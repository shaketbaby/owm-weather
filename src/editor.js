import Vue from 'vue'
import Editor from './components/editor'

new Vue({
  el: "main[owm-editor-app]",
  template: "<owm-editor></owm-editor>",
  components: { "owm-editor": Editor }
})
