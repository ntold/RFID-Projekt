import Vue from "vue";
import Router from "vue-router";
import Home from "./components/Home.vue";
import RFID from "./components/RFID.vue";


Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/:id",
      name: "rfid",
      component: RFID
    }
  ]
});
