<template>
  <div>
    <Navbar />

    <div class="products-page">
      <h2 class="page-title">🔥 Hot Deals</h2>
      <div class="products-grid">
        <ProductCard
          v-for="product in hotDeals"
          :key="product.id"
          :product="product"
        />
      </div>
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

const hotDeals = ref([]);

const fetchHotDeals = async () => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_hot_deal", true); // শুধু hot deals filter
  if (!error) hotDeals.value = data;
};

onMounted(() => fetchHotDeals());
</script>

<style scoped>
.products-page {
  width: 80%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  margin-top: 30px;
}

.page-title {
  font-size: 2rem;
  margin-bottom: 20px;
  color: #8E2DE2;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 15px;
}

/* Responsive */
@media (max-width: 1024px) {
  .products-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .products-grid {
    grid-template-columns: 1fr;
  }
}
</style>
