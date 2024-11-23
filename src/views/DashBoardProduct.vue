<template>
  <div class="wrapper">
    <Slider />
    <div class="main">
      <Nav />
      <main class="content px-3 py-2">
        <div class="container-fluid">
          <h1 class="mb-4 text-center">Sản phẩm trong cửa hàng</h1>
          <div class="d-flex justify-content-between mb-3">
            <button @click="showAddProductModal = true" class="btn btn-primary">
              Thêm Số Lượng
            </button>
            <div class="filter-search">
              <select v-model="filterOption" class="form-select" @change="filterProducts">
                <option value="all">Tất cả</option>
                <option value="new">Sản phẩm Mới Nhất</option>
              </select>
              <form class="form-inline" @submit.prevent>
                <div class="input-group">
                  <input
                    class="form-control"
                    type="search"
                    placeholder="Tìm kiếm..."
                    aria-label="Search"
                    v-model="searchText"
                  />
                  <div class="input-group-append">
                    <button class="btn btn-outline-success" type="submit">
                      <i class="fas fa-search"></i>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <!-- Modal for adding product quantity -->
        <div v-if="showAddProductModal" class="modal">
          <div class="modal-content">
            <span class="close" @click="showAddProductModal = false">&times;</span>
            <h2 class="modal-title">Thêm Số Lượng Kho cho Sản Phẩm</h2>

            <!-- Dropdown để chọn sản phẩm -->
            <div class="form-group">
              <label for="productSelect" class="form-label">Chọn sản phẩm:</label>
              <select v-model="selectedProduct" id="productSelect" class="form-control">
                <option v-for="(product, index) in filteredProducts" :key="index" :value="product">
                  {{ product.NAME_PRODUCT }} - Hiện có: {{ product.NUMBER_INVENTORY_PRODUCT }}
                </option>
              </select>
            </div>

          <!-- Hiển thị thuộc tính của sản phẩm được chọn -->
        <div v-if="selectedProduct" class="attributes-container">
          <h4 class="attributes-title">Thuộc tính của sản phẩm:</h4>
          <ul class="attributes-list">
            <li v-for="(attribute, index) in selectedProduct.LIST_PRODUCT_METADATA" :key="index">
              <b class="attribute-key">{{ attribute.KEY }}:</b> <span class="attribute-value">{{ attribute.VALUE.join(', ') }}</span>
            </li>
          </ul>
        </div>

    <!-- Form để thêm số lượng và thuộc tính Màu Sắc, Kích Thước -->
    <form @submit.prevent="addProduct">
      <div v-if="selectedProduct" class="form-section">
        <div class="form-group">
          <label class="form-label">Số Lượng:</label>
          <input type="number" v-model="newProductQuantity" class="form-control" required />
        </div>
        <div class="form-group">
          <label class="form-label">Màu Sắc:</label>
          <input v-model="color" class="form-control" placeholder="Nhập màu sắc" required />
        </div>
        <div class="form-group">
          <label class="form-label">Kích Thước:</label>
          <input v-model="size" class="form-control" placeholder="Nhập kích thước" required />
        </div>
        <button type="submit" class="btn btn-success">Thêm Số Lượng</button>
      </div>
    </form>
  </div>
</div>


          <!-- Bảng sản phẩm -->
          <table class="table table-bordered">
            <thead>
              <tr>
                <th class="text-center">STT</th>
                <th class="text-center">Tên sản phẩm</th>
                <th class="text-center">Tổng số lượng</th>
                <th class="text-center">Ảnh sản phẩm</th>
                <th class="text-center">Số lượng chi tiết</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(product, index) in filteredProducts" :key="index">
                <td class="text-center">{{ index + 1 }}</td>
                <td class="text-center">{{ product.NAME_PRODUCT }}</td>
                <td class="text-center">{{ product.NUMBER_INVENTORY_PRODUCT }}</td>
                <td class="text-center">
                  <img
                    :src="product.LIST_FILE_ATTACHMENT_DEFAULT[0].FILE_URL"
                    class="img-thumbnail"
                    width="100px"
                    alt="Product Image"
                  />
                </td>
                <td>
                  <ul class="list-unstyled text-center">
                    <li v-for="(detail, i) in product.QUANTITY_BY_KEY_VALUE" :key="i">
                      <div class="row">
                        <div class="col-md-6">
                          <span v-for="(key, j) in detail.LIST_MATCH_KEY" :key="j">
                            <b>{{ key.KEY }}:</b> {{ key.VALUE[0] }}<br>
                          </span>
                        </div>
                        <div class="col-md-6">
                          <span class="text-center">
                            <b>Số lượng:</b> {{ detail.QUANTITY }}
                          </span>
                        </div>
                      </div>
                      <hr />
                    </li>
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
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
import inventoryService from "@/services/inventory.service";
import Swal from "sweetalert2";

