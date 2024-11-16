<template>
  <div>
    <NavBar />
    <div class="container content">
      <h2 class="my-4 text-3xl font-bold text-center">Sản Phẩm Yêu Thích Của Bạn</h2>
      <div class="row">
        <div v-for="product in favorites" :key="product._id" class="col-lg-4 col-md-4 mb-5 with">
          <div class="card shadow-md rounded-lg overflow-hidden transition-transform transform hover:scale-105">
            <img
              :src="product.PRODUCT_ID.LIST_FILE_ATTACHMENT[0]?.FILE_URL || 'default-image-url.jpg'"
              class="card-img-top object-cover h-56 w-full"
              alt="Product Image"
            />
            <div class="card-body p-4">
              <h5 class="card-title text-xl font-semibold text-primary mb-2">{{ product.PRODUCT_ID.NAME_PRODUCT }}</h5>
              <p class="card-text text-gray-500 mb-3">{{ product.PRODUCT_ID.SHORT_DESC }}</p>
              <p class="card-text font-bold text-lg mb-4">
                {{ product.price !== undefined ? product.price + ' VNĐ' : 'Giá chưa có' }}
              </p>
              <div class="flex justify-between">
                <button class="btn btn-outline-primary" @click="goToDetail(product.PRODUCT_ID._id)">
                  Xem chi tiết
                </button>
                <button class="btn btn-outline-danger" @click="removeFromFavorites(product)">Xóa</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="favorites.length === 0" class="text-center my-8">
        <p class="text-gray-600 text-lg">Bạn chưa có sản phẩm yêu thích nào.</p>
<button class="btn btn-primary mt-4" @click="goToShop">Xem thêm sản phẩm</button>
      </div>
    </div>
    <AppFooter />
  </div>
</template>

<script>
import NavBar from "@/components/User/layout/NavBar.vue";
import AppFooter from "@/components/User/layout/AppFooter.vue";
import userService from "@/services/user.service";
import FavoriteService from "@/services/favorite";
import priceService from "@/services/price.service";
import Swal from "sweetalert2";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Favorites",
  components: { NavBar, AppFooter },
  data() {
    return { favorites: [], userId: null };
  },
  async created() {
    await this.fetchUserLogin();
    this.favorites.forEach(product => {
      this.fetchPrice(product.PRODUCT_ID._id);
    });
  },
  methods: {
    goToDetail(productId) {
      this.$router.push({ name: 'UserDetail', params: { id: productId } });
    },
     goToShop() {
    this.$router.push({ name: 'ShopView' });
    },
    async fetchPrice(productId) {
      if (!productId) return;
      try {
        const response = await priceService.getDefaultPrice(productId);
        if (response && response.success) {
          const priceData = response.data.find(item => item.ID_PRODUCT === productId);
          if (priceData) {
            const product = this.favorites.find(p => p.PRODUCT_ID._id === productId);
            if (product) product.price = priceData.PRICE_NUMBER;
          }
        }
      } catch (error) {
        console.error("Error fetching price:", error);
      }
    },
    async fetchUserLogin() {
      try {
        const response = await userService.getUserLogin();
        if (response && response.success && response.data) {
          this.userId = response.data._id;
          await this.fetchFavorites();
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    },
    async fetchFavorites() {
      if (!this.userId) return;
      try {
        const response = await FavoriteService.getFavoritesByUserId(this.userId);
        if (response && response.success) {
          this.favorites = response.data;
          for (const favorite of this.favorites) {
            const productId = favorite.PRODUCT_ID ? favorite.PRODUCT_ID._id : null;
            if (productId) {
              const price = await this.fetchPrice(productId);
              favorite.price = price;
            }
          }
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    },
    async removeFromFavorites(favorite) {
      if (!this.userId) return;
      try {
        const productId = favorite.PRODUCT_ID._id;
        const response = await FavoriteService.removeFavorite(this.userId, productId);
        if (response && response.success) {
          this.favorites = this.favorites.filter(product => product._id !== favorite._id);
          Swal.fire({
            icon: 'success',
            title: 'Thành công!',
            text: 'Sản phẩm đã được xóa khỏi danh sách yêu thích.',
            confirmButtonText: 'OK'
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Lỗi!',
            text: response.message || 'Không thể xóa sản phẩm yêu thích.',
            confirmButtonText: 'OK'
          });
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi!',
          text: 'Có lỗi xảy ra. Vui lòng thử lại sau.',
          confirmButtonText: 'OK'
        });
      }
    }
  }
};
</script>

<style scoped>
.card {
  transition: transform 0.3s, box-shadow 0.3s;
}

.card:hover {
  transform: translateY(-8px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}

.text-primary {
  color: #007bff;
}

.btn-outline-primary {
  color: #007bff;
  border-color: #007bff;
}

.btn-outline-primary:hover {
  background-color: #007bff;
  color: #fff;
}

.btn-outline-danger {
  color: #dc3545;
  border-color: #dc3545;
}

.btn-outline-danger:hover {
  background-color: #dc3545;
  color: #fff;
}

.content {
  margin-top: 110px; /* Điều chỉnh giá trị tùy thuộc vào chiều cao của navbar */
}

.with{
    width: 20%!important;
}
.card-img-top {
  width: 100%;
  height: 250px; /* Chiều cao cố định cho ảnh, bạn có thể điều chỉnh cho phù hợp */
  object-fit: cover; /* Cắt ảnh cho vừa khung mà không bị méo */
  object-position: center; /* Căn giữa ảnh trong khung */
}


/* Thiết lập căn chỉnh và khoảng cách giữa các nút */
.card-body .flex {
  display: flex;
  justify-content: space-between;
  gap: 10px; /* Tạo khoảng cách giữa hai nút */
}

</style>
