<template>
  <div class="container-fluid py-5 mb-5 hero-header">
    <div class="container py-5">
      <div class="row g-5 align-items-center">
        <div class="col-md-12 col-lg-7">
          <h4 class="mb-3 text-a">Mua hàng nhanh chóng, tiện lợi</h4>
          <h1 class="mb-5 display-3 text-a">
           Thương Mại Điện Tử
          </h1>
          
        </div>
        <div class="col-md-12 col-lg-5">
          <div
            id="carouselId"
            class="carousel slide position-relative"
            data-bs-ride="carousel"
          >
            <div class="carousel-inner" role="listbox">
              <div class="carousel-item active rounded">
                <img
                  src="../../../assets/thoitrang.jpg"
                  class="img-fluid w-100 h-100 bg-secondary rounded"
                  alt="First slide"
                />
                <a href="#" class="btn px-4 py-2 text-white rounded">Thời trang</a>
              </div>
              <div class="carousel-item rounded">
                <img
                  src="../../../assets/dienthoai.jpg"
                  class="img-fluid w-100 h-100 rounded"
                  alt="Second slide"
                />
                <a href="#" class="btn px-4 py-2 text-white rounded"
                  >Điện thoại</a
                >
              </div>

              <div class="carousel-item rounded">
                <img
                  src="../../../assets/banh.jpg"
                  class="img-fluid w-100 h-100 rounded"
                  alt="Second slide"
                />
                <a href="#" class="btn px-4 py-2 text-white rounded"
                  >Bánh</a
                >
              </div>
            </div>
            <button
              class="carousel-control-prev"
              type="button"
              data-bs-target="#carouselId"
              data-bs-slide="prev"
            >
              <span
                class="carousel-control-prev-icon"
                aria-hidden="true"
              ></span>
              <span class="visually-hidden">Previous</span>
            </button>
            <button
              class="carousel-control-next"
              type="button"
              data-bs-target="#carouselId"
              data-bs-slide="next"
            >
              <span
                class="carousel-control-next-icon"
                aria-hidden="true"
              ></span>
              <span class="visually-hidden">Next</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HomeHero",
};

</script>

<style>
.text-a{
  color:black
}</style>
