<template>
  <div>
    <Navbar />
    <h2 class="page-title">⭐ Top Products</h2>
    <div class="products-grid">
      <ProductCard
        v-for="product in topProducts"
        :key="product.id"
        :product="product"
      />
    </div>
    <Footer />
  </div>
</template>

<script setup>
import Navbar from "../components/NavBar.vue";
import ProductCard from "../components/ProductCard.vue";
import Footer from "../components/Footer.vue";
import { ref, onMounted } from "vue";
import { supabase } from "../lib/supabase";

const topProducts = ref([]);
const fetchTopProducts = async () => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_top_product", true);
  if (!error) topProducts.value = data;
};
onMounted(() => fetchTopProducts());
</script>

<style scoped>
.products-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 15px;
  margin: 20px;
}
.page-title {
  margin: 20px;
  font-size: 2rem;
}
@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
