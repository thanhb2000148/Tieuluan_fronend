<template>
  <div class="wrapper">
    <Slider />
    <div class="main">
      <Nav />
      <main class="content px-4 py-3">
        <div class="container-fluid">
          <h1 class="mb-4 text-center text-primary">Danh sách sản phẩm</h1>
          <div class="d-flex justify-content-between align-items-center mb-4">
            <button @click="addProduct" class="btn btn-primary">
              <i class="bi bi-plus-circle me-2"></i>Thêm Sản Phẩm
            </button>
            <div class="filter-search">
              <form class="form-inline" @submit.prevent>
                <div class="input-group">
                  <input
                    class="form-control"
                    type="search"
                    placeholder="Tìm kiếm..."
                    aria-label="Search"
                    v-model="searchText"
                  />
                  <button class="btn btn-outline-primary" type="submit">
                    <i class="bi bi-search"></i>
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div v-if="products.length === 0" class="alert alert-info text-center" role="alert">
            <i class="bi bi-info-circle me-2"></i>Không có sản phẩm nào.
          </div>

          <div v-else class="product-table">
            <div class="table-responsive">
              <table class="table table-hover table-striped">
                <thead class="table-light">
                  <tr>
                    <th class="text-center">STT</th>
                    <th class="text-center">Tên sản phẩm</th>
                    <th class="text-center">Mô tả ngắn</th>
                    <th class="text-center">Trạng thái</th>
                    <th class="text-center">Thời gian tạo</th>
                    <th class="text-center">Danh mục</th>
                    <th class="text-center">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(product, index) in products" :key="product._id">
                    <td class="text-center">{{ index + 1 }}</td>
                    <td>
                      <div class="product-card">
                        <div class="product-image">
                          <img :src="product.LIST_FILE_ATTACHMENT_DEFAULT[0]?.FILE_URL" alt="Hình ảnh sản phẩm" class="img-thumbnail" />
                        </div>
                        <div class="product-info">
                          <h5 class="mb-1">{{ product.NAME_PRODUCT }}</h5>
                          <p class="mb-1"><small><strong>Mô tả chi tiết:</strong> {{ product.SHORT_DESC }}</small></p>
                          <p class="mb-1"><small>{{ getSummary(product) }}</small></p>
                          <button @click="openImageModal(product)" class="btn btn-outline-secondary btn-sm mt-1">
                            <i class="bi bi-images me-1"></i>Xem thêm hình ảnh
                          </button>
                        </div>
                      </div>
                    </td>
                    <td>{{ product.SHORT_DESC }}</td>
                    <td>
                      <span :class="{'badge bg-success': product.IN_STOCK, 'badge bg-danger': !product.IN_STOCK}">
                        {{ product.IN_STOCK ? 'Còn hàng' : 'Hết hàng' }}
                      </span>
                    </td>
                    <td>{{ formatDate(product.CREATED_AT) }}</td>
                    <td>{{ product.categoryName || 'Đang tải...' }}</td>
                    <td class="text-center">
                      <button @click="openEditModal(product)" class="btn btn-warning btn-sm mx-1">
                        <i class="bi bi-pencil-square"></i>
                      </button>
                      <button @click="deleteProduct(product._id)" class="btn btn-danger btn-sm mx-1">
                        <i class="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <!-- Modal hiển thị thêm hình ảnh -->
          <div v-if="showImageModal" class="modal-backdrop fade show"></div>
          <div v-if="showImageModal" class="modal fade show" style="display: block;">
            <div class="modal-dialog modal-lg modal-dialog-centered">
              <div class="modal-content">
                <div class="modal-header bg-primary text-white">
                  <h5 class="modal-title">
                    <i class="bi bi-images me-2"></i>Hình ảnh của sản phẩm
                  </h5>
                  <button type="button" class="btn-close btn-close-white" @click="closeImageModal"></button>
                </div>
                <div class="modal-body">
                  <div class="image-gallery">
                    <div v-for="image in selectedProduct.LIST_FILE_ATTACHMENT" :key="image._id" class="image-item">
                      <img :src="image.FILE_URL" :alt="selectedProduct.NAME_PRODUCT" class="img-fluid rounded shadow-sm" />
                    </div>
                  </div>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" @click="closeImageModal">Đóng</button>
                </div>
              </div>
            </div>
          </div>

          
                <!-- Modal sửa sản phẩm -->
                <div v-if="showEditModal" class="modal-backdrop fade show"></div>
                <div v-if="showEditModal" class="modal fade show" style="display: block;">
                    <div class="modal-dialog modal-lg modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header bg-warning text-white">
                        <h5 class="modal-title">Chỉnh sửa sản phẩm</h5>
                        <button type="button" class="btn-close btn-close-white" @click="closeEditModal"></button>
                        </div>
                        <div class="modal-body">
                        <form @submit.prevent="updateProduct">
                            <div class="mb-3">
                            <label for="productName" class="form-label">Tên sản phẩm</label>
                            <input type="text" class="form-control" id="productName" v-model="editedProduct.NAME_PRODUCT" />
                            </div>
                            <div class="mb-3">
                            <label for="shortDesc" class="form-label">Mô tả chi tiết</label>
                            <textarea class="form-control" id="shortDesc" v-model="editedProduct.SHORT_DESC" ></textarea>
                            </div>
                            <div class="mb-3">
                            <label for="detailedDesc" class="form-label">Mô tả ngắn</label>
                            <textarea class="form-control" id="detailedDesc" v-model="editedProduct.DESC_PRODUCT" rows="4"></textarea>
                            </div>
                            <div class="mb-3">
                            <label for="category" class="form-label">Danh mục</label>
                            <select class="form-select" id="category" v-model="editedProduct.CATEGORY_ID" >
                                <option value="" disabled>Chọn danh mục</option>
                                <option v-for="category in categories" :key="category._id" :value="category._id">{{ category.CATEGORY_NAME }}</option>
                            </select>
                            </div>
                           <!-- Thêm phần upload ảnh đại diện -->
                            <div class="mb-3">
                                <label for="thumbnail" class="form-label">Ảnh đại diện sản phẩm</label>
                                <input type="file" class="form-control" id="thumbnail" @change="handleFileChange($event, 'thumbnail')" />
                            </div>

                            <div class="mb-3">
                            <!-- Thông tin các key thuộc tính -->
                            <h6>Thông tin chi tiết:</h6>
                                <div v-for="(meta, index) in editedProduct.LIST_PRODUCT_METADATA" :key="index" class="mb-2">
                                    <label :for="'meta_' + index" class="form-label">{{ meta.KEY }}</label>
                                    <input
                                    type="text"
                                    class="form-control"
                                    :id="'meta_' + index"
                                    v-model="meta.VALUE"  
                                    />
                                </div>
                            </div>
                            <!-- Thêm phần upload ảnh chi tiết -->
                           <!-- Thêm phần upload ảnh chi tiết -->
                                <div class="mb-3">
                                    <label for="detail_images" class="form-label">Ảnh Chi Tiết Sản Phẩm</label>
                                    <p class="helper-text">Bạn có thể thêm nhiều ảnh chi tiết để làm rõ hơn về sản phẩm.</p>
                                    <button type="button" class="btn btn-success mb-2" @click="addDetailImageInput">
                                        <i class="fas fa-plus"></i> Thêm Ảnh Chi Tiết
                                    </button>
                                    <div v-for="(image, index) in uploadedDetailImages" :key="index" class="mt-2">
                                        <input type="file" class="form-control" :id="'detail_images_' + index" @change="handleFileChange($event, 'detail', index)" />
                                    </div>
                                </div>

                            <div v-if="editedProduct.LIST_FILE_ATTACHMENT && editedProduct.LIST_FILE_ATTACHMENT.length > 0" class="mt-2">
                                <h6>Hình ảnh hiện tại:</h6>
                                <div class="image-gallery">
                                    <div v-for="image in editedProduct.LIST_FILE_ATTACHMENT" :key="image._id" class="image-item">
                                    <img :src="image.FILE_URL" class="img-fluid rounded" />
                                    </div>
                                </div>
                            </div>
                            <button type="submit" class="btn btn-success">Cập nhật</button>
                        </form>
                        </div>
                            <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" @click="closeEditModal">Đóng</button>
                        </div>
                    </div>
                    </div>
                </div>
        </div>
      </main>
    </div>
  </div>
