<template>
  <div class="wrapper">
    <Slider />
    <div class="main">
      <Nav />
      <main class="content px-4 py-3">
  <div class="container-fluid">
    <h1 class="mb-4 text-center ">Danh sách sản phẩm</h1>
    <div class="d-flex align-items-center mb-4">
      <button @click="addProduct" class="btn btn-custom btn-primary me-2">
        <i class="bi bi-plus-circle me-2"></i>Thêm Sản Phẩm
      </button>
      <button @click="toggleDeletedProducts" class="btn btn-custom btn-secondary me-2">
        <i class="bi bi-trash me-2"></i>{{ showDeleted ? 'Hiển thị sản phẩm chưa xóa' : 'Hiển thị sản phẩm đã xóa' }}
      </button>
      <div class="filter-search ms-auto">
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

           <div v-if="isLoading" class="alert alert-info text-center" role="alert">
    <i class="bi bi-info-circle me-2"></i>Đang tải sản phẩm...
  </div>

  <div v-if="noProducts" class="alert alert-info text-center" role="alert">
    <i class="bi bi-info-circle me-2"></i>Không có sản phẩm nào.
  </div>

          <div v-else class="product-table">
            <div class="table-responsive">
              <table class="table table-hover table-striped">
                <thead class="table-light">
                  <tr>
                    <th class="text-center">STT</th>
                    <th class="text-center">Tên sản phẩm</th>
                    <th class="text-center">Mô tả chi tiết</th>
                    <th class="text-center">Trạng thái</th>
                    <th class="text-center">Thời gian tạo</th>
                    <th class="text-center">Danh mục</th>
                    <th class="text-center">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(product, index) in paginatedProducts" :key="product._id">
                    <td class="text-center">{{ index + 1 }}</td>
                    <td>
                      <div class="product-card">
                        <div class="product-image">
                          <img :src="product.LIST_FILE_ATTACHMENT_DEFAULT[0]?.FILE_URL" alt="Hình ảnh sản phẩm" class="img-thumbnail" />
                        </div>
                        <div class="product-info">
                          <h5 class="mb-1">{{ product.NAME_PRODUCT }}</h5>
                          <p class="mb-1"><small><strong>Mô tả ngắn:</strong> {{ product.SHORT_DESC }}</small></p>
                          <p class="mb-1"><small>{{ getSummary(product) }}</small></p>
                          <button @click="openImageModal(product)" class="btn btn-outline-secondary btn-sm mt-1">
                            <i class="bi bi-images me-1"></i>Xem thêm hình ảnh
                          </button>
                        </div>
                      </div>
                    </td>
                    <td>{{ product.SHORT_DESC }}</td>
                    <td>
                      <span :class="{'badge bg-success': product.NUMBER_INVENTORY_PRODUCT, 'badge bg-danger': !product.NUMBER_INVENTORY_PRODUCT}">
                        {{ product.NUMBER_INVENTORY_PRODUCT ? 'Còn hàng' : 'Hết hàng' }}
                      </span>
                    </td>
                    <td>{{ formatDate(product.CREATED_AT) }}</td>
                    <td>{{ product.categoryName || 'Đang tải...' }}</td>
<td class="text-center">
  <template v-if="showDeleted">
    <button @click="restoreProduct(product._id)" class="btn btn-success btn-sm mx-1">
      <i class="bi bi-arrow-counterclockwise"></i> Khôi phục
    </button>
  </template>
  <template v-else>
    <button @click="openEditModal(product)" class="btn btn-warning btn-sm mx-1">
      <i class="bi bi-pencil-square"></i>
    </button>
    <button @click="deleteProduct(product._id)" class="btn btn-danger btn-sm mx-1">
      <i class="bi bi-trash"></i>
    </button>
  </template>
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
                    <div v-for="image in selectedProduct.LIST_FILE_ATTACHMENT" :key="image._id" class="image-item position-relative">
                      <img :src="image.FILE_URL" :alt="selectedProduct.NAME_PRODUCT" class="img-fluid rounded shadow-sm" />
                      <button class="btn-close position-absolute top-0 end-0" @click="confirmDelete(image._id)"></button>
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
                      <textarea class="form-control" id="shortDesc" v-model="editedProduct.SHORT_DESC"></textarea>
                    </div>
                    <div class="mb-3">
                      <label for="detailedDesc" class="form-label">Mô tả ngắn</label>
                      <textarea class="form-control" id="detailedDesc" v-model="editedProduct.DESC_PRODUCT" rows="4"></textarea>
                    </div>
                    <div class="mb-3">
                      <label for="category" class="form-label">Danh mục</label>
                      <select class="form-select" id="category" v-model="editedProduct.CATEGORY_ID">
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
                      <h6>Thông tin chi tiết:</h6>
                      <div v-for="(meta, index) in editedProduct.LIST_PRODUCT_METADATA" :key="index" class="mb-2">
                        <label :for="'meta_' + index" class="form-label">{{ meta.KEY }}</label>
                        <input type="text" class="form-control" :id="'meta_' + index" v-model="meta.VALUE" />
                      </div>
                    </div>

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
                    <button type="submit" class="btn btn-success" :disabled="isLoading">
                      <span v-if="isLoading">
                        <i class="fa fa-spinner fa-spin"></i> Đang tải ảnh lên...
                      </span>
                      <span v-else>Cập nhật</span>
                    </button>
                  </form>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" @click="closeEditModal">Đóng</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Phân trang -->
          <nav aria-label="Page navigation" class="mt-4">
            <ul class="pagination justify-content-center mb-0">
              <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <a class="page-link" @click.prevent="changePage(currentPage - 1)">
                  <i class="fas fa-chevron-left"></i>
                </a>
              </li>
              <li class="page-item">
                <span class="page-link">
                  Trang {{ currentPage }} / {{ totalPages }}
                </span>
              </li>
              <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                <a class="page-link" @click.prevent="changePage(currentPage + 1)">
                  <i class="fas fa-chevron-right"></i>
                </a>
              </li>
            </ul>
          </nav>

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
import Swal from "sweetalert2";


