<template>
  <div class="container">
    <div class="jumbotron text-center">
      <h1 class="display-3">Cảm ơn bạn đã mua hàng!</h1>
      <p class="lead">
        <strong>Hãy theo dõi điện thoại</strong> chúng tôi sẽ liên hệ với bạn
        trong thời gian sớm nhất
      </p>
      <hr />
      <p class="lead">
        <a
          class="btn btn-primary btn-sm"
          href="#"
          role="button"
          @click="backHome()"
          >Quay trở về trang chủ</a
        >
      </p>
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
  height: 100vh;
}
</style>
