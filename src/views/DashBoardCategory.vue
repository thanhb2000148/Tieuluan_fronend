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

            <!-- Nút Xóa tất cả -->
            <button type="button" class="btn btn-danger" @click="removeAllCategories">
              <i class="fas fa-trash"></i> Xóa tất cả
            </button>
          </div>
         <table class="table table-bordered table-hover">
  <thead>
    <tr class="text-center">
      <th scope="col" class="space-role">Tên danh mục</th>
      <th scope="col" class="space-handle">Xử lý</th>
    </tr>
  </thead>
  <tbody v-if="filteredCategoriesCount > 0" class="text-center">
    <tr v-for="(category, index) in filteredCategories" :key="index">
      <td>{{ category.CATEGORY_NAME }}</td>
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
  <!-- <tfoot v-else>
    <tr>
      <td colspan="2" class="non-user">Không có danh mục sản phẩm nào</td>
    </tr>
  </tfoot> -->
</table>

        </div>
      </main>
    </div>
  </div>
</template>

<script>
import Slider from "../components/admin/Slider.vue";
import Nav from "../components/admin/Nav.vue";
import categoryService from "@/services/category.service";

export default {
  name: "DashboardCategory",
  components: {
    Slider,
    Nav,
  },
  data() {
    return {
      searchText: "",
      categories: [], // Khởi tạo categories là một mảng rỗng
    };
  },
  async created() {
    try {
      await this.getCategory(); // Lấy danh sách danh mục
    } catch (error) {
      console.error("Error during component initialization:", error);
    }
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
  editCategory(categoryId) {
    // Xử lý sự kiện sửa danh mục sản phẩm
    alert(`Sửa danh mục sản phẩm với ID: ${categoryId}`);
  },
    removeAllCategories() {
      this.categories = [];
    },
    async getCategory() {
      try {
        // Gọi service để lấy danh sách danh mục
        const response = await categoryService.getAll();
        if (response && response.data) {
          this.categories = response.data;
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    },
}

};
</script>

<style scoped>
/* CSS của bạn không thay đổi */
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
