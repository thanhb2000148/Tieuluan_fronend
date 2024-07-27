<template>
  <div>
    <NavBar />
    <Search />
    <!-- Contact Start -->
    <div class="container-fluid contact py-5">
      <div class="container py-5">
        <div class="p-5 bg-light rounded">
          <div class="row g-4">
            <div class="col-12">
              <div class="text-center mx-auto" style="max-width: 700px">
                <h1 class="text-primary">Liên hệ với chúng tôi</h1>
                <p class="mb-4">
                  Địa chỉ: Hưng Phú, Cái Răng, Cần Thơ
                  <br />
                  Điện thoại: +84 123 456 789
                  <br />
                  Giờ làm việc: Thứ 2 - Thứ 6: 7:00 - 17:00
                </p>
              </div>
            </div>
            <div class="col-lg-12">
              <div class="h-100 rounded">
                <iframe
                  class="rounded w-100"
                  style="height: 400px"
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
    <!-- Contact End -->
  </div>
</template>

<script>
import NavBar from "@/components/User/layout/NavBar.vue";
import AppFooter from "@/components/User/layout/AppFooter.vue";
import Search from "@/components/User/Home/Search.vue";
export default {
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
  background-color: #f9f9f9;
}

h1.text-primary {
  color: #007bff !important;
}
</style>
