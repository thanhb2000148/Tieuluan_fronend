<template>
  <div class="wrapper">
    <Slider />
    <div class="main">
      <Nav />
      <main class="content px-3 py-2">
        <div class="container-fluid">
          <h1 class="page-title">Thêm sản phẩm</h1>
          
          <div v-if="loading" class="loading-indicator">
            <p>Đang thêm sản phẩm, vui lòng chờ...</p>
          </div>

          <div v-if="!successMessage"> <!-- Chỉ hiển thị form nếu không có thông báo thành công -->
            <form @submit.prevent="submitForm" class="product-form">
              <div class="form-group">
                <label for="name">Tên Sản Phẩm</label>
                <input
                  v-model="product.name"
                  type="text"
                  class="form-control"
                  id="name"
                  placeholder="Nhập tên sản phẩm"
                  @input="validateName"
                />
                <div v-if="errors.name" class="text-danger">{{ errors.name }}</div>
              </div>

              <div class="form-group">
                <label for="short_desc">Mô Tả Ngắn</label>
                <input
                  v-model="product.short_desc"
                  type="text"
                  class="form-control"
                  id="short_desc"
                  placeholder="Nhập mô tả ngắn"
                  @input="validateShortDesc"
                />
                <div v-if="errors.short_desc" class="text-danger">{{ errors.short_desc }}</div>
              </div>

              <div class="form-group">
                <label for="desc_product">Mô Tả Chi Tiết</label>
                <textarea
                  v-model="product.desc_product"
                  class="form-control"
                  id="desc_product"
                  rows="3"
                  placeholder="Nhập mô tả chi tiết"
                  @input="validateDescProduct"
                ></textarea>
                <div v-if="errors.desc_product" class="text-danger">{{ errors.desc_product }}</div>
              </div>
              
              <div class="form-group">
                <label for="category_id">Danh Mục</label>
                <select v-model="product.category_id" class="form-control" id="category_id">
                  <option v-if="categories.length === 0" disabled>Không có danh mục nào</option>
                  <option v-for="category in categories" :key="category._id" :value="category._id">
                    {{ category.CATEGORY_NAME }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label for="size">Kích Cỡ (Nhập các kích cỡ, cách nhau bởi dấu phẩy)</label>
                <input
                  v-model="sizeInput"
                  type="text"
                  class="form-control"
                  id="size"
                  placeholder="Nhập kích cỡ (vd: S, M, L)"
                  @input="validateSize"
                />
              </div>

              <div class="form-group">
                <label for="color">Màu Sắc (Nhập các màu sắc, cách nhau bởi dấu phẩy)</label>
                <input
                  v-model="colorInput"
                  type="text"
                  class="form-control"
                  id="color"
                  placeholder="Nhập màu sắc (vd: Đen, Trắng)"
                  @input="validateColor"
                />
              </div>

              <div class="form-group">
                <label for="thumbnail">Ảnh đại diện sản phẩm</label>
                <input
                  type="file"
                  class="form-control"
                  id="thumbnail" 
                  @change="handleFileChange($event, 'thumbnail')"
                />
              </div>

             <div class="form-group">
  <label for="detail_images">Ảnh Chi Tiết Sản Phẩm</label>
  <p class="helper-text">Bạn có thể thêm nhiều ảnh chi tiết để làm rõ hơn về sản phẩm.</p>
  <button type="button" class="btn btn-success mb-2" @click="addDetailImageInput">
    <i class="fas fa-plus"></i> Thêm Ảnh Chi Tiết
  </button>
  <div v-for="(image, index) in uploadedDetailImages" :key="index" class="mt-2">
    <input
      type="file"
      class="form-control"
      :id="'detail_images_' + index"
      @change="handleFileChange($event, index)"
    />
  </div>
</div>


              <button type="submit" class="btn btn-primary" :disabled="loading">
                <span v-if="loading">Đang xử lý...</span>
                <span v-else>Thêm Sản Phẩm</span>
              </button>
            </form>
          </div>
          
          <div v-if="successMessage" class="alert alert-success mt-3">
            {{ successMessage }}
          </div>
        </div>
      </main>
    </div>
  </div>
</template>



<script>
import axios from 'axios';
import Swal from "sweetalert2";

import Slider from "../components/admin/Slider.vue";
import Nav from "../components/admin/Nav.vue";
import CategoryService from "../services/category.service";
import ProductService from "../services/product.service"; // Nhập ProductService


export default {
  name: "DashboardAddProduct",
  components: {
    Slider,
    Nav,
  },
  data() {
    return {
      product: {
        name: "",
        short_desc: "",
        desc_product: "",
        category_id: "",
        size: [],
        color: [],
        thumbnail: null,
        detail_images: [], // Thay đổi thành mảng để chứa nhiều ảnh
      },
      categories: [], // Mảng để lưu trữ danh mục
      sizeInput: "", // Để lấy input từ người dùng cho kích cỡ
      colorInput: "", // Để lấy input từ người dùng cho màu sắc
      previewThumbnailUrl: null, // Biến để lưu đường dẫn xem trước của ảnh đại diện
      previewDetailUrls: [], // Biến để lưu đường dẫn xem trước của ảnh chi tiết
       // Mảng để chứa các file chi tiết sản phẩm
      uploadedDetailImages: [],
      loading: false, // Thêm biến loading
            successMessage: "", // Thêm biến cho thông báo thành công

     errors: {},

    };
  },
  mounted() {
    this.fetchCategories(); // Gọi API khi component được mount
  },
  methods: {
     resetForm() {
      this.product = {
        name: "",
        short_desc: "",
        desc_product: "",
        category_id: "",
        size: [],
        color: [],
        thumbnail: null,
        detail_images: [],
      };
    this.sizeInput = "";
    this.colorInput = "";
    this.previewThumbnailUrl = null;
    this.previewDetailUrls = [];
    this.uploadedDetailImages = [];
      this.errors = {}; // Reset lỗi
    // Đặt lại các file input 
  const thumbnailInput = document.getElementById("thumbnail");
    if (thumbnailInput) {
      thumbnailInput.value = null; // Đặt lại giá trị file
    }
    this.uploadedDetailImages.forEach((_, index) => {
      const detailImageInput = document.getElementById(`detail_images_${index}`);
      if (detailImageInput) {
        detailImageInput.value = null; // Đặt lại giá trị file
      }
    });
  },
    async fetchCategories() {
      try {
        const response = await CategoryService.getAll();  // Gọi service để lấy dữ liệu danh mục
        this.categories = response.data;  // Lưu mảng danh mục vào categories
        console.log("Danh sách danh mục:", this.categories); // Kiểm tra dữ liệu
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
      }
    },
    async uploadImage(file) {
      try {
        const formData = new FormData();
        formData.append('image', file); // Thêm file vào FormData

        // Gọi API upload ảnh
        const response = await axios.post('http://localhost:8000/v1/upload/', formData);
        return response.data.data.url; // Trả về URL ảnh từ API

      } catch (error) {
        console.error('Lỗi khi tải ảnh lên:', error);
        return null; // Trả về null nếu có lỗi
      }
    },

    addDetailImageInput() {
      this.uploadedDetailImages.push(null); // Thêm một entry mới vào mảng
    },
  

    handleFileChange(event, index) {
      const files = event.target.files;
      // Xử lý ảnh thumbnail
      if (event.target.id === 'thumbnail') {
        this.product.thumbnail = files[0]; // Lưu file ảnh thumbnail
        if (this.product.thumbnail) {
          this.previewThumbnailUrl = URL.createObjectURL(this.product.thumbnail); // Xem trước ảnh thumbnail
        }
      } 
      
      // Xử lý ảnh chi tiết
      else if (files.length > 0) {
        this.product.detail_images[index] = files[0]; // Lưu file ảnh chi tiết vào mảng theo index
        this.previewDetailUrls[index] = URL.createObjectURL(this.product.detail_images[index]); // Xem trước ảnh chi tiết
      }
    },
     validateName() {
      if (!this.product.name) {
        this.errors.name = "Tên sản phẩm không được để trống.";
      } else {
        delete this.errors.name; // Xóa thông báo lỗi nếu nhập đúng
      }
    },
    validateShortDesc() {
      if (!this.product.short_desc) {
        this.errors.short_desc = "Mô tả ngắn không được để trống.";
      } else {
        delete this.errors.short_desc; // Xóa thông báo lỗi nếu nhập đúng
      }
    },
    validateDescProduct() {
      if (!this.product.desc_product) {
        this.errors.desc_product = "Mô tả chi tiết không được để trống.";
      } else {
        delete this.errors.desc_product; // Xóa thông báo lỗi nếu nhập đúng
      }
    },
    validateSize() {
      const sizes = this.sizeInput.split(',').map(size => size.trim()); // Tách và trim kích cỡ
      if (sizes.length === 0 || sizes.some(size => !size)) {
        this.errors.size = "Ít nhất một kích cỡ cần được nhập.";
      } else {
        this.errors.size = null; // Xóa thông báo lỗi nếu nhập đúng
        this.product.size = sizes; // Cập nhật kích cỡ vào sản phẩm
      }
    },
    validateColor() {
      const colors = this.colorInput.split(',').map(color => color.trim()); // Tách và trim màu sắc
      if (colors.length === 0 || colors.some(color => !color)) {
        this.errors.color = "Ít nhất một màu sắc cần được nhập.";
      } else {
        this.errors.color = null; // Xóa thông báo lỗi nếu nhập đúng
        this.product.color = colors; // Cập nhật màu sắc vào sản phẩm
      }
    },

    async submitForm() {  
      this.loading = true; // Bắt đầu loading
      this.errors = {}; // Reset các lỗi trước khi kiểm tra
      this.successMessage = ""; // Reset thông báo thành công

      // Chia chuỗi kích cỡ và màu sắc thành mảng
      const sizes = this.sizeInput.split(',').map(item => item.trim());
      const colors = this.colorInput.split(',').map(item => item.trim());

      // Tạo đối tượng sản phẩm theo định dạng yêu cầu
      const productToSubmit = {
        name: this.product.name,
        short_desc: this.product.short_desc,
        desc_product: this.product.desc_product,
        category_id: this.product.category_id,
        size: sizes,
        color: colors,
        file_attachments: [],
        file_attachmentsdefault: [],
      };
      // Xử lý ảnh thumbnail
      if (this.product.thumbnail) {
        const thumbnailUrl = await this.uploadImage(this.product.thumbnail); // Đảm bảo uploadImage là async
        if (thumbnailUrl) {
          productToSubmit.file_attachmentsdefault.push({
            file_url: thumbnailUrl,
            file_type: "image",
          });
        } else {
          console.error("Lỗi khi tải ảnh đại diện lên");
          return; // Dừng lại nếu có lỗi
        }
      }

      // Xử lý ảnh chi tiết
      for (let file of this.product.detail_images) {
        const detailImageUrl = await this.uploadImage(file); // Đảm bảo uploadImage là async
        if (detailImageUrl) {
          productToSubmit.file_attachments.push({
            file_url: detailImageUrl,
            file_type: "image",
          });
        } else {
          console.error("Lỗi khi tải ảnh chi tiết lên");
          return; // Dừng lại nếu có lỗi
        }
          }
      // Gửi dữ liệu đến backend để lưu vào MongoDB
          try {
            const response = await ProductService.create(productToSubmit);
            console.log("Sản phẩm đã được tạo thành công:", response);
            // Có thể thêm thông báo thành công hoặc điều hướng đến trang khác
                     // Thông báo thành công bằng SweetAlert
          await Swal.fire({
            icon: "success",
            title: "Thêm sản phẩm thành công",
            text: `Sản phẩm ${this.product.name} đã được thêm thành công!`,
          });

        // Reset form sau khi thêm thành công
        this.resetForm();
        this.errors = {}; // Reset lỗi nếu thành công

      } catch (error) {
        console.error("Lỗi khi tạo sản phẩm:", error);

        // Thông báo lỗi bằng SweetAlert
        await Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: error.response?.data?.message || "Đã có lỗi xảy ra, vui lòng thử lại.",
        });

        this.errors = error.response ? error.response.data : { general: "Có lỗi xảy ra, vui lòng thử lại." };
      } finally {
        this.loading = false; // Kết thúc loading
      }
          // console.log(productToSubmit);
          // // Gửi dữ liệu productToSubmit đến server hoặc xử lý tiếp theo ở đây
        }

          },
};
</script>

