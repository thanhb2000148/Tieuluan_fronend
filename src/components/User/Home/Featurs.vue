<template>
  <div class="container-fluid featurs py-5">
    <div class="container py-5">
      <div class="row g-4">
        <div class="col-md-6 col-lg-3">
          <div class="featurs-item text-center rounded bg-light p-4">
            <div
              class="featurs-icon btn-square rounded-circle bg-secondary mb-5 mx-auto"
            >
              <i class="fas fa-car-side fa-3x text-white"></i>
            </div>
            <div class="featurs-content text-center">
              <h5>Miễn phí vận chuyển</h5>
              <p class="mb-0">Miễn phí cho đơn hàng từ 300.000đ</p>
            </div>
          </div>
        </div>
        <div class="col-md-6 col-lg-3">
          <div class="featurs-item text-center rounded bg-light p-4">
            <div
              class="featurs-icon btn-square rounded-circle bg-secondary mb-5 mx-auto"
            >
              <i class="fas fa-user-shield fa-3x text-white"></i>
            </div>
            <div class="featurs-content text-center">
              <h5>Bảo mật thanh toán</h5>
              <p class="mb-0">Bảo mật 100%</p>
            </div>
          </div>
        </div>
        <div class="col-md-6 col-lg-3">
          <div class="featurs-item text-center rounded bg-light p-4">
            <div
              class="featurs-icon btn-square rounded-circle bg-secondary mb-5 mx-auto"
            >
              <i class="fas fa-exchange-alt fa-3x text-white"></i>
            </div>
            <div class="featurs-content text-center">
              <h5>Hoàn trả trong 30 ngày</h5>
              <p class="mb-0">Hoàn tiền trong 30 ngày</p>
            </div>
          </div>
        </div>
        <div class="col-md-6 col-lg-3">
          <div class="featurs-item text-center rounded bg-light p-4">
            <div
              class="featurs-icon btn-square rounded-circle bg-secondary mb-5 mx-auto"
            >
              <i class="fa fa-phone-alt fa-3x text-white"></i>
            </div>
            <div class="featurs-content text-center">
              <h5>Hỗ trợ 24/7</h5>
              <p class="mb-0">Hỗ trợ nhanh chóng mọi lúc</p>
            </div>
          </div>
        </div>
      </div>

      <!--  -->
      <div class="row g-4 justify-content-center mt-5">
        <div class="col-md-6 col-lg-4">
          <a href="#">
            <div class="service-item bg-secondary rounded border border-secondary">
              <img src="https://res.cloudinary.com/dgfwiff6k/image/upload/v1717646398/test_folder/gdwjvwku6u2oww8cnpic.webp" class="img-fluid rounded-top w-100" alt="Fresh Apples">
              <div class="px-4 rounded-bottom text-b">
                <div class="service-content bg-primary text-center p-4 rounded">
                  <h5 class="text-white">iphone 15 Pro Max</h5>
                  <h3 class="mb-0">Hàng mới 100%</h3>
                </div>
              </div>
            </div>
          </a>
        </div>
        <div class="col-md-6 col-lg-4">
          <a href="#">
            <div class="service-item bg-dark rounded border border-dark">
              <img src="https://res.cloudinary.com/dgfwiff6k/image/upload/v1718022208/test_folder/nkbc69rdjva1ndmpjnll.png" class="img-fluid rounded-top w-100" alt="Tasty Fruits">
              <div class="px-4 rounded-bottom text-b">
                <div class="service-content bg-light text-center  rounded">
                  <h5 class="text-c">Pizza New York Bò </h5>
                  <h3 class="mb-0 text-c">Món ăn hấp dẫn </h3>
                </div>
              </div>
            </div>
          </a>
        </div>
        <div class="col-md-6 col-lg-4">
          <a href="#">
            <div class="service-item bg-primary rounded border border-primary">
              <img src="https://res.cloudinary.com/dgfwiff6k/image/upload/v1718010799/test_folder/bchtr89pfqyahbiolzir.webp" class="img-fluid rounded-top w-100" alt="Exotic Vegetable">
              <div class="px-4 rounded-bottom">
                <div class="service-content bg-secondary text-center p-4 rounded">
                  <h5 class="text-white">Áo Thun Nam BeTod</h5>
                  <h3 class="mb-0">Mẫu mới 2024</h3>
                </div>
              </div>
            </div>
          </a>
        </div>
      </div>
<!-- Banner Section Start -->
      <div class="container-fluid banner bg-secondary my-5">
        <div class="container py-5">
          <div class="row g-4 align-items-center">
            <div class="col-lg-6">
              <div class="py-4">
                <h1 class="display-3 text-white">Thiết kế thời trang</h1>
                <p class="fw-normal display-3 text-dark mb-4">Độ bền ấn tượng</p>
                <p class="mb-4 text-dark">Cạnh viền uốn cong nhẹ nhàng đi kèm với khung viền Titan giúp thiết bị toát lên được vẻ ngoài sang trọng đầy tính thời thượng</p>
              </div>
            </div>
            <div class="col-lg-6">
              <div class="position-relative">
                <img src="img/15prm1.jpg" class="img-fluid w-100 rounded" alt="">
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Banner Section End -->

    </div>
  </div>
</template>

<script>
export default {
  name: "HomeFeaturs",
};
</script>

<style scoped>
/* Các kiểu hiện có */

/* Thêm các kiểu bổ sung cho phần mới */
.service-item {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.service-content {
  flex-grow: 1;
}

.featurs-item {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.featurs-content {
  flex-grow: 1;
}
.text-b {
      margin: 25px;
}
.text-c{
  color: #282828
}
</style>