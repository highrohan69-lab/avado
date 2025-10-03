<template>
  <div class="account-page">
    <h1>My Account</h1>

    <div v-if="user" class="account-info">
      <p><strong>Name:</strong> {{ user.user_metadata?.name || 'Not set' }}</p>
      <p><strong>Email:</strong> {{ user.email }}</p>
      <p><strong>Phone:</strong> {{ user.user_metadata?.phone || 'Not set' }}</p>

      <button class="logout-btn" @click="handleLogout">Logout</button>
    </div>

    <div v-else>
      <p>You are not logged in.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { supabase } from "@/lib/supabase";
import { useRouter } from "vue-router";

const user = ref(null);
const router = useRouter();

// Fetch logged-in user
const getUser = async () => {
  const { data } = await supabase.auth.getUser();
  user.value = data.user;
};

// Logout function
const handleLogout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    alert("Logout failed: " + error.message);
    return;
  }
  user.value = null;
  router.push("/login"); // redirect to login page after logout
};

onMounted(() => {
  getUser();
});
</script>

<style scoped>
.account-page {
  max-width: 500px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background: #f9f9f9;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

.account-info p {
  font-size: 18px;
  margin: 10px 0;
}

.logout-btn {
  display: block;
  margin: 20px auto 0;
  padding: 10px 20px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.logout-btn:hover {
  background: #c0392b;
}
</style>
