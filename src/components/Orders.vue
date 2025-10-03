<template>
  <div class="orders">
    <h1>My Orders</h1>

    <!-- jodi user login na kore -->
    <div v-if="!currentUser">
      <p>Please login first to see your orders.</p>
    </div>

    <!-- jodi login kora thake -->
    <ul v-else>
      <li v-for="o in orders" :key="o.id">
        Order #{{ o.id }} - {{ o.total }}৳ - {{ o.status }}
      </li>

      <li v-if="orders.length === 0">No orders found.</li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { supabase } from "@/lib/supabase"

const orders = ref([])
const currentUser = ref(null)

onMounted(async () => {
  // check current user
  const { data: { user } } = await supabase.auth.getUser()
  currentUser.value = user

  if (!user) return // login nai

  // specific user er order fetch
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id) // ✅ dhore nilam order table e user_id ase

  if (!error) orders.value = data
})
</script>
