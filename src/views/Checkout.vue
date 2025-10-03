<template>
  <div class="checkout">
    <h1>Checkout</h1>

    <form @submit.prevent="placeOrder">
      <input v-model="customerName" placeholder="Full Name" required />
      <input v-model="customerPhone" placeholder="Phone" required />
      <input v-model="customerAddress" placeholder="Address" required />
      <input v-model="customerDistrict" placeholder="District" required />
      <input v-model="customerUpazila" placeholder="Upazila" required />
      <input v-model="customerThana" placeholder="Thana" required />

      <h3>Order Summary</h3>
      <ul>
        <li v-for="(item,i) in cartStore.items" :key="i">
          {{ item.name }} - {{ item.price }}৳
        </li>
      </ul>
      <p>Total: {{ cartStore.totalPrice }}৳</p>

      <h3>Payment Method</h3>
      <div class="payment-option">
        <label>
          <input type="radio" v-model="paymentMethod" value="Cash on Delivery" checked />
          Cash on Delivery
        </label>
      </div>

      <button type="submit" :disabled="isPlacingOrder">
        {{ isPlacingOrder ? "Placing Order..." : "Confirm Order" }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useCartStore } from "@/components/cart.js";
import { supabase } from "@/lib/supabase";

const cartStore = useCartStore();
const router = useRouter();

const customerName = ref("");
const customerPhone = ref("");
const customerAddress = ref("");
const customerDistrict = ref("");
const customerUpazila = ref("");
const customerThana = ref("");
const paymentMethod = ref("Cash on Delivery");
const isPlacingOrder = ref(false);

const currentUser = ref(null);

onMounted(async () => {
  const { data } = await supabase.auth.getUser();
  currentUser.value = data.user || null;
});

const placeOrder = async () => {
  if (cartStore.items.length === 0) {
    alert("Cart is empty!");
    return;
  }
  if (!customerPhone.value || !customerName.value || !customerAddress.value ||
      !customerDistrict.value || !customerUpazila.value || !customerThana.value) {
    alert("Please fill all details!");
    return;
  }

  isPlacingOrder.value = true;

  try {
    let userId;

    if (currentUser.value) {
      userId = currentUser.value.id;
    } else {
      const email = `${customerPhone.value}@avado.com`;
      const password = customerPhone.value;

      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({ email, password });

      if (loginError && loginError.message.includes("Invalid login credentials")) {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name: customerName.value, phone: customerPhone.value } },
        });
        if (signUpError) throw signUpError;

        const { error: loginError2 } = await supabase.auth.signInWithPassword({ email, password });
        if (loginError2) throw loginError2;

        currentUser.value = signUpData.user;
        userId = currentUser.value.id;
      } else if (loginData.user) {
        currentUser.value = loginData.user;
        userId = currentUser.value.id;
      } else {
        throw new Error("Failed to login or create account");
      }
    }

    const orderData = {
      items: cartStore.items,
      total: cartStore.totalPrice,
      customer: {
        name: customerName.value,
        phone: customerPhone.value,
        address: customerAddress.value,
        district: customerDistrict.value,
        upazila: customerUpazila.value,
        thana: customerThana.value,
      },
      payment_method: paymentMethod.value,
      status: "Pending",
      user_id: userId,
      created_at: new Date().toISOString(),
    };

    const { error: orderError } = await supabase.from("orders").insert(orderData);
    if (orderError) throw orderError;

    cartStore.clearCart();
    alert("Order placed successfully!");
    router.push("/orders");
  } catch (err) {
    console.error("Order failed:", err.message);
    alert("Failed to place order. Try again.");
  } finally {
    isPlacingOrder.value = false;
  }
};
</script>

<style scoped>
.checkout {
  max-width: 600px;
  margin: auto;
  padding: 20px;
}

.checkout input {
  display: block;
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.payment-option {
  margin-bottom: 20px;
}

.payment-option label {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 500;
  cursor: pointer;
}

.payment-option input[type="radio"] {
  width: 18px;
  height: 18px;
}
</style>
