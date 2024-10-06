<template>
  <NavBar />
  <Search />
  <SinglePageHeaderVue />
  <div class="container-fluid py-5 mt-5">
    <div class="container py-5">
      <div class="row g-4 mb-5">
        <div class="col-lg-8 col-xl-12">
          <div class="row g-4">
            <div class="col-lg-6">
              <div class="border rounded">
                <div
                  id="carouselExampleControls"
                  class="carousel slide"
                  data-bs-ride="carousel"
                >
                  <div class="carousel-indicators">
                    <button
                      v-for="(item, index) in products.LIST_FILE_ATTACHMENT"
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
                      v-for="(item, index) in products.LIST_FILE_ATTACHMENT"
                      :key="index._id"
                      :class="['carousel-item', { active: index === 0 }]"
                      style="height: 100%"
                    >
                      <img
                        :src="item.FILE_URL"
                        class="d-block w-100"
                        style="object-fit: cover; height: 100%"
                        alt=""
                      />
                    </div>
                  </div>
                  <button
                    class="carousel-control-prev"
                    type="button"
                    data-bs-target="#carouselExampleControls"
                    data-bs-slide="prev"
                  >
                    <span
                      class="carousel-control-prev-icon"
                      aria-hidden="true"
                    ></span>
                    <span class="visually-hidden">Previous</span>
                  </button>
                  <button
                    class="carousel-control-next"
                    type="button"
                    data-bs-target="#carouselExampleControls"
                    data-bs-slide="next"
                  >
                    <span
                      class="carousel-control-next-icon"
                      aria-hidden="true"
                    ></span>
                    <span class="visually-hidden">Next</span>
                  </button>
                </div>
              </div>
            </div>

            <div class="col-lg-6">
              <h4 class="fw-bold mb-3">{{ products.NAME_PRODUCT }}</h4>
              <p class="mb-3">
                Danh mục: {{ getCategoryName(products.CATEGORY_ID) }}
              </p>
              <h5 class="fw-bold mb-3">
                {{
                  price.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })
                }}
              </h5>
             

              <div class="d-flex align-items-center mb-4">
                <div class="d-flex">
                  <span 
                    v-for="n in 5" 
                    :key="n" 
                    class="fa fa-star" 
                    :class="{ filled: n <= Math.round(averageRating) }">
                  </span>
                </div>
                <span class="ms-2">{{ averageRating.toFixed(1) }}/5</span>
              </div>

              
              <p class="mb-4">
                {{ products.SHORT_DESC }}
              </p>
              <div class="input-group quantity mb-5" style="width: 100px">
                <div class="input-group-btn">
                  <button
                    class="btn btn-sm btn-minus rounded-circle bg-light border"
                    @click="reduceQuanlity"
                  >
                    <i class="fa fa-minus"></i>
                  </button>
                </div>
                <input
                  type="text"
                  class="form-control form-control-sm text-center border-0"
                  :value="quantity"
                />
                <div class="input-group-btn">
                  <button
                    class="btn btn-sm btn-plus rounded-circle bg-light border"
                    @click="increaseQuanlity"
                  >
                    <i class="fa fa-plus"></i>
                  </button>
                </div>
              </div>
              <a
                @click.prevent="addToCartClick(products.ID)"
                href="#"
                class="btn border border-secondary rounded-pill px-4 py-2 mb-4 text-primary"
                ><i class="fa fa-shopping-bag me-2 text-primary"></i> Thêm vào
                giỏ hàng</a
              >

              <div class="flex KIoPj6 W5LiQM">
                <div class="flex flex-column">
                  <!-- Section for Colors -->
                  <section
                    v-if="!is_loading"
                    class="flex items-center"
                    style="margin-bottom: 24px; align-items: baseline"
                  >
                    <h3 class="From">
                      {{ products.LIST_PRODUCT_METADATA[0].KEY }}
                    </h3>
                    <div class="flex items-center colors">
                      <button
                        v-for="color in products.LIST_PRODUCT_METADATA[0].VALUE"
                        :key="color"
                        class="From2 selection-box-unselected btn-outline-success"
                        aria-label="color"
                        @click="selectColor(color)"
                        :class="{
                          'selection-box-selected': selectedColor === color,
                        }"
                      >
                        {{ color }}
                        <!--Hiễn thị các mảng button được lặp-->
                      </button>
                    </div>
                  </section>
                  <!-- Section for Sizes -->
                  <section
                    v-if="!is_loading"
                    class="flex items-center"
                    style="margin-bottom: 24px; align-items: baseline"
                  >
                    <h3 class="From">
                      {{ products.LIST_PRODUCT_METADATA[1].KEY }}
                    </h3>
                    <div class="flex items-center sizes">
                      <button
                        v-for="size in products.LIST_PRODUCT_METADATA[1].VALUE"
                        :key="size"
                        class="From2 selection-box-unselected btn-outline-success"
                        aria-label="size"
                        @click="selectSize(size)"
                        :class="{
                          'selection-box-selected': selectedSize === size,
                        }"
                      >
                        {{ size }}
                      </button>
                    </div>
                  </section>
                </div>
              </div>
              <nav>
                <div class="nav nav-tabs mb-3">
                  <button
                    class="nav-link active border-white border-bottom-0"
                    type="button"
                    role="tab"
                    id="nav-about-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#nav-about"
                    aria-controls="nav-about"
                    aria-selected="true"
                  >
                    Chi Tiết Sản Phẩm
                  </button>
                  <!-- <button
                    class="nav-link border-white border-bottom-0"
                    type="button"
                    role="tab"
                    id="nav-reviews-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#nav-reviews"
                    aria-controls="nav-reviews"
                    aria-selected="false"
                  >
                    Đánh Giá
                  </button> -->
                </div>
              </nav>
              <div class="tab-content mb-5">
                <div
                  class="tab-pane active"
                  id="nav-about"
                  role="tabpanel"
                  aria-labelledby="nav-about-tab"
                >
                  <p>
                    {{ products.DESC_PRODUCT }}
                  </p>
                </div>
                <div
                  class="tab-pane"
                  id="nav-reviews"
                  role="tabpanel"
                  aria-labelledby="nav-reviews-tab"
                >
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    <div class="review-container border rounded p-4">
        <h1 class="fw-bold mb-0">Đánh Giá sản phẩm</h1>
        
        <!-- Phần hiển thị điểm đánh giá trung bình -->
        <div class="d-flex align-items-center justify-content-between">
            <div class="average-info d-flex align-items-center">
                <h3 class="average-text me-2">
                    {{ averageRating.toFixed(1) }} / 5
                </h3>
                <div class="rating-stars d-flex">
                    <span v-for="n in 5" :key="n" class="TO fa fa-star me-1" :class="{ filled: n <= averageRating }"></span>
                </div>
            </div>
            <div class="filter-rating">
                <h3 class="rating-title">Xếp Hạng:</h3>
                <select v-model="selectedRating" @change="filterReviews(selectedRating)" class="rating-dropdown">
                    <option value="">-- Chọn số sao --</option>
                    <option v-for="n in 5" :key="n" :value="n">{{ n }} Sao</option>
                    <option value="all">Tất cả</option>
                </select>
            </div>
        </div>

        <div v-if="is_loading" class="text-muted mb-0">
            <p>Đang tải ...</p>
            <div class="spinner-border" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
          <!-- Phần hiển thị danh sách đánh giá -->
          <div v-if="reviews.length > 0">
              <div v-for="review in reviews" :key="review._id" class="review-card">
                  <div class="review-header">
                      <img :src="review.user_id.AVT_URL || '/img/avatar.jpg'" alt="Avatar" class="avatar">
                      <div class="user-info">
                          <p class="user-name">{{ review.user_id.EMAIL_USER }}</p>
                          <div class="rating-stars">
                              <span v-for="n in 5" :key="n" class="fa fa-star" :class="{ filled: n <= review.rating }"></span>
                          </div>
                      </div>
                  </div>
                  <div class="review-body">
                      <p class="comment">{{ review.comment }}</p>
                  </div>
                  <div class="review-footer">
                      <p class="timestamp">{{ new Date(review.created_at).toLocaleString() }} | {{ review.device_info }}</p>
                      <!-- <button v-if="userReview && userReview._id === review._id" @click="deleteReview(review._id)" class="btn btn-danger btn-sm">Xóa</button> -->
                  </div>
              </div>
          </div>
          <div v-else class="no-reviews">
              <p>Chưa có đánh giá nào cho sản phẩm này.</p>
          </div>

          <h5 class="mb-5 fw-bold">Gửi Đánh Giá</h5>

          <!-- Form hiển thị đánh giá của người dùng nếu đã có -->
          <div v-if="userReview">
              <h5 class="fw-bold">Đánh Giá Của Bạn</h5>
              <div class="review-card">
                  <div class="review-header">
                      <!-- Kiểm tra avatar_url nếu có, nếu khng thì hiển thị hình mặc định -->
                <img :src="userReview.user_id.AVT_URL || '/img/avatar.jpg'" alt="Avatar" class="avatar">
                      <div class="user-info">
                          <p class="user-name">{{ userReview.user_id.EMAIL_USER }}</p>
                          <div class="rating-stars">
                              <span v-for="n in 5" :key="n" class="fa fa-star" :class="{ filled: n <= userReview.rating }"></span>
                          </div>
                      </div>
                  </div>
                  <div class="review-body">
                      <p class="comment">{{ userReview.comment }}</p>
                  </div>
                  <div class="review-footer">
                      <p class="timestamp">{{ new Date(userReview.created_at).toLocaleString() }}</p>
                      <button @click="deleteReview(userReview._id)" class="btn btn-danger btn-sm">Xóa Đánh Giá</button>
                  </div>
              </div>
          </div>
          
          <!-- Form gửi đánh giá mới nếu người dùng chưa có đánh giá -->
          <div v-else>
              <form @submit.prevent="submitReview">
                  <div class="row g-2">
                      <div class="col-lg-12">
                          <div class="rating-selection border-bottom rounded">
                              <label for="rating" class="form-label">Đánh giá:</label>
                              <div class="rating-stars">
                                  <span v-for="n in 5" :key="n" class="star fa fa-star" :class="{ filled: n <= newReview.rating }" @click="setRating(n)"></span>
                              </div>
                          </div>
                      </div>
                      <div class="col-lg-12">
                          <div class="border-bottom rounded my-4">
                              <label for="comment" class="form-label">Nhận xét:</label>
                              <textarea v-model="newReview.comment" class="form-control border-0" required></textarea>
                          </div>
                      </div>
                      <div class="col-lg-12 text-end">
                          <button type="submit" class="btn border border-secondary text-primary rounded-pill px-3 py-2">Gửi Đánh Giá</button>
                      </div>
                  </div>
              </form>
          </div>
      </div>
    <!--From sản Phẩm liên quan-->
      <h1 class="fw-bold mb-0">Sản phẩm liên quan</h1>
      <div class="row g-4">
        <div
          v-for="product in productCategory.flat()"
          :key="product._id"
          class="col-md-6 col-lg-4 col-xl-3"
        >
          <router-link
            :to="{ name: 'UserDetail', params: { id: product._id } }"
          >
            <div>
              <img
                v-if="
                  product.LIST_FILE_ATTACHMENT_DEFAULT &&
                  product.LIST_FILE_ATTACHMENT_DEFAULT.length > 0
                "
                :src="product.LIST_FILE_ATTACHMENT_DEFAULT[0].FILE_URL"
                class="img-fluid-a rounded"
                :alt="product.NAME_PRODUCT"
              />
              <div class="card-body">
                <h5 class="card-title">{{ product.NAME_PRODUCT }}</h5>
                <p class="fw-bold mb-3">
                  {{
                    product.price.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })
                  }}
                </p>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
  <AppFooter />
