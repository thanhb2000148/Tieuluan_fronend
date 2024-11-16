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
                    <button class="btn btn-danger" @click="deleteReview(review._id)">Xem</button>
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
      </main>
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2';
import Slider from "../components/admin/Slider.vue";
import Nav from "../components/admin/Nav.vue";
import axios from 'axios';

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
    };
  },
  methods: {
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
