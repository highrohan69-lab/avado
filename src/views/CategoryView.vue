<template>
  <div>
    <Navbar />

    <div class="home-wrapper category-page">
      <h1 class="category-title">{{ slug }} Products</h1>

      <div v-if="products.length" class="products-grid">
        <ProductCard
          v-for="product in products"
          :key="product.id"
          :product="product"
        />
      </div>

      <div v-else>
        <p>No products found in this category.</p>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script setup>
import Navbar from "../components/NavBar.vue";
import Footer from "../components/Footer.vue";
import ProductCard from "../components/ProductCard.vue";
import { ref, onMounted } from "vue";
import { supabase } from "../lib/supabase";

const props = defineProps({
  slug: String
});

const products = ref([]);

const fetchProducts = async () => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("category_slug", props.slug);

  if (error) console.error("Error loading products:", error.message);
  else products.value = data;
};

onMounted(() => {
  fetchProducts();
});
</script>

<style scoped>
/* Home-wrapper like homepage with side margin */
.home-wrapper {
  margin: 0 10%;
  padding: 20px 0;
  box-sizing: border-box;
}

/* Category page title */
.category-title {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #4A00E0; /* purple theme */
  text-align: center;
}

/* Products grid */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
}

/* Fallback product card styling if ProductCard fails */
.product-card {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: center;
}
.product-card img {
  width: 100%;
  height: auto;
  object-fit: cover;
}
.product-card p {
  margin-top: 8px;
  font-size: 16px;
  font-weight: 500;
}
</style>