</template>

<script>
import productService from "@/services/product.service";
import PriceService from "@/services/price.service";
import NavBar from "@/components/User/layout/NavBar.vue";
import AppFooter from "@/components/User/layout/AppFooter.vue";
import cartService from "@/services/cart.service";
import categoryService from "@/services/category.service";
import Search from "@/components/User/Home/Search.vue";
import Swal from "sweetalert2";
import getCookie from "@/utils/getCookie";
import priceService from "@/services/price.service";
import SinglePageHeaderVue from "../components/User/detail/SinglePageHeader.vue";
import ReviewService from "../services/review.service";
export default {
  name: "UserDetail",
  components: {
    NavBar,
    AppFooter,
    Search,
    SinglePageHeaderVue,
  },

  data() {
    return {
      products: [],
      price: [],
      reviews: [],
      priceKV: [],
      cart: [],
      prices: {},
      productCategory: [],
      nameCategory: [],
      avatarUrl: '',
      selectedColor: null,
      selectedSize: null,
      is_loading: true, // chạy loading trước sao đó mới gọi api
      quantity: 1,
      image_url: "",
      newReview: { // Thêm biến để chứa thông tin đánh giá mới
        rating: null,
        comment: "",
      },
      averageRating: 0,
      selectedRating: "",
      userReview: null, // Thêm biến để lưu đánh giá của người dùng
    
 
    };
  },
  computed: {
    allProducts() {
      return this.productCategory.flat();
    },
    defaultPrice() {
      if (this.products._id) {
        return this.getPriceDefault(this.products._id);
      }
      return 0; // hoặc giá trị mặc định nếu không có sản phẩm nào được chọn
    },

    // // Tính toán số lượng trang dựa trên tổng số đánh giá và số lượng đánh giá mỗi trang
    // totalPages() {
    //   return Math.ceil(this.reviews.length / this.itemsPerPage);
    // },
    // // Các đánh giá hiện tại được hiển thị dựa trên phân trang
    // paginatedReviews() {
    //   const start = (this.currentPage - 1) * this.itemsPerPage;
    //   const end = start + this.itemsPerPage;
    //   return this.reviews.slice(start, end);
    // },
  },
  
  watch: {
    "$route.params.id": {
      immediate: true, // Kích hoạt ngay lập tức khi component được tạo
      handler(newId, oldId) {
        if (newId !== oldId) {
          // Nếu id sản phẩm mới khác với id sản phẩm cũ
          this.getProduct();
          this.getReviews();// Gọi lại phương thức getProduct để tải lại dữ liệu sản phẩm mới
        }
      },
    },
  },
  mounted() {
    // this.loadReviews(); // Tải danh sách đánh giá khi component được mount
},
  async created() {
    try {
      await this.getProduct();

      await this.getPriceProduct();
      console.log("sản phẩm được lấy về", this.products);
      await this.getCategory();

      await this.getProductCategory();

      await this.selectColor();
     
      await this.getReviews();
      console.log(" các đánh giá ", this.reviews);
       await this.checkUserReview(); // Kiểm tra đánh giá của người dùng
      await this.getPriceKV();
      console.log("sp theo cate", this.productCategory);
    } catch (error) {
      console.error(error);
    }
  },

  methods: {
    async getProduct() {
      try {
        const productId = this.$route.params.id;
        console.log("ID sản phẩm từ URL:", productId);
        const response = await productService.getById(productId);
        if (response && response.data) {
          this.is_loading = false;
          this.products = response.data;
          await this.getPriceProduct();
          // await this.getPriceProduct(this.products._id);
          console.log("Dữ liệu sản phẩm:", this.products); // Log dữ liệu sản phẩm để kiểm tra
        } else {
          console.error("Unexpected response structure:", response);
        }
      } catch (error) {
        console.error(error);
      }
    },
    setRating(value) {
      this.newReview.rating = value; // Cập nhật số sao khi người dùng chọn
    },
    // //phân trang
    //  goToPage(page) {
    //   if (page > 0 && page <= this.totalPages) {
    //     this.currentPage = page;
    //   }
    // },
    async submitReview() {
      try {
        const productId = this.$route.params.id;

        // Kiểm tra dữ liệu đầu vào
        if (!this.newReview.rating || !this.newReview.comment) {
          Swal.fire({
            icon: 'error',
            title: 'Lỗi',
            text: 'Bạn phải nhập đủ số sao và bình luận!',
            confirmButtonText: 'OK',
          });
          return;
        }

        // Chuẩn bị dữ liệu review
        const reviewData = {
          rating: this.newReview.rating,
          comment: this.newReview.comment,
        };

        // Gửi dữ liệu review đến server
        const response = await ReviewService.createReview(productId, reviewData);
        if (response && response.review) {
          Swal.fire({
            icon: "success",
            title: "Đánh giá thành công!",
            text: "Cảm ơn bạn đã gửi đánh giá.",
            confirmButtonText: 'OK',
          });
          // this.reviews.push(response.review);
          this.newReview.rating = null;
          this.newReview.comment = "";
          this.userReview = response.review; // Lưu lại đánh giá của người dùng
          // Tải lại danh sách đánh giá
          await this.getReviews(); // Gọi lại hàm để tải lại danh sách đánh giá
          await this.checkUserReview(); // Cập nhật đánh giá của người dùng
          this.calculateAverageRating(); // Tính lại điểm trung bình
        } else {
          console.error("Lỗi khi gửi đánh giá:", response);
          Swal.fire({
            icon: 'error',
            title: 'Lỗi',
            text: 'Đã xảy ra lỗi khi gửi đánh giá!',
            confirmButtonText: 'OK',
          });
        }
      } catch (error) {
        console.error("Lỗi khi gửi đánh giá:", error);
      }
    },
    async deleteReview(reviewId) {
    try {
        const response = await ReviewService.deleteReview(reviewId); // Gọi API để xóa đánh giá
        console.log("Phản hồi từ server:", response);
        
        // Kiểm tra phản hồi từ server
        if (response && response.message === "Xóa đánh giá thành công") {
            this.is_loading = true; // Bắt đầu loading
            // Lọc danh sách đánh giá để xóa đánh giá đã chọn
            this.reviews = this.reviews.filter(review => review._id !== reviewId);
            this.userReview = null; // Xóa đánh giá của người dùng
            
            // Tính lại điểm trung bình
            this.calculateAverageRating(); // Tính lại điểm trung bình
            
            // Hiển thị thông báo thành công
            await Swal.fire({
                icon: "success",
                title: "Xóa đánh giá thành công!",
                text: "Đánh giá của bạn đã được xóa.",
                confirmButtonText: 'OK',
            });

            // Tải lại danh sách đánh giá
            await this.getReviews(); // Gọi lại hàm để tải lại danh sách đánh giá
            this.is_loading = false; // Kết thúc loading
        }
          } catch (error) {
              console.error("Lỗi khi xóa đánh giá:", error);
              this.is_loading = false; // Kết thúc loading trong trường hợp lỗi
              // Hiển thị thông báo lỗi
              await Swal.fire({
                  icon: 'error',
                  title: 'Lỗi',
                  text: 'Đã xảy ra lỗi khi xóa đánh giá!',
                  confirmButtonText: 'OK',
              });
          }
        },

    async getReviews() {
      try {
        const productId = this.$route.params.id;
        const response = await ReviewService.getProductReviews(productId); // Gọi API để lấy đánh giá

        // Log phản hồi từ server để kiểm tra cấu trúc
        console.log("Phản hồi từ server:", response);

        // Nếu response trả về một mảng trực tiếp, không cần kiểm tra response.data
        if (response && Array.isArray(response)) {
          this.reviews = response; // Lưu trực tiếp response vào biến reviews
          this.calculateAverageRating();
          await this.getReviewsByRating("");
          console.log("Đánh giá sản phẩm:", this.reviews); // Log các đánh giá
        } else {
          this.reviews = response.review || []; // Cập nhật lại nếu server trả về cấu trúc khác
          this.calculateAverageRating();
        }
      } catch (error) {
        console.error("Lỗi khi lấy đánh giá:", error);
      }
    },
    async checkUserReview() {
      try {
          const productId = this.$route.params.id;
          const response = await ReviewService.getReviewsByProductId(productId);
          
          if (response && response.userReview) { // Kiểm tra nếu có đánh giá
              this.userReview = response.userReview; // Lưu đánh giá của người dùng
          } else {
              this.userReview = null; // Nếu không có đánh giá
        }
      } catch (error) {
          console.error("Lỗi khi kiểm tra đánh giá của người dùng:", error);
      }
    },


    calculateAverageRating() {
    if (this.reviews.length === 0) {
        this.averageRating = 0; // Không có đánh giá
        console.log("Không có đánh giá, trung bình là 0");
        return;
    }

    // Ghi log đánh giá để kiểm tra
    console.log("Đánh giá hiện tại:", this.reviews);
    
    const totalRating = this.reviews.reduce((sum, review) => {
        if (typeof review.rating !== 'number') {
            console.warn("Đánh giá không hợp lệ:", review);
            return sum; // Bỏ qua đánh giá không hợp lệ
        }
        return sum + review.rating;
    }, 0);

    this.averageRating = totalRating / this.reviews.length; // Tính trung bình
    console.log("Điểm trung bình mới:", this.averageRating);
},

    filterReviews(rating) {
      if (rating === "all") {
        this.getReviews(); // Nếu chọn "Tất cả", lấy tất cả đánh giá
      } else {
        // Gọi API để lọc đánh giá theo số sao
        this.getReviewsByRating(rating);
      }
    },
    async getReviewsByRating(rating) {
      try {
        const productId = this.$route.params.id; // Lấy ID sản phẩm từ route
        const response = await ReviewService.getReviewsByRating(productId, rating);
        if (response && response.review) {
          this.reviews = response.review; // Cập nhật danh sách đánh giá
        }
      } catch (error) {
        console.error("Lỗi khi lấy đánh giá:", error);
      }
    },

    async getPriceProduct() {
      try {
        const response = await PriceService.getDefaultPrice(
          this.$route.params.id
        );
        if (response && response.data && response.data[0]) {
          this.price = response.data[0].PRICE_NUMBER;
        } else {
          console.error("Unexpected response structure:", response);
        }
      } catch (error) {
        console.error("lỗi khi lấy giá:", error);
        throw error; // Re-throw error to be caught by the caller
      }
    },
    async addToCartClick() {
      try {
        if (getCookie("access_token")) {
          const productId = this.$route.params.id;
          const colorKey = this.products.LIST_PRODUCT_METADATA[0].KEY;
          const sizeKey = this.products.LIST_PRODUCT_METADATA[1].KEY;
          const selectedColorValue = this.selectedColor;
          const selectedSizeValue = this.selectedSize;
          const payload = {
            key: [colorKey, sizeKey],
            value: [selectedColorValue, selectedSizeValue],
            number: this.quantity,
          };
          const response = await cartService.addToCart(productId, payload);
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
            // console.log("Đã thêm sản phẩm vào giỏ hàng:", response.data);
            // console.log(`${colorKey}:${selectedColorValue}, ${sizeKey}:${selectedSizeValue}`);
          } else {
            console.error("Lỗi khi thêm vào giỏ hàng:", response);
          }
        } else {
          Swal.fire({
            title: "Bạn chưa đăng nhập?",
            text: "hãy đăng nhập để thêm sản phẩm vào giỏ hàng",
            icon: "question",
          });
        }
      } catch (error) {
        console.error(error.message);
      }
    },
    async getPriceDefault(id) {
      try {
        let price = 0;
        const response = await priceService.getDefaultPrice(id);

        if (response && response.data && response.data.length > 0) {
          price = response.data[0].PRICE_NUMBER;
        } else {
          console.error("No default price found for product ID:", id);
          // Bạn có thể xử lý thêm ở đây nếu cần
        }

        return price;
      } catch (error) {
        console.error("Error fetching default price:", error.message);
        throw error; // Ném lỗi để xử lý ở phía gọi hàm nếu cần
      }
    },
    async getPriceKV() {
      try {
        const productId = this.$route.params.id;
        const colorKey = this.products.LIST_PRODUCT_METADATA[0].KEY;
        const sizeKey = this.products.LIST_PRODUCT_METADATA[1].KEY;
        const selectedColorValue = this.selectedColor;
        const selectedSizeValue = this.selectedSize;

        // Truyền thông tin key và value dưới dạng query parameters
        const response = await PriceService.getPriceKeyValue(productId, {
          key: [colorKey, sizeKey],
          value: [selectedColorValue, selectedSizeValue],
        });

        if (response && response.data) {
          this.priceKV = response.data;
          console.log("Mảng price kv:", this.priceKV);
        } else {
          console.error("Unexpected response structure:", response);
        }
      } catch (error) {
        console.error(error.message);
      }
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
        const categoryId = this.products.CATEGORY_ID; // Lấy CATEGORY_ID của sản phẩm hiện tại
        const productPromises = this.nameCategory.map(async (category) => {
          if (category._id === categoryId) {
            const response = await productService.getProductByIdCategory(
              category._id
            );
            if (response && response.data) {
              const relatedProducts = response.data.filter(
                (product) => product._id !== this.products._id
              );

              // Lấy giá cho từng sản phẩm liên quan
              for (const product of relatedProducts) {
                const priceResponse = await priceService.getDefaultPrice(
                  product._id
                );
                if (
                  priceResponse &&
                  priceResponse.data &&
                  priceResponse.data.length > 0
                ) {
                  product.price = priceResponse.data[0].PRICE_NUMBER;
                } else {
                  product.price = 0; // Hoặc giá trị mặc định nếu không có giá
                }
              }

              return relatedProducts;
            }
            return [];
          }
          return []; // Trả về mảng rỗng nếu không phải danh mục hiện tại
        });
        this.productCategory = await Promise.all(productPromises);
      } catch (error) {
        console.log("error", error);
      }
    },

    getCategoryName(categoryId) {
      const category = this.nameCategory.find((cat) => cat._id === categoryId);
      return category ? category.CATEGORY_NAME : "Không xác định";
    },
    selectColor(color) {
      this.selectedColor = color;
      this.getPriceKV();
    },
    selectSize(size) {
      this.selectedSize = size;
      this.getPriceKV();
    },

    increaseQuanlity() {
      this.quantity++;
    },
    reduceQuanlity() {
      if (this.quantity > 1) {
        this.quantity--;
      }
    },
  },
};

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded and parsed");
  const colorButtons = document.querySelectorAll(".colors button");
  const sizeButtons = document.querySelectorAll(".sizes button");
  let selectedColor = null;
  let selectedSize = null;

  colorButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Xóa lớp 'selection-box-selected' khỏi tất cả các nút màu sắc
      colorButtons.forEach((btn) =>
        btn.classList.remove("selection-box-selected")
      );
      // Thêm lớp 'selection-box-selected' vào nút được nhấn
      button.classList.add("selection-box-selected");
      // Lưu lại màu đã chọn
      selectedColor = button;
    });
  });

  sizeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Xóa lớp 'selection-box-selected' khỏi tất cả các nút kích cỡ
      sizeButtons.forEach((btn) =>
        btn.classList.remove("selection-box-selected")
      );
      // Thêm lớp 'selection-box-selected' vào nút được nhấn
      button.classList.add("selection-box-selected");
      // Lưu lại kích cỡ đã chọn
      selectedSize = button;
    });
  });

  // Kiểm tra và giữ lại lựa chọn khi chuyển đổi giữa màu sắc và kích cỡ
  document.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      if (selectedColor) selectedColor.classList.add("selection-box-selected");
      if (selectedSize) selectedSize.classList.add("selection-box-selected");
    });
  });
});
</script>

