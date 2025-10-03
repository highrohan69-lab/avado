<template>
  <div>
    <head>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link
        href="https://fonts.googleapis.com/css2?family=Abril+Fatface&family=Alice&display=swap"
        rel="stylesheet"
      />
    </head>

    <div class="navbarcontainer">
      <!-- Logo -->
      <div class="logo" @click="goHome" style="cursor:pointer">
        <div class="logoimg">
          <img src="@/assets/logo.png" alt="AVADO Logo" />
        </div>
        <div class="logoname">AVADO</div>
      </div>

      <!-- Hamburger menu for mobile -->
      <div class="hamburger" @click="toggleMenu">
        <span :class="{ 'bar1': true, 'change': isOpen }"></span>
        <span :class="{ 'bar2': true, 'change': isOpen }"></span>
        <span :class="{ 'bar3': true, 'change': isOpen }"></span>
      </div>

      <!-- Nav Links -->
      <ul :class="['nav-links', { 'open': isOpen }]">
        <li @click="goHotDeals">
          <img :src="giftIcon" alt="Gift Icon" class="icon" />
          <span class="icon-text">Offer</span>
        </li>

        <li @click="goOrders">
          <img :src="bagIcon" alt="Bag Icon" class="icon" />
          <span class="icon-text">Order</span>
        </li>

        <li class="cart-li">
          <div class="cart-wrapper" @click="toggleCart">
            <img :src="cartIcon" alt="Cart Icon" class="icon" />
            <span class="icon-text">Cart</span>
            <span v-if="cartStore.itemCount > 0" class="cart-badge">
              {{ cartStore.itemCount }}
            </span>
          </div>
        </li>

        <li @click="goAccount">
          <img :src="userIcon" alt="User Icon" class="icon" />
          <span class="icon-text">
            {{ currentUser ? (currentUser.user_metadata?.name || currentUser.email) : 'Account' }}
          </span>
        </li>
      </ul>
    </div>

    <!-- Cart Panel (Slide-in from right) -->
    <Cart :open="cartOpen" @close="toggleCart" />
  </div>
</template>

<script setup>
import giftIcon from '@/assets/icons/gift.svg'
import bagIcon from '@/assets/icons/shopping-bag.svg'
import cartIcon from '@/assets/icons/shopping-cart.svg'
import userIcon from '@/assets/icons/circle-user-round.svg'

import { useCartStore } from "@/components/cart.js";
import { useRouter } from 'vue-router';
import { supabase } from "@/lib/supabase";
import { ref, onMounted } from "vue";

// Import Cart Component
import Cart from "../components/cart.vue";

const cartStore = useCartStore();
const router = useRouter();
const currentUser = ref(null);

const getUser = async () => {
  const { data } = await supabase.auth.getUser();
  currentUser.value = data.user;
};

const goOrders = () => router.push('/orders');
const goAccount = () => currentUser.value ? router.push('/account') : router.push('/signup');
const goHotDeals = () => router.push('/hot-deal');
const goHome = () => router.push('/');

onMounted(() => getUser());

const isOpen = ref(false);
const toggleMenu = () => isOpen.value = !isOpen.value;

const cartOpen = ref(false);
const toggleCart = () => cartOpen.value = !cartOpen.value;
</script>

<style scoped>
.navbarcontainer {
  margin: 0;
  position: sticky;
  top: 0;
  width: 100%;
  height: 80px;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 5%;
  box-sizing: border-box;
  z-index: 9999;
}

/* Logo */
.logo { display: flex; align-items: center; gap: 10px; color: white; }
.logoimg img { width: 70px; height: 85%; }
.logoname { font-size: 30px; color: white; font-family: "Abril Fatface", serif; font-weight: 400; text-transform: uppercase; }

/* Nav Links */
.nav-links {
  list-style: none;
  display: flex;
  gap: 30px;
  align-items: center;
  transition: all 0.3s ease;
}
.nav-links li {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  padding: 5px;
  border-radius: 6px;
  transition: all 0.3s ease;
  position: relative;
  z-index: 2;
}
.icon { width: 25px; height: 25px; margin-bottom: 5px; filter: brightness(0) invert(1); transition: all 0.3s ease; }
.icon-text { font-size: 17px; color: white; transition: all 0.3s ease; }

/* Hover purple */
.nav-links li:hover .icon,
.nav-links li:hover .icon-text { color: #8E2DE2; filter: brightness(0) invert(32%) sepia(84%) saturate(2800%) hue-rotate(257deg) brightness(90%) contrast(95%); }
.nav-links li:hover { background: rgba(142, 45, 226, 0.1); }

/* Cart wrapper vertical */
.cart-wrapper { display: flex; flex-direction: column; align-items: center; position: relative; cursor: pointer; }

/* Cart badge */
.cart-badge { position: absolute; top: -5px; right: -10px; background: red; color: white; font-size: 12px; border-radius: 50%; padding: 2px 6px; }

/* Hamburger */
.hamburger { display: none; flex-direction: column; cursor: pointer; }
.hamburger span { display: block; width: 25px; height: 3px; margin: 4px 0; background: white; transition: 0.4s; }
.bar1.change { transform: rotate(-45deg) translate(-5px, 6px); }
.bar2.change { opacity: 0; }
.bar3.change { transform: rotate(45deg) translate(-5px, -6px); }

@media (max-width: 768px) {
  .hamburger { display: flex; }
  .nav-links {
    position: absolute;
    top: 80px;
    right: 0;
    background: #000;
    flex-direction: column;
    width: 100%;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
    z-index: 999;
  }
  .nav-links.open { max-height: 500px; }
  .nav-links li { padding: 15px 0; }
}
</style>
