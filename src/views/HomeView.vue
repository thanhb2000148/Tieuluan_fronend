<template>
  <div class="home">
    <NavBar />
    <Hero />
    <Featurs />
    <Search />
    <div class="container-fluid fruite py-5">
      <div class="container py-5">
        <div class="tab-class text-center">
          <div class="row g-4">
            <div class="col-lg-4 text-start">
              <h1>Các sản phẩm của chúng tôi</h1>
            </div>
            <div class="col-lg-8 text-end">
              <ul class="nav nav-pills d-inline-flex text-center mb-5">
                <li class="nav-item cursor-pointer">
                  <a
                    class="d-flex m-2 py-2 bg-light rounded-pill"
                    :class="{ active: currentTab === 'all' }"
                    @click="setCurrentTab('all')"
                  >
                    <span class="text-dark" style="width: 130px"
                      >Tất cả sản phẩm</span
                    >
                  </a>
                </li>
                <li
                  class="nav-item cursor-pointer"
                  v-for="(item, index) in nameCategory"
                  :key="index"
                >
                  <a
                    class="d-flex py-2 m-2 bg-light rounded-pill"
                    :class="{ active: currentTab === item.CATEGORY_NAME }"
                    @click="setCurrentTab(item.CATEGORY_NAME)"
                  >
                    <span class="text-dark" style="width: 130px">{{
                      item.CATEGORY_NAME
                    }}</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div class="tab-content">
            <div
              v-if="currentTab === 'all'"
              class="tab-pane fade show p-0 active"
            >
              <div class="row g-4">
                <div
                  v-for="product in allProducts"
                  :key="product._id"
                  class="col-md-6 col-lg-4 col-xl-3"
                >
                  <ProductCard :product="product" :category="category" />
                </div>
              </div>
            </div>
            <div
              v-else
              v-for="(category, index) in nameCategory"
              :key="category._id"
              class="tab-pane fade show p-0"
              :class="{ active: currentTab === category.CATEGORY_NAME }"
            >
              <div class="row g-4">
                <div
                  v-for="product in productCategory[index]"
                  :key="product._id"
                  class="col-md-6 col-lg-4 col-xl-3"
                >
                  <ProductCard :product="product" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <AppFooter />
  </div>
</template>

<script>
import NavBar from "@/components/User/layout/NavBar.vue";
import AppFooter from "@/components/User/layout/AppFooter.vue";
import Featurs from "@/components/User/Home/Featurs.vue";
import Hero from "@/components/User/Home/Hero.vue";
import ProductCard from "@/components/User/Home/ProductCard.vue";
import categoryService from "@/services/category.service";
import productService from "@/services/product.service";
import Search from "@/components/User/Home/Search.vue";

export default {
  name: "HomeView",
  components: {
    NavBar,
    AppFooter,
    Featurs,
    Hero,
    ProductCard,
    Search
  },
  data() {
    return {
      nameCategory: [],
      productCategory: [],
      currentTab: "all",
      page: 1,
      limit: 6,
      skip: 1,
    };
  },
  computed: {
    allProducts() {
      return this.productCategory.flat();
    },
  },
  async created() {
    try {
      await this.getCategory();
      console.log("mãng category", this.nameCategory);
      await this.getProductCategory();
      console.log("mãng product", this.productCategory);
    } catch (error) {
      console.error(error);
    }
  },
  methods: {
    setCurrentTab(tab) {
      this.currentTab = tab;
    },
    async getCategory() {
      try {
        const response = await categoryService.getAll();
        if (response && response.data) {
          this.nameCategory = response.data;
        }
      } catch (error) {
        console.log("error", error);
      }
    },
    async getProductCategory() {
      try {
        const productPromises = this.nameCategory.map(async (category) => {
          const response = await productService.getProductByIdCategory(
            category._id
          );
          return response && response.data ? response.data : [];
        });
        this.productCategory = await Promise.all(productPromises);
      } catch (error) {
        console.log("error", error);
      }
    },
  },
};
</script>
<style></style>
