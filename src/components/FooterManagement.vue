<template>
  <div class="footer-manager">
    <h2>Footer Manager</h2>

    <!-- Support Section -->
    <section>
      <h3>Support Section</h3>
      <div class="add-item">
        <input v-model="newSupport.label" placeholder="Label (e.g., 9 AM - 8 PM)" />
        <input v-model="newSupport.value" placeholder="Value (e.g., 16793)" />
        <button @click="addSupport">Add</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Label</th>
            <th>Value</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in supportItems" :key="item.id">
            <td>{{ item.id }}</td>
            <td><input v-model="item.label" /></td>
            <td><input v-model="item.value" /></td>
            <td>
              <button @click="updateSupport(item)">Update</button>
              <button @click="deleteSupport(item.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- About Us Section -->
    <section>
      <h3>About Us (3 Columns)</h3>
      <div class="columns">
        <div v-for="(column, index) in aboutColumns" :key="index" class="about-column">
          <h4>Column {{ index + 1 }}</h4>
          <div class="add-item">
            <input v-model="newAbout.label" placeholder="Label" />
            <input v-model="newAbout.link" placeholder="Link" />
            <button @click="addAbout(index)">Add</button>
          </div>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Label</th>
                <th>Link</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in column" :key="item.id">
                <td>{{ item.id }}</td>
                <td><input v-model="item.label" /></td>
                <td><input v-model="item.link" /></td>
                <td>
                  <button @click="updateAbout(item)">Update</button>
                  <button @click="deleteAbout(item.id, index)">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- Stay Connected Section -->
    <section>
      <h3>Stay Connected</h3>
      <div>
        <label>Name:</label>
        <input v-model="stayConnected.name" />
        <label>Address:</label>
        <input v-model="stayConnected.address" />
        <label>Email:</label>
        <input v-model="stayConnected.email" />
        <button @click="updateStayConnected">Update</button>
      </div>
    </section>

    <!-- App Links Section -->
    <section>
      <h3>App Links</h3>
      <div class="add-item">
        <input v-model="newApp.link" placeholder="Link" />
        <input type="file" @change="handleAppIcon" />
        <button @click="addAppLink">Add</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Link</th>
            <th>Icon</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in appLinks" :key="item.id">
            <td>{{ item.id }}</td>
            <td><input v-model="item.link" /></td>
            <td>
              <img :src="item.icon" alt="" style="height:40px" />
              <input type="file" @change="e => handleUpdateAppIcon(e, item)" />
            </td>
            <td>
              <button @click="updateAppLink(item)">Update</button>
              <button @click="deleteAppLink(item.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- Social Links Section -->
    <section>
      <h3>Social Links</h3>
      <div class="add-item">
        <input v-model="newSocial.link" placeholder="Link" />
        <input type="file" @change="handleSocialIcon" />
        <button @click="addSocialLink">Add</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Link</th>
            <th>Icon</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in socialLinks" :key="item.id">
            <td>{{ item.id }}</td>
            <td><input v-model="item.link" /></td>
            <td>
              <img :src="item.icon" alt="" style="height:40px" />
              <input type="file" @change="e => handleUpdateSocialIcon(e, item)" />
            </td>
            <td>
              <button @click="updateSocialLink(item)">Update</button>
              <button @click="deleteSocialLink(item.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- Footer Texts Section -->
    <section>
      <h3>Footer Texts</h3>
      <div>
        <label>App Text:</label>
        <input v-model="appText" />
        <label>Copyright:</label>
        <input v-model="copyright" />
        <label>Powered By:</label>
        <input v-model="poweredBy" />
        <button @click="updateFooterTexts">Update</button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { supabase } from "@/lib/supabase";

const supportItems = ref([]);
const aboutColumns = ref([[], [], []]);
const stayConnected = ref({ name: "", address: "", email: "" });
const appLinks = ref([]);
const socialLinks = ref([]);
const appText = ref("");
const copyright = ref("");
const poweredBy = ref("");

const newSupport = ref({ label: "", value: "" });
const newAbout = ref({ label: "", link: "" });
const newApp = ref({ link: "", icon: "" });
const newSocial = ref({ link: "", icon: "" });

// Fetch All
const fetchAll = async () => {
  const { data: supportData } = await supabase.from("footer_support").select("*");
  supportItems.value = supportData || [];

  const { data: aboutData } = await supabase.from("footer_about").select("*").order("column_order");
  aboutColumns.value = [[], [], []];
  (aboutData || []).forEach(item => aboutColumns.value[item.column_order - 1].push(item));

  const { data: stayData } = await supabase.from("footer_stay_connected").select("*").single();
  stayConnected.value = stayData || { name: "", address: "", email: "" };

  const { data: appData } = await supabase.from("footer_app_links").select("*");
  appLinks.value = appData || [];

  const { data: socialData } = await supabase.from("footer_social_links").select("*");
  socialLinks.value = socialData || [];

  const { data: textsData } = await supabase.from("footer_texts").select("*").maybeSingle();
  if (textsData) {
    appText.value = textsData.app_text;
    copyright.value = textsData.copyright;
    poweredBy.value = textsData.powered_by;
  }
};

