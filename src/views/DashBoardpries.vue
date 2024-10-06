<template>
  <div class="wrapper">
    <Slider />
    <div class="main">
      <Nav />
      <main class="content px-3 py-2">
        <div class="container-fluid">
          <h1 class="mb-4 text-center">Sản phẩm trong cửa hàng</h1>

         <!-- Modal cho cập nhật giá -->
            <div v-if="showPriceForm" class="modal-overlay">
            <div class="modal-content">
                <span class="close" @click="showPriceForm = false">&times;</span>
                <h3>Cập nhật giá sản phẩm</h3>
                <div>
                <label for="priceType">Chọn loại giá:</label>
                <select v-model="selectedPriceType" id="priceType">
                    <option value="default">Giá mặc định</option>
                    <option value="attribute">Giá theo thuộc tính</option>
                </select>
                </div>
                <div v-if="selectedPriceType === 'default'">
                <label for="newPrice">Nhập giá mới:</label>
                <input type="number" v-model="newPrice" id="newPrice" />
                </div>
                <div v-if="selectedPriceType === 'attribute'">
                <label for="attributeKeys">Nhập thuộc tính (Màu sắc, Kích thước):</label>
                <input type="text" v-model="attributeKeys" id="attributeKeys" placeholder="Ví dụ: Màu Sắc,Kích Thước" />
                <label for="attributeValues">Nhập giá trị tương ứng:</label>
                <input type="text" v-model="attributeValues" id="attributeValues" placeholder="Ví dụ: Trắng,M" />
                <label for="newAttributePrice">Nhập giá mới:</label>
                <input type="number" v-model="newAttributePrice" id="newAttributePrice" />
                </div>
                <button class="btn-update" @click="updatePrice">Cập nhật giá</button>
                <!-- <button class="btn-close" @click="showPriceForm = false">Đóng</button> -->
            </div>
            </div>


          <table class="table table-bordered">
            <thead>
              <tr>
                <th class="text-center">STT</th>
                <th class="text-center">Tên sản phẩm</th>
                <th class="text-center">Ảnh sản phẩm</th>
                <th class="text-center">Giá sản phẩm</th>
                <th class="text-center">Thông số và Giá</th>
                <th class="text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(product, index) in products" :key="index">
                <td class="text-center">{{ index + 1 }}</td>
                <td class="text-center">{{ product.NAME_PRODUCT }}</td>
                <td class="text-center">
                  <img
                    :src="product.LIST_FILE_ATTACHMENT_DEFAULT[0].FILE_URL"
                    class="img-thumbnail"
                    width="100px"
                    alt="Product Image"
                  />
                </td>
                <td class="text-center">
                  <span v-if="product.DEFAULT_PRICE">{{ product.DEFAULT_PRICE }} VNĐ</span>
                  <span v-else>Chưa có giá</span>
                </td>
                <td>
                  <ul class="list-unstyled text-center">
                    <li
                      v-for="(detail, i) in product.QUANTITY_BY_KEY_VALUE"
                      :key="i"
                    >
                      <div class="row">
                        <div class="col-md-6">
                          <span
                            class="text-center"
                            v-for="(key, j) in detail.LIST_MATCH_KEY"
                            :key="j"
                          >
                            <b>{{ key.KEY }}:</b> {{ key.VALUE[0] }}<span v-if="j < detail.LIST_MATCH_KEY.length - 1">,</span>
                          </span>
                        </div>
                        <div class="col-md-6">
                          <span class="text-center">
                            <b>Giá:</b> {{ detail.PRICE !== undefined ? detail.PRICE + ' VNĐ' : 'Chưa có giá' }}
                          </span>
                        </div>
                      </div>
                      <hr />
                    </li>
                  </ul>
                </td>
                <td class="text-center">
                  <!-- <button class="btn btn-sm btn-primary">Sửa</button> -->
                  <button class="btn btn-sm btn-primary" @click="editPrice(product._id)">Sửa</button>
                  <button class="btn btn-sm btn-danger">Xóa</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="pagination">
          <pagination
            v-model="page"
            :records="numberProduct.length"
            :per-page="limit"
            @paginate="myCallback"
            class="pagination-3"
          />
        </div>
      </main>
    </div>
  </div>
