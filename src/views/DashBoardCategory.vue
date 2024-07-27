<template>
    <div class="wrapper">
      <Slider />
      <div class="main">
        <Nav />
        <main class="content px-3 py-2">
          <div class="container-fluid">
            <h1 class="mb-4 text-center">Danh mục sản phẩm</h1>
            <div class="d-flex justify-content-between align-items-center mb-4">
              <!-- Nút Quay lại -->
              <router-link to="/admin" class="btn btn-info button-add">
                <i class="fas fa-arrow-left"></i> Quay lại
              </router-link>
  
              <!-- Thanh Tìm kiếm -->
              <form class="form-inline">
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
  
              <!-- Nút Xóa tất cả -->
              <button type="button" class="btn btn-danger" @click="removeAllCategories">
                <i class="fas fa-trash"></i> Xóa tất cả
              </button>
            </div>
            <table class="table table-bordered table-hover">
              <thead>
                <tr class="text-center">
                  <th scope="col" class="space-role">Loại sản phẩm</th>
                  <th scope="col" class="space-name">Chi tiết sản phẩm</th>
                  <th scope="col" class="space-handle">Xử lý</th>
                </tr>
              </thead>
              <tbody v-if="filteredCategoriesCount > 0" class="text-center">
                <tr :key="index" v-for="(category, index) in filteredCategories">
                  <td>{{ category.CATEGORY_NAME }}</td>
                  <td>
                    <ul>
                      <li v-for="detail in category.typeProductDetails" :key="detail._id">
                        <strong>{{ detail.TYPE_PRODUCT_NAME }} ({{ detail.TYPE_PRODUCT_CODE }}):</strong>
                        <ul style="list-style-type: none; padding-left: 0;">
                          <li v-for="item in detail.LIST_TYPE_PRODUCT" :key="item._id">
                            <strong>{{ item.KEY }}:</strong> {{ item.VALUE.join(', ') }}
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </td>
                  <td>
                    <button type="button" class="btn btn-warning btn-sm" @click="editCategory(category._id)">
                      <i class="fas fa-edit"></i> Sửa
                    </button>
                    <button type="button" class="btn btn-danger btn-sm" @click="deleteCategory(category._id)">
                      <i class="fas fa-trash"></i> Xóa
                    </button>
                  </td>
                </tr>
              </tbody>
              <tfoot v-else>
                <tr>
                  <td colspan="3" class="non-user">Không có danh mục sản phẩm nào</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </main>
      </div>
    </div>
  </template>
  
  <script>
  import Slider from "../components/admin/Slider.vue";
  import Nav from "../components/admin/Nav.vue";
  import Footer from "../components/admin/Footer.vue";
  
  export default {
    name: "DashboardCategory",
    components: {
      Slider,
      Nav,
      Footer,
    },
    data() {
      return {
        searchText: "",
        categories: [
          {
            _id: "1",
            CATEGORY_NAME: "Điện Thoại",
            typeProductDetails: [
              {
                _id: "664d4cd8350abb44d66bf264",
                TYPE_PRODUCT_CODE: "DT01",
                TYPE_PRODUCT_NAME: "Điện Thoại",
                LIST_TYPE_PRODUCT: [
                  {
                    _id: "6666caa816bd1ccebebf14eb",
                    KEY: "MEMORY",
                    VALUE: ["128GB", "256GB", "512GB"],
                  },
                  {
                    _id: "6666caa816bd1ccebebf14ec",
                    KEY: "COLOR",
                    VALUE: ["Trắng", "Đen", "Xanh dương"],
                  },
                ],
              },
            ],
          },
          {
            _id: "2",
            CATEGORY_NAME: "Đồ ăn",
            typeProductDetails: [
              {
                _id: "664d4cd8350abb44d66bf265",
                TYPE_PRODUCT_CODE: "TA01",
                TYPE_PRODUCT_NAME: "Đồ ăn",
                LIST_TYPE_PRODUCT: [
                  {
                    _id: "6666caa816bd1ccebebf14ed",
                    KEY: "FLAVOR",
                    VALUE: ["Thịt Xông Khói", "Bò Phô Mai", "Hải Sản"],
                  },
                  {
                    _id: "6666caa816bd1ccebebf14ee",
                    KEY: "SIZE",
                    VALUE: ["M", "L"],
                  },
                ],
              },
            ],
          },
          // Dữ liệu mới "Thời Trang"
          {
            _id: "3",
            CATEGORY_NAME: "Thời Trang",
            typeProductDetails: [
              {
                _id: "664d4cd8350abb44d66bf266",
                TYPE_PRODUCT_CODE: "TT01",
                TYPE_PRODUCT_NAME: "Thời Trang",
                LIST_TYPE_PRODUCT: [
                  {
                    _id: "6666c4674545b32ecacbd012",
                    KEY: "COLOR",
                    VALUE: ["Trắng", "Đen", "Xanh dương"],
                  },
                  {
                    _id: "6666c4674545b32ecacbd013",
                    KEY: "SIZE",
                    VALUE: ["M", "L", "S"],
                  },
                ],
              },
            ],
          },
        ],
      };
    },
    computed: {
      filteredCategories() {
        return this.categories.filter((category) =>
          category.CATEGORY_NAME.toLowerCase().includes(this.searchText.toLowerCase())
        );
      },
      filteredCategoriesCount() {
        return this.filteredCategories.length;
      },
    },
    methods: {
      deleteCategory(categoryId) {
        this.categories = this.categories.filter((category) => category._id !== categoryId);
      },
      removeAllCategories() {
        this.categories = [];
      },
      editCategory(categoryId) {
        // Xử lý sự kiện sửa danh mục sản phẩm
        alert(`Sửa danh mục sản phẩm với ID: ${categoryId}`);
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
  
  .container-fluid {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
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
    background-color: transparent;
  }
  
  .table th {
    color: #000;
  }
  
  .table-hover tbody tr:hover {
    background-color: rgba(0, 0, 0, 0.075);
  }
  
  .btn {
    margin-right: 8px;
  }
  
  .non-user {
    margin-top: 20px;
    font-size: 18px;
    font-weight: bold;
    color: blue;
    text-align: center;
  }
  
  .button-add {
    color: #fff;
  }
  
  .form-inline .btn {
    margin-left: -1px;
  }
  
  .input-group {
    width: 300px;
  }
  
  .input-group-append .btn {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
  </style>
  