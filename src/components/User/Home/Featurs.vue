<template>
 <div class="wrapper-heading-home wrapper-heading-home-new">
    <div class="wrapper-animation">
      <span class="text-animation a">
        <h2>
          <router-link to="/shop">NEW ARRIVALS</router-link>
        </h2>
      </span>
      <span class="text-animation a">
        <h2>
          <router-link to="/shop">NEW ARRIVALS</router-link>
        </h2>
      </span>
      <span class="text-animation a">
         <h2>
          <router-link to="/shop">NEW ARRIVALS</router-link>
        </h2>
      </span>
      <span class="text-animation a">
         <h2>
          <router-link to="/shop">NEW ARRIVALS</router-link>
        </h2>
      </span>
      <span class="text-animation a">
        <h2>
          <router-link to="/shop">NEW ARRIVALS</router-link>
        </h2>
      </span>
    </div>
  </div>
  <div>
    <img src="https://res.cloudinary.com/dgfwiff6k/image/upload/v1726902403/slideshow_2_gsa5eu.webp" alt="Mô tả hình ảnh" style="width: 100%; height: auto;" />
  </div><!--  -->
 <div class="module three-up overlay-true">
    <div class="module-interior">
        <div class="block-module block--1">
            <a class="link-banner" href="/shop">
                <div class="ratiobox">
                    <img class="responsive-img" src="//theme.hstatic.net/1000306633/1001194548/14/block_home_category1_new.png?v=231" alt="Tops">
                    <div class="block-content block-overlay">
                        <h3 class="title-b block-title"> </h3>
                    </div>
                </div>
            </a>
        </div>
        <div class="block-module block--2">
            <a class="link-banner" href="/shop">
                <div class="ratiobox">
                    <img class="responsive-img" src="//theme.hstatic.net/1000306633/1001194548/14/block_home_category2_new.png?v=231" alt="Bottoms">
                    <div class="block-content block-overlay">
                        <h3 class="title-b block-title"> </h3>
                    </div>
                </div>
            </a>
        </div>
        <div class="block-module block--3">
            <a class="link-banner" href="/shop">
                <div class="ratiobox">
                    <img class="responsive-img" src="//theme.hstatic.net/1000306633/1001194548/14/block_home_category3_new.png?v=231" alt="Outerwear">
                    <div class="block-content block-overlay">
                        <h3 class="title-b block-title"></h3>
                    </div>
                </div>
            </a>
        </div>
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
/* Thêm các kiểu bổ sung cho phần mới */
.wrapper-heading-home {
  overflow: hidden;
  height: 50px; /* Chiều cao của khối bao quanh */
  position: relative;
  -webkit-text-fill-color: hsla(0, 0%, 100%, 0);
  -webkit-text-stroke-width: 1px;
  margin: 29px;
}

.wrapper-animation {
  display: flex;
  position: absolute;
  white-space: nowrap; /* Để các chữ không xuống hàng */
  animation: scrollTextHorizontal 30s linear infinite; /* Hiệu ứng di chuyển ngang */
}

.text-animation {
  display: inline-block;
  padding-right: 50px; /* Khoảng cách giữa các từ */
  
}
.text-animation a{
  color: black !important;
}

h2 {
  font-size: 36px;
  font-weight: bold;
  margin: 0;
}


@keyframes scrollTextHorizontal {
  0% {
    transform: translateX(-100%); /* Bắt đầu từ bên ngoài bên phải */
  }
  100% {
    transform: translateX(100%); /* Kết thúc bên ngoài bên trái */
  }
}


.module-interior {
    display: flex; /* Sử dụng flexbox để xếp hàng */
    justify-content: space-around; /* Đặt khoảng cách đều giữa các khối */
}

.block-module {
    flex: 0 0 30%; /* Mỗi khối chiếm khoảng 30% chiều rộng của hàng */
    max-width: 30%; /* Giới hạn kích thước tối đa của mỗi khối */
    margin: 0 5px; /* Thêm khoảng cách giữa các khối */
}

.responsive-img {
    width: 100%; /* Ảnh sẽ tự động điều chỉnh theo chiều rộng của khối */
    height: auto; /* Đảm bảo tỉ lệ khung hình được giữ nguyên */
}



</style>