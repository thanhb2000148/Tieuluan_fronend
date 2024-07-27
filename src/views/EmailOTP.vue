<template>
  <NavBar />
  <div>
    <div class="container">
      <div class="content">
        <h2>Xác Minh Tài Khoản</h2>
        <p>Hãy nhập lại Email để nhận lại mã OTP.</p>
        <form @submit.prevent="verifyOtp">
          <input type="text" v-model="email" placeholder="Nhập Email của bạn" required>
          <button type="submit">Xác Minh</button>
        </form>
      </div>
    </div>
  </div>
  <AppFooter />
</template>

<script>
import AppFooter from "@/components/User/layout/AppFooter.vue";
import NavBar from "@/components/User/layout/NavBar.vue";

export default {
  name: "emailotpUser",
  components: {
    AppFooter,
    NavBar,
  },
  data() {
    return {
      email: '',
    };
  },
  methods: {
    verifyOtp() {
      // Thực hiện xác minh OTP
      // Nếu xác minh thành công, điều hướng người dùng đến trang nhập mã OTP
      this.$router.push('/otp');
    }
  }
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: white;
}

.content {
  margin: 50px 0;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 400px;
  width: 100%;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: white;
}

h2 {
  margin-bottom: 20px;
  color: #333;
}

p {
  margin-bottom: 20px;
  color: #666;
}

form {
  display: flex;
  flex-direction: column;
  align-items: center;
}

input {
  padding: 15px;
  width: 100%;
  margin-bottom: 20px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}

button {
  padding: 15px 30px;
  font-size: 16px;
  background-color: #0072ff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #005bb5;
}
</style>