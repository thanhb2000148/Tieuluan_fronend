  <template>
    <div class="wrapper">
      <Slider />
      <div class="main">
        <Nav />
        <main class="content px-3 py-2">
          <div class="container-fluid">
            <h1 class="mb-4 text-center">Danh sách Đánh Giá</h1>

            <!-- Loading State -->
            <div v-if="isLoading" class="text-center">
              <p>Đang tải đánh giá...</p>
              <div class="spinner-border" role="status">
                <span class="sr-only">Loading...</span>
              </div>
            </div>

            <!-- Danh sách đánh giá -->
            <div v-if="reviews.length > 0">
              <table class="table table-bordered table-hover">
                <thead>
                  <tr class="text-center">
                    <th scope="col">Người dùng</th>
                    <th scope="col">Bình luận</th>
                    <th scope="col">Số sao</th>
                    <th scope="col">Ngày tạo</th>
                    <th scope="col">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="review in reviews" :key="review._id" class="align-middle">
                    <td class="px-4 py-3">
                      <div class="d-flex align-items-center">
                        <img :src="review.user_id.AVT_URL || 'https://via.placeholder.com/40'" alt="Avatar" class="rounded-circle" width="40" height="40" />
                        <span class="ms-3">{{ review.user_id.EMAIL_USER }}</span>
                      </div>
                    </td>
                    <td class="px-4 py-3 text-gray-600">{{ review.comment }}</td>
                    <td class="px-4 py-3">{{ review.rating }} / 5</td>
                    <td class="px-4 py-3">{{ new Date(review.created_at).toLocaleDateString() }}</td>
                    <td class="px-4 py-3 text-center">
  <button class="btn btn-primary" @click="viewReview(review)">Xem</button>