onMounted(fetchAll);

// Support CRUD
const addSupport = async () => {
  if (!newSupport.value.label || !newSupport.value.value) return alert("Fill fields");
  const { data } = await supabase.from("footer_support").insert([newSupport.value]).select();
  if (data?.length) supportItems.value.push(data[0]);
  newSupport.value = { label: "", value: "" };
};
const updateSupport = async (item) => {
  await supabase.from("footer_support").update({ label: item.label, value: item.value }).eq("id", item.id);
};
const deleteSupport = async (id) => {
  await supabase.from("footer_support").delete().eq("id", id);
  supportItems.value = supportItems.value.filter(i => i.id !== id);
};

// About CRUD
const addAbout = async (colIndex) => {
  if (!newAbout.value.label || !newAbout.value.link) return alert("Fill fields");
  const item = { ...newAbout.value, column_order: colIndex + 1 };
  const { data } = await supabase.from("footer_about").insert([item]).select();
  if (data?.length) aboutColumns.value[colIndex].push(data[0]);
  newAbout.value = { label: "", link: "" };
};
const updateAbout = async (item) => {
  await supabase.from("footer_about").update({ label: item.label, link: item.link }).eq("id", item.id);
};
const deleteAbout = async (id, colIndex) => {
  await supabase.from("footer_about").delete().eq("id", id);
  aboutColumns.value[colIndex] = aboutColumns.value[colIndex].filter(i => i.id !== id);
};

// Stay Connected
const updateStayConnected = async () => {
  await supabase.from("footer_stay_connected").upsert(stayConnected.value);
};

// App Links
const handleAppIcon = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const { error } = await supabase.storage.from("banners").upload(`app/${file.name}`, file, { upsert: true });
  if (error) return alert(error.message);
  const { data } = supabase.storage.from("banners").getPublicUrl(`app/${file.name}`);
  newApp.value.icon = data.publicUrl;
};
const handleUpdateAppIcon = async (e, item) => {
  const file = e.target.files[0];
  if (!file) return;
  const { error } = await supabase.storage.from("banners").upload(`app/${file.name}`, file, { upsert: true });
  if (error) return alert(error.message);
  const { data } = supabase.storage.from("banners").getPublicUrl(`app/${file.name}`);
  item.icon = data.publicUrl;
};
const addAppLink = async () => {
  if (!newApp.value.link || !newApp.value.icon) return alert("Fill fields");
  const { data } = await supabase.from("footer_app_links").insert([newApp.value]).select();
  if (data?.length) appLinks.value.push(data[0]);
  newApp.value = { link: "", icon: "" };
};
const updateAppLink = async (item) => {
  await supabase.from("footer_app_links").update({ link: item.link, icon: item.icon }).eq("id", item.id);
};
const deleteAppLink = async (id) => {
  await supabase.from("footer_app_links").delete().eq("id", id);
  appLinks.value = appLinks.value.filter(i => i.id !== id);
};

// Social Links
const handleSocialIcon = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const { error } = await supabase.storage.from("banners").upload(`social/${file.name}`, file, { upsert: true });
  if (error) return alert(error.message);
  const { data } = supabase.storage.from("banners").getPublicUrl(`social/${file.name}`);
  newSocial.value.icon = data.publicUrl;
};
const handleUpdateSocialIcon = async (e, item) => {
  const file = e.target.files[0];
  if (!file) return;
  const { error } = await supabase.storage.from("banners").upload(`social/${file.name}`, file, { upsert: true });
  if (error) return alert(error.message);
  const { data } = supabase.storage.from("banners").getPublicUrl(`social/${file.name}`);
  item.icon = data.publicUrl;
};
const addSocialLink = async () => {
  if (!newSocial.value.link || !newSocial.value.icon) return alert("Fill fields");
  const { data } = await supabase.from("footer_social_links").insert([newSocial.value]).select();
  if (data?.length) socialLinks.value.push(data[0]);
  newSocial.value = { link: "", icon: "" };
};
const updateSocialLink = async (item) => {
  await supabase.from("footer_social_links").update({ link: item.link, icon: item.icon }).eq("id", item.id);
};
const deleteSocialLink = async (id) => {
  await supabase.from("footer_social_links").delete().eq("id", id);
  socialLinks.value = socialLinks.value.filter(i => i.id !== id);
};

// Footer Texts
const updateFooterTexts = async () => {
  await supabase.from("footer_texts").upsert({
    app_text: appText.value,
    copyright: copyright.value,
    powered_by: poweredBy.value
  });
};
</script>



<style scoped>
.footer-manager {
  padding: 20px;
}
section {
  margin-bottom: 40px;
}
.add-item input {
  margin-right: 5px;
}
.add-item button {
  margin-left: 5px;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}
table th, table td {
  border: 1px solid #ccc;
  padding: 5px;
}
img {
  max-height: 40px;
}
</style>
