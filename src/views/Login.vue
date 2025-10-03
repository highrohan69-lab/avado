<template>
  <div class="login-container">
    <h2>Login</h2>
    <form @submit.prevent="handleLogin">
      <input v-model="loginInput" placeholder="Email or Phone" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
    <p>
      Don’t have an account?
      <router-link to="/signup">Signup</router-link>
    </p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { supabase } from "@/lib/supabase";
import { useRouter } from "vue-router";

const router = useRouter();
const loginInput = ref(""); // email or phone
const password = ref("");

// নতুন function: phone number দিয়ে login
async function loginWithPhone(phoneNumber, passwordToUse) {
  const email = `${phoneNumber}@avado.com`;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: passwordToUse,
  });

  if (error) {
    console.error("Login failed:", error.message);
    alert("Login failed. Try again.");
    return null;
  }

  alert("Login successful!");
  return data.user;
}

// handleLogin function
const handleLogin = async () => {
  // যদি input phone number হয়
  if (/^\d{10,15}$/.test(loginInput.value)) {
    const user = await loginWithPhone(loginInput.value, password.value);
    if (user) {
      router.push("/account");
    }
  } else {
    // Normal email login
    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginInput.value,
      password: password.value,
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Login successful!");
      router.push("/account");
    }
  }
};
</script>
