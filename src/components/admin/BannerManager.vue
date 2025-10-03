<template>
  <div class="banner-manager">
    <h2>Manage Banners</h2>

    <!-- Add Form -->
    <form @submit.prevent="addBanner">
      <input type="file" @change="onFileChange" accept="image/*" required />
      <input v-model="newBannerLink" placeholder="Link URL (optional)" />
      <button type="submit">Add Banner</button>
    </form>

    <!-- Banner List -->
    <ul>
      <li v-for="b in banners" :key="b.id" class="banner-item">
        <a :href="b.link" target="_blank">
          <img :src="b.image_url" width="150" />
        </a>
        <p v-if="b.link">🔗 {{ b.link }}</p>
        <button @click="deleteBanner(b.id)">Delete</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { supabase } from "@/lib/supabase";

const banners = ref([]);
const newFile = ref(null);
const newBannerLink = ref("");

// Image select
const onFileChange = (e) => {
  newFile.value = e.target.files[0];
};

// Fetch banners
const fetchBanners = async () => {
  const { data, error } = await supabase.from("banners").select("*").order("id", { ascending: false });
  if (!error) banners.value = data;
};

// Add banner
const addBanner = async () => {
  if (!newFile.value) return;

  const fileExt = newFile.value.name.split(".").pop();
  const fileName = `banner_${Date.now()}.${fileExt}`;

  // Upload to Storage
  const { error: uploadError } = await supabase.storage
    .from("banners")
    .upload(fileName, newFile.value, { upsert: true });

  if (uploadError) return console.error(uploadError);

  // Get public URL
  const { data: { publicUrl } } = supabase.storage.from("banners").getPublicUrl(fileName);

  // Insert into table
  const { error } = await supabase.from("banners").insert([
    { image_url: publicUrl, link: newBannerLink.value },
  ]);

  if (!error) {
    newFile.value = null;
    newBannerLink.value = "";
    fetchBanners();
  } else console.error(error);
};

// Delete banner
const deleteBanner = async (id) => {
  await supabase.from("banners").delete().eq("id", id);
  fetchBanners();
};

onMounted(() => {
  fetchBanners();
});
</script>

<style scoped>
.banner-item {
  margin-bottom: 20px;
}
</style>
