import 'whatwg-fetch';
import Vue from 'vue'
import Widget from './components/Widget'

// load once on page load
document.addEventListener("DOMContentLoaded", loadWidgets);
// check if more widgets are added dynamically, could use MutationObserver
window.setInterval(loadWidgets, 3000);

function loadWidgets() {
  Array.from(document.querySelectorAll("[owm-widget]")).forEach(load);
}

function load(widget) {
  let attr = name => widget.getAttribute(name);
  new Vue({
    el: widget,
    components: { "owm-widget": Widget },
    template: `
      <owm-widget title="${attr('title')}" unit="${attr('unit')}" show-wind="${attr('show-wind')}">
      </owm-widget>
    `,
  })
}

