import Vue from "vue";
import VueRouter from "vue-router";
import JoinUs from "../views/JoinUs.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/JoinUs",
    name: "JoinUs",
    component: JoinUs,
  },
  {
    path: "/",
    name: "Home",
    component: () => import("../views/Home.vue"),
  },
  {
    path: "/event-provider-login",
    name: "EventProviderLogin",
    component: () => import("../views/EventProviderLogin.vue"),
  },
  {
    path: "/event-provider-control-panel",
    name: "Control-panel",
    component: () => import("../views/EventProviderControlPanel.vue"),
  },
  {
    path: "/create-new-event",
    name: "Create-new-event",
    component: () => import("../views/CreateNewEvent.vue"),
  },
  {
    path: "/customer-login",
    name: "CustomerLogin",
    component: () => import("../views/CustomerLogin.vue"),
  },
  {
    path: "/customer-signup",
    name: "CustomerSignup",
    component: () => import("../views/CustomerSignup.vue"),
  },
  { path: "*", redirect: "/" },
];

const router = new VueRouter({
  routes,
});

export default router;