</template>





<script>
import Slider from "../components/admin/Slider.vue";
import Nav from "../components/admin/Nav.vue";
import productService from "@/services/product.service";
import Pagination from "v-pagination-3";
import PriceService from "@/services/price.service";
import Swal from "sweetalert2";


export default {
  name: "DashBoardpries",
  components: {
    Slider,
    Nav,
   
    Pagination,
  },
  data() {
    return {
      products: [],
      numberProduct: [],
      page: 1,
      limit: 6,
        skip: 1,
      selectedPriceType: "default", // Loại giá được chọn
      newPrice: null,
      newAttributePrice: null,
      attributeKeys: "",
      attributeValues: "",
      selectedProductId: null,
      selectedListPriceId: null,
      showPriceForm: false,
    };
  },
  created() {
    this.getAllProduct();
    this.getProduct();
    },
  mounted() {
      this.fetchProducts(); 
     this.fetchAllPrices(); 
},
    methods: {
    showError(message) {
        // Bạn có thể xử lý hiển thị lỗi ở đây
        console.error(message);
        // Ví dụ: Hiển thị thông báo lỗi lên giao diện
        alert(message);
        },
    showSuccess(message) {
        // Bạn có thể xử lý hiển thị lỗi ở đây
        console.error(message);
        // Ví dụ: Hiển thị thông báo lỗi lên giao diện
        alert(message);
    },
    async getProduct() {
        try {
            const response = await productService.getAll(this.skip, this.limit);
            if (response && response.data) {
            this.products = response.data;
            // Gọi hàm để lấy giá cho từng sản phẩm
                await this.fetchProducts();
                await this.fetchDefaultPrices(); // Fetch default prices here

            }
        } catch (error) {
            console.error(error);
        }
    },

    async getAllProduct() {
      try {
        const response = await productService.getAllProduct();
        if (response && response.data) {
          this.numberProduct = response.data;
        }
      } catch (error) {
        console.error(error);
      }
        },
     async fetchAllPrices() {
    try {
      const data = await PriceService.getAllPrices();
      console.log("All Prices:", data);
      this.prices = data.data; // Adjust according to your response structure
    } catch (error) {
      console.error("Error fetching all prices:", error);
    }
  },
// Hàm xử lý khi bấm nút Sửa
    // Nhấn vào nút "Sửa"
  async editPrice(productId) {
      if (!productId) {
        console.error("Không tìm thấy ID của sản phẩm");
        return;
      }
      this.selectedProductId = productId;
      this.selectedListPriceId = null; // Reset list_price_id
      this.showPriceForm = true;
      
      // Lấy thông tin giá mặc định
      try {
        const priceData = await PriceService.getDefaultPrice(productId);
        if (priceData && priceData.success && priceData.data.length > 0) {
          this.newPrice = priceData.data[0].PRICE_NUMBER;
          this.selectedListPriceId = priceData.data[0]._id;
        } else {
          this.newPrice = null;
          this.selectedListPriceId = null;
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin giá mặc định:", error);
      }
    },
async updatePrice() {
    const idProduct = this.selectedProductId;

    if (!idProduct) {
        console.error("Thiếu ID sản phẩm");
        Swal.fire({
            icon: 'error',
            title: 'Lỗi',
            text: 'Không tìm thấy ID sản phẩm. Vui lòng thử lại.',
            confirmButtonText: 'OK',
        });
        return;
    }

    // Tạo payload dựa trên loại giá được chọn
    const payload = this.createPayload();

    console.log("Thông tin cập nhật giá:", {
        idProduct,
        selectedPriceType: this.selectedPriceType,
        payload,
        selectedListPriceId: this.selectedListPriceId
    });

    try {
        let response;
        if (this.selectedPriceType === "default") {
            // Nếu là giá mặc định, tìm ID list_price tương ứng
            this.selectedListPriceId = this.findDefaultPriceId(idProduct);
            response = await PriceService.updatePrice(idProduct, this.selectedListPriceId, payload);
        } else if (this.selectedListPriceId) {
            response = await PriceService.updatePrice(idProduct, this.selectedListPriceId, payload);
        } else {
            response = await PriceService.createPrice(idProduct, payload);
        }

        console.log("Cập nhật giá thành công:", response);
        Swal.fire({
            icon: 'success',
            title: 'Thành công',
            text: 'Cập nhật giá thành công!',
            confirmButtonText: 'OK',
        });
        this.showPriceForm = false;
        await this.getProduct(); // Refresh danh sách sản phẩm
    } catch (error) {
        console.error("Lỗi khi cập nhật giá:", error);
        Swal.fire({
            icon: 'error',
            title: 'Lỗi',
            text: 'Có lỗi xảy ra khi cập nhật giá. Vui lòng thử lại.',
            confirmButtonText: 'OK',
        });
    }
},




createPayload() {
    let payload;

    if (this.selectedPriceType === "default") {
        payload = {
            price_number: this.newPrice,
        };
    } else if (this.selectedPriceType === "attribute") {
        const keys = this.attributeKeys.split(",").map(k => k.trim());
        const values = this.attributeValues.split(",").map(v => v.trim());
        payload = {
            price_number: this.newAttributePrice,
            key: keys,
            value: values,
        };

        // Tìm list_price_id tương ứng
        this.selectedListPriceId = this.findListPriceId(this.selectedProductId, keys, values);
        console.log("Selected List Price ID từ findListPriceId:", this.selectedListPriceId);
    }

    return payload;
},
findDefaultPriceId(productId) {
    // Tìm sản phẩm trong danh sách sản phẩm
    const product = this.prices.find(p => p.ID_PRODUCT.toString() === productId);
    if (!product) return null;

    // Tìm giá mặc định trong LIST_PRICE
    const defaultPrice = product.LIST_PRICE.find(lp => 
        lp.LIST_MATCH_KEY.length === 0 // kiểm tra LIST_MATCH_KEY rỗng
    );

    return defaultPrice ? defaultPrice._id : null; // Trả về ID của giá mặc định
},


//cập nhập giá đúng
findListPriceId(productId, keys, values) {
    console.log("Tìm List Price ID với tham số:", productId, keys, values);

    // Tìm sản phẩm trong danh sách sản phẩm
    const product = this.products.find(p => p._id === productId);
    if (!product) return null;

    // Tìm giá trong dữ liệu giá đã lấy
    const priceEntry = this.prices.find(price => price.ID_PRODUCT.toString() === productId);
    if (!priceEntry) return null;

    // Trường hợp không có thuộc tính, trả về list_price_id của giá mặc định
    if (keys.length === 0) {
        return this.selectedListPriceId; // Hoặc giá trị khác nếu cần
    }

    // Tìm kiếm trong LIST_PRICE
    const detail = priceEntry.LIST_PRICE.find(lp => 
        lp.LIST_MATCH_KEY.length === keys.length &&
        lp.LIST_MATCH_KEY.every((item, index) => 
            item.KEY === keys[index] && item.VALUE.includes(values[index])
        )
    );

    console.log("Chi tiết tìm được:", detail);
    return detail ? detail._id : null; // Trả về ID của detail
},


    async fetchDefaultPrices() {
      for (const product of this.products) {
        try {
          const priceData = await PriceService.getDefaultPrice(product._id);
          if (priceData && priceData.success && priceData.data.length > 0) {
            product.DEFAULT_PRICE = priceData.data[0].PRICE_NUMBER;
            product.DEFAULT_PRICE_ID = priceData.data[0]._id;
          } else {
            product.DEFAULT_PRICE = 'Chưa có giá';
            product.DEFAULT_PRICE_ID = null;
          }
        } catch (error) {
          console.error("Lỗi khi gọi PriceService:", error);
          product.DEFAULT_PRICE = 'Đã xảy ra lỗi khi lấy giá';
          product.DEFAULT_PRICE_ID = null;
        }
      }
    },
    async fetchProducts() {
        console.log("Bắt đầu fetchProducts");

        for (const product of this.products) {
            for (const detail of product.QUANTITY_BY_KEY_VALUE) {
            const keys = detail.LIST_MATCH_KEY.map((item) => item.KEY); // Trích xuất các key (màu sắc, kích thước)
            const values = detail.LIST_MATCH_KEY.map((item) => item.VALUE[0]); // Trích xuất các giá trị tương ứng

            console.log("key[]:", keys);
            console.log("value[]:", values);

            try {
                // Gọi dịch vụ lấy giá dựa trên ID sản phẩm và các thuộc tính
                const priceData = await PriceService.getPriceProduct(product._id, keys, values);
                console.log("Kết quả từ PriceService:", priceData);

                // Gán giá đã lấy hoặc thông báo mặc định nếu không có
                detail.PRICE = (priceData && priceData.success && priceData.data.length > 0) 
                    ? priceData.data[0].PRICE_NUMBER 
                    : 'Chưa có giá';
                
                console.log("Giá:", detail.PRICE);
            } catch (error) {
                console.error("Lỗi khi gọi PriceService:", error);
                detail.PRICE = 'Đã xảy ra lỗi khi lấy giá';
            }
            }
        }
    },
    myCallback() {
      this.skip = this.page;
      this.getProduct();
    },
  },
};
</script>

<style scoped>
.wrapper {
  display: flex;
}

.main {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.content {
  flex-grow: 1;
  padding: 20px;
}

.table {
  width: 100%;
  margin-top: 20px;
  border-collapse: collapse;
}

.table-bordered {
  border: 1px solid #000;
}

.table th,
.table td {
  padding: 12px;
  text-align: center;
  vertical-align: middle;
  border: 1px solid #000;
  background-color: #fff;
}

.table th {
  color: #000;
}

.img-thumbnail {
  border: 1px solid #dee2e6;
  padding: 4px;
  border-radius: 4px;
}

.btn {
  margin-right: 8px;
}

.list-unstyled {
  padding-left: 0;
  list-style: none;
  text-align: center;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.pagination-3 {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
}

.pagination-3 li {
  margin-right: 5px;
}

.pagination-3 li a {
  display: block;
  padding: 5px 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  text-decoration: none;
  color: #333;
}

.pagination-3 li.active a {
  background-color: #007bff;
  color: #fff;
}

.VuePagination__count {
  display: none;
}

.a {
  color: black;
}
.pagination {
  display: block;
}

/* Tùy chỉnh hiển thị cho form cập nhật giá */
.update-price-form {
  border: 1px solid #ddd;
  padding: 20px;
  margin: 20px 0;
}
/* Modal */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.6); /* Nền mờ */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000; /* Đảm bảo modal nằm trên cùng */
}

.modal-content {
    background-color: #fff; /* Màu nền trắng */
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3); /* Đổ bóng */
    width: 400px; /* Chiều rộng của modal */
    position: relative; /* Để quản lý vị trí */
}

