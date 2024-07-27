<template>
  <div class="container mt-5">
    <h2>Thêm Sản Phẩm Quần Áo</h2>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="name">Tên Sản Phẩm</label>
        <input
          v-model="product.name"
          type="text"
          class="form-control"
          id="name"
          placeholder="Nhập tên sản phẩm"
        />
      </div>
      <div class="form-group">
        <label for="short_desc">Mô Tả Ngắn</label>
        <input
          v-model="product.short_desc"
          type="text"
          class="form-control"
          id="short_desc"
          placeholder="Nhập mô tả ngắn"
        />
      </div>
      <div class="form-group">
        <label for="desc_product">Mô Tả Chi Tiết</label>
        <textarea
          v-model="product.desc_product"
          class="form-control"
          id="desc_product"
          rows="3"
          placeholder="Nhập mô tả chi tiết"
        ></textarea>
      </div>
      <div class="form-group">
        <label for="category_id">Danh Mục</label>
        <select v-model="category_id" multiple class="form-control" id="size">
          <option value="M">Quần Áo</option>
          <option value="L">Điện thoại</option>
          <option value="S">Thức ăn</option>
        </select>
      </div>
      <div class="form-group">
        <label for="size">Kích Cỡ</label>
        <select v-model="product.size" multiple class="form-control" id="size">
          <option value="M">M</option>
          <option value="L">L</option>
          <option value="S">S</option>
        </select>
      </div>
      <div class="form-group">
        <label for="type">Loại</label>
        <select v-model="product.type" multiple class="form-control" id="type">
          <option value="Thịt Xông khói">Thịt Xông khói</option>
          <option value="Đặc Biệt">Đặc Biệt</option>
        </select>
      </div>
      <div class="form-group">
        <label for="file_url">Ảnh đại diện sản phẩm</label>
        <input
          type="file"
          class="form-control"
          id="thumnail"
          placeholder="Tải lên file ảnh"
          @change="handleFileChange($event, 'thumbnail')"
        />
      </div>
      <div class="form-group">
        <label for="file_url">Ảnh chi tiết sản phẩm</label>
        <input
          type="file"
          class="form-control"
          id="detail_images"
          placeholder="Tải lên file ảnh"
          @change="handleFileChange($event, 'detail_images')"
          multiple
        />
      </div>

      <button type="submit" class="btn btn-primary">Thêm Sản Phẩm</button>
    </form>
  </div>
</template>

<script>
export default {
  name: "ClothingComponent",
  data() {
    return {
      product: {
        name: "",
        short_desc: "",
        desc_product: "",
        category_id: "",
        size: [],
        type: [],
        thumbnail: null,
        detail_images: null,
      },
    };
  },
  methods: {
    handleFileChange(event, type) {
      const file = event.target.files;
      if (type === "thumbnail") {
        this.product.thumbnail = file[0];
        console.log("file ảnh", file);
      } else if (type === "detail_images") {
        this.product.detail_images = Array.from(file);
        console.log("files ảnh chi tiết", file);
      }
    },
    submitForm() {
      console.log(this.product);
      // Gửi dữ liệu product đến server hoặc xử lý tiếp theo ở đây
    },
  },
};
</script>
