<template>
  <div class="wrapper">
    <Slider />
    <div class="main">
      <Nav />
      <main class="content px-3 py-2">
        <div class="container-fluid">
          <h1 class="mb-4 text-center">Sản phẩm trong cửa hàng</h1>
          <table class="table table-bordered">
            <thead>
              <tr>
                <th class="text-center">STT</th>
                <th class="text-center">Tên sản phẩm</th>
                <th class="text-center">Tổng số lượng</th>
                <th class="text-center">Ảnh sản phẩm</th>
                <th class="text-center">Số lượng chi tiết</th>
                <th class="text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(product, index) in products" :key="index">
                <td class="text-center">{{ index + 1 }}</td>
                <td class="text-center">{{ product.NAME_PRODUCT }}</td>
                <td class="text-center">
                  {{ product.NUMBER_INVENTORY_PRODUCT }}
                </td>
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
                            <b>{{ key.KEY }}:</b> {{ key.VALUE[0] }},
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
                <td class="text-center">
                  <button class="btn btn-sm btn-primary">Sửa</button>
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
import Footer from "../components/admin/Footer.vue";
import productService from "@/services/product.service";
import Pagination from "v-pagination-3";
export default {
  name: "DashboardProduct",
  components: {
    Slider,
    Nav,
    Footer,
    Pagination,
  },
  data() {
    return {
      products: [],
      numberProduct: [],
      page: 1,
      limit: 6,
      skip: 1,
    };
  },
  created() {
    this.getAllProduct();
    this.getProduct();
  },
  methods: {
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
</style>