</td>

                  </tr>
                </tbody>
              </table>
            </div>
            
            <!-- Không có đánh giá -->
            <div v-else>
              <p class="text-center">Chưa có đánh giá nào</p>
            </div>

            <!-- Phân trang -->
            <div v-if="reviews.length > 0" class="pagination text-center">
              <button 
                class="btn btn-primary" 
                :disabled="currentPage === 1" 
                @click="changePage(currentPage - 1)"
              >
                &lt;
              </button>   

              <span class="mx-2">Trang {{ currentPage }} / {{ totalPages }}</span>

              <button 
                class="btn btn-primary" 
                :disabled="currentPage === totalPages" 
                @click="changePage(currentPage + 1)"
              >
                &gt;
              </button>
            </div>
          </div>
          <!-- modal xem chi tiết -->
          <div 
            v-if="showModal" 
            class="custom-modal-overlay show" 
            @click.self="closeModal"
          >
            <div class="custom-modal">
              <div class="modal-header">
                <div class="user-info">
                  <img 
                    :src="selectedReview?.user_id.AVT_URL || 'https://via.placeholder.com/40'" 
                    alt="User Avatar" 
                    class="user-avatar"
                  />
                  <div class="user-details">
                    <h5>Chi tiết đánh giá</h5>
                    <span class="user-email">{{ selectedReview?.user_id.EMAIL_USER }}</span>
                  </div>
                </div>
                <button class="close-button" @click="closeModal">&times;</button>
              </div>
              
              <div class="modal-body">
                <div class="review-content">
                  <div class="modal-info">
                    <div class="rating-section">
                      <div class="stars">
                        <span 
                          v-for="i in 5" 
                          :key="i" 
                          :class="['star', i <= selectedReview?.rating ? 'filled' : '']"
                        >★</span>
                      </div>
                      <span class="rating-text">{{ selectedReview?.rating }} / 5</span>
                    </div>
                    
                    <div class="comment-section">
                      <h6>Bình luận:</h6>
                      <p class="comment-text">{{ selectedReview?.comment }}</p>
                    </div>
                    
                    <div class="date-section">
                      <i class="far fa-calendar-alt"></i>
                      <span>{{ selectedReview ? new Date(selectedReview.created_at).toLocaleString() : '' }}</span>
                    </div>
                  </div>

                  <div class="modal-image-container">
                    <h6>Hình ảnh sản phẩm:</h6>
                    <div class="image-wrapper">
                      <img 
                        :src="productImage" 
                        alt="Hình ảnh sản phẩm" 
                        class="product-image" 
                        v-if="productImage"
                      />
                      <div class="no-image" v-else>
                        <span>Không có hình ảnh sản phẩm</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- <div class="modal-footer">
                <button class="btn-close" @click="closeModal">Đóng</button>
              </div> -->
            </div>
          </div>
        </main>
      </div>
    </div>
  </template>

  <script>
  import Swal from 'sweetalert2';
  import Slider from "../components/admin/Slider.vue";
  import Nav from "../components/admin/Nav.vue";
  import axios from 'axios';
  import productService from '@/services/product.service';

  export default {
    name: "DashboardReviews",
    components: {
      Slider,
      Nav,
    },
    data() {
      return {
        reviews: [], // Danh sách đánh giá
        isLoading: false,  // Trạng thái loading
        currentPage: 1, // Trang hiện tại
        reviewsPerPage: 10, // Số lượng đánh giá trên mỗi trang
        totalPages: 1, // Tổng số trang, sẽ được tính sau khi có dữ liệu
              selectedReview: null, // Đánh giá được chọn
        productImage: null, // URL hình ảnh sản phẩm
          showModal: false, // Hiển thị modal hay không


      };
    },
    methods: {
 async viewReview(review) {
  this.selectedReview = review;
  this.productImage = null;  // Reset hình ảnh khi mở modal

  try {
    const product = await productService.getById(review.product_id);
    console.log("Dữ liệu sản phẩm trả về:", product);  // Log toàn bộ sản phẩm để kiểm tra

    // Kiểm tra xem LIST_FILE_ATTACHMENT_DEFAULT có trong product không
    if (!product || !product.data || !product.data.LIST_FILE_ATTACHMENT_DEFAULT) {
      console.log("LIST_FILE_ATTACHMENT_DEFAULT không có trong dữ liệu sản phẩm!");
      this.productImage = "https://via.placeholder.com/150";  // Hình ảnh mặc định khi không có dữ liệu
      return;
    }

    // Xử lý hình ảnh từ sản phẩm
    this.productImage = await this.getProductImage(product.data);  // Dùng product.data nếu dữ liệu nằm trong trường này
    console.log("Hình ảnh sản phẩm sau khi lấy:", this.productImage);  // Log URL hình ảnh

  } catch (error) {
    console.error("Lỗi khi lấy thông tin sản phẩm:", error);
    this.productImage = "https://via.placeholder.com/150";  // Hình ảnh mặc định khi có lỗi
  }

  this.showModal = true;
}





,



async getProductImage(product) {
  let image = null;
  console.log("Dữ liệu LIST_FILE_ATTACHMENT_DEFAULT:", product.LIST_FILE_ATTACHMENT_DEFAULT);

  // Kiểm tra nếu LIST_FILE_ATTACHMENT_DEFAULT tồn tại và có phần tử
  if (product?.LIST_FILE_ATTACHMENT_DEFAULT?.length > 0) {
    const defaultImage = product.LIST_FILE_ATTACHMENT_DEFAULT[0];
    console.log("Thông tin hình ảnh mặc định:", defaultImage);

    // Kiểm tra FILE_URL có tồn tại không
    if (defaultImage?.FILE_URL) {
      image = defaultImage.FILE_URL;
      console.log("URL hình ảnh hợp lệ:", image);
    } else {
      console.log("Không có URL hợp lệ trong FILE_URL.");
    }
  } else {
    console.log("Không có hình ảnh mặc định trong LIST_FILE_ATTACHMENT_DEFAULT.");
  }

  // Nếu không tìm thấy hình ảnh hợp lệ, trả về hình ảnh mặc định
  if (!image) {
    image = "https://via.placeholder.com/150";
  }

  return image;
}





,








closeModal() {
  this.showModal = false; // Đóng modal bằng cách đặt showModal thành false
},


      // Lấy danh sách đánh giá
      async fetchReviews() {
        this.isLoading = true;
        try {
          const response = await axios.get('http://localhost:8000/v1/review/', {
            params: {
              page: this.currentPage,
              limit: this.reviewsPerPage,
            },
          });

          // Log lại dữ liệu trả về từ API
          console.log("Dữ liệu trả về từ API:", response.data);

          // Kiểm tra dữ liệu trả về là mảng hay không
          if (response.data && Array.isArray(response.data)) {
            this.reviews = response.data; // Cập nhật danh sách đánh giá
            // Tính toán tổng số trang dựa trên tổng số đánh giá
            this.totalPages = Math.ceil(response.data.length / this.reviewsPerPage);
          } else {
            this.reviews = [];
            this.totalPages = 1; // Nếu không có đánh giá, trang vẫn là 1
          }
        } catch (error) {
          console.error("Lỗi khi lấy dữ liệu từ API:", error);
          Swal.fire({
            icon: 'error',
            title: 'Lỗi',
            text: 'Không thể tải dữ liệu từ API!',
          });
        } finally {
          this.isLoading = false;
        }
      },

      // Thay đổi trang phân trang
      changePage(page) {
        if (page < 1 || page > this.totalPages) return;
        this.currentPage = page;
        this.fetchReviews();
      },

      // // Xóa đánh giá
      // async deleteReview(reviewId) {
      //   const confirmation = await Swal.fire({
      //     title: 'Bạn có chắc chắn?',
      //     text: "Bạn sẽ không thể hoàn tác hành động này!",
      //     icon: 'warning',
      //     showCancelButton: true,
      //     confirmButtonColor: '#3085d6',
      //     cancelButtonColor: '#d33',
      //     confirmButtonText: 'Đúng, xóa nó!',
      //   });

      //   if (confirmation.isConfirmed) {
      //     try {
      //       const response = await axios.delete(`http://localhost:8000/v1/review/admin/${reviewId}`);
      //       console.log('Đánh giá đã được xóa:', response.data);
      //       this.fetchReviews(); // Tải lại danh sách đánh giá sau khi xóa
      //       Swal.fire({
      //         icon: 'success',
      //         title: 'Thành công!',
      //         text: 'Đánh giá đã được xóa.',
      //       });
      //     } catch (error) {
      //       console.error('Lỗi khi xóa đánh giá:', error);
      //       Swal.fire({
      //         icon: 'error',
      //         title: 'Lỗi',
      //         text: 'Không thể xóa đánh giá này.',
      //       });
      //     }
      //   }
      // },
    },
    mounted() {
      this.fetchReviews(); // Gọi API khi component được mount
    },
  };
  </script>
