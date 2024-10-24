<template>
  <div class="container">
    <div class="thank-you-card">
      <div class="success-checkmark">
        <div class="check-icon">
          <span class="icon-line line-tip"></span>
          <span class="icon-line line-long"></span>
        </div>
      </div>
      <h1 class="title">Cảm ơn bạn đã mua hàng!</h1>
      <p class="message">
        <strong>Hãy theo dõi điện thoại</strong> - chúng tôi sẽ liên hệ với bạn
        trong thời gian sớm nhất
      </p>
      <div class="divider"></div>
      <button class="home-button" @click="backHome()">
        <span class="button-text">Quay trở về trang chủ</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "ThankPayment",
  methods: {
    backHome() {
      this.$router.push("/");
    },
  },
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 20px;
}

.thank-you-card {
  background: white;
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 600px;
  width: 100%;
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.title {
  color: #2c3e50;
  font-size: 2.5rem;
  margin-bottom: 20px;
  font-weight: 600;
}

.message {
  color: #636e72;
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 30px;
}

.divider {
  height: 1px;
  background: #e9ecef;
  margin: 30px 0;
}

.home-button {
  background: #4CAF50;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 25px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  outline: none;
}

.home-button:hover {
  background: #45a049;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(76, 175, 80, 0.3);
}

.button-text {
  display: inline-block;
  transition: transform 0.3s ease;
}

.home-button:hover .button-text {
  transform: translateX(-3px);
}

/* Success Checkmark Animation */
.success-checkmark {
  margin-bottom: 30px;
}

.check-icon {
  width: 80px;
  height: 80px;
  position: relative;
  border-radius: 50%;
  box-sizing: content-box;
  border: 4px solid #4CAF50;
  margin: 0 auto;
}

.check-icon::before {
  top: 3px;
  left: -2px;
  width: 30px;
  transform-origin: 100% 50%;
  border-radius: 100px 0 0 100px;
}

.check-icon::after {
  top: 0;
  left: 30px;
  width: 60px;
  transform-origin: 0 50%;
  border-radius: 0 100px 100px 0;
  animation: rotate-circle 4.25s ease-in;
}

.icon-line {
  height: 5px;
  background-color: #4CAF50;
  display: block;
  border-radius: 2px;
  position: absolute;
  z-index: 10;
}

.line-tip {
  top: 46px;
  left: 14px;
  width: 25px;
  transform: rotate(45deg);
  animation: icon-line-tip 0.75s;
}

.line-long {
  top: 38px;
  right: 8px;
  width: 47px;
  transform: rotate(-45deg);
  animation: icon-line-long 0.75s;
}

@keyframes icon-line-tip {
  0% {
    width: 0;
    left: 1px;
    top: 19px;
  }
  54% {
    width: 0;
    left: 1px;
    top: 19px;
  }
  70% {
    width: 50px;
    left: -8px;
    top: 37px;
  }
  84% {
    width: 17px;
    left: 21px;
    top: 48px;
  }
  100% {
    width: 25px;
    left: 14px;
    top: 45px;
  }
}

@keyframes icon-line-long {
  0% {
    width: 0;
    right: 46px;
    top: 54px;
  }
  65% {
    width: 0;
    right: 46px;
    top: 54px;
  }
  84% {
    width: 55px;
    right: 0px;
    top: 35px;
  }
  100% {
    width: 47px;
    right: 8px;
    top: 38px;
  }
}
</style>