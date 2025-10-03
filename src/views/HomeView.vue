<template>
  <div>
    <Navbar />

    <div class="home-content">
      <!-- Banner Slider -->
      <div class="banner-slider" v-if="banners.length">
        <router-link :to="banners[currentIndex].link">
          <img
            :src="banners[currentIndex].image_url"
            :alt="banners[currentIndex].title || 'Banner'"
            class="banner-image"
          />
        </router-link>
        <h2 class="banner-title">{{ banners[currentIndex].title }}</h2>
      </div>

      <!-- Top Categories -->
      <div class="categories-section" v-if="categories.length">
        <h2 class="section-title">Top Categories</h2>
        <span class="section-link" @click="router.push('/categories')">See All Categories</span>
        <div class="categories-grid">
          <div
            v-for="category in categories"
            :key="category.id"
            class="category-card"
          >
            <router-link :to="`/category/${category.slug}`">
              <img
                :src="category.image_url"
                :alt="category.name"
                class="category-image"
              />
              <p>{{ category.name }}</p>
            </router-link>
          </div>
        </div>
      </div>

      <!-- Hot Deals Section -->
      <div class="products-section" v-if="hotDeals.length">
        <h2 class="section-title">Hot Deals</h2>
        <span class="section-link" @click="router.push('/hot-deals')">View All Hot Deals</span>
        <div class="products-grid">
          <ProductCard
            v-for="product in hotDeals"
            :key="product.id"
            :product="product"
          />
        </div>
      </div>

      <!-- Top Products Section -->
      <div class="products-section" v-if="topProducts.length">
        <h2 class="section-title">Top Products</h2>
        <span class="section-link" @click="router.push('/top-products')">See All Top Products</span>
        <div class="products-grid">
          <ProductCard
            v-for="product in topProducts"
            :key="product.id"
            :product="product"
          />
        </div>
      </div>

      <!-- All Products Section -->
      <div class="products-section" v-if="allProducts.length">
        <h2 class="section-title">All Products</h2>
        <span class="section-link" @click="router.push('/all-products')">View All Products</span>
        <div class="products-grid">
          <ProductCard
            v-for="product in allProducts"
            :key="product.id"
            :product="product"
          />
        </div>
      </div>
    </div>

    <Footer />
  </div>
<head>
    <meta charset="utf-8" />
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Abril+Fatface&family=Alice&display=swap" rel="stylesheet">
    <meta name="viewport" content="width=device-width,initial-scale=1.0" />
    <title>AVADO</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Abril+Fatface&display=swap" rel="stylesheet">
  </head>
</template>

<script setup>
import Navbar from "../components/NavBar.vue";
import ProductCard from "../components/ProductCard.vue";
import Footer from "../components/Footer.vue";
import { ref, onMounted, onUnmounted } from "vue";
import { supabase } from "../lib/supabase";
import { useRouter } from "vue-router";

const banners = ref([]);
const currentIndex = ref(0);
let intervalId = null;
const router = useRouter();

const fetchBanners = async () => {
  const { data, error } = await supabase.from("banners").select("*");
  if (!error) banners.value = data;
};
const startSlider = () => {
  intervalId = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % banners.value.length;
  }, 4000);
};
onMounted(async () => {
  await fetchBanners();
  if (banners.value.length) startSlider();
});
onUnmounted(() => {
  clearInterval(intervalId);
});

const categories = ref([]);
const fetchCategories = async () => {
  const { data, error } = await supabase.from("categories").select("*");
  if (!error) categories.value = data;
};
onMounted(() => fetchCategories());

// Hot Deals
const hotDeals = ref([]);
const fetchHotDeals = async () => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_hot_deal", true)
    .limit(10);
  if (!error) hotDeals.value = data;
};
onMounted(() => fetchHotDeals());

// Top Products
const topProducts = ref([]);
const fetchTopProducts = async () => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_top_product", true)
    .limit(10);
  if (!error) topProducts.value = data;
};
onMounted(() => fetchTopProducts());

// All Products (first 10)
const allProducts = ref([]);
const fetchAllProducts = async () => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .limit(10);
  if (!error) allProducts.value = data;
};
onMounted(() => fetchAllProducts());
</script>

<style scoped>
@import "../views/home.css";

/* Section Titles with Gradient Underline */
.section-title {
   font-family: "Alice", serif;
  font-weight: 400;
  font-style: normal;
  background: linear-gradient(to right, #a100ff, #ff00ff); /* gradient color */
  -webkit-background-clip: text; /* Safari/Chrome */
  -webkit-text-fill-color: transparent; /* make text transparent to show gradient */
  background-clip: text; /* standard */
  color: transparent; /* fallback */
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 8px;
  position: relative;
  display: inline-block;
  padding-bottom: 8px; /* space for underline */
}

/* Gradient Underline */
.section-title::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  height: 4px; /* thickness */
  width: 100%;
  border-radius: 2px;
  background: linear-gradient(to right, #a100ff, #ff00ff);
}

/* Underlink (small clickable link under title) */
.section-link {
  display: block;
  font-size: 0.95rem;
  margin-top: 4px;
  color: #8E2DE2;
  text-decoration: underline;
  cursor: pointer;
  transition: color 0.2s;
}

.section-link:hover {
  color: #4A00E0;
}
</style>