<style>

/* Cải thiện kiểu chữ và kích thước */
.page-title {
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px; /* Khoảng cách dưới tiêu đề */
}

.product-form {
  background-color: #f9f9f9; /* Màu nền cho form */
  border-radius: 10px; /* Bo góc cho form */
  padding: 20px; /* Padding cho form */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* Bóng cho form */
}

.form-group {
  margin-bottom: 15px; /* Khoảng cách giữa các nhóm form */
}

.form-control {
  border: 1px solid #ccc; /* Viền cho các input */
  border-radius: 4px; /* Bo góc cho các input */
}

.btn-primary {
  background-color: #007bff; /* Màu nền cho nút */
  color: #fff; /* Màu chữ cho nút */
}

.loading-indicator {
  text-align: center;
  font-size: 1.2rem; /* Kích thước chữ cho loading */
}

.text-danger {
  color: red;
  font-size: 0.875em; /* Kích thước font nhỏ hơn cho thông báo lỗi */
}

.alert {
  font-size: 1.1rem; /* Kích thước font cho thông báo thành công */
}
.helper-text {
  font-size: 0.9rem; /* Kích thước chữ nhỏ hơn cho gợi ý */
  color: #6c757d; /* Màu chữ nhạt hơn */
  margin-bottom: 10px; /* Khoảng cách dưới gợi ý */
}
</style>