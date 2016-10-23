import Vue from "vue";
import Widget from "src/components/Widget";
import WeatherService from "src/services/weather";

describe("Widget.vue", () => {
  let weatherInfo = {
    dt: 1477135325,
    name: "Rogans Hill",
    weather: [{ id: 800 }],
    main: { temp: 12.08, humidity: 96 },
    wind: { speed: 4.85, deg: 232.501 },
    sys: { sunrise: 1477076745, sunset: 1477124121 }
  };
  let props = { title: "test widget", unit: "metric", showWind: "false" };
  let propsWind = { title: "test widget", unit: "metric", showWind: "true" };
  let serviceStub;

  beforeEach(() => {
    sinon.stub(WeatherService, "getWeatherInfo");
    serviceStub = WeatherService.getWeatherInfo;
  });

  afterEach(() => serviceStub.restore());

  it("should initialise widget correctly", () => {
    let promise = Promise.resolve();
    serviceStub.returns(promise);
    let vm = render(props);
    expect(vm.title).to.equal(props.title);
    expect(vm.unit).to.equal(props.unit);
    expect(vm.showWind).to.equal(props.showWind);
    expect(vm.info).to.equal(null);
    expect(vm.error).to.equal(null);
    expect(vm.state).to.equal("fetching");
    expect(text(vm, ".widget_header")).to.equal(props.title);
    expect(text(vm, ".widget_content")).to.equal("Fetching weather info...");
  });

  it("should show weather info once loaded", (done) => {
    let promise = Promise.resolve(weatherInfo);
    serviceStub.returns(promise);
    let vm = render(props);
    assertLater(promise, () => {
      expect(text(vm, ".widget_city")).to.equal("Rogans Hill");
      expect(text(vm, "[data-test-humidity]")).to.equal("Humidity: 96%");
      expect(text(vm, "[data-test-sunrise]")).to.equal("Sun rise: 6:05");
      expect(text(vm, "[data-test-sunset]")).to.equal("Sun set: 19:15");
      done();
    });
  });

  it("should not show wind when showWind is false", (done) => {
    let promise = Promise.resolve(weatherInfo);
    serviceStub.returns(promise);
    let vm = render(props);
    assertLater(promise, () => {
      expect(element(vm, "[data-test-wind]")).to.equal(null);
      done();
    });
  });

  it("should show wind when showWind is true", (done) => {
    let promise = Promise.resolve(weatherInfo);
    serviceStub.returns(promise);
    let vm = render(propsWind);
    assertLater(promise, () => {
      expect(text(vm, "[data-test-wind]")).to.equal("Wind: 4.85 meter/sec");
      done();
    });
  });

  it("should show wind in miles/hour when unit is imperial", (done) => {
    let promise = Promise.resolve(weatherInfo);
    serviceStub.returns(promise);
    let vm = render(Object.assign(propsWind, { unit: "imperial" }));
    assertLater(promise, () => {
      expect(text(vm, "[data-test-wind]")).to.equal("Wind: 4.85 miles/hour");
      done();
    });
  });

  it("shows error when failed to get weather info", (done) => {
    let promise = Promise.reject("test error");
    WeatherService.getWeatherInfo.returns(promise);
    let vm = render(props);
    assertLater(promise, () => {
      expect(vm.state).to.equal("error");
      expect(text(vm, ".widget_content")).to.equal("test error");
      done();
    });
  });

});

// looks like Vue.nextTick happens before promise is fulfilled
// so have to wait until promise is fulfilled and then check in nextTick
function assertLater(promise, assertions) {
  let cb = () => {
    Vue.nextTick(() => {
      // another tick for DOM update
      Vue.nextTick(() => {
        assertions();
      });
    });
  };
  return promise.then(cb, cb);
}

function render(propsData) {
  const Ctor = Vue.extend(Widget);
  return new Ctor({ propsData }).$mount()
}

function text(vm, selector) {
  return element(vm, selector).textContent;
}

function element(vm, selector) {
  return vm.$el.querySelector(selector);
}
