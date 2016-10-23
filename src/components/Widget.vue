<template>
  <section class="widget">
    <header class="widget_header">{{title}}</header>

    <div class="widget_content" v-if="state === 'fetching'">Fetching weather info...</div>
    <div class="widget_content" v-if="state === 'error'">{{this.errorMessage}}</div>
    <div class="widget_content" v-if="state === 'fetched'">
      <div>
        <div class="widget_city">{{info.name}}</div>
        <div v-if="showWind === 'true'">
          <i class="wi wi-wind" :class="windIcon"></i>
          <span data-test-wind>Wind: 4.85 {{windUnit}}</span>
        </div>
        <div>
          <i class="wi wi-humidity"></i>
          <span data-test-humidity>Humidity: {{info.main.humidity}}%</span>
        </div>
        <div>
          <i class="wi -sun wi-sunrise"></i>
          <span data-test-sunrise>Sun rise: {{time(info.sys.sunrise)}}</span>
        </div>
        <div>
          <i class="wi -sun wi-sunset"></i>
          <span data-test-sunset>Sun set: {{time(info.sys.sunset)}}</span>
        </div>
      </div>
      <div class="widget_icon-temp">
        <i class="wi -big" :class="weatherIcon"></i>
        <div class="widget_temp">{{info.main.temp}}&deg;</div>
      </div>
    </div>

  </section>
</template>

<script>
import WeatherService from "../services/weather";

export default {
  name: "owm-widget",
  data() {
    return { info: null, state: null, error: null }
  },
  props: ["title", "unit", "showWind"],
  computed: {
    windIcon() {
      return [`towards-${Math.round(this.info.wind.deg)}-deg`];
    },
    weatherIcon() {
      return [`wi-owm-${this.info.weather[0].id}`];
    },
    windUnit() {
      return this.unit === "metric" ? "meter/sec" : "miles/hour";
    },
  },
  methods: {
    time(ts) {
      let d = new Date(ts*1000);
      let m = d.getMinutes();
      return `${d.getHours()}:${m < 10 ? "0" + m : m}`;
    },
    getWeatherInfo() {
      this.state = "fetching";
      WeatherService.getWeatherInfo(this.unit)
        .then(info => {
          this.state = "fetched";
          this.info = info;
        })
        .catch(error => {
          this.state = "error";
          this.errorMessage = error;
        });
    }
  },
  created() {
    this.getWeatherInfo();
  }
}

/* private helpers */
</script>

<style>
.widget {
  line-height: 1.5;
  display: inline-block;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, .2);
}

.widget_header {
  padding: 1rem;
  font-weight: 600;
  border-bottom: 1px solid #e6e6e9;
}

.widget_content {
  padding: 1rem;
  display: flex;
}

.widget_city {
  font-size: 1.75rem;
}

.widget_icon-temp {
  margin-left: 1rem;
  text-align: center;
}

.wi {
  vertical-align: middle;
}

.wi.-sun {
  font-size: .6rem;
  transform: scale(1.25);
}

.wi.-big {
  font-size: 3rem;
}

.widget_temp {
  font-size: 1.25rem;
  margin-top: 0.5rem;}
</style>
