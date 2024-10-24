<template>
  <div class="wrapper">
    <Slider />
    <div class="main">
      <Nav />
      <main class="content bg-light">
        <div class="container-fluid p-4">
          <div class="row mb-4">
            <div class="col-12">
              <div class="card shadow-sm">
                <div class="card-header bg-white border-0">
                  <div class="row align-items-center">
                    <div class="col">
                      <h3 class="mb-0 text-gray-800">Quản lý tài khoản</h3>
                    </div>
                  </div>
                </div>

                <div class="card-body">
                  <div class="row mb-4">
                    <div class="col-md-6">
                      <router-link to="/admin" class="btn btn-outline-primary">
                        <i class="fas fa-arrow-left me-2"></i>Quay lại
                      </router-link>
                    </div>
                    <div class="col-md-6">
                      <form class="d-flex justify-content-end">
                        <div class="input-group w-75">
                          <input
                            class="form-control border-end-0"
                            type="search"
                            placeholder="Tìm kiếm theo tên hoặc email..."
                            v-model="searchText"
                          />
                          <span class="input-group-text bg-white border-start-0">
                            <i class="fas fa-search text-gray-400"></i>
                          </span>
                        </div>
                      </form>
                    </div>
                  </div>

                  <div class="table-responsive">
                    <table class="table table-hover align-middle">
                      <thead class="bg-light">
                        <tr>
                          <th scope="col" class="text-center px-4">Vai trò</th>
                          <th scope="col" class="text-center">Hình ảnh</th>
                          <th scope="col">Tên</th>
                          <th scope="col">Email</th>
                          <th scope="col" class="text-center">Ngày tạo/Cập nhật</th>
                          <th scope="col" class="text-center">Trạng thái</th>
                          <th scope="col" class="text-center">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody v-if="filteredUsersCount > 0">
                        <tr v-for="(user, index) in paginatedUsers" :key="index">
                          <td class="text-center">
                            <span 
                              :class="user.OBJECT_ROLE.IS_ADMIN ? 
                                'badge bg-primary' : 'badge bg-info'"
                            >
                              {{ user.OBJECT_ROLE.IS_ADMIN ? 'Admin' : 'Khách hàng' }}
                            </span>
                          </td>
                          <td class="text-center">
                            <div class="avatar-wrapper">
                              <img
                                v-if="user.user[0]?.AVT_URL"
                                :src="user.user[0].AVT_URL"
                                :alt="user.USER_NAME"
                                class="avatar"
                              />
                              <img
                                v-else
                                src="/img/avatar.jpg"
                                alt="Default Avatar"
                                class="avatar"
                              />
                            </div>
                          </td>
                          <td>{{ user.USER_NAME }}</td>
                          <td v-for="(email, index) in user.user" :key="'email-'+index">
                            {{ email.EMAIL_USER }}
                          </td>
                          <td class="text-center" v-for="(email, index) in user.user" :key="'date-'+index">
                            {{ formatDateTime(email.CREATED_AT) }}
                          </td>
                          <td class="text-center">
                            <span 
                              :class="user.IS_LOCK ? 
                                'badge bg-danger' : 'badge bg-success'"
                            >
                              {{ user.IS_LOCK ? 'Đang bị khóa' : 'Đang hoạt động' }}
                            </span>
                          </td>
                          <td class="text-center">
                            <div class="btn-group">
                              <button
                                type="button"
                                class="btn btn-outline-info btn-sm"
                                @click="viewDetails(user)"
                                title="Xem chi tiết"
                              >
                                <i class="fas fa-eye"></i>
                              </button>
                              <button
                                type="button"
                                class="btn btn-outline-danger btn-sm"
                                @click="lockAccount(user._id)"
                                title="Khóa tài khoản"
                                :disabled="user.IS_LOCK"
                              >
                                <i class="fas fa-lock"></i>
                              </button>
                              <button
                                type="button"
                                class="btn btn-outline-success btn-sm"
                                @click="unlockAccount(user._id)"
                                title="Mở khóa tài khoản"
                                :disabled="!user.IS_LOCK"
                              >
                                <i class="fas fa-unlock-alt"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                      <tbody v-else>
                        <tr>
                          <td colspan="7" class="text-center py-4">
                            <div class="text-muted">
                              <i class="fas fa-inbox fa-3x mb-3"></i>
                              <p class="mb-0">Không tìm thấy tài khoản nào</p>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <!-- Pagination -->
                  <nav aria-label="Page navigation" class="mt-4">
                    <ul class="pagination justify-content-center mb-0">
                      <li class="page-item" :class="{ disabled: currentPage === 1 }">
                        <a class="page-link" @click.prevent="changePage(currentPage - 1)">
                          <i class="fas fa-chevron-left"></i>
                        </a>
                      </li>
                      <li class="page-item">
                        <span class="page-link">
                          Trang {{ currentPage }} / {{ totalPages }}
                        </span>
                      </li>
                      <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                        <a class="page-link" @click.prevent="changePage(currentPage + 1)">
                          <i class="fas fa-chevron-right"></i>
                        </a>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- User Details Modal -->
    <div v-if="isModalVisible" class="modal fade show" tabindex="-1" style="display: block;">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header border-0">
            <h5 class="modal-title">Thông tin chi tiết</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <div class="text-center mb-4">
              <img 
                v-if="selectedUser?.user[0]?.AVT_URL" 
                :src="selectedUser.user[0].AVT_URL" 
                :alt="selectedUser?.USER_NAME"
                class="avatar-lg mb-3"
              />
              <h4>{{ selectedUser?.USER_NAME }}</h4>
              <span 
                :class="selectedUser?.OBJECT_ROLE.IS_ADMIN ? 
                  'badge bg-primary' : 'badge bg-info'"
              >
                {{ selectedUser?.OBJECT_ROLE.IS_ADMIN ? 'Admin' : 'Khách hàng' }}
              </span>
            </div>
            <div class="user-info">
              <div class="info-item">
                <i class="fas fa-user text-primary me-2"></i>
                <span class="label">Họ tên:</span>
                <span class="value">{{ selectedUser?.user[0]?.LAST_NAME }}</span>
              </div>
              <div class="info-item">
                <i class="fas fa-envelope text-primary me-2"></i>
                <span class="label">Email:</span>
                <span class="value">{{ selectedUser?.user[0]?.EMAIL_USER }}</span>
              </div>
              <div class="info-item">
                <i class="fas fa-phone text-primary me-2"></i>
                <span class="label">Số điện thoại:</span>
                <span class="value">{{ selectedUser?.user[0]?.PHONE_NUMBER }}</span>
              </div>
              <div class="info-item">
                <i class="fas fa-birthday-cake text-primary me-2"></i>
                <span class="label">Ngày sinh:</span>
                <span class="value">{{ formatDateTime(selectedUser?.user[0]?.BIRTHDAY) }}</span>
              </div>
              <div class="info-item">
                <i class="fas fa-calendar-alt text-primary me-2"></i>
                <span class="label">Ngày tạo:</span>
                <span class="value">{{ formatDateTime(selectedUser?.user[0]?.CREATED_AT) }}</span>
              </div>
            </div>
          </div>
          <div class="modal-footer border-0">
            <button type="button" class="btn btn-secondary" @click="closeModal">
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="isModalVisible" class="modal-backdrop fade show"></div>
  </div>
