/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from "@/plugins";

// Components
import App from "./App.vue";
import "./styles/global.css";

// Composables
import { createApp } from "vue";
import { initDB } from "./database/database";

const app = createApp(App);
initDB()
  .then(() => {
    console.log("DB Connected!");
  })
  .catch((err) => {
    console.error("DB Failed!", err);
  });
registerPlugins(app);

app.mount("#app");
