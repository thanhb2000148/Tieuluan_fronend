<template>
    <div class="container p-5">
      <div class="row">
        <div class="col-md-3"></div>
        <div class="col-md-5 mt-5">
          <div class="bg-white p-5 rounded-3 shadow-sm border">
            <div>
              <p class="text-center text-success" style="font-size: 5.5rem;">
                <i class="fa-solid fa-envelope-circle-check"></i>
              </p>
              <p class="text-center text-center h5">Please check your email</p>
              <p class="text-muted text-center">
                We've sent a code to contact@curfcode.com
              </p>
              <div class="row pt-4 pb-2">
                <div class="col-3">
                  <input class="otp-letter-input" type="text" maxlength="1" v-model="otp[0]">
                </div>
                <div class="col-3">
                  <input class="otp-letter-input" type="text" maxlength="1" v-model="otp[1]">
                </div>
                <div class="col-3">
                  <input class="otp-letter-input" type="text" maxlength="1" v-model="otp[2]">
                </div>
                <div class="col-3">
                  <input class="otp-letter-input" type="text" maxlength="1" v-model="otp[3]">
                </div>
              </div>
              <p class="text-muted text-center">
                Didn't get the code?
                <a href="#" class="text-success" @click="resendCode">Click to resend.</a>
              </p>
              <div class="row pt-5">
                <div class="col-6">
                  <button class="btn btn-outline-secondary w-100" @click="cancel">Cancel</button>
                </div>
                <div class="col-6">
                  <button class="btn btn-success w-100" @click="verifyOtp">Verify</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        otp: ['', '', '', ''],
        email: 'contact@curfcode.com' // Replace with dynamic email
      };
    },
    methods: {
      resendCode() {
        // Logic to resend OTP
        alert('Resending OTP...');
      },
      cancel() {
        // Logic to cancel
        alert('Canceling...');
      },
      verifyOtp() {
        const otpCode = this.otp.join('');
        // Logic to verify OTP
        alert(`Verifying OTP: ${otpCode}`);
        // You can replace alert with an actual API call to verify OTP
      }
    }
  };
  </script>
  
  <style scoped>
  body {
    background-color: #ebecf0;
  }
  .otp-letter-input {
    max-width: 100%;
    height: 90px;
    border: 1px solid #198754;
    border-radius: 10px;
    color: #198754;
    font-size: 60px;
    text-align: center;
    font-weight: bold;
  }
  .btn {
    height: 50px;
  }
  </style>
  