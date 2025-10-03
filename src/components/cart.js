// src/components/cart.js
import { defineStore } from "pinia";
import { supabase } from "@/lib/supabase";

const LOCAL_KEY = "guest_cart";

// 🔹 Helper to ensure user exists in users table
async function ensureUserExists(userId, email = null) {
  if (!userId) return;

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) throw error;

  if (!data) {
    const { error: insertError } = await supabase.from("users").insert([
      { id: userId, email: email || null }
    ]);
    if (insertError) throw insertError;
  }
}

export const useCartStore = defineStore("cart", {
  state: () => ({
    items: [],
    orders: [],
    isCartOpen: false,
    userId: null,
    isGuest: true,
  }),

  actions: {
    // Initialize cart for logged-in user or guest
    async initUser(userId = null, email = null) {
      if (userId) {
        this.userId = userId;
        this.isGuest = false;
        // Ensure user exists in users table
        await ensureUserExists(userId, email);
        await this.loadCartFromDB();
      } else {
        this.isGuest = true;
        this.loadCartFromLocal();
      }
    },

    // Load cart from Supabase for logged-in user
    async loadCartFromDB() {
      if (!this.userId) return;

      const { data, error } = await supabase
        .from("cart")
        .select("*")
        .eq("user_id", this.userId)
        .maybeSingle();

      if (error) {
        console.error("Error loading cart from DB:", error.message);
        return;
      }

      if (data) {
        this.items = data.items || [];
        this.orders = data.orders || [];
      } else {
        // Create empty cart row for user
        const { error: insertError } = await supabase.from("cart").insert({
          user_id: this.userId,
          items: [],
          orders: [],
        });
        if (insertError) console.error("Error creating cart row:", insertError.message);
      }
    },

    // Load cart from localStorage for guest users
    loadCartFromLocal() {
      const saved = localStorage.getItem(LOCAL_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        this.items = parsed.items || [];
        this.orders = parsed.orders || [];
      }
    },

    // Save cart to DB or localStorage
    async saveCart() {
      if (this.isGuest) {
        localStorage.setItem(
          LOCAL_KEY,
          JSON.stringify({ items: this.items, orders: this.orders })
        );
      } else if (this.userId) {
        try {
          const { error } = await supabase
            .from("cart")
            .upsert(
              { user_id: this.userId, items: this.items, orders: this.orders },
              { onConflict: "user_id" } // ⚡ Important: conflict resolve
            );
          if (error) console.error("Error saving cart:", error.message);
        } catch (err) {
          console.error("Cart save failed:", err);
        }
      }
    },

    // -------------------------
    // 🛒 CART FUNCTIONS
    // -------------------------

    addItem(product) {
      const existing = this.items.find(
        (i) =>
          i.id === product.id &&
          JSON.stringify(i.selectedVariants) === JSON.stringify(product.selectedVariants)
      );

      if (existing) {
        existing.quantity = (existing.quantity || 1) + (product.quantity || 1);
      } else {
        this.items.push({ ...product, quantity: product.quantity || 1 });
      }
      this.saveCart();
    },

    removeItem(index) {
      this.items.splice(index, 1);
      this.saveCart();
    },

    increaseQuantity(item) {
      item.quantity++;
      this.saveCart();
    },

    decreaseQuantity(item) {
      if (item.quantity > 1) {
        item.quantity--;
      } else {
        const index = this.items.indexOf(item);
        if (index > -1) this.items.splice(index, 1);
      }
      this.saveCart();
    },

    toggleCart() {
      this.isCartOpen = !this.isCartOpen;
    },

    clearCart() {
      this.items = [];
      this.saveCart();
    },

    async placeOrder(customerInfo) {
      try {
        const order = {
          id: Date.now(),
          items: [...this.items],
          total: this.items.reduce((sum, i) => sum + i.price * i.quantity, 0),
          customer: customerInfo,
          date: new Date().toLocaleString(),
        };

        this.orders.push(order);
        this.clearCart();
        await this.saveCart();
        return order;
      } catch (err) {
        console.error("placeOrder failed:", err);
      }
    },
  },

  getters: {
    itemCount: (state) =>
      state.items.reduce((sum, i) => sum + (i.quantity || 1), 0),

    totalPrice: (state) =>
      state.items.reduce((sum, i) => sum + i.price * (i.quantity || 1), 0),
  },
});
