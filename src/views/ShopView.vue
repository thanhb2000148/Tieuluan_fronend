<template>
  <NavBar />
  <Search />
  <div class="container-fluid fruite">
    <div class="container py-5">
       <div id="carouselExampleIndicators" class="carousel slide" data-bs-ride="carousel" >
        <ol class="carousel-indicators slide-indi">
          <li data-bs-target="#carouselExampleIndicators " data-bs-slide-to="0" class="active"></li>
          <li data-bs-target="#carouselExampleIndicators " data-bs-slide-to="1"></li>
          <li data-bs-target="#carouselExampleIndicators " data-bs-slide-to="2"></li>
        </ol>
        <div class="carousel-inner">
          <div class="carousel-item active">
            <img src="https://res.cloudinary.com/dgfwiff6k/image/upload/v1719589353/test_folder/nqq1g7p7fhtfhl7tc2gp.webp" class="d-block w-100 custom-img-size" alt="Slide 1">
            <div class="carousel-caption d-none d-md-block">
            </div>
          </div>
          <div class="carousel-item">
            <img src="https://res.cloudinary.com/dgfwiff6k/image/upload/v1719589985/test_folder/xiasufqignvtjfqknre0.webp" class="d-block w-100 custom-img-size" alt="Slide 2">
            <div class="carousel-caption d-none d-md-block">
            </div>
          </div>
          <div class="carousel-item">
            <img src="https://res.cloudinary.com/dgfwiff6k/image/upload/v1719590222/test_folder/gchx3lm4a9lh6dtbgnss.webp" class="d-block w-100 custom-img-size" alt="Slide 3">
            <div class="carousel-caption d-none d-md-block">  
            </div>
          </div>
        </div>
        <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-bs-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </a>
        <a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-bs-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </a>
      </div>
      <div class="row g-4">
        <div class="col-lg-12">
          <div class="row g-4">
            <div class="col-xl-3">
            </div>
            <div class="col-6"></div>
             <div class="col-xl-3">
                <div class="bg-light ps-3 py-3 rounded d-flex justify-content-between mb-4">
                  <label for="fruits">Xếp Theo:</label>
                  <select
                    id="fruits"
                    name="fruitlist"
                    class="border-0 form-select-sm bg-light me-3"
                    form="fruitform"
                    @change="filterProductsByPrice($event.target.value)"
                  >
                    <option value="all">Tất Cả</option>
                    <option value="lowToHigh">Giá Tăng Dần</option>
                    <option value="highToLow">Giá Thấp Dần</option>
                  </select>
                </div>
              </div>
          </div>
          <div class="row g-4">
            <div class="col-lg-3">
              <div class="row g-4">
                  <div class="col-lg-12">
                    <div class="mb-3">
                      <h4>BỘ SƯU TẬP</h4>
                        <ul class="list-unstyled fruite-categorie">
                          <li v-for="category in nameCategory" :key="category._id">
                            <div class="d-flex justify-content-between fruite-name">
                              <a href="#" class="a" 
                                @click="filterProductsByCategory(category._id)"
                                :class="{ active: selectedCategory === category._id }">
                                <i class="fas fa-apple-alt me-2"></i>{{ category.CATEGORY_NAME }}
                              </a>
                              <span>({{ getProductCountByCategory(category._id) }})</span>
                            </div>
                          </li>
                        </ul>
                    </div>
                  </div>
                <div class="col-lg-12">
                  <div class="position-relative">
                    <img
                      src="https://res.cloudinary.com/dgfwiff6k/image/upload/v1719677132/test_folder/jqdflnig4gch6vkprys9.jpg"
                      class="img-fluid w-100 rounded"
                      alt=""
                    />
                    <div
                      class="position-absolute"
                      style="top: 90%; left: 52px; transform: translateY(-50%)"
                    >
                      <h3 class="text-secondary fw-bold">
                        NEW ARRIVAL<br />
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-lg-9">
              <div class="row g-4 justify-content-center">
                <div
                  class="col-md-6 col-lg-6 col-xl-4 min-height product-container"
                  v-for="item in products"
                  :key="item._id" 
                >
                  <div
                    class="border border-top-0 rounded position-relative fruite-item"
                  >
                    <router-link
                      :to="{ name: 'UserDetail', params: { id: item._id } }"
                      ><div class="fruite-img">
                        <img
                          :src="item.LIST_FILE_ATTACHMENT_DEFAULT[0].FILE_URL"
                          class="img-fluid rounded-top"
                          alt=""
                        /></div
                    ></router-link>
                    <div class="p-4 rounded-bottom size-text">
                      <h4>{{ item.NAME_PRODUCT }}</h4>
                      <p>
                        {{ item.SHORT_DESC }}
                      </p>
                      <div class="d-flex justify-content-between flex-lg-wrap">
                        <p class="text-dark fs-5 fw-bold mb-0">
                          {{
                            getPrice(item._id).toLocaleString("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            })
                          }}
                        </p>
                        <p
                          @click="addCartNonKV(item._id)"
                          href="#"
                          class="btn border border-secondary rounded-pill px-3 text-primary"
                        >
                          <i class="fa fa-shopping-bag me-2 text-primary"></i>
                          Thêm Vào Giỏ Hàng
                        </p>
                         <div class="eye-icon" @click="openModal(item)">
                          <i class="fa fa-eye text-black"></i>
                        </div>
                         <p class="quick-view-text">Xem Nhanh</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="col-12">
    <div class="pagination">
      <pagination
        v-model="page"
        :records="productAll.length"
        :per-page="limit"
        @paginate="myCallback"
        class="pagination-3"
      />
    </div>
  </div>
  <AppFooter />
  <!-- Modal for product preview -->
  <div v-if="selectedProduct" class="modal" tabindex="-1" style="display: block; background: rgba(0,0,0,0.5);" @click.self="closeModal">
  <div class="modal-dialog">
    <div class="modal-content a">
      <div class="modal-header">
        <h5 class="modal-title">{{ selectedProduct.NAME_PRODUCT }}</h5>
        <button type="button" class="btn-close" @click="closeModal"></button>
      </div>
      <div class="modal-body">
        <div
          id="carouselExampleControls"
          class="carousel slide"
          data-bs-ride="carousel"
        >
          <div class="carousel-indicators">
            <button
              v-for="(item, index) in selectedProduct.LIST_FILE_ATTACHMENT"
              :key="index"
              type="button"
              :data-bs-target="'#carouselExampleControls'"
              :data-bs-slide-to="index"
              :class="{ active: index === 0 }"
              :aria-label="'Slide ' + (index + 1)"
              :aria-current="index === 0 ? 'true' : undefined"
            ></button>
          </div>
          <div class="carousel-inner">
            <div
              class="carousel-item" style="height: 100%"
              v-for="(item, index) in selectedProduct.LIST_FILE_ATTACHMENT"
              :key="index"
              :class="{ active: index === 0 }"
            >
              <img :src="item.FILE_URL" class="d-block w-100" alt="" />
            </div>
          </div>
          <button
            class="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleControls"
            data-bs-slide="prev"
          >
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
          </button>
          <button
            class="carousel-control-next"
            type="button"
            data-bs-target="#carouselExampleControls"
            data-bs-slide="next"
          >
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
          </button>
        </div>
        <div class="p">
          <p>{{ selectedProduct.SHORT_DESC }}</p>
        </div>
        
        <p class="text-dark fs-5 fw-bold mb-0">
          {{
            getPrice(selectedProduct._id).toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })
          }}
        </p>

        <!-- Color selection section -->
        <!-- <div v-if="selectedProduct.LIST_PRODUCT_METADATA.length > 0">
          <h5 class="mt-3">{{ selectedProduct.LIST_PRODUCT_METADATA[0].KEY }}</h5>
          <div class="d-flex">
            <button
              v-for="color in selectedProduct.LIST_PRODUCT_METADATA[0].VALUE"
              :key="color"
              class="btn btn-outline-primary me-2"
              :class="{ 'btn-primary': selectedColor === color }"
              @click="selectColor(color)"
            >
              {{ color }}
            </button>
          </div>
        </div> -->

      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" @click="closeModal">Đóng</button>
        <router-link :to="{ name: 'UserDetail', params: { id: selectedProduct._id } }" class="btn btn-primary">Xem Chi Tiết</router-link>
      </div>
    </div>
  </div>