.close {
    position: absolute;
    top: 8px;
    right: 15px;
    font-size: 38px;
    cursor: pointer;
    color: #ff0000; /* Màu đỏ cho nút đóng */
}

h3 {
    margin: 0 0 15px; /* Khoảng cách cho tiêu đề */
    text-align: center; /* Canh giữa tiêu đề */
}

label {
    display: block; /* Hiển thị label như một khối */
    margin-bottom: 5px; /* Khoảng cách giữa label và input */
    font-weight: bold; /* In đậm */
}

input[type="number"],
input[type="text"],
select {
    width: 100%; /* Chiều rộng 100% cho các trường nhập */
    padding: 10px; /* Padding cho input */
    margin-bottom: 15px; /* Khoảng cách giữa các trường nhập */
    border: 1px solid #ccc; /* Viền cho input */
    border-radius: 5px; /* Bo tròn góc */
    box-sizing: border-box; /* Đảm bảo padding không làm tăng kích thước */
}

.btn-update,
.btn-close {
    background-color: #4caf50; /* Màu xanh lá cho nút cập nhật */
    color: white; /* Màu chữ trắng */
    border: none; /* Không viền */
    padding: 10px 15px; /* Padding cho nút */
    border-radius: 5px; /* Bo tròn góc cho nút */
    cursor: pointer; /* Con trỏ tay khi hover */
    transition: background-color 0.3s; /* Hiệu ứng chuyển màu */
}

.btn-close {
    background-color: #f44336; /* Màu đỏ cho nút đóng */
}

.btn-update:hover,
.btn-close:hover {
    opacity: 0.8; /* Hiệu ứng mờ khi hover */
}

</style>