export default {
  name: "DashboardProduct",
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
      showAddProductModal: false,
      selectedProduct: null,
      newProductQuantity: 0,
      color: '',  //  attribute: Màu sắc
      size: '',   // attribute: Kích Thước
      attributes: [],  // khởi tạo attributes
      filterOption: 'all', // trạng thái dropdown
      searchText: '', // văn bản tìm kiếm
    };
  },
  created() {
    this.getAllProduct();
    this.getProduct();
  },
  computed: {
    filteredProducts() {
      // Sao chép toàn bộ sản phẩm từ `numberProduct` (tất cả sản phẩm)
      let filtered = [...this.numberProduct];

      // Tìm kiếm theo tên sản phẩm
      if (this.searchText) {
        filtered = filtered.filter(product =>
          product.NAME_PRODUCT.toLowerCase().includes(this.searchText.toLowerCase())
        );
      }

       // Lọc theo sản phẩm mới nhất (lấy các sản phẩm cuối bảng)
      if (this.filterOption === 'new') {
        filtered = filtered.reverse();  // Đảo ngược danh sách sản phẩm
      }

      // Áp dụng phân trang cho dữ liệu đã lọc
      return filtered.slice((this.page - 1) * this.limit, this.page * this.limit);
    },
  },
  methods: {
    myCallback() {
      this.skip = this.page;
      this.getProduct();
    },
  //   filterProducts() {
  //   if (this.filterOption === 'new') {
  //     const thirtyDaysAgo = new Date();
  //     thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  //     this.products = this.numberProduct.filter(product => {
  //       return new Date(product.createdAt) >= thirtyDaysAgo; // Thay 'createdAt' bằng thuộc tính tương ứng
  //     });
  //   } else {
  //     this.products = this.numberProduct; // Trả lại tất cả sản phẩm
  //   }
  //   this.page = 1; // Đặt lại trang về 1
  // },

    async getProduct() {
      try {
        const response = await productService.getAll(this.skip, this.limit);
        if (response && response.data) {
          this.products = response.data;
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
    
    async addProduct() {
      if (this.selectedProduct && this.selectedProduct.QUANTITY_BY_KEY_VALUE) {
        // Gán giá trị `Màu Sắc` và `Kích Thước` vào attributes
        this.attributes = [
          { key: "Màu Sắc", value: this.color },
          { key: "Kích Thước", value: this.size }
        ];

        // Kiểm tra nếu `attributes` là rỗng
        if (!this.attributes || this.attributes.length === 0) {
          console.error("Attributes are missing.");
          return;
        }

        // Lấy các key và value từ thuộc tính
        const keys = this.attributes.map(attr => attr.key);
        const values = this.attributes.map(attr => attr.value);

        // Kiểm tra xem đã có mục với tổ hợp thuộc tính tương tự chưa
        const matchingEntry = this.selectedProduct.QUANTITY_BY_KEY_VALUE.find(entry => {
          return entry.LIST_MATCH_KEY.every((keyVal, index) => 
            keyVal.KEY === keys[index] && keyVal.VALUE[0] === values[index]
          );
        });

        if (matchingEntry) {
          // Nếu đã có mục này, cập nhật số lượng
          matchingEntry.QUANTITY += this.newProductQuantity;
        } else {
          // Nếu chưa có, tạo mục mới
          this.selectedProduct.QUANTITY_BY_KEY_VALUE.push({
            QUANTITY: this.newProductQuantity,
            LIST_MATCH_KEY: keys.map((key, index) => ({
              KEY: key,
              VALUE: [values[index]],
            }))
          });
        }

        try {
          const payload = {
            quantity: this.newProductQuantity,
            keys: keys,
            values: values,
          };

          // Gửi yêu cầu cập nhật kho
          await inventoryService.addInventoryEntries(this.selectedProduct._id, payload.quantity, payload.keys, payload.values);
          // Hiển thị thông báo thành công
          Swal.fire({
            icon: 'success',
            title: 'Thành công',
            text: 'Thêm số lượng sản phẩm thành công!',
            confirmButtonText: 'OK',
          });
          this.showAddProductModal = false;
          this.getProduct(); // Cập nhật danh sách sản phẩm
        } catch (error) {
          console.error("Lỗi khi thêm kho:", error);
          // Hiển thị thông báo lỗi
          Swal.fire({
            icon: 'error',
            title: 'Lỗi',
            text: 'Có lỗi xảy ra khi cập nhật giá. Vui lòng thử lại.',
            confirmButtonText: 'OK',
          });
        }
      } else {
        console.error("Selected product or its inventory data is missing.");
      }
    }
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

/* Modal Styles */
.modal {
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7); /* Tăng độ tối để tạo cảm giác sâu hơn */
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity 0.3s ease; /* Thêm hiệu ứng mờ cho modal */
}

.modal-content {
  background-color: #fff;
  padding: 20px; /* Tăng padding để tạo không gian hơn */
  border-radius: 10px; /* Bo tròn các góc */
  width: 90%; /* Giữ kích thước này */
  max-width: 450px; /* Tăng chiều rộng tối đa */
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2); /* Hiệu ứng bóng đổ mạnh mẽ hơn */
  position: relative;
 /* overflow-y: auto;  Thêm thanh cuộn nếu nội dung vượt quá */
 /* max-height: 80vh;  Giới hạn chiều cao của modal */
}

.close {
  position: absolute;
  top: 15px; /* Điều chỉnh vị trí lên một chút */
  right: 20px; /* Điều chỉnh vị trí sang bên phải một chút */
  font-size: 24px; /* Tăng kích thước biểu tượng đóng */
  cursor: pointer;
  color: #ff5c5c; /* Thay đổi màu sắc để nổi bật hơn */
  transition: color 0.3s ease; /* Thêm hiệu ứng chuyển màu */
}

.close:hover {
  color: #ff0000; /* Thay đổi màu khi di chuột */
}

.modal-title {
  text-align: center;
  margin-bottom: 20px; /* Tăng khoảng cách dưới tiêu đề */
  font-size: 1.6rem; /* Tăng kích thước chữ */
  color: #333;
  font-weight: bold; /* Đậm chữ */
}


/* Flexbox for Filter and Search */
.filter-search {
  display: flex;
  align-items: center;
  gap: 10px;
}

.input-group {
  display: flex;
}

.attributes-container {
  border: 1px solid #ddd; /* Đường viền xung quanh khung */
  border-radius: 8px; /* Bo tròn các góc */
  padding: 15px; /* Padding cho khung */
  background-color: #f9f9f9; /* Màu nền nhẹ cho khung */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* Hiệu ứng bóng nhẹ */
  margin-top: 15px; /* Khoảng cách phía trên */
}

.attributes-title {
  text-align: center;
  margin-bottom: 10px; /* Khoảng cách phía dưới tiêu đề */
  font-size: 1.5rem; /* Kích thước chữ lớn hơn */
  color: #333; /* Màu chữ tối */
  font-weight: bold; /* Làm chữ đậm */
}

.attributes-list {
  list-style-type: none; /* Loại bỏ dấu chấm đầu dòng */
  padding-left: 0; /* Bỏ khoảng cách bên trái */
}

.attribute-key {
  color: #007bff; /* Màu chữ cho tên thuộc tính */
  font-weight: bold; /* Làm chữ đậm */
}

.attribute-value {
  color: #555; /* Màu chữ cho giá trị thuộc tính */
}

</style>
