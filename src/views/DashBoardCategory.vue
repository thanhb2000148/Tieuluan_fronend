<template>
  <div class="wrapper">
    <Slider />
    <div class="main">
      <Nav />
      <main class="content px-3 py-2">
        <div class="container-fluid">
          <h1 class="mb-4 text-center">Danh mục sản phẩm</h1>
          <div class="d-flex justify-content-between align-items-center mb-4">
            <button class="btn btn-primary" @click="showAddCategoryForm">Thêm danh mục</button>
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

          <!-- Modal thêm danh mục -->
          <div v-if="showAddForm" class="modal fade show" tabindex="-1" role="dialog" style="display: block;">
            <div class="modal-dialog" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">Thêm danh mục</h5>
                  <button type="button" class="close" @click="closeAddModal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                  <input type="text" v-model="newCategoryName" placeholder="Nhập tên danh mục" class="form-control" />
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" @click="closeAddModal">Hủy</button>
                  <button type="button" class="btn btn-success" @click="addCategory">Thêm</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Modal sửa danh mục -->
          <div v-if="showEditForm" class="modal fade show" tabindex="-1" role="dialog" style="display: block;">
            <div class="modal-dialog" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">Sửa danh mục</h5>
                  <button type="button" class="close" @click="closeEditModal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                  <input type="text" v-model="editCategoryName" placeholder="Nhập tên danh mục" class="form-control" />
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" @click="closeEditModal">Hủy</button>
                  <button type="button" class="btn btn-success" @click="updateCategory">Cập nhật</button>
                </div>
              </div>
            </div>
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
                  <button type="button" class="btn btn-warning btn-sm" @click="editCategory(category)">
                    <i class="fas fa-edit"></i> Sửa
                  </button>
                  <button type="button" class="btn btn-danger btn-sm" @click="deleteCategory(category._id)">
                    <i class="fas fa-trash"></i> Xóa
                  </button>
                </td>
              </tr>
            </tbody>
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
import Swal from 'sweetalert2';

export default {
  name: "DashboardCategory",
  components: {
    Slider,
    Nav,
  },
  data() {
    return {
      searchText: "",
      categories: [],
      showAddForm: false,
      newCategoryName: '',
      showEditForm: false,
      editCategoryId: null,
      editCategoryName: '',
    };
  },
  async created() {
    await this.getCategory();
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
    showAddCategoryForm() {
      this.newCategoryName = '';
      this.showAddForm = true;
    },
    closeAddModal() {
      this.showAddForm = false;
    },
    async addCategory() {
      try {
        const response = await categoryService.createCategory({ CATEGORY_NAME: this.newCategoryName });
        if (response && response.data) {
          this.categories.push(response.data);
          this.newCategoryName = '';
          this.showAddForm = false;
          Swal.fire({
            icon: 'success',
            title: 'Thành công',
            text: 'Đã thêm danh mục thành công!',
            confirmButtonText: 'OK',
          });
        }
      } catch (error) {
        console.error("Lỗi khi thêm danh mục:", error);
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: 'Đã xảy ra lỗi khi thêm danh mục. Vui lòng thử lại.',
          confirmButtonText: 'OK',
        });
      }
    },
    editCategory(category) {
      this.editCategoryId = category._id;
      this.editCategoryName = category.CATEGORY_NAME;
      this.showEditForm = true;
    },
    closeEditModal() {
      this.showEditForm = false;
    },
    async updateCategory() {
      try {
        if (!this.editCategoryId) {
          throw new Error("ID danh mục không hợp lệ.");
        }
        const response = await categoryService.updateCategory(this.editCategoryId, { CATEGORY_NAME: this.editCategoryName });
        if (response && response.data) {
          this.editCategoryName = '';
          this.showEditForm = false;
          Swal.fire({
            icon: 'success',
            title: 'Thành công',
            text: 'Đã cập nhật danh mục thành công!',
            confirmButtonText: 'OK',
          }).then(() => {
            this.getCategory();
          });
        } else {
          throw new Error("Đã xảy ra lỗi khi cập nhật danh mục.");
        }
      } catch (error) {
        console.error("Lỗi khi cập nhật danh mục:", error);
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: `Đã xảy ra lỗi khi cập nhật danh mục: ${error.message}`,
          confirmButtonText: 'OK',
        });
      }
    },
    async getCategory() {
      try {
        const response = await categoryService.getAll();
        if (response && response.data) {
          this.categories = response.data;
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    },
    async deleteCategory(categoryId) {
      const confirmation = await Swal.fire({
        title: 'Bạn có chắc chắn?',
        text: "Bạn sẽ không thể khôi phục lại danh mục này!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy'
      });

      if (confirmation.isConfirmed) {
        try {
          await categoryService.deleteCategory(categoryId);
          this.categories = this.categories.filter((category) => category._id !== categoryId);
          Swal.fire({
            icon: 'success',
            title: 'Thành công',
            text: 'Danh mục đã được xóa thành công!',
            confirmButtonText: 'OK',
          });
        } catch (error) {
          console.error("Lỗi khi xóa danh mục:", error);
          Swal.fire({
            icon: 'error',
            title: 'Lỗi',
            text: `Đã xảy ra lỗi khi xóa danh mục: ${error.message}`,
            confirmButtonText: 'OK',
          });
        }
      }
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
}

.modal {
  z-index: 1050;
}

.space-role {
  width: 50%;
}

.space-handle {
  width: 25%;
}
</style>
