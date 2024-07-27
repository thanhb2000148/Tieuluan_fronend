<template>
  <NavBar />
  <Search />
  <SinglePageHeaderVue />
  <div class="container-fluid py-5">
    <div class="container py-5">
      <div v-if="cart.length === 0">
        <div class="text-cart-empty">
          <img src="../../public/img/cart_empty.png" alt="" />
          <p class="text-center">
            Hiện tại không có sản phẩm nào trong giỏ hàng của Anh/Chị.
          </p>
        </div>
      </div>
      <div class="table-responsive" v-else>
        <table class="table">
          <thead>
            <tr>
              <th scope="col">Ảnh sản phẩm</th>
              <th scope="col">Tên sản phẩm</th>
              <th scope="col">Phân loại</th>
              <th scope="col">Giá</th>
              <th scope="col">Số lượng</th>
              <th scope="col">Tổng cộng</th>
              <th scope="col">Xử lý</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in cart" :key="item.ITEM._id">
              <td>
                <div class="d-flex align-items-center">
                  <img
                    v-if="
                      item.ITEM.PRODUCT_DETAILS &&
                      item.ITEM.PRODUCT_DETAILS.imageUrl
                    "
                    :src="item.ITEM.PRODUCT_DETAILS.imageUrl"
                    class="img-fluid me-5 rounded-circle"
                    style="width: 80px; height: 80px"
                    alt=""
                  />
                </div>
              </td>

              <td>
                <p class="mb-0 mt-4" v-if="item.ITEM.PRODUCT_DETAILS">
                  {{ item.ITEM.PRODUCT_DETAILS.name }}
                </p>
                <p class="mb-0 mt-4" v-else>Thông tin sản phẩm không có sẵn</p>
              </td>
              <td>
                <p class="mb-0 mt-4">
                  <span
                    v-if="
                      item.ITEM.LIST_MATCH_KEY && item.ITEM.LIST_MATCH_KEY[0]
                    "
                    class="d-block"
                  >
                    {{ item.ITEM.LIST_MATCH_KEY[0].KEY }}:
                    {{ item.ITEM.LIST_MATCH_KEY[0].VALUE }}
                  </span>
                  <span v-else class="d-block">Thông tin không có sẵn</span>
                  <span
                    v-if="
                      item.ITEM.LIST_MATCH_KEY && item.ITEM.LIST_MATCH_KEY[1]
                    "
                    class="d-block"
                  >
                    {{ item.ITEM.LIST_MATCH_KEY[1].KEY }}:
                    {{ item.ITEM.LIST_MATCH_KEY[1].VALUE }}
                  </span>
                  <span v-else class="d-block">Thông tin không có sẵn</span>
                </p>
              </td>
              <td>
                <p class="mb-0 mt-4">{{ formatPrice(item.ITEM.PRICE) }}</p>
              </td>
              <td>
                <div class="input-group quantity mt-4" style="width: 100px">
                  <div class="input-group-btn">
                    <button
                      @click="
                        updateNumberCartMinus(
                          item.ITEM.ID_PRODUCT,
                          item.ITEM._id,
                          item.ITEM.QUANTITY - 1,
                          item.ITEM._id
                        )
                      "
                      class="btn btn-sm btn-minus rounded-circle bg-light border"
                    >
                      <i class="fa fa-minus"></i>
                    </button>
                  </div>
                  <input
                    type="text"
                    class="form-control form-control-sm text-center border-0"
                    :value="item.ITEM.QUANTITY"
                  />
                  <div class="input-group-btn">
                    <button
                      @click="
                        updateNumberCartPlus(
                          item.ITEM.ID_PRODUCT,
                          item.ITEM._id,
                          item.ITEM.QUANTITY + 1,
                          item.ITEM._id
                        )
                      "
                      class="btn btn-sm btn-plus rounded-circle bg-light border"
                    >
                      <i class="fa fa-plus"></i>
                    </button>
                  </div>
                </div>
              </td>
              <td>
                <p class="mb-0 mt-4">
                  {{
                    formatPrice(totalPrice(item.ITEM.PRICE, item.ITEM.QUANTITY))
                  }}
                </p>
              </td>
              <td>
                <button
                  class="btn btn-md rounded-circle bg-light border mt-4"
                  @click="deleteCart(item.ITEM._id)"
                >
                  <i class="fa fa-times text-danger"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="cart.length > 0">
        <!-- <div class="mt-5">
          <input
            type="text"
            class="border-0 border-bottom rounded me-5 py-3 mb-4"
            placeholder="Coupon Code"
          />
          <button
            class="btn border-secondary rounded-pill px-4 py-3 text-primary"
            type="button"
          >
            Apply Coupon
          </button>
        </div> -->
        <div class="row g-4 justify-content-end">
          <div class="col-8"></div>
          <div class="col-sm-8 col-md-7 col-lg-6 col-xl-4">
            <div class="bg-light rounded">
              <div class="p-4">
                <h1 class="display-6 mb-4">
                  <span class="fw-normal">Tổng đơn hàng</span>
                </h1>
              </div>
              <div
                class="py-4 mb-4 border-top border-bottom d-flex justify-content-between"
              >
                <h5 class="mb-0 ps-4 me-4">Tổng cộng</h5>
                <p class="mb-0 pe-4">
                  {{ formatPrice(calculateTotalCart()) }}
                </p>
              </div>

              <button
                @click="checkLenghtCart()"
                class="btn border-secondary rounded-pill px-4 py-3 text-primary text-uppercase mb-4 ms-4"
                type="button"
              >
                Thanh toán
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <AppFooter />
</template>