export default {
  components: {
    Slider,
    Nav,
  },
  data() {
    return {
      currentPage: 1, // Trang hiện tại
      itemsPerPage: 10, // Số sản phẩm hiển thị trên mỗi trang
      categories: [],
      products: [],
      searchText: '',
      showImageModal: false,
      selectedProduct: null,
      showEditModal: false,
      editedProduct: {}, // Khởi tạo sản phẩm để chỉnh sửa
      uploadedDetailImages: [], // Danh sách lưu trữ các ảnh chi tiết
      thumbnailFile: null, // Khai báo thumbnailFile để lưu trữ file thumbnail
      isLoading: false, // Biến theo dõi trạng thái loading
      showDeleted: false, // Biến để theo dõi trạng thái hiển thị sản phẩm đã xóa
          noProducts: false, // Thêm biến để kiểm tra không có sản phẩm nào

    


    };
  },
  created() {
    this.fetchProducts();
    this.fetchCategories();
  },
  watch: {
  showDeleted() {
    this.fetchProducts();
  },
},
  computed: {
  filteredProducts() {
    if (this.searchText.trim() === '') {
      return this.products; // Nếu không có gì để tìm, trả về tất cả sản phẩm
    }
    const lowerCaseSearchText = this.searchText.toLowerCase();
    return this.products.filter(product => {
      return (
        product.NAME_PRODUCT.toLowerCase().includes(lowerCaseSearchText) ||
        product.SHORT_DESC.toLowerCase().includes(lowerCaseSearchText) ||
        product.DESC_PRODUCT.toLowerCase().includes(lowerCaseSearchText)
      );
    });
    },
  totalPages() {
    return Math.ceil(this.filteredProducts.length / this.itemsPerPage); // Tính số trang
  },
  paginatedProducts() {
    const start = (this.currentPage - 1) * this.itemsPerPage; // Tính chỉ số bắt đầu
    return this.filteredProducts.slice(start, start + this.itemsPerPage); // Lấy các sản phẩm cho trang hiện tại
  },
},

  methods: {
    changePage(page) {
        if (page < 1 || page > this.totalPages) return; // Kiểm tra trang hợp lệ
        this.currentPage = page;
    },
    async fetchProducts() {
  this.isLoading = true; // Bắt đầu loading
  this.noProducts = false; // Đặt lại trạng thái không có sản phẩm

  try {
    const response = this.showDeleted 
      ? await productService.getDeletedProducts() 
      : await productService.getAllProduct();

    if (response.success) {
      const products = response.data;
      this.products = await Promise.all(
        products.map(async (product) => {
          const categoryName = await this.getCategoryName(product.CATEGORY_ID);
          return { ...product, categoryName };
        })
      );

      // Kiểm tra nếu không có sản phẩm nào
      if (this.products.length === 0) {
        this.noProducts = true; // Nếu không có sản phẩm
      }
    } else {
      console.error("Không thể lấy sản phẩm:", response.message);
    }
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm:", error);
  } finally {
    this.isLoading = false; // Kết thúc loading
  }
},


toggleDeletedProducts() {
  this.showDeleted = !this.showDeleted; // Chuyển đổi trạng thái
    console.log("Show deleted:", this.showDeleted); // Kiểm tra giá trị của showDeleted

  this.fetchProducts(); // Gọi lại hàm để cập nhật danh sách sản phẩm
},

async restoreProduct(productId) {
  const confirmRestore = await Swal.fire({
    title: 'Xác nhận khôi phục',
    text: "Bạn có chắc chắn muốn khôi phục sản phẩm này không?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Khôi phục',
    cancelButtonText: 'Hủy'
  });

  if (confirmRestore.isConfirmed) {
    try {
      const response = await productService.updateDeletedStatus(productId, false); // Gửi giá trị Boolean false thay vì đối tượng
      if (response.success) {
        Swal.fire("Thành công!", "Sản phẩm đã được khôi phục.", "success");
        this.fetchProducts(); // Gọi lại hàm để cập nhật danh sách sản phẩm
      } else {
        Swal.fire("Thất bại!", "Có lỗi xảy ra khi khôi phục sản phẩm.", "error");
      }
    } catch (error) {
      console.error("Lỗi khi khôi phục sản phẩm:", error);
      Swal.fire("Thất bại!", "Có lỗi xảy ra khi khôi phục sản phẩm.", "error");
    }
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
   confirmDelete(imageId) {
  // Hiển thị hộp thoại xác nhận bằng SweetAlert
  Swal.fire({
    title: 'Bạn có chắc chắn muốn xóa hình ảnh này?',
    text: "Hành động này không thể hoàn tác!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Có, xóa!',
    cancelButtonText: 'Không, hủy!'
  }).then(async (result) => {
    if (result.isConfirmed) {
      await this.deleteImage(imageId);
    }
  });
},

  
  async deleteImage(imageId) {
  try {
    await productService.deleteImage(this.selectedProduct._id, imageId); // Gọi API xóa
    // Xóa hình ảnh đã xóa khỏi mảng
    this.selectedProduct.LIST_FILE_ATTACHMENT = this.selectedProduct.LIST_FILE_ATTACHMENT.filter(image => image._id !== imageId);
    
    // Hiển thị thông báo thành công bằng SweetAlert
    await Swal.fire({
      icon: "success",
      title: "Xóa hình ảnh thành công!",
      text: "Hình ảnh đã được xóa.",
    });
  } catch (error) {
    console.error("Lỗi khi xóa hình ảnh:", error);
    // Hiển thị thông báo lỗi bằng SweetAlert
    await Swal.fire({
      icon: "error",
      title: "Có lỗi xảy ra!",
      text: "Xóa hình ảnh không thành công.",
    });
  }
},

    async deleteProduct(id) {
  const { value: confirmDelete } = await Swal.fire({
    title: 'Xác nhận',
    text: 'Bạn có chắc chắn muốn xóa sản phẩm này không?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Có, xóa!',
    cancelButtonText: 'Hủy'
  });

  if (confirmDelete) {
    try {
      const response = await productService.deleteProduct(id);
      if (response.success) {
        // Cập nhật danh sách sản phẩm sau khi xóa
        this.products = this.products.filter(product => product._id !== id);
        Swal.fire('Đã xóa!', 'Sản phẩm đã được xóa thành công.', 'success');
      } else {
        Swal.fire('Lỗi!', response.message, 'error');
      }
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      Swal.fire('Lỗi!', 'Đã xảy ra lỗi khi xóa sản phẩm.', 'error');
    }
  }
},
  async updateProduct() {
    const updateData = {};
    console.log("Bắt đầu cập nhật sản phẩm:", this.editedProduct._id);

      this.isLoading = true; // Bắt đầu tải ảnh


    // Xử lý thumbnail
    if (this.thumbnailFile) {
      console.log("Tải lên thumbnail:", this.thumbnailFile.name);
      try {
        const thumbnailUrl = await this.uploadImage(this.thumbnailFile);
        if (thumbnailUrl) {
          // Cập nhật thumbnail URL trong LIST_FILE_ATTACHMENT_DEFAULT
          updateData.LIST_FILE_ATTACHMENT_DEFAULT = [{
            FILE_URL: thumbnailUrl,
            FILE_TYPE: "image", // Đặt loại là image
            FROM_DATE: new Date(),
            TO_DATE: null,
            _id: this.editedProduct.LIST_FILE_ATTACHMENT_DEFAULT[0]._id || 'thumbnail_id_' + Date.now(), // Giữ ID cũ hoặc tạo ID mới nếu không có
          }];
          console.log("Thumbnail đã được tải lên:", thumbnailUrl);
        }
      } catch (uploadError) {
        console.error("Lỗi khi tải lên thumbnail:", uploadError);
      }
    } else {
      console.log("Không tải lên thumbnail, giữ nguyên hình ảnh hiện có.");
      // Nếu không có thumbnail mới, giữ ảnh hiện có trong LIST_FILE_ATTACHMENT_DEFAULT
      updateData.LIST_FILE_ATTACHMENT_DEFAULT = this.editedProduct.LIST_FILE_ATTACHMENT_DEFAULT;
    }

    // Xử lý ảnh chi tiết
    let updatedDetailImages = this.editedProduct.LIST_FILE_ATTACHMENT.filter(file => file.FILE_TYPE === "detail"); // Bắt đầu với ảnh chi tiết hiện có
    if (this.uploadedDetailImages.length > 0) {
      console.log("Tải lên ảnh chi tiết mới...");
      for (const file of this.uploadedDetailImages) {
        if (file) {
          try {
            const detailImageUrl = await this.uploadImage(file);
            if (detailImageUrl) {
              updatedDetailImages.push({
                FILE_URL: detailImageUrl,
                FILE_TYPE: "detail", // Đặt loại là detail
                FROM_DATE: new Date(),
                TO_DATE: null,
                _id: 'detail_image_id_' + Date.now(), // Tạo ID mới cho ảnh chi tiết
              });
              console.log("Ảnh chi tiết mới đã được tải lên:", detailImageUrl);
            }
          } catch (uploadError) {
            console.error("Lỗi khi tải lên ảnh chi tiết:", uploadError);
          }
        }
      }
    }

    // Gán lại danh sách ảnh detail
    updateData.LIST_FILE_ATTACHMENT = updatedDetailImages; // Gán ảnh chi tiết vào LIST_FILE_ATTACHMENT

    // Cập nhật các trường thông tin khác
    updateData.NAME_PRODUCT = this.editedProduct.NAME_PRODUCT;
    updateData.SHORT_DESC = this.editedProduct.SHORT_DESC;
    updateData.DESC_PRODUCT = this.editedProduct.DESC_PRODUCT;
    updateData.CATEGORY_ID = this.editedProduct.CATEGORY_ID;
    updateData.LIST_PRODUCT_METADATA = this.editedProduct.LIST_PRODUCT_METADATA.filter(meta => meta.VALUE);

    console.log("Dữ liệu cập nhật cuối cùng:", JSON.stringify(updateData, null, 2));

    // Gửi yêu cầu cập nhật đến server
    try {
      const response = await productService.update(this.editedProduct._id, updateData);
      console.log("Kết quả cập nhật:", response);
      if (response && response.success) {
        await this.fetchProducts();
        this.closeEditModal();
        // Hiển thị thông báo thành công
      await Swal.fire({
        icon: "success",
        title: "Cập nhật sản phẩm thành công!",
        text: "Sản phẩm đã được cập nhật thành công.",
      });
      } else {
        console.error("Cập nhật sản phẩm thất bại:", response.message);
        await Swal.fire({
        icon: "error",
        title: "Cập nhật sản phẩm thất bại!",
        text: response.message || "Có lỗi xảy ra khi cập nhật sản phẩm.",
      });
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật sản phẩm:", error.message || error);
    await Swal.fire({
      icon: "error",
      title: "Có lỗi xảy ra!",
      text: "Vui lòng kiểm tra console để biết thêm thông tin.",
    });
    }finally {
    this.isLoading = false; // Kết thúc quá trình tải ảnh
  }
  },



  async handleFileChange(event, type) {
  const file = event.target.files[0];
  if (file) {
    if (type === 'thumbnail') {
      this.isLoading = true; // Bắt đầu tải ảnh
      const url = await this.uploadImage(file);
      if (url) {
        this.editedProduct.LIST_FILE_ATTACHMENT_DEFAULT[0].FILE_URL = url;
      }
      this.isLoading = false; // Kết thúc quá trình tải ảnh
    } else if (type === 'detail') {
      this.isLoading = true; // Bắt đầu tải ảnh
      const url = await this.uploadImage(file);
      if (url) {
        this.editedProduct.LIST_FILE_ATTACHMENT.push({ FILE_URL: url, FILE_TYPE: "detail" });
      }
      this.isLoading = false; // Kết thúc quá trình tải ảnh
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

/* Style cho các nút hiển thị sản phẩm */
.btn-custom {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  margin-left: 0.5rem; /* Khoảng cách giữa các nút */
  border-radius: 0.25rem;
  font-weight: bold;
  transition: background-color 0.3s, color 0.3s;
}

/* Nút thêm sản phẩm */
.btn-custom.btn-primary {
  background-color: #007bff;
  color: white;
}

/* Nút hiển thị sản phẩm đã xóa */
.btn-custom.btn-secondary {
  background-color: #dc3545;
  color: white;
}

/* Hiệu ứng hover cho cả hai nút */
.btn-custom:hover {
  opacity: 0.8; /* Giảm độ trong suốt khi hover */
}


</style>