</div>
</template>
<script>
import NavBar from "@/components/User/layout/NavBar.vue";
import AppFooter from "@/components/User/layout/AppFooter.vue";
import Pagination from "v-pagination-3";
import productService from "@/services/product.service";
import PriceService from "@/services/price.service";
import cartService from "@/services/cart.service";
import Swal from "sweetalert2";
import Search from "@/components/User/Home/Search.vue";
import categoryService from "@/services/category.service";


export default {
  name: "ShopView",
  components: {
    NavBar,
    AppFooter,
    Search,
    Pagination
  },
  data() {
    return {
      nameCategory: [], // Danh sách các danh mục
      productCategory: [], // Danh sách sản phẩm theo danh mục
      products: [],
      productAll: [],
      prices: [],
      cart: [],
      // selectedColor: null,
      page: 1,
      limit: 6,
      skip: 1,
      selectedProduct: null, 
       selectedCategory: null,

    };
  },

  async created() {
    try {
      await this.getCategory(); // Lấy danh sách danh mục
      await this.getProductCategory(); // Lấy sản phẩm cho từng danh mục
      await this.getProduct();
      await this.getAllProduct();
      await this.getPriceProduct();
      await this.addCartNonKV();
    } catch (error) {
      console.error("Error during component initialization:", error);
    }
  },
  watch: {
    products: {
      handler: "getPriceProduct",
      immediate: true // Gọi ngay lập tức khi component được tạo
    }
  },
  methods: {
   
    // selectColor(color) {
    //   this.selectedColor = color;
    //   const selectedAttachment = this.selectedProduct.LIST_FILE_ATTACHMENT.find(
    //     (item) => item.COLOR === color
    //   );
    //   if (selectedAttachment) {
    //     this.selectedProduct.LIST_FILE_ATTACHMENT_DEFAULT = [selectedAttachment];
    //   }
    // },

    async getAllProduct() {
      try {
        const product = await productService.getAllProduct();
        if (product && product.data) {
          this.productAll = product.data;
        }
      } catch (error) {
        console.log(error);
      }
    },
    async getCategory() {
      try {
        // Gọi service để lấy danh sách danh mục
        const response = await categoryService.getAll();
        if (response && response.data) {
          this.nameCategory = response.data;
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    },
    async getProductCategory() {
      try {
        // Gọi service để lấy sản phẩm cho từng danh mục
        const promises = this.nameCategory.map(async (category) => {
          const response = await productService.getProductByIdCategory(category._id);
          return response && response.data ? response.data : [];
        });
        this.productCategory = await Promise.all(promises);
      } catch (error) {
        console.error("Error fetching products by category:", error);
      }
    },
    filterProductsByCategory(categoryId) {
      this.selectedCategory = categoryId;
      // Lọc sản phẩm theo loại danh mục
      this.products = this.productAll.filter(product => product.CATEGORY_ID === categoryId);

    },
    getProductCountByCategory(categoryId, typeProductId) {
      // Tính số lượng sản phẩm trong danh mục và loại sản phẩm
      let count = 0;
      for (const product of this.productAll) {
        if (product.CATEGORY_ID === categoryId && product.TYPE_PRODUCT_ID === typeProductId) {
          count += 1;
        }
      }
  return count;
    },
    async getProduct() {
      try {
        const response = await productService.getAll(this.skip, this.limit);
        if (response && response.data) {
          this.products = response.data; // Lưu mảng sản phẩm vào this.products
          await this.getPriceProduct();
        } else {
          console.error("Unexpected response structure:", response);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        throw error; // Re-throw error to be caught by the caller
      }
    },
    myCallback() {
      this.skip = this.page; // Cập nhật skip từ page
      this.getProduct();
    },
    async getPriceProduct() {
      try {
        // Kiểm tra nếu this.products là một mảng
        if (Array.isArray(this.products)) {
          const prices = {};
          for (const product of this.products) {
            const response = await PriceService.getDefaultPrice(product._id);
            if (response && response.data && response.data[0]) {
              prices[product._id] = response.data[0].PRICE_NUMBER;
            } else {
              console.error("Unexpected response structure:", response);
            }
          }
          this.prices = prices; // Cập nhật trạng thái `prices`
        } else {
          console.error("products is not an array:", this.products);
        }
      } catch (error) {
        console.error("lỗi khi lấy giá:", error);
        throw error; // Re-throw error to be caught by the caller
      }
    },
    getPrice(productId) {
      const price = this.prices[productId];
      if (price) {
        return price;
      } else {
        return "Đang cập nhật giá";
      }
    },
    async addCartNonKV(productId) {
      try {
        const response = await cartService.addCart(productId);
        if (response && response.data) {
          const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 800,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.onmouseenter = Swal.stopTimer;
              toast.onmouseleave = Swal.resumeTimer;
            },
          });
          Toast.fire({
            icon: "success",
            title: "Thêm sản phẩm vào giỏ hàng thành công",
          });
        } else {
          console.error("Unexpected response structure:", response);
        }
      } catch (error) {
        console.error("lỗi khi thêm sp vào giỏ:", error);
      }
    },
    async filterProductsByPrice(sortOption) {
      try {
        switch (sortOption) {
          case "lowToHigh":
            this.products.sort((a, b) => {
              const priceA = this.getPrice(a._id);
              const priceB = this.getPrice(b._id);
              return priceA - priceB;
            });
            break;
          case "highToLow":
            this.products.sort((a, b) => {
              const priceA = this.getPrice(a._id);
              const priceB = this.getPrice(b._id);
              return priceB - priceA;
            });
            break;
          case "all":
          default:
            await this.getProduct(); // Call your method to fetch products again
            break;
        }
      } catch (error) {
        console.error("Error filtering products by price:", error);
      }
    },
     openModal(product) {
    this.selectedProduct = product;
  },
  closeModal() {
    this.selectedProduct = null;
    },
   openProductDetail(product) {
      this.selectedProduct = product; // Lưu sản phẩm được chọn vào biến selectedProduct
      ('#productDetailModal').modal('show'); // Hiển thị modal
    },
    
  },
};
</script>

