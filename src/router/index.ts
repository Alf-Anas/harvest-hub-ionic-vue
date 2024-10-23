import { createRouter, createWebHistory } from "vue-router/auto";
import LoginPage from "@/components/LoginPage.vue";
import HomePage from "@/components/HomePage.vue";
import FarmPage from "@/components/farm/FarmPage.vue";
import CreateFarmPage from "@/components/farm/CreateFarmPage.vue";
import ActionFarmPage from "@/components/farm/ActionFarmPage.vue";
import TaskPage from "@/components/task/TaskPage.vue";
import CreateTaskPage from "@/components/task/CreateTaskPage.vue";
import ActionTaskPage from "@/components/task/ActionTaskPage.vue";
import { checkLoginState } from "./auth";

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomePage,
    meta: { requiresAuth: true },
  },
  {
    path: "/login",
    name: "Login",
    component: LoginPage,
  },
  {
    path: "/farm-field",
    name: "View Farm Field",
    component: FarmPage,
    meta: { requiresAuth: true },
  },
  {
    path: "/farm-field/create",
    name: "Create Farm Field",
    component: CreateFarmPage,
    meta: { requiresAuth: true },
  },
  {
    path: "/farm-field/action",
    name: "Farm Field Action",
    component: ActionFarmPage,
    meta: { requiresAuth: true },
  },
  {
    path: "/farm-site",
    name: "View Farm Site",
    component: FarmPage,
    meta: { requiresAuth: true },
  },
  {
    path: "/farm-site/create",
    name: "Create Farm Site",
    component: CreateFarmPage,
    meta: { requiresAuth: true },
  },
  {
    path: "/farm-site/action",
    name: "Farm Site Action",
    component: ActionFarmPage,
    meta: { requiresAuth: true },
  },
  {
    path: "/task",
    name: "View Task",
    component: TaskPage,
    meta: { requiresAuth: true },
  },
  {
    path: "/task/create",
    name: "Create Task",
    component: CreateTaskPage,
    meta: { requiresAuth: true },
  },
  {
    path: "/task/action",
    name: "Task Action",
    component: ActionTaskPage,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Check Authentication
router.beforeEach(async (to, _from, next) => {
  const isAuthenticated = await checkLoginState();

  if (to.meta.requiresAuth && !isAuthenticated.status) {
    next({ name: "Login" }); // Redirect to login if not authenticated
  } else if (to.name === "Login" && isAuthenticated.status) {
    next({ name: "Home" }); // Redirect to home if already authenticated
  } else {
    next(); // Proceed to the route
  }
});

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.("Failed to fetch dynamically imported module")) {
    if (!localStorage.getItem("vuetify:dynamic-reload")) {
      console.log("Reloading page to fix dynamic import error");
      localStorage.setItem("vuetify:dynamic-reload", "true");
      location.assign(to.fullPath);
    } else {
      console.error("Dynamic import error, reloading page did not fix it", err);
    }
  } else {
    console.error(err);
  }
});

router.isReady().then(() => {
  localStorage.removeItem("vuetify:dynamic-reload");
});

export default router;
