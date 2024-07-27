<template>
  <div class="container-fluid bg-dark text-white-50 footer pt-5 mt-5">
    <div class="container py-5">
      <div
        class="pb-4 mb-4"
        style="border-bottom: 1px solid rgba(226, 175, 24, 0.5)"
      >
        <div class="row g-4">
          <div class="col-lg-3">
            <a href="#">
              <h1 class="text-primary mb-0">Không lo về giá</h1>
              <p class="text-secondary mb-0">Mua sắm thả ga</p>
            </a>
          </div>
          <!-- <div class="col-lg-6">
            <div class="position-relative mx-auto">
              <input
                class="form-control border-0 w-100 py-3 px-4 rounded-pill"
                type="number"
                placeholder="Email của bạn"
              />
              <button
                type="submit"
                class="btn btn-primary border-0 border-secondary py-3 px-4 position-absolute rounded-pill text-white"
                style="top: 0; right: 0"
              >
                Theo dõi ngay
              </button>
            </div>
          </div> -->
          <div class="col-lg-3">
    <div class="d-flex justify-content-end pt-3">
        <a
            class="btn btn-outline-secondary me-2 btn-md-square rounded-circle"
            href="https://twitter.com/yourprofile"
            target="_blank"
            ><i class="fab fa-twitter"></i
        ></a>
        <a
            class="btn btn-outline-secondary me-2 btn-md-square rounded-circle"
            href="https://facebook.com/yourprofile"
            target="_blank"
            ><i class="fab fa-facebook-f"></i
        ></a>
        <a
            class="btn btn-outline-secondary me-2 btn-md-square rounded-circle"
            href="https://youtube.com/yourchannel"
            target="_blank"
            ><i class="fab fa-youtube"></i
        ></a>
        <a
            class="btn btn-outline-secondary btn-md-square rounded-circle"
            href="https://linkedin.com/in/yourprofile"
            target="_blank"
            ><i class="fab fa-linkedin-in"></i
        ></a>
    </div>
          </div>
        </div>
      </div>
      <div class="row g-5">
        <div class="col-lg-3 col-md-6">
          <div class="footer-item">
            <h4 class="text-light mb-3">Tại sao mọi người thích chúng tôi!</h4>
            <p class="mb-4">
             Đây là nơi mua hàng online nhanh chóng tiện lợi, giúp mọi người có thể xem sản phẩm, xem giá sản phẩm trực tiếp trên trang
            </p>
            <a
              href=""
              class="btn border-secondary py-2 px-4 rounded-pill text-primary"
              >Đọc thêm</a
            >
          </div>
        </div>
        <div class="col-lg-3 col-md-6">
          <div class="d-flex flex-column text-start footer-item">
            <h4 class="text-light mb-3">Thông tin liên hệ</h4>
            <a class="btn-link" href="">Về chúng tôi</a>
            <router-link class="btn-link" to="/contact">Liên hệ chúng tôi</router-link>
            <a class="btn-link" href="">Chính sách bảo mật</a>
            <a class="btn-link" href="">Điều khoản & Điều kiện</a>
            <a class="btn-link" href="">Chính sách hoàn trả</a>
            <a class="btn-link" href="">Câu hỏi thường gặp và trợ giúp</a>
          </div>
        </div>
        <div class="col-lg-3 col-md-6">
          <div class="d-flex flex-column text-start footer-item">
            <h4 class="text-light mb-3">Tài khoản</h4>
            <router-link class="btn-link" to="/userinformation">Tài khoản của tôi</router-link>
            <router-link class="btn-link" to="/details">Chi tiết cửa hàng</router-link>
            <router-link class="btn-link" to="/cart">Giỏ hàng</router-link>
            <a class="btn-link" href="">Danh sách yêu thích</a>
            <a class="btn-link" href="">Lịch sử mua hàng</a>
            <a class="btn-link" href="">Đơn đặt hàng quốc tế</a>
          </div>
        </div>
        <div class="col-lg-3 col-md-6">
          <div class="footer-item">
            <h4 class="text-light mb-3">Liên hệ</h4>
            <p>Địa chỉ: Hưng Phú, Cái Răng, Cần Thơ</p>
            <p>Email: Example@gmail.com</p>
            <p>Điện thoại: +0123 4567 8910</p>
            <p>Thanh toán được chấp nhận</p>
            <div class="d-flex payment-icons">
              <a href="https://zalopay.vn/" target="_blank">
                <img src="/img/zalo.jpg" class="img-fluid" alt="Zalo Pay" />
              </a>
              <a href="https://momo.vn/" target="_blank">
                <img src="/img/momo.jpg" class="img-fluid" alt="MoMo" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <a
    href="#"
    class="btn btn-primary border-3 border-primary rounded-circle back-to-top"
    ><i class="fa fa-arrow-up"></i
  ></a>
</template>

<script>
export default {
  name: "AppFooter",
};
</script>

<style>
.payment-icons img {
  width: 50px; /* Điều chỉnh kích thước theo nhu cầu */
  margin-right: 10px; /* Khoảng cách giữa các biểu tượng */
}
</style>
