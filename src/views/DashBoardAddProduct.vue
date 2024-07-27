<template>
  <div class="wrapper">
    <Slider />
    <div class="main">
      <Nav />
      <main class="content px-3 py-2">
        <div class="container-fluid">
          <h1>Thêm sản phẩm</h1>
          <p>Bạn muốn thêm sản phẩm thuộc danh mục nào?</p>
          <button @click="selectedProduct = 'clothing'">Thêm Quần Áo</button>
          <button @click="selectedProduct = 'food'">Thêm Thức Ăn</button>
          <button @click="selectedProduct = 'phone'">Thêm Điện Thoại</button>
        </div>
        <div v-if="selectedProduct === 'clothing'">
          <ClothingComponent />
        </div>
        <div v-else-if="selectedProduct === 'food'">
          <FoodComponent />
        </div>
        <div v-else-if="selectedProduct === 'phone'">
          <PhoneComponent />
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import Slider from "../components/admin/Slider.vue";
import Nav from "../components/admin/Nav.vue";
import Footer from "../components/admin/Footer.vue";
import ClothingComponent from "../components/admin/AddProduct/ClothingComponent.vue";
import FoodComponent from "../components/admin/AddProduct/FoodComponent.vue";
import PhoneComponent from "../components/admin/AddProduct/PhoneComponent.vue";
export default {
  name: "DashboardAddProduct",
  components: {
    Slider,
    Nav,
    Footer,
    ClothingComponent,
    FoodComponent,
    PhoneComponent,
  },
  data() {
    return {
      selectedProduct: null,
    };
  },
};
</script>

<style></style>
