<template>
  <div>
    <NavBar />
    <Search />
    <!-- Contact Start -->
    <div class="container-fluid contact py-5">
      <div class="container py-5">
        <div class="p-5 bg-white rounded shadow-sm">
          <div class="row g-4">
            <div class="col-12">
              <div class="text-center mx-auto" style="max-width: 700px">
                <h1 class="display-5 text-primary mb-4 fw-bold">Liên Hệ Với Chúng Tôi</h1>
                <p class="lead text-muted mb-5">
                  Hãy liên hệ với chúng tôi nếu bạn cần hỗ trợ. Đội ngũ của chúng tôi luôn sẵn sàng phục vụ bạn.
                </p>
              </div>
            </div>
            
            <div class="col-lg-4">
              <div class="contact-info p-4 bg-light rounded h-100">
                <h4 class="mb-4">Thông Tin Liên Hệ</h4>
                <div class="d-flex mb-3">
                  <div class="contact-icon bg-primary text-white rounded-circle">
                    <i class="fas fa-map-marker-alt"></i>
                  </div>
                  <div class="ms-3">
                    <h5 class="mb-1">Địa Chỉ</h5>
                    <p class="mb-0">Hưng Phú, Cái Răng, Cần Thơ</p>
                  </div>
                </div>
                <div class="d-flex mb-3">
                  <div class="contact-icon bg-primary text-white rounded-circle">
                    <i class="fas fa-phone"></i>
                  </div>
                  <div class="ms-3">
                    <h5 class="mb-1">Điện Thoại</h5>
                    <p class="mb-0">+84 123 456 789</p>
                  </div>
                </div>
                <div class="d-flex">
                  <div class="contact-icon bg-primary text-white rounded-circle">
                    <i class="fas fa-clock"></i>
                  </div>
                  <div class="ms-3">
                    <h5 class="mb-1">Giờ Làm Việc</h5>
                    <p class="mb-0">Thứ 2 - Thứ 6: 7:00 - 17:00</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-lg-8">
              <form class="contact-form p-4 bg-light rounded">
                <div class="row g-3">
                  <div class="col-md-6">
                    <input type="text" class="form-control" placeholder="Họ và tên">
                  </div>
                  <div class="col-md-6">
                    <input type="email" class="form-control" placeholder="Email">
                  </div>
                  <div class="col-12">
                    <input type="text" class="form-control" placeholder="Tiêu đề">
                  </div>
                  <div class="col-12">
                    <textarea class="form-control" rows="5" placeholder="Nội dung"></textarea>
                  </div>
                  <div class="col-12">
                    <button class="btn btn-primary w-100 py-3" type="submit">Gửi Tin Nhắn</button>
                  </div>
                </div>
              </form>
            </div>

            <div class="col-12 mt-5">
              <div class="map-container rounded overflow-hidden">
                <iframe
                  class="w-100"
                  style="height: 450px; border: 0;"
                  src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d7858.008246677342!2d105.78541360000003!3d10.0165173!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1svi!2sus!4v1718935195259!5m2!1svi!2sus"
                  loading="lazy"
                  referrerpolicy="no-referrer-when-downgrade"
                >
                </iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <AppFooter />
  </div>
</template>

<script>
import NavBar from "@/components/User/layout/NavBar.vue";
import AppFooter from "@/components/User/layout/AppFooter.vue";
import Search from "@/components/User/Home/Search.vue";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Contact",
  components: {
    NavBar,
    AppFooter,
    Search,
  },
};
</script>

<style scoped>
.contact {
  background-color: #f8f9fa;
}

.contact-icon {
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.contact-info {
  transition: all 0.3s ease;
}

.contact-info:hover {
  transform: translateY(-5px);
  box-shadow: 0 .5rem 1rem rgba(0,0,0,.15);
}

.contact-form input,
.contact-form textarea {
  padding: 12px 15px;
  border: 1px solid #dee2e6;
  transition: all 0.3s ease;
}

.contact-form input:focus,
.contact-form textarea:focus {
  border-color: #007bff;
  box-shadow: none;
}

.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background-color: #0056b3;
  border-color: #0056b3;
  transform: translateY(-2px);
}

.map-container {
  box-shadow: 0 0 20px rgba(0,0,0,0.1);
}

h1.text-primary {
  color: #007bff !important;
}

.shadow-sm {
  box-shadow: 0 .125rem .25rem rgba(0,0,0,.075) !important;
}
</style>