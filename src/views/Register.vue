<template>
  <div>
    <NavBar />
    <section class="h-100 h-custom" style="background-color: #ffffff">
      <div class="container py-5 h-100">
        <div class="row d-flex justify-content-center align-items-center h-100">
          <div class="col-lg-15 col-xl-9">
            <div class="card rounded-3 shadow-lg">
              <div class="card-body p-4 p-md-5">
                <h3 class="mb-4 pb-2 pb-md-0 mb-md-5 px-md-2 text-center">
                  Thông Tin Đăng Ký
                </h3>
                <form class="px-md-2" @submit.prevent="register">
                  <div class="row">
                    <div class="col-md-6 mb-4">
                      <div class="form-group">
                        <label for="firstName">Tên</label>
                        <input
                          type="text"
                          id="firstName"
                          class="form-control"
                          v-model="formData.first_name"
                          placeholder="Nhập tên của bạn"
                          required
                          pattern="[a-zA-ZÀ-ỹ ]+"
                          title="Chỉ chấp nhận ký tự chữ cái và dấu"
                        />
                        <small
                          v-if="!isFirstNameValid"
                          class="invalid-feedback"
                        >
                          Tên chỉ chấp nhận chữ cái và dấu
                        </small>
                      </div>
                    </div>

                    <div class="col-md-6 mb-4">
                      <div class="form-group">
                        <label for="lastName">Họ</label>
                        <input
                          type="text"
                          id="lastName"
                          class="form-control"
                          v-model="formData.last_name"
                          placeholder="Nhập họ của bạn"
                          required
                          pattern="[a-zA-ZÀ-ỹ ]+"
                          title="Chỉ chấp nhận ký tự chữ cái và dấu"
                        />
                        <small v-if="!isLastNameValid" class="invalid-feedback">
                          Họ chỉ chấp nhận chữ cái và dấu
                        </small>
                      </div>
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-md-6 mb-4">
                      <div class="form-group">
                        <label for="middleName">Tên đệm</label>
                        <input
                          type="text"
                          id="middleName"
                          class="form-control"
                          v-model="formData.middle_name"
                          placeholder="Nhập tên đệm của bạn"
                          required
                          pattern="[a-zA-ZÀ-ỹ ]+"
                          title="Chỉ chấp nhận ký tự chữ cái và dấu"
                        />
                        <small
                          v-if="!isMiddleNameValid"
                          class="invalid-feedback"
                        >
                          Tên đệm chỉ chấp nhận chữ cái và dấu
                        </small>
                      </div>
                    </div>

                    <div class="col-md-6 mb-4">
                      <div class="form-group">
                        <label for="phoneNumber">Số điện thoại</label>
                        <input
                          type="tel"
                          id="phoneNumber"
                          class="form-control"
                          v-model="formData.phone_number"
                          placeholder="Số điện thoại"
                          required
                          pattern="[0-9]{10}"
                          title="Số điện thoại gồm 10 chữ số"
                        />
                        <small
                          v-if="!isPhoneNumberValid"
                          class="invalid-feedback"
                        >
                          Số điện thoại là bắt buộc và phải là số, gồm 10 chữ
                          số.
                        </small>
                      </div>
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-md-6 mb-4">
                      <div class="form-group">
                        <label for="userName">Tên đăng nhập</label>
                        <input
                          type="text"
                          id="userName"
                          class="form-control"
                          v-model="formData.user_name"
                          placeholder="Tên đăng nhập"
                          required
                        />
                        <small v-if="!isUserNameValid" class="invalid-feedback">
                          Tên đăng nhập phải có ít nhất 5 ký tự.
                        </small>
                      </div>
                    </div>

                    <div class="col-md-6 mb-4">
                      <div class="form-group">
                        <label for="emailAddress">Địa chỉ Email</label>
                        <input
                          type="email"
                          id="emailAddress"
                          class="form-control"
                          v-model="formData.email_user"
                          placeholder="Email"
                          required
                        />
                        <!-- <small v-if="!isEmailValid" class="invalid-feedback">
                          Vui lòng nhập email hợp lệ.
                        </small> -->
                      </div>
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-md-6 mb-4">
                      <div class="form-group">
                        <label for="password">Mật khẩu</label>
                        <div class="password-container">
                          <input
                            :type="showPassword.password ? 'text' : 'password'"
                            id="password"
                            class="form-control"
                            v-model="formData.password"
                            placeholder="Mật khẩu"
                            required
                          />
                          <span
                            class="toggle-password"
                            @click="togglePasswordVisibility('password')"
                          >
                            <i
                              :class="
                                showPassword.password
                                  ? 'fas fa-eye'
                                  : 'fas fa-eye-slash'
                              "
                            ></i>
                          </span>
                        </div>
                        <small v-if="!isPasswordValid" class="invalid-feedback">
                          Mật khẩu phải có ít nhất 3 ký tự.
                        </small>
                      </div>
                    </div>
                    <div class="col-md-6 mb-4">
                      <div class="form-group">
                        <label for="confirmPassword">Nhập lại mật khẩu</label>
                        <div class="password-container">
                          <input
                            :type="
                              showPassword.confirmPassword ? 'text' : 'password'
                            "
                            id="confirmPassword"
                            class="form-control"
                            v-model="confirmPassword"
                            placeholder="Nhập lại mật khẩu"
                            required
                          />
                          <span
                            class="toggle-password"
                            @click="togglePasswordVisibility('confirmPassword')"
                          >
                            <i
                              :class="
                                showPassword.confirmPassword
                                  ? 'fas fa-eye'
                                  : 'fas fa-eye-slash'
                              "
                            ></i>
                          </span>
                        </div>
                        <small v-if="!isPasswordMatch" class="invalid-feedback">
                          Mật khẩu không khớp.
                        </small>
                      </div>
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-md-6 mb-4">
                      <div class="form-group">
                        <label for="gender">Giới tính</label>
                        <select
                          v-model="formData.gender_user"
                          id="gender"
                          class="form-control"
                          @change="genderSelected = true"
                          required
                        >
                          <option value="" disabled>Chọn giới tính</option>
                          <option value="male">Nam</option>
                          <option value="female">Nữ</option>
                          <option value="other">Khác</option>
                        </select>
                        <small
                          v-if="!genderSelected && !formData.gender_user"
                          class="invalid-feedback"
                        >
                          Vui lòng chọn giới tính.
                        </small>
                      </div>
                    </div>
                  </div>

                  <div class="text-center">
                    <button
                      type="submit"
                      class="btn btn-primary btn-lg btn-block"
                    >
                      Đăng ký
                    </button>
                  </div>
                </form>
                <div v-if="message" class="mt-3 alert" :class="alertClass">
                  {{ message }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <AppFooter />
  </div>
</template>

<script>
import AuthService from "@/services/auth.service";
import NavBar from "@/components/User/layout/NavBar.vue";
import AppFooter from "@/components/User/layout/AppFooter.vue";
import "@fortawesome/fontawesome-free/css/all.css";
export default {
  name: "RegisterUser",
  components: {
    NavBar,
    AppFooter,
  },
  data() {
    return {
      formData: {
        first_name: "",
        middle_name: "",
        last_name: "",
        user_name: "",
        email_user: "",
        phone_number: "",
        password: "",
        gender_user: "",
      },
      confirmPassword: "",
      message: "",
      alertClass: "",
      isFirstNameValid: true,
      isLastNameValid: true,
      isMiddleNameValid: true,
      isPhoneNumberValid: true,
      isUserNameValid: true,
      isPasswordValid: true,
      isPasswordMatch: true,
      showPassword: {
        password: false,
        confirmPassword: false,
      },
      genderSelected: false,
    };
  },
  methods: {
    async register() {
      this.isUserNameValid = this.formData.user_name.length >= 5;
      this.isPasswordValid = this.formData.password.length >= 3;

      if (
        !this.isFirstNameValid ||
        !this.isLastNameValid ||
        !this.isMiddleNameValid ||
        !this.isPhoneNumberValid ||
        !this.isUserNameValid ||
        !this.isPasswordValid ||
        !this.isPasswordMatch ||
        !this.formData.gender_user
      ) {
        return;
      }

      try {
        if (this.confirmPassword !== this.formData.password) {
          this.isPasswordMatch = false;
          return;
        }

        const response = await AuthService.register(this.formData);
        this.message = "Đăng ký thành công!";
        this.alertClass = "alert-success";
        localStorage.setItem("registeredEmail", this.formData.email_user);
        this.$router.push({ name: "OTP" });
      } catch (error) {
        if (error.response && error.response.status === 400) {
          this.message =
            "Tên đăng nhập hoặc địa chỉ email đã tồn tại trên hệ thống.";
        } else {
          this.message = `Lỗi: ${error.message}`;
        }
        this.alertClass = "alert-danger";
        console.error("Registration error:", error);
      }
    },
    togglePasswordVisibility(field) {
      this.showPassword[field] = !this.showPassword[field];
    },
  },
  watch: {
    "formData.first_name"(newVal) {
      this.isFirstNameValid = /^[a-zA-ZÀ-ỹ ]+$/.test(newVal.trim());
    },
    "formData.last_name"(newVal) {
      this.isLastNameValid = /^[a-zA-ZÀ-ỹ ]+$/.test(newVal.trim());
    },
    "formData.middle_name"(newVal) {
      this.isMiddleNameValid = /^[a-zA-ZÀ-ỹ ]+$/.test(newVal.trim());
    },
    "formData.phone_number"(newVal) {
      this.isPhoneNumberValid = /^\d{10}$/.test(newVal.trim());
    },
    confirmPassword(newVal) {
      this.isPasswordMatch = newVal === this.formData.password;
    },
    "formData.user_name"(newVal) {
      this.isUserNameValid = newVal.length >= 5;
    },
    "formData.password"(newVal) {
      this.isPasswordValid = newVal.length >= 3;
    },
    // "formData.email_user"(newVal) {
    //   this.isEmailValid = this.validateEmail(newVal);
    // },
  },
};
</script>

<style scoped>
body {
  font-family: Arial, sans-serif;
  background-color: #f7f7f7;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
}

.card {
  border: none;
}

.form-control {
  font-size: 16px;
  padding: 12px;
  border-radius: 4px;
  transition: border-color 0.3s ease;
}

.form-group {
  margin-bottom: 20px;
  position: relative;
}

.form-group label {
  position: absolute;
  top: -28px;
  left: 0;
  font-size: 18px;
  color: #000000;
  background: #ffffff;
  padding: 0 5px;
  transition: all 0.3s ease;
}

.form-group input,
.form-group select {
  width: 100%;
  border: 1px solid #ccc;
  box-sizing: border-box;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #81c408;
}

.form-group input:valid,
.form-group select:valid {
  border-color: #81c408;
}

.form-group input:invalid,
.form-group select:invalid {
  border-color: #81c408;
}

.btn {
  background-color: #81c408;
  color: #ffffff;
  padding: 12px 20px;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn:hover {
  background-color: #81c408;
}

.invalid-feedback {
  display: block;
  color: #dc3545;
  font-size: 14px;
  margin-top: 4px;
}

.custom-message {
  font-size: 16px;
  margin-top: 10px;
  color: #81c408;
}

.password-container {
  position: relative;
}

.password-container .toggle-password {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  cursor: pointer;
}

.password-container .toggle-password i {
  font-size: 16px;
  color: #888;
}

.password-container .toggle-password i:hover {
  color: #333;
}
.toggle-password i {
  font-size: 16px;
  color: #888;
}

.toggle-password i:hover {
  color: #333;
}
</style>
