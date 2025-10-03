<template>
  <div class="admin-page">
    <h1>Admin Panel</h1>

    <!-- Nav Tabs -->
    <nav class="flex space-x-4 mb-4">
      <button
        @click="activeTab = 'banners'"
        :class="activeTab === 'banners' ? 'bg-purple-600 text-white' : 'bg-gray-200'"
        class="px-4 py-2 rounded"
      >
        Banners
      </button>

      <button
        @click="activeTab = 'categories'"
        :class="activeTab === 'categories' ? 'bg-purple-600 text-white' : 'bg-gray-200'"
        class="px-4 py-2 rounded"
      >
        Categories
      </button>

      <button
        @click="activeTab = 'products'"
        :class="activeTab === 'products' ? 'bg-purple-600 text-white' : 'bg-gray-200'"
        class="px-4 py-2 rounded"
      >
        Products
      </button>

      <button
        @click="activeTab = 'orders'"
        :class="activeTab === 'orders' ? 'bg-purple-600 text-white' : 'bg-gray-200'"
        class="px-4 py-2 rounded"
      >
        Orders
      </button>

      <!-- ✅ Footer Management Tab -->
      <button
        @click="activeTab = 'footer'"
        :class="activeTab === 'footer' ? 'bg-purple-600 text-white' : 'bg-gray-200'"
        class="px-4 py-2 rounded"
      >
        Footer
      </button>
    </nav>

    <!-- Tab Content -->
    <div v-if="activeTab === 'banners'">
      <BannerManager />
    </div>

    <div v-else-if="activeTab === 'categories'">
      <CategoryManager />
    </div>

    <div v-else-if="activeTab === 'products'">
      <ProductsManager />
    </div>

    <div v-else-if="activeTab === 'orders'">
      <OrdersManager />
    </div>

    <!-- ✅ Footer Management Content -->
    <div v-else-if="activeTab === 'footer'">
      <FooterManagement />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

import BannerManager from "../components/admin/BannerManager.vue";
import CategoryManager from "../components/admin/CategoryManager.vue";
import ProductsManager from "../components/admin/ProductManager.vue";
import OrdersManager from "../components/admin/AdminOrders.vue";
import FooterManagement from "../components/FooterManagement.vue"; // নতুন যোগ

const activeTab = ref("banners");
</script>

<style scoped>
.admin-page { padding: 20px; max-width: 900px; margin: auto; }
nav button { transition: all 0.2s; }
</style>
