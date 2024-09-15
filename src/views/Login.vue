<template>
  <div class="login-page">
    <NavBar />
    <div class="login-container d-flex align-items-center justify-content-center">
      <div class="card login-card shadow-lg p-3 mb-5 bg-white rounded">
        <div class="card-body">
          <h5 class="card-title text-center mb-4">Đăng nhập</h5>
          <form @submit.prevent="login" class="px-md-2">
            <div data-mdb-input-init class="form-outline mb-4">
              <input
                v-model="user_name"
                @blur="checkUserName"
                @input="clearError('userNameError')"
                type="text"
                id="form2Example1"
                class="form-control"
                placeholder="Tên Đăng Nhập"
                aria-describedby="username-error"
              />
              <small
                v-if="userNameError"
                id="username-error"
                class="form-text text-danger"
              >
                {{ userNameError }}
              </small>
            </div>

            <div data-mdb-input-init class="form-outline mb-4">
              <div class="password-container">
                <input
                  v-model="password"
                  @blur="checkPassword"
                  @input="clearError('passwordError')"
                  :type="showPassword ? 'text' : 'password'"
                  id="form2Example2"
                  class="form-control"
                  placeholder="Mật khẩu"
                  aria-describedby="password-error"
                />
                <span
                  class="toggle-password"
                  @click="togglePasswordVisibility"
                  style="cursor: pointer;"
                >
                  <i
                    :class="showPassword ? 'fas fa-eye' : 'fas fa-eye-slash'"
                  ></i>
                </span>
              </div>
              <small
                v-if="passwordError"
                id="password-error"
                class="form-text text-danger"
              >
                {{ passwordError }}
              </small>
            </div>

            <div class="text-center mb-4">
              <button type="submit" class="btn-custom-green">Đăng nhập</button>
            </div>
          </form>

          <div class="sigup-or"><span>Hoặc</span></div>

          <div class="text-center social">
            <button class="signup-google" @click="googleLogin">
              <i class="fab fa-google signup-google-icon"></i>
              <span class="signup-google-text">Google</span>
            </button>
            <button class="signup-facebook">
              <i class="fab fa-facebook signup-facebook-icon"></i>
              <span class="signup-facebook-text">Facebook</span>
            </button>
          </div>

          <div v-if="errorMessage" class="alert alert-danger" role="alert">
            {{ errorMessage }}
          </div>

          <div class="text-center mb-4">
            <p class="text-muted d-inline">
              Bạn Chưa Có Tài Khoản?
              <strong
                class="register-link"
                @click="redirectToRegister"
                style="cursor: pointer;"
              >
                Đăng ký ngay
              </strong>
            </p>
          </div>
        </div>
      </div>
    </div>
    <AppFooter />
  </div>
</template>

<script>
import AppFooter from "@/components/User/layout/AppFooter.vue";
import NavBar from "@/components/User/layout/NavBar.vue";
import AuthService from "@/services/auth.service";
import Cookies from "js-cookie";

export default {
  name: "LoginUser",
  components: {
    AppFooter,
    NavBar,
  },
  data() {
    return {
      user_name: "",
      password: "",
      errorMessage: "",
      showPassword: false,
      userNameError: "",
      passwordError: "",
    };
  },
  methods: {
    async login() {
      this.errorMessage = ""; // Clear any previous error message

      // Kiểm tra lỗi trước khi gửi form
      this.checkUserName();
      this.checkPassword();

      if (this.userNameError || this.passwordError) {
        return; // Nếu có lỗi, không gửi form
      }

      try {
        const data = await AuthService.login({
          user_name: this.user_name,
          password: this.password,
        });

        if (data && data.data && data.data.accessToken) {
          Cookies.set("access_token", data.data.accessToken, { expires: 1 });
          Cookies.set("refresh_token", data.data.refreshToken, { expires: 1 });
          this.$router.push("/");
        } else {
          throw new Error("Không có accessToken trong phản hồi");
        }
      } catch (error) {
        console.error("Lỗi khi đăng nhập:", error);
        this.errorMessage = "Tên người dùng hoặc mật khẩu không đúng.";
      }
    },
    googleLogin() {
      window.location.href = "http://localhost:8000/v1/user/auth/google"; // phía backend Google OAuth
    },
    redirectToRegister() {
      this.$router.push("/register");
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    // Kiểm tra tên đăng nhập
    checkUserName() {
      if (this.user_name.length < 5) {
        this.userNameError = "Tên đăng nhập phải có ít nhất 5 ký tự.";
      }
    },
    // Kiểm tra mật khẩu
    checkPassword() {
      if (this.password.length < 3) {
        this.passwordError = "Mật khẩu phải có ít nhất 3 ký tự.";
      }
    },
    // Xóa thông báo lỗi khi người dùng bắt đầu nhập liệu
    clearError(field) {
      this[field] = "";
    },
  },
};
</script>


<style scoped>
.login-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.login-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 57px;
  background-image: url("https://res.cloudinary.com/dgfwiff6k/image/upload/v1725354192/test_folder/e3orn19tfo9nkanqvzjv.jpg");
  background-size: cover; /* Đảm bảo hình ảnh phủ toàn bộ phần tử */
  background-position: center; /* Căn giữa hình ảnh */
  background-repeat: no-repeat; /* Không lặp lại hình ảnh */
}

