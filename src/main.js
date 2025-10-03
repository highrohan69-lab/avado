import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import { supabase } from "@/lib/supabase";
import { useCartStore } from "@/components/cart";

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
app.use(router);
app.mount("#app");

// ----------------------------
// Cart initialization
// ----------------------------
const cartStore = useCartStore();

supabase.auth.onAuthStateChange((event, session) => {
  if (session?.user) {
    cartStore.initUser(session.user.id);
  } else {
    cartStore.initUser(null);
  }
});

// On page load, check current session
(async () => {
  const { data } = await supabase.auth.getUser();
  if (data.user) {
    await cartStore.initUser(data.user.id);
  } else {
    await cartStore.initUser(null);
  }
})();