<style>
.fruite-img {
  overflow: hidden;
  width: 305px;
  height: 350px;
  border-radius: 10px;
}

.fruite-img img {
  width: 100%; /*  hình ảnh luôn đầy đủ chiều rộng của khung */
  height: 100%; /* hình ảnh luôn đầy đủ chiều cao của khung */
  object-fit: cover; /* Hiển thị không biến dạng tỷ lệ */
}
.min-height {
  min-height: 595px;
  font-size: 1.4rem;
}
.size-text > h4 {
  font-size: 1.4rem;
}
.size-text p {
  font-size: 1.2rem;
}
.pagination {
  display: flex;
  justify-content: center;
}
.pagination .pagination-3 {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
}
.pagination .pagination-3 li {
  margin-right: 5px;
}
.pagination .pagination-3 li a {
  display: block;
  padding: 5px 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  text-decoration: none;
  color: #333;
}
.pagination .pagination-3 li.active a {
  background-color: #007bff;
  color: #fff;
}
.VuePagination__count {
  display: none;
}
.a{
  color: black;
}
.btn.border-secondary {
    margin: revert;
    transition: 0.5s;
}
/*slide*/
.custom-img-size {
  max-height: 400px;
  margin: 0 auto; 
  border-radius: 15px;
}
.slide-indi li {
  width: 12px !important; 
  height: 12px !important; 
  border-radius: 50%;  
  background-color: #fff; 
  margin: 9px 7px !important;
}
.slide.indi .active{
  width: 13px;
    height: 13px;
}
/*modal*/
.a{
  width: 80%;
}
.p{
  margin-top: 10px;
  font-family: cursive;
  font-size: large;
}
/*eyes*/
.eye-icon {
  position: absolute;
  top: 56%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: none;
  cursor: pointer;
}
.product-container {
  position: relative;
}

.product-container:hover .eye-icon {
  display: block;
}
.eye-icon:hover + .quick-view-text {
  display: block; /* Hiển thị quick-view-text khi di chuột vào eye-icon */
}

.quick-view-text {
  display: none; 
  position: absolute;
  top: 280px; 
  left: 51%; 
  transform: translateX(-50%);
  background-color: black; 
  color: white; 
  padding: 5px 10px; 
  border-radius: 36px; 
  z-index: 1; 
  font-size: small !important;
}
/*sáng lựa chọn*/
.fruite-categorie .a.active {
  color: #ff9300; 
}


</style>
