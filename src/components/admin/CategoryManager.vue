<template>
  <div class="category-manager">
    <h2>Manage Categories</h2>

    <!-- Add Category Form -->
    <form @submit.prevent="addCategory" class="add-category-form">
      <input type="file" @change="onCategoryFileChange" accept="image/*" required />
      <input v-model="newCategorySlug" placeholder="Slug (e.g. electronics)" required />
      <button type="submit">Add Category</button>
    </form>

    <!-- Categories List -->
    <ul class="category-list">
      <li v-for="c in categories" :key="c.id" class="category-item">
        <img :src="c.image_url" width="80" />
        <span>{{ c.slug }}</span>
        <button @click="deleteCategory(c.id)">Delete</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { supabase } from "@/lib/supabase";

const categories = ref([]);
const newCategoryFile = ref(null);
const newCategorySlug = ref("");

// Handle file input
const onCategoryFileChange = (e) => {
  newCategoryFile.value = e.target.files[0];
};

// Fetch all categories
const fetchCategories = async () => {
  const { data, error } = await supabase.from("categories").select("*");
  if (error) console.error("Error fetching categories:", error.message);
  else categories.value = data || [];
};

// Add category
const addCategory = async () => {
  if (!newCategoryFile.value || !newCategorySlug.value) return;

  const fileExt = newCategoryFile.value.name.split(".").pop();
  const fileName = `category_${Date.now()}.${fileExt}`;

  // Upload image to categories bucket
  const { error: uploadError } = await supabase.storage
    .from("categories")
    .upload(fileName, newCategoryFile.value, { upsert: true });

  if (uploadError) return console.error("Storage upload error:", uploadError.message);

  // Get public URL
  const { data: publicData } = supabase.storage.from("categories").getPublicUrl(fileName);
  const publicURL = publicData.publicUrl;

  // Insert row into categories table
  // eslint-disable-next-line no-unused-vars
  const { data, error } = await supabase
    .from("categories")
    .insert([{ slug: newCategorySlug.value, image_url: publicURL }])
    .select(); // important, otherwise data will be null

  if (error) {
    console.error("Insert error:", error.message);
  } else {
    newCategoryFile.value = null;
    newCategorySlug.value = "";
    fetchCategories();
  }
};

// Delete category
const deleteCategory = async (id) => {
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) console.error("Delete error:", error.message);
  else fetchCategories();
};

// Load categories on mount
onMounted(() => {
  fetchCategories();
});
</script>

<style scoped>
.add-category-form {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  align-items: center;
}
.category-list {
  list-style: none;
  padding: 0;
}
.category-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}
</style>