<style scoped>
.custom-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(17, 24, 39, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.custom-modal-overlay.show {
  opacity: 1;
  visibility: visible;
}

/* Modal container */
.custom-modal {
  background: linear-gradient(to bottom right, #ffffff, #f8fafc);
  width: 90%;
  max-width: 800px;
  border-radius: 16px;
  box-shadow: 
    0 10px 25px -5px rgba(0, 0, 0, 0.1),
    0 8px 10px -6px rgba(0, 0, 0, 0.1);
  transform: translateY(20px) scale(0.95);
  opacity: 0;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.custom-modal-overlay.show .custom-modal {
  transform: translateY(0) scale(1);
  opacity: 1;
}

/* Header styling */
.modal-header {
  padding: 24px 28px;
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
  background: rgba(255, 255, 255, 0.8);
  border-radius: 16px 16px 0 0;
  backdrop-filter: blur(8px);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 18px;
}

.user-avatar {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #fff;
  box-shadow: 
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: transform 0.3s ease;
}

.user-avatar:hover {
  transform: scale(1.05);
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.user-details h5 {
  margin: 0;
  font-size: 1.35rem;
  font-weight: 600;
  color: #1e293b;
  letter-spacing: -0.025em;
}

.user-email {
  font-size: 0.925rem;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 6px;
}

.user-email::before {
  content: "📧";
  font-size: 0.875rem;
}

/* Close button */
.close-button {
  background: white;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  font-size: 24px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.05),
    0 1px 2px rgba(0, 0, 0, 0.1);
}

.close-button:hover {
  background: #ef4444;
  color: white;
  transform: rotate(90deg);
}

/* Body styling */
.modal-body {
  padding: 28px;
}

.review-content {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 28px;
}

/* Rating section */
.rating-section {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 24px;
}

.stars {
  display: flex;
  gap: 6px;
  margin-bottom: 8px;
}

.star {
  font-size: 28px;
  color: #e2e8f0;
  transition: color 0.3s ease;
}

.star.filled {
  color: #fbbf24;
  text-shadow: 0 0 10px rgba(251, 191, 36, 0.4);
}

.rating-text {
  font-size: 1.1rem;
  color: #475569;
  font-weight: 500;
  margin-left: 12px;
}

/* Comment section */
.comment-section {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 24px;
}

.comment-section h6 {
  margin: 0 0 12px 0;
  color: #1e293b;
  font-size: 1.1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.comment-section h6::before {
  content: "💭";
  font-size: 1.2rem;
}

.comment-text {
  margin: 0;
  color: #475569;
  line-height: 1.7;
  font-size: 1.05rem;
}

/* Date section */
.date-section {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #64748b;
  font-size: 0.95rem;
  padding: 12px 16px;
  background: #f8fafc;
  border-radius: 8px;
  width: fit-content;
}

.date-section::before {
  content: "📅";
  font-size: 1.1rem;
}

/* Image container */
.modal-image-container {
  padding: 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  height: fit-content;
}

.modal-image-container h6 {
  margin: 0 0 16px 0;
  color: #1e293b;
  font-size: 1.1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.modal-image-container h6::before {
  content: "📷";
  font-size: 1.2rem;
}

.image-wrapper {
  position: relative;
  width: 100%;
  padding-top: 100%;
  border-radius: 12px;
  overflow: hidden;
  background: #f8fafc;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
}

.product-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 12px;
}

.product-image:hover {
  transform: scale(1.08);
}

.no-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  font-size: 0.95rem;
  flex-direction: column;
  gap: 12px;
}

.no-image::before {
  content: "🖼️";
  font-size: 2rem;
}

/* Footer styling */
.modal-footer {
  padding: 20px 28px;
  border-top: 1px solid rgba(226, 232, 240, 0.8);
  display: flex;
  justify-content: flex-end;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 0 0 16px 16px;
  backdrop-filter: blur(8px);
}

/* Close button styling */
.btn-close {
  padding: 10px 28px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #475569;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;
  position: relative;
  overflow: hidden;
}

.btn-close::before {
  content: "✖️";
  font-size: 0.9rem;
  margin-right: 4px;
  transition: transform 0.3s ease;
}

/* Gradient hover effect */
.btn-close:hover {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border-color: transparent;
  transform: translateY(-2px);
  box-shadow: 
    0 4px 12px rgba(37, 99, 235, 0.2),
    0 2px 4px rgba(37, 99, 235, 0.1);
}

/* Rotate icon on hover */
.btn-close:hover::before {
  transform: rotate(90deg);
}

/* Active state */
.btn-close:active {
  transform: translateY(0px);
  box-shadow: 
    0 2px 8px rgba(37, 99, 235, 0.2),
    0 1px 2px rgba(37, 99, 235, 0.1);
}

/* Alternative close button in header */
.close-button {
  background: white;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  font-size: 24px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.05),
    0 1px 2px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.close-button:hover {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  color: white;
  transform: rotate(90deg) scale(1.1);
  box-shadow: 
    0 4px 12px rgba(220, 38, 38, 0.2),
    0 2px 4px rgba(220, 38, 38, 0.1);
}

.close-button:active {
  transform: rotate(90deg) scale(0.95);
}

/* Add ripple effect for both buttons */
.btn-close::after,
.close-button::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.6s ease-out, height 0.6s ease-out;
}

.btn-close:active::after,
.close-button:active::after {
  width: 150%;
  height: 150%;
}
/* Responsive design */
@media (max-width: 768px) {
  .review-content {
    grid-template-columns: 1fr;
  }
  
  .custom-modal {
    width: 95%;
    margin: 16px;
  }
  
  .modal-header {
    padding: 20px;
  }
  
  .user-avatar {
    width: 44px;
    height: 44px;
  }
  
  .user-details h5 {
    font-size: 1.2rem;
  }
  
  .modal-body {
    padding: 20px;
  }
  
  .comment-section, 
  .modal-image-container {
    padding: 16px;
  }
  
  .rating-section {
    padding: 16px;
  }
  
  .star {
    font-size: 24px;
  }
}

/* Animation keyframes */
@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes overlayFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