.login-card {
  max-width: 400px;
  bottom: -20px;
  width: 100%;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 20px;
  background-color: #f9f9f9;
}

.card-title {
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
}

.form-outline {
  border-radius: 10px;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  position: relative;
  margin-bottom: 20px; /* Thêm khoảng cách giữa các khung nhập liệu */
}

/* Tùy chỉnh thông báo lỗi */
.form-text.text-danger {
  color: #e74c3c; /* Màu đỏ nhẹ cho lỗi */
  font-size: 0.85rem; /* Kích thước chữ nhỏ hơn để không làm rối mắt */
  position: absolute; /* Vị trí tuyệt đối để thông báo lỗi không đẩy phần tử khác */
  bottom: -20px; /* Đặt thông báo lỗi ngay dưới khung nhập liệu */
  left: 0;
  margin-top: 5px;
}

/* Tùy chỉnh khung nhập liệu khi có lỗi */
.form-control.is-invalid {
  border-color: #e74c3c; /* Đổi màu viền khi có lỗi */
  box-shadow: none; /* Loại bỏ bóng khi có lỗi */
}

/* Tùy chỉnh khung nhập liệu không có lỗi */
.form-control {
  border-color: #ced4da; /* Màu viền mặc định */
  transition: border-color 0.3s ease; /* Hiệu ứng mượt khi thay đổi màu viền */
}

.form-control:focus.is-invalid {
  border-color: #e74c3c; /* Giữ màu viền đỏ khi có lỗi và người dùng nhấn vào */
  box-shadow: none;
}

.form-label {
  text-align: center;
  display: block;
}

.text-muted {
  color: #666;
}

.btn-custom-green {
  background-color: #81c408;
  border-color: #81c408;
  border-radius: 10px;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  padding: 10px 20px;
  color: white;
}

.btn-custom-green:hover {
  background-color: #6aa106;
  border-color: #6aa106;
}

.register-link {
  cursor: pointer;
  color: #007bff;
  transition: color 0.3s;
}

.register-link:hover {
  color: #0056b3;
}

.password-container {
  position: relative;
}

.toggle-password {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  cursor: pointer;
}

.toggle-password i {
  font-size: 16px;
  color: #888;
}

.toggle-password i:hover {
  color: #333;
}

/* mật khẩu */
.form-control {
  text-align: left; /* Căn chỉnh văn bản bên trái */
}

.password-container .form-control {
  text-align: left; /* Căn chỉnh văn bản bên trái */
}

.password-container .toggle-password {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
}

.text-center {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px; /* Khoảng cách giữa hai nút */
  margin-top: 20px; /* Đảm bảo khoảng cách với thông báo lỗi */
}

.signup-google, .signup-facebook {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ddd; /* Đường viền nút */
  border-radius: 5px;
  padding: 10px 42px;
  background-color: rgb(255, 255, 255); /* Màu nền nút */
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.signup-google-text, .signup-facebook-text {
  margin-left: 8px;
}

.signup-google-icon {
  color: red;
  font-size: 24px;
}

.signup-facebook-icon {
  color: blue;
  font-size: 24px;
}

.signup-google-text {
  color: red;
}

.signup-facebook-text {
  color: blue;
}

.sigup-or {
  text-align: center;
  font-size: 19px;
  color: #999;
  margin: 10px auto;
  position: relative;
}

.sigup-or:after {
  content: "";
  width: 100%;
  height: 1px;
  background-color: #999;
  top: 50%;
  position: absolute;
  left: 0;
  transform: translateY(-50%);
}

.sigup-or span {
  display: inline-block;
  padding: 10px 30px;
  background-color: #fff;
  position: relative;
  z-index: 2;
}

.d-inline {
  margin-top: 5%;
}


</style>
