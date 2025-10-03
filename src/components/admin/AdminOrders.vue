<template>
  <div>
    <h2>All Orders</h2>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Phone</th>
          <th>Address</th>
          <th>District</th>
          <th>Upazila</th>
          <th>Thana</th>
          <th>Payment</th>
          <th>Total</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="o in orders" :key="o.id">
          <td>{{ o.id }}</td>
          <td>{{ o.customer.name }}</td>
          <td>{{ o.customer.phone }}</td>
          <td>{{ o.customer.address }}</td>
          <td>{{ o.customer.district }}</td>
          <td>{{ o.customer.upazila }}</td>
          <td>{{ o.customer.thana }}</td>
          <td>{{ o.payment_method }}</td>
          <td>{{ o.total }}৳</td>
          <td>{{ o.status }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { supabase } from "@/lib/supabase";

const orders = ref([]);

onMounted(async () => {
  const { data, error } = await supabase.from("orders").select("*").order('created_at', { ascending: false });
  if (!error) orders.value = data;
});
</script>
