import Vue from "vue";
import Editor from "src/components/Editor";

describe("Editor.vue", () => {

  it("should render a form in default state", () => {
    const vm = render();
    expect(element(vm, ".editor_input-title").value).to.equal("");
    expect(element(vm, "input[type='radio']:checked").value).to.equal("metric");
    expect(element(vm, "input[type='checkbox']").checked).to.equal(false);
  });

  it("should render am empty table with a new widgets message", () => {
    const vm = render();
    expect(element(vm, "[data-test-widgets]")).to.equal(null);
    expect(element(vm, "[colspan='2']").textContent)
      .to.equal("No widgets, use the above form to create one.");
  });

  it("should render widget usage instruction", () => {
    const vm = render();
    expect(element(vm, ".editor_instruction")).to.not.equal(null);
  });

  it("should show created widgets in a list", (done) => {
    const vm = render();
    vm.widget.title = "Test title";
    vm.widget.unit = "imperial";
    vm.widget.showWind = true;
    vm.save({ preventDefault() {} });

    Vue.nextTick(() => {
      let cells = elements(vm, "[data-test-widgets] .editor_cell");
      expect(cells.map(c => c.textContent)).to.eql([
        "Test title",
        '<div owm-widget title="Test title" unit="imperial" show-wind="true"></div>'
      ]);
      expect(element(vm, "[colspan='2']")).to.equal(null);
      done();
    });
  });

});

function render() {
  const Ctor = Vue.extend(Editor);
  return new Ctor().$mount()
  // return new Vue({
  //   el: document.createElement("div"),
  //   render: (h) => h(Editor)
  // });
}

function element(vm, selector) {
  return vm.$el.querySelector(selector);
}

function elements(vm, selector) {
  return Array.from(vm.$el.querySelectorAll(selector));
}
