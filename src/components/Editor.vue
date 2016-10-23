<template>
  <section class="editor">
    <form @submit="save">
      <legend>Create a new widget:</legend>
      <label class="editor_form-control">
        Title: <input class="editor_input-title" type="text" placeholder="widget title" v-model.trim="widget.title" required>
      </label>
      <label class="editor_form-control">
        Unit:
        <input type="radio" v-model="widget.unit" value="metric"> Metric
        <input type="radio" v-model="widget.unit" value="imperial"> Imperial
      </label>
      <label class="editor_form-control">
        Show wind: <input class="editor_wind-toggle" type="checkbox" v-model="widget.showWind">
      </label>
      <input class="editor_form-control" type="submit" value="Save">
    </form>

    <table class="editor_table">
      <thead>
        <tr>
          <th class="editor_cell">Title</th>
          <th class="editor_cell">Usage</th>
        </tr>
      </thead>
      <tbody data-test-widgets v-if="widgets.length">
        <tr v-for="w in widgets" :key="w.id">
          <td class="editor_cell">{{w.title}}</td>
          <td class="editor_cell">{{w.usage}}</td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr>
          <td colspan="2" class="editor_cell">No widgets, use the above form to create one.</td>
        </tr>
      </tbody>
    </table>

    <div class="editor_instruction">
      To embed a widget:
      <ul class="editor_steps">
        <li>add &lt;script src=&quot;/widget.js&quot;&gt;&lt;/script&gt; to the page once</li>
        <li>add once or more widget to the page by copying the usage</li>
      </ul>
    </div>
  </section>
</template>

<script>
export default {
  name: "owm-editor",
  data() {
    return {
      widgets: [],
      widget: defaultWidget(),
    };
  },
  methods: {
    save(event) {
      event.preventDefault();
      if (this.widget.id === null) {
        this.widget.id = this.widgets.length;
      }
      this.widget.usage = getUsage(this.widget);
      this.widgets.push(this.widget);
      this.widget = defaultWidget();
    }
  }
}

/* private helpers */
function defaultWidget() {
  return { id: null, title: "", unit: "metric", showWind: false, usage: null }
}

function getUsage({title, unit, showWind}) {
  return `<div owm-widget title="${title}" unit="${unit}" show-wind="${!!showWind}"></div>`;
}
</script>

<style>
.editor {
  padding-left: .5rem;
}

.editor_form-control {
  display: block;
  margin-top: 1rem;
}

.editor_input-title {
  padding: .25rem;
  min-width: 10rem;
  vertical-align: middle;
}

.editor_wind-toggle {
  vertical-align: bottom;
}

.editor_instruction {
  margin-top: 1rem;
  font-style: italic;
}

.editor_steps {
  margin: 0;
}

.editor_table {
  margin-top: 2rem;
}

.editor_cell {
  padding: .5rem .5rem .5rem 0;
  text-align: left;
}
</style>