</template>


          
     

<script>
import axios from 'axios';

import categoryService from "@/services/category.service";
import productService from "@/services/product.service";
import Slider from "../components/admin/Slider.vue";
import Nav from "../components/admin/Nav.vue";

export default {
  components: {
    Slider,
    Nav,
  },
  data() {
    return {
      categories: [],
      products: [],
      searchText: '',
      showImageModal: false,
      selectedProduct: null,
      showEditModal: false,
        editedProduct: {}, // Khởi tạo sản phẩm để chỉnh sửa
        uploadedDetailImages: [], // Danh sách lưu trữ các ảnh chi tiết
            thumbnailFile: null, // Khai báo thumbnailFile để lưu trữ file thumbnail


    };
  },
  created() {
    this.fetchProducts();
    this.fetchCategories();
  },
  methods: {
    async fetchProducts() {
      try {
        const response = await productService.getAllProduct();
        if (response.success) {
          this.products = await Promise.all(
            response.data.map(async (product) => {
              const categoryName = await this.getCategoryName(product.CATEGORY_ID);
              return { ...product, categoryName }; // Gộp thông tin categoryName vào sản phẩm
            })
          );
        } else {
          console.error("Không thể lấy sản phẩm:", response.message);
        }
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error);
      }
    },
    async fetchCategories() {
      try {
        const response = await categoryService.getAll();
        if (response.success) {
          this.categories = response.data;
        } else {
          console.error("Không thể lấy danh mục:", response.message);
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
      }
    },
    async getCategoryName(categoryId) {
      try {
        const response = await categoryService.getById(categoryId);
        return response.success && response.data.length > 0 
          ? response.data[0].CATEGORY_NAME 
          : 'Không xác định';
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
        return 'Không xác định';
      }
      },
     formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  },
    getSummary(product) {
      const colorCount = product.LIST_PRODUCT_METADATA.find(meta => meta.KEY === "Màu Sắc")?.VALUE.length || 0;
      const sizeCount = product.LIST_PRODUCT_METADATA.find(meta => meta.KEY === "Kích Thước")?.VALUE.length || 0;
      return `${colorCount} màu, ${sizeCount} kích thước`;
    },
      openImageModal(product) {
          console.log("Sản phẩm đã chọn:", product); // Kiểm tra thông tin sản phẩm

      this.selectedProduct = product;
      this.showImageModal = true;
    },
    closeImageModal() {
      this.showImageModal = false;
      this.selectedProduct = null;
    },
    addProduct() {
      this.$router.push('/add-product');
    },
    openEditModal(product) {
      this.editedProduct = { ...product }; // Sao chép thông tin sản phẩm để chỉnh sửa
      this.showEditModal = true;
    },
    closeEditModal() {
      this.showEditModal = false;
        this.editedProduct = {}; // Đặt lại để tránh hiển thị thông tin cũ
        this.thumbnailFile = null; // Reset thumbnailFile

    },
    async deleteProduct(id) {
      const confirmDelete = confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?');
      if (confirmDelete) {
        try {
          const response = await productService.deleteProduct(id);
          if (response.success) {
            this.products = this.products.filter(product => product._id !== id);
          } else {
            console.error("Không thể xóa sản phẩm:", response.message);
          }
        } catch (error) {
          console.error("Lỗi khi xóa sản phẩm:", error);
        }
      }
    },
async updateProduct() {
  const updateData = {};
  console.log("Bắt đầu cập nhật sản phẩm:", this.editedProduct._id);

  // Xử lý thumbnail
  if (this.thumbnailFile) {
    console.log("Tải lên thumbnail:", this.thumbnailFile.name);
    try {
      const thumbnailUrl = await this.uploadImage(this.thumbnailFile);
      updateData.LIST_FILE_ATTACHMENT_DEFAULT = [{
        FILE_URL: thumbnailUrl,
        FILE_TYPE: "image",
        FROM_DATE: new Date(),
        TO_DATE: null,
        _id: this.editedProduct.LIST_FILE_ATTACHMENT_DEFAULT[0]._id, // Giữ ID cũ
      }];
      console.log("Thumbnail đã được tải lên:", thumbnailUrl);
    } catch (uploadError) {
      console.error("Lỗi khi tải lên thumbnail:", uploadError);
    }
  } else {
    console.log("Không tải lên thumbnail, giữ nguyên hình ảnh hiện có.");
    updateData.LIST_FILE_ATTACHMENT_DEFAULT = this.editedProduct.LIST_FILE_ATTACHMENT_DEFAULT;
  }

  // Xử lý ảnh chi tiết
  let updatedDetailImages = [...this.editedProduct.LIST_FILE_ATTACHMENT]; // Bắt đầu với ảnh hiện có
  if (this.uploadedDetailImages.length > 0) {
    console.log("Tải lên ảnh chi tiết mới...");
    for (const file of this.uploadedDetailImages) {
      if (file) {
        try {
          const detailImageUrl = await this.uploadImage(file);
          updatedDetailImages.push({
            FILE_URL: detailImageUrl,
            FROM_DATE: new Date(),
            TO_DATE: null,
            _id: 'detail_image_id_' + Date.now(), // Tạo ID mới cho ảnh chi tiết
          });
          console.log("Ảnh chi tiết mới đã được tải lên:", detailImageUrl);
        } catch (uploadError) {
          console.error("Lỗi khi tải lên ảnh chi tiết:", uploadError);
        }
      }
    }
  }
  updateData.LIST_FILE_ATTACHMENT = updatedDetailImages;

  // Cập nhật các trường thông tin khác
  updateData.NAME_PRODUCT = this.editedProduct.NAME_PRODUCT;
  updateData.SHORT_DESC = this.editedProduct.SHORT_DESC;
  updateData.DESC_PRODUCT = this.editedProduct.DESC_PRODUCT;
  updateData.CATEGORY_ID = this.editedProduct.CATEGORY_ID;
  updateData.LIST_PRODUCT_METADATA = this.editedProduct.LIST_PRODUCT_METADATA.filter(meta => meta.VALUE);

  console.log("LIST_FILE_ATTACHMENT:", JSON.stringify(updateData.LIST_FILE_ATTACHMENT, null, 2));
  console.log("Dữ liệu cập nhật cuối cùng:", JSON.stringify(updateData, null, 2));

  // Gửi yêu cầu cập nhật đến server
  try {
    const response = await productService.update(this.editedProduct._id, updateData);
    console.log("Kết quả cập nhật:", response);
    if (response && response.success) {
      await this.fetchProducts();
      this.closeEditModal();
      alert("Cập nhật sản phẩm thành công!");
    } else {
      console.error("Cập nhật sản phẩm thất bại:", response.message);
    }
  } catch (error) {
    console.error("Lỗi khi cập nhật sản phẩm:", error.message || error);
    alert("Có lỗi xảy ra trong quá trình cập nhật sản phẩm. Vui lòng kiểm tra console để biết thêm thông tin.");
  }
},
   async handleFileChange(event, type) {
    const file = event.target.files[0];
    if (file) {
      if (type === 'thumbnail') {
        const url = await this.uploadImage(file);
        if (url) {
          this.editedProduct.LIST_FILE_ATTACHMENT_DEFAULT[0].FILE_URL = url; // Cập nhật URL hình ảnh đại diện
        }
      } else if (type === 'detail') {
        const url = await this.uploadImage(file);
        if (url) {
          this.editedProduct.LIST_FILE_ATTACHMENT.push({ FILE_URL: url }); // Thêm URL hình ảnh chi tiết
        }
      }
    }
  },


    addDetailImageInput() {
      this.uploadedDetailImages.push(null); // Thêm một input trống cho ảnh chi tiết
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
  },
};
</script>