<script>
import cartService from "@/services/cart.service";
import productService from "@/services/product.service";
import NavBar from "@/components/User/layout/NavBar.vue";
import AppFooter from "@/components/User/layout/AppFooter.vue";
import SinglePageHeaderVue from "@/components/User/cart/SinglePageHeader.vue";
import formatUtils from "../utils/format";
import Swal from "sweetalert2";
import Search from "@/components/User/Home/Search.vue";
export default {
  name: "CartView",
  components: {
    NavBar,
    AppFooter,
    SinglePageHeaderVue,
    Search,
  },
  data() {
    return {
      cart: [],
    };
  },
  async created() {
    await this.getCart(); // Lấy dữ liệu giỏ hàng
    console.log("giỏ hàng:", this.cart);
    console.log("số lượng sp trong giỏ", this.getNumberCart);
    await this.populateProducts(); // Lấy chi tiết sản phẩm cho từng mục trong giỏ hàng
    await this.updateNumberCartPlus();
  },

  methods: {
    async getCart() {
      try {
        const response = await cartService.getCart();
        if (response && response.data) {
          this.cart = response.data; // Đặt dữ liệu giỏ hàng vào biến cục bộ
        }
      } catch (error) {
        console.error(error);
      }
    },

    async populateProducts() {
      for (let item of this.cart) {
        // Duyệt qua từng mục trong giỏ hàng và lấy chi tiết sản phẩm sử dụng `getProduct`
        const productDetails = await this.getProduct(item.ITEM.ID_PRODUCT);
        if (productDetails) {
          item.ITEM.PRODUCT_DETAILS = productDetails;
        } else {
          // Xử lý khi không tìm thấy sản phẩm, ví dụ gán một giá trị mặc định
          item.ITEM.PRODUCT_DETAILS = {
            NAME_PRODUCT: "Sản phẩm không tồn tại",
            LIST_FILE_ATTACHMENT_DEFAULT: [
              { FILE_URL: "default-image-url.jpg" },
            ],
          };
        }
      }
    },
    async getProduct(productId) {
      try {
        const response = await productService.getById(productId);
        if (response && response.data) {
          return {
            name: response.data.NAME_PRODUCT,
            imageUrl: response.data.LIST_FILE_ATTACHMENT_DEFAULT[0].FILE_URL,
            // Thêm các trường khác nếu cần
          };
        }
      } catch (error) {
        console.error(error);
        return null;
      }
    },
    totalPrice(price, quantity) {
      return price * quantity;
    },
    formatPrice(price) {
      if (typeof price !== "undefined") {
        const formatter = formatUtils.formatNumber(); // Initialize the formatter function
        return formatter(price); // Format the price using the formatter function
      } else {
        return "0"; // Hoặc giá trị mặc định khác tùy vào yêu cầu của bạn
      }
    },
    checkLenghtCart() {
      if (this.cart.length > 0) {
        this.$router.push("/checkout");
      } else {
        alert("bạn chưa có hàng trong giỏ");
      }
    },
    async updateNumberCartPlus(
      id_product,
      id_list_product,
      newNumber,
      item_id
    ) {
      try {
        // Tìm sản phẩm trong giỏ hàng
        const itemIndex = this.cart.findIndex(
          (item) => item.ITEM._id === item_id
        );
        if (itemIndex !== -1) {
          const productInCart = this.cart[itemIndex];

          // Kiểm tra nếu số lượng mới vượt quá số lượng sản phẩm trong kho
          if (newNumber > productInCart.ITEM.NUMBER_PRODUCT) {
            Swal.fire({
              icon: "error",
              title: "Số lượng vượt quá số lượng trong kho",
              text: `Sản phẩm này chỉ còn ${productInCart.ITEM.NUMBER_PRODUCT} trong kho.`,
            });
            return;
          }

          const response = await cartService.updateCart({
            id_product: id_product,
            id_list_product: id_list_product,
            numberCart: newNumber,
          });

          if (response && response.success) {
            // Cập nhật số lượng trong giỏ hàng cục bộ
            if (newNumber === 0) {
              const result = await Swal.fire({
                title: "Bạn có muốn xóa sản phẩm ra khỏi giỏ hàng",
                showDenyButton: false,
                showCancelButton: true,
                confirmButtonText: "Có",
                denyButtonText: `Không`,
              });
              if (result.isConfirmed) {
                await cartService.deleteCart(item_id);
                this.cart.splice(itemIndex, 1);
              }
            } else {
              // Update QUANTITY trong ITEM
              this.cart[itemIndex].ITEM.QUANTITY = newNumber;
            }
          } else {
            console.error("Cập nhật giỏ hàng thất bại", response.message);
          }
        }
      } catch (error) {
        console.error(error);
      }
    },

    async updateNumberCartMinus(
      id_product,
      id_list_product,
      newNumber,
      item_id
    ) {
      try {
        if (newNumber >= 0) {
          const response = await cartService.updateCart({
            id_product: id_product,
            id_list_product: id_list_product,
            numberCart: newNumber,
          });
          if (response && response.success) {
            const itemIndex = this.cart.findIndex(
              (item) => item.ITEM._id === item_id
            );
            if (newNumber === 0) {
              const result = await Swal.fire({
                title: "Bạn có muốn xóa sản phẩm ra khỏi giỏ hàng",
                showDenyButton: false,
                showCancelButton: true,
                confirmButtonText: "Có",
                denyButtonText: `Không`,
              });
              if (result.isConfirmed) {
                await cartService.deleteCart(item_id);
                this.cart.splice(itemIndex, 1);
              }
            } else {
              // Update QUANTITY trong ITEM
              this.cart[itemIndex].ITEM.QUANTITY = newNumber;
            }
          } else {
            console.error("Cập nhật giỏ hàng thất bại", response.message);
          }
        }
      } catch (error) {
        console.error(error);
      }
    },
    async deleteCart(id) {
      try {
        const result = await Swal.fire({
          title: "Bạn có muốn xóa sản phẩm ra khỏi giỏ hàng",
          showDenyButton: false,
          showCancelButton: true,
          confirmButtonText: "Có",
          denyButtonText: `Không`,
        });

        if (result.isConfirmed) {
          const response = await cartService.deleteCart(id);
          if (response && response.success) {
            const itemIndex = this.cart.findIndex(
              (item) => item.ITEM._id === id
            );
            if (itemIndex !== -1) {
              this.cart.splice(itemIndex, 1);
            }
          } else {
            console.error("Xóa giỏ hàng thất bại", response.message);
          }
        }
      } catch (error) {
        console.error(error);
      }
    },
    calculateTotalCart() {
      return this.cart.reduce((total, item) => {
        return total + this.totalPrice(item.ITEM.PRICE, item.ITEM.QUANTITY);
      }, 0);
    },
  },
};
</script>

<style scoped>
.text-cart-empty p {
  font-size: 25px;
}
.text-cart-empty img {
  display: block;
  margin: 0 auto;
}
</style>