</template>

<script>
import Slider from "../components/admin/Slider.vue";
import Nav from "../components/admin/Nav.vue";
import userService from "@/services/user.service";
import AuthService from "@/services/auth.service";
import Swal from 'sweetalert2';


export default {
  name: "DashboardUsers",
  components: {
    Slider,
    Nav,
  },
  data() {
    return {
      searchText: "",
      users: [],
      currentPage: 1,
      itemsPerPage: 5, // Số lượng người dùng trên mỗi trang
      isModalVisible: false,
      selectedUser: null,
    };
  },
  async created() {
    await this.fetchUsers();
    console.log("dữ liệu user", this.users);
  },
  computed: {
    filteredUsers() {
      return this.users.filter((user) =>
        user.USER_NAME.toLowerCase().includes(this.searchText.toLowerCase()) ||
        user.user[0]?.EMAIL_USER.toLowerCase().includes(this.searchText.toLowerCase()) // Tìm kiếm theo email
      );
    },
    filteredUsersCount() {
      return this.filteredUsers.length;
    },
    paginatedUsers() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.filteredUsers.slice(start, start + this.itemsPerPage);
    },
    totalPages() {
      return Math.ceil(this.filteredUsersCount / this.itemsPerPage);
    },
  },
  methods: {
    async fetchUsers() {
      try {
        const response = await userService.getAllUsers();
        this.users = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    changePage(page) {
      if (page < 1 || page > this.totalPages) return;
      this.currentPage = page;
    },
    formatDateTime(isoDate) {
      const date = new Date(isoDate);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");

      return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    },
    viewDetails(userId) {
      this.selectedUser = userId; // Cập nhật thông tin người dùng được chọn
      this.isModalVisible = true; // Hiện modal
    },
    closeModal() {
      this.isModalVisible = false; // Đóng modal
      this.selectedUser = null; // Đặt lại thông tin người dùng
    },
    async lockAccount(accountId) {
  try {
    const response = await AuthService.lockAccount(accountId);
    await this.fetchUsers(); 

    Swal.fire({
      icon: 'success',
      title: 'Thành công',
      text: response.message, // Thông báo thành công
      confirmButtonText: 'OK',
    });
  } catch (error) {
    console.error("Lỗi khi khóa tài khoản:", error);

    Swal.fire({
      icon: 'error',
      title: 'Lỗi',
      text: 'Đã xảy ra lỗi khi khóa tài khoản: ' + error.message, // Thông báo lỗi
      confirmButtonText: 'OK',
    });
  }
},

async unlockAccount(accountId) {
  try {
    const response = await AuthService.unlockAccount(accountId);
    await this.fetchUsers(); 

    Swal.fire({
      icon: 'success',
      title: 'Thành công',
      text: response.message, // Thông báo thành công
      confirmButtonText: 'OK',
    });
  } catch (error) {
    console.error("Lỗi khi mở khóa tài khoản:", error);

    Swal.fire({
      icon: 'error',
      title: 'Lỗi',
      text: 'Đã xảy ra lỗi khi mở khóa tài khoản: ' + error.message, // Thông báo lỗi
      confirmButtonText: 'OK',
    });
  }
},
  },
};
</script>

<style scoped>
.wrapper {
  display: flex;
  min-height: 100vh;
  background-color: #f8f9fa;
}

.main {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.content {
  flex-grow: 1;
}

.card {
  border: none;
  border-radius: 0.75rem;
}

.card-header {
  padding: 1.5rem;
}

.avatar-wrapper {
  width: 40px;
  height: 40px;
  margin: 0 auto;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.avatar-lg {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #fff;
  box-shadow: 0 3px 6px rgba(0,0,0,0.1);
}

.btn-group .btn {
  padding: 0.25rem 0.5rem;
  margin: 0 0.125rem;
}

.table th {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
}

.pagination .page-link {
  padding: 0.5rem 0.75rem;
  color: #6c757d;
  cursor: pointer;
}

.pagination .page-link:hover {
  background-color: #e9ecef;
}

.user-info {
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 0.5rem;
}

.info-item {
  padding: 0.75rem;
  border-bottom: 1px solid #dee2e6;
  display: flex;
  align-items: center;
}

.info-item:last-child {
  border-bottom: none;
}

.info-item .label {
  font-weight: 600;
  margin-right: 0.5rem;
  color: #495057;
}

.info-item .value {
  color: #6c757d;
}

.badge {
  padding: 0.5em 0.75em;
  font-weight: 500;
}

.text-gray-400 {
  color: #ced4da;
}

.text-gray-800 {
  color: #343a40;
}

.modal-content {
  border: none;
  border-radius: 0.75rem;
}

.btn-outline-primary:hover {
  color: #fff;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .card-header {
    padding: 1rem;
  }
  
  .table-responsive {
    margin: 0 -1rem;
  }
  
  .btn-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .btn-group .btn {
    margin: 0;
  }
}
</style>
