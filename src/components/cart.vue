<template>
  <div class="cart-panel" :class="{ open: open }">
    <div class="cart-header">
      <h2>My Cart</h2>
      <button class="close-cart" @click="$emit('close')">×</button>
    </div>

    <div v-if="cartStore.items.length">
      <div v-for="item in cartStore.items" :key="item.id" class="cart-item">
        <div class="item-info">
          <img :src="item.image" alt="img" class="item-img"/>
          <div class="details">
            <p class="name">{{ item.name }}</p>
            <p class="price">{{ item.price }}৳</p>
            <p v-if="item.selectedVariants?.length" class="variants">
              <span v-for="(v, i) in item.selectedVariants" :key="i">
                {{ v.variantName }}: {{ v.optionName }}
              </span>
            </p>
          </div>
        </div>

        <!-- Quantity Control + Remove -->
        <div class="item-actions">
          <div class="quantity-control">
            <button @click="cartStore.decreaseQuantity(item)">-</button>
            <span>{{ item.quantity }}</span>
            <button @click="cartStore.increaseQuantity(item)">+</button>
          </div>
          <button class="remove-btn" @click="cartStore.removeItem(item.id)">🗑️</button>
        </div>
      </div>

      <!-- Footer -->
      <div class="cart-footer">
        <p>Total: {{ cartStore.totalPrice }}৳</p>
        <button class="checkout-btn" @click="goToCheckout">Checkout</button>
      </div>
    </div>
    <div v-else>No items in cart.</div>
  </div>
</template>

<script setup>
import { useCartStore } from "@/components/cart.js";
import { useRouter } from "vue-router";

const cartStore = useCartStore();
const router = useRouter();

defineProps({ open: Boolean });

const goToCheckout = () => {
  // Checkout page এ নিয়ে যাবে
  router.push("/checkout");
};
</script>

<style scoped>
.cart-panel {
  position: fixed;
  top: 0;
  right: -400px;
  width: 350px;
  height: 100vh;
  background: #fff;
  box-shadow: -2px 0 8px rgba(0,0,0,0.2);
  padding: 20px;
  transition: right 0.3s ease;
  z-index: 999899;
}
.cart-panel.open { right: 0; }

.cart-header { display: flex; justify-content: space-between; align-items: center; }
.close-cart { background: #8E2DE2; color: white; border: none; border-radius: 4px; padding: 4px 10px; cursor: pointer; font-size: 20px; }

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}
.item-info { display: flex; gap: 10px; }
.item-img { width: 50px; height: 50px; border-radius: 6px; object-fit: cover; }
.details { display: flex; flex-direction: column; font-size: 14px; }
.name { font-weight: bold; }
.price { color: #8E2DE2; font-size: 14px; }
.variants { font-size: 12px; color: #555; }

.item-actions { display: flex; align-items: center; gap: 10px; }

.quantity-control { display: flex; align-items: center; gap: 6px; }
.quantity-control button {
  padding: 2px 6px;
  background: #8E2DE2;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.remove-btn {
  background: #ff4d4f;
  border: none;
  color: white;
  padding: 5px 8px;
  border-radius: 6px;
  cursor: pointer;
}

.cart-footer { margin-top: 20px; text-align: center; }
.checkout-btn { background: #8E2DE2; color: #fff; border: none; padding: 10px 15px; border-radius: 6px; cursor: pointer; }
</style>
