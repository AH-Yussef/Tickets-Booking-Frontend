import Vue from "vue";
import VueRouter from "vue-router";
import AdminLogin from "../views/AdminLogin.vue";
import ControlPanel from "../views/ControlPanel.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "AdminLogin",
    component: AdminLogin,
  },
  {
    path: "/control-panel",
    name: "ControlPanel",
    component: ControlPanel,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
