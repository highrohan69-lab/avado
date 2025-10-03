<template>
  <div class="product-manager">
    <h2>Add Product</h2>

    <form @submit.prevent="addProduct">
      <!-- Basic Info -->
      <input v-model="product.name" placeholder="Product Name" required />
      <input v-model.number="product.price" type="number" placeholder="Price" required />
      <textarea v-model="product.description" placeholder="Description"></textarea>
      <input v-model="product.category_slug" placeholder="Category Slug" />

      <!-- Primary Image Upload -->
      <label>Primary Image:</label>
      <input type="file" @change="uploadImage($event, 'image_url')" />

      <!-- Secondary Image Upload -->
      <label>Secondary Image:</label>
      <input type="file" @change="uploadImage($event, 'secondary_image_url')" />

      <!-- Flags -->
      <label>
        <input type="checkbox" v-model="product.is_top_product" /> Top Product
      </label>
      <label>
        <input type="checkbox" v-model="product.is_hot_deal" /> Hot Deal
      </label>

      <!-- Discount -->
      <input v-model.number="product.discount_percent" type="number" placeholder="Discount (%)" />
      <input v-model="product.offer_end_date" type="datetime-local" />

      <!-- Variants -->
      <div v-for="(variant, vIndex) in variants" :key="vIndex" class="variant-box">
        <h3>{{ variant.level === 1 ? 'Primary Variant' : 'Secondary Variant' }}</h3>
        <input v-model="variant.name" placeholder="Variant Name" />

        <!-- Variant Options -->
        <div v-for="(option, oIndex) in variant.options" :key="oIndex" class="option-box">
          <input v-model="option.option_name" placeholder="Option Name" />
          <input v-model.number="option.option_price" type="number" placeholder="Option Price" />
          <input type="file" @change="uploadOptionImage($event, vIndex, oIndex)" />
          <span v-if="option.option_image_url">Uploaded ✅</span>
        </div>

        <button type="button" @click="addOption(vIndex)">+ Add Option</button>
      </div>

      <button type="button" @click="addVariant(1)">+ Add Primary Variant</button>
      <button type="button" @click="addVariant(2)">+ Add Secondary Variant</button>

      <button type="submit">Save Product</button>
    </form>
  </div>
</template>

<script>
import { supabase } from "@/lib/supabase";

export default {
  name: "ProductManager",
  data() {
    return {
      product: {
        name: "",
        price: null,
        description: "",
        category_slug: "",
        image_url: "",
        secondary_image_url: "",
        is_top_product: false,
        is_hot_deal: false,
        discount_percent: null,
        offer_end_date: null,
      },
      variants: [],
    };
  },
  methods: {
    async uploadImage(event, field) {
      const file = event.target.files[0];
      if (!file) return;

      const { data, error } = await supabase.storage
        .from("banners")
        .upload(`products/${Date.now()}-${file.name}`, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.error(error);
        return;
      }

      const { data: publicUrl } = supabase.storage
        .from("banners")
        .getPublicUrl(data.path);

      this.product[field] = publicUrl.publicUrl;
    },

    async uploadOptionImage(event, vIndex, oIndex) {
      const file = event.target.files[0];
      if (!file) return;

      const { data, error } = await supabase.storage
        .from("banners")
        .upload(`variants/${Date.now()}-${file.name}`, file);

      if (error) {
        console.error(error);
        return;
      }

      const { data: publicUrl } = supabase.storage
        .from("banners")
        .getPublicUrl(data.path);

      this.variants[vIndex].options[oIndex].option_image_url = publicUrl.publicUrl;
    },

    addVariant(level) {
      this.variants.push({
        level,
        name: "",
        options: [],
      });
    },

    addOption(vIndex) {
      this.variants[vIndex].options.push({
        option_name: "",
        option_price: null,
        option_image_url: "",
      });
    },

    async addProduct() {
      try {
        // 1. insert product
        const { data: productData, error: productError } = await supabase
          .from("products")
          .insert([this.product])
          .select()
          .single();

        if (productError) throw productError;

        // 2. insert variants
        for (const variant of this.variants) {
          const { data: variantData, error: variantError } = await supabase
            .from("product_variants")
            .insert([
              {
                product_id: productData.id,
                variant_level: variant.level,
                name: variant.name,
              },
            ])
            .select()
            .single();

          if (variantError) throw variantError;

          // 3. insert variant options
          for (const option of variant.options) {
            await supabase.from("product_variant_options").insert([
              {
                variant_id: variantData.id,
                option_name: option.option_name,
                option_price: option.option_price,
                option_image_url: option.option_image_url,
              },
            ]);
          }
        }

        alert("✅ Product saved successfully!");
        this.resetForm();
      } catch (err) {
        console.error(err);
        alert("❌ Error saving product");
      }
    },

    resetForm() {
      this.product = {
        name: "",
        price: null,
        description: "",
        category_slug: "",
        image_url: "",
        secondary_image_url: "",
        is_top_product: false,
        is_hot_deal: false,
        discount_percent: null,
        offer_end_date: null,
      };
      this.variants = [];
    },
  },
};
</script>

<style>
.product-manager {
  max-width: 700px;
  margin: auto;
  padding: 20px;
}
.variant-box, .option-box {
  border: 1px solid #ddd;
  padding: 10px;
  margin: 10px 0;
}
</style>