<style>
body {
  font-family: Arial, sans-serif;
}

.flex {
  display: flex;
}

.flex-column {
  flex-direction: column;
}

.items-center {
  align-items: center;
}

.KIoPj6 {
  padding: 16px;
}

.W5LiQM {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.From {
  margin: 0 16px 0 0;
  font-size: 18px;
  font-weight: bold;
}

.colors {
  gap: 8px;
}
.sizes {
  gap: 8px;
}

.From2 {
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #fff;
  cursor: pointer;
}

.selection-box-unselected:hover {
  border-color: #aaa;
}

.selection-box-unselected:focus {
  outline: none;
  border-color: #007bff;
}

.suQW3X {
  border: 1px solid #ddd;
  background-color: #fff;
  padding: 8px;
  cursor: pointer;
}

.shopee-svg-icon {
  width: 10px;
  height: 10px;
}

.u00pLG {
  text-align: center;
  width: 40px;
  border: none;
  outline: none;
}

.Bf9ap6 {
  display: none;
}
.img-fluid-a {
  max-width: 84%;
  height: 285px;
}

/* CSS code */
.selection-box-selected {
  border: 2px solid blue;
  background-color: rgb(247, 243, 242);
}
a {
  color: #000000;
  text-decoration: none;
}

/*related*/
.card-body {
  padding: 1rem;
}
/* .card-body img {
  width: 100%; 
  height: auto; 
} */
.product-container {
  margin-bottom: 1.5rem; /* Khoảng cách giữa các sản phẩm */
}
.card-img-top {
  object-fit: cover;
  height: 200px; /* Chiều cao cố định cho hình ảnh */
}
.mb-0 {
  margin-bottom: 14px !important;
}


/*cmt*/
.review-card {
    background-color: #fff; /* Nền trắng cho mỗi khung đánh giá */
    border-radius: 8px; /* Bo tròn góc */
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Đổ bóng nhẹ */
    padding: 15px; /* Khoảng cách bên trong */
    margin-bottom: 20px; /* Khoảng cách giữa các khung đánh giá */
    transition: transform 0.2s; /* Hiệu ứng khi di chuột */
    cursor: pointer; /* Cho phép người dùng nhấp chuột */
}

.review-card:hover {
    transform: scale(1.02); /* Phóng to nhẹ khi di chuột */
}

.review-header {
    display: flex; /* Sử dụng flexbox để căn chỉnh các phần tử */
    align-items: center; /* Căn giữa theo chiều dọc */
}

.avatar {
    width: 50px; /* Kích thước ảnh đại diện */
    height: 50px; /* Kích thước ảnh đại diện */
    border-radius: 50%; /* Bo tròn ảnh đại diện */
    margin-right: 10px; /* Khoảng cách bên phải của ảnh đại diện */
}

.user-info {
    flex-grow: 1; /* Cho phép phần thông tin người dùng mở rộng */
}

.user-name {
    font-weight: bold; /* Đậm tên người dùng */
    margin-bottom: 5px; /* Khoảng cách bên dưới tên người dùng */
        cursor: pointer; /* Đặt lại con trỏ thành dấu mũi tên khi hover */

}

.rating-stars .star {
    color: #ccc; /* Màu sắc cho các sao chưa được chọn */
    font-size: 18px; /* Kích thước sao */
}

.rating-stars .star.filled {
    color: #ffcc00; /* Màu vàng cho sao đã được chọn */
}

.review-body {
    margin-top: 10px; /* Khoảng cách giữa tiêu đề và nội dung đánh giá */
}

.comment {
    font-size: 16px; /* Kích thước chữ cho nội dung đánh giá */
    line-height: 1.5; /* Khoảng cách dòng */
}

.review-footer {
    margin-top: 10px; /* Khoảng cách giữa nội dung đánh giá và chân khung */
    font-size: 12px; /* Kích thước chữ nhỏ cho thông tin thêm */
    color: #666; /* Màu sắc nhạt cho thông tin thêm */
}

.star {
  padding: 10px; /* Tăng khoảng cách giữa các ngôi sao */
}

.star:hover, .star:focus {
  color: #ffd700; /* Hiệu ứng khi di chuột qua ngôi sao */
}

.filled {
  color: #ffd700; /* Màu vàng cho ngôi sao đã chọn */
}

/*số sao tổng*/
.text-secondary {
    color: #ccc; /* Màu cho sao chưa được chọn (màu xám) */
}

.text-warning {
    color: #ffd700; /* Màu cho sao đã được chọn (màu vàng) */
}

.average-text {
  font-size: 16px; /* Kích thước chữ vừa phải */
  font-weight: normal; /* Không in đậm */
  font-style: normal; /* Đảm bảo chữ không bị nghiêng */
  color: #333; /* Màu chữ tối hơn để dễ nhìn */
}

/*xếp hạng*/
.filter-rating {
  display: flex; /* Sử dụng flexbox để sắp xếp các phần tử */
  align-items: center; /* Căn giữa theo chiều dọc */
  justify-content: flex-end; /* Đẩy phần tử sang bên phải */
  margin: 20px; /* Khoảng cách từ các cạnh */
}

.rating-dropdown {
  margin-left: 10px; /* Khoảng cách giữa tiêu đề và dropdown */
}
.rating-title {
    font-size: 0.9rem; /* Giảm kích thước chữ "Xếp Hạng" */
    margin-bottom: 0; /* Đảm bảo không có khoảng cách thừa */
}
.rating-stars .TO{
  font-size: 1.5rem; /* Tăng kích thước sao */
}

/*Khung đánh giá*/
.review-container {
    background-color: #f9f9f9; /* Màu nền cho khung */
    border: 1px solid #ddd; /* Đường viền */
    border-radius: 8px; /* Bo góc khung */
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* Đổ bóng cho khung */
    margin: 20px 0; /* Khoảng cách phía trên và dưới */
    padding: 20px; /* Khoảng cách bên trong khung */
}
/*Phân trang*/
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}
.pagination button {
  padding: 5px 10px;
  margin: 0 5px;
  border: 1px solid #ccc;
  background-color: #f8f9fa;
  cursor: pointer;
}
.pagination button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
.pagination span {
  margin: 0 10px;
}

</style>