<style scoped>
.wrapper {
  display: flex;
  min-height: 100vh;
}

.main {
  flex: 1;
  background-color: #f8f9fa;
}

.product-card {
  display: flex;
  align-items: center;
}

.product-image img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  margin-right: 15px;
  border-radius: 5px;
}

.product-info h5 {
  font-size: 1rem;
  color: #333;
  margin-bottom: 0.25rem;
}

.table th {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.85rem;
}

.table td {
  vertical-align: middle;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

.badge {
  font-size: 0.75rem;
  padding: 0.35em 0.65em;
}

.image-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 15px;
  padding: 15px;
}

.image-item {
  position: relative;
  overflow: hidden;
  border-radius: 0.25rem;
  transition: transform 0.3s ease;
}

.image-item:hover {
  transform: scale(1.05);
}

.image-item img {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.table {
  background: linear-gradient(to bottom, #ffffff, #f8f9fa);
  border-radius: 0.5rem; /* Bo tròn cho bảng */
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
}

.btn {
  transition: all 0.3s ease;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
}

.table-hover tbody tr {
  transition: background-color 0.3s ease;
}

.table-hover tbody tr:hover {
  background-color: rgba(0, 123, 255, 0.1);
}

.badge {
  font-weight: 500;
  letter-spacing: 0.5px;
  padding: 0.35em 0.65em;
}

.content,
.table,
.product-image img {
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
}

@media (max-width: 768px) {
  .image-gallery {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }
  
  .image-item img {
    height: 120px;
  }
}

.modal-content {
  max-width: 600px; /* Giới hạn chiều rộng tối đa của modal */
  width: 100%; /* Chiều rộng 100% cho các màn hình nhỏ */
  max-height: 80vh; /* Giới hạn chiều cao tối đa của modal */
  overflow-y: auto; /* Cuộn theo chiều dọc nếu nội dung vượt quá chiều cao tối đa */
}


</style>
