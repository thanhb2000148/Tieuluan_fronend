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
    @import '../style.css/dasboardReview.css';

</style>
