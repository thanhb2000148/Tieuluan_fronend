<template>
  <div>
    <NavBar />
    <div class="article-detail-container">
      <div class="article-content">
        <h1 class="article-title">{{ article.title }}</h1>
        <div class="article-meta">
          <span class="article-date">{{ new Date(article.date).toLocaleDateString() }}</span>
          <span class="article-author" v-if="article.author">by {{ article.author }}</span>
        </div>
        <div class="article-image">
          <img :src="article.image" :alt="article.title" />
        </div>
        <p class="article-excerpt">{{ article.excerpt }}</p>
        <div class="article-full-content" v-html="article.content"></div>
        <button class="back-button" @click="goBack">Quay lại</button>
      </div>
    </div>
    <AppFooter />
  </div>
</template>

<script>
import axios from 'axios';
import NavBar from "@/components/User/layout/NavBar.vue";
import AppFooter from "@/components/User/layout/AppFooter.vue";

export default {
  name: 'NewDetail',
  components: {
    NavBar,
    AppFooter,
  },
  data() {
    return {
      article: {},
    };
  },
  async mounted() {
    await this.fetchArticle();
  },
  methods: {
    async fetchArticle() {
      try {
        const response = await axios.get(`http://localhost:8000/v1/news/news/${this.$route.params.id}`);
        this.article = response.data.article;
      } catch (error) {
        console.error("Có lỗi xảy ra khi lấy bài viết:", error);
      }
    },
    goBack() {
      this.$router.go(-1);
    }
  },
};
</script>

<style scoped>
.article-detail-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  font-family: 'Arial', sans-serif;
}

.article-title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 10px;
  text-align: center;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  color: #888;
}

.article-image {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.article-image img {
  max-width: 100%;
  height: auto;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.article-excerpt {
  font-size: 1.2rem;
  margin-bottom: 20px;
  text-align: justify;
}

.article-full-content {
  font-size: 1rem;
  line-height: 1.6;
  text-align: justify;
  margin-bottom: 20px;
  word-wrap: break-word; /* Thêm thuộc tính này */
  overflow-wrap: break-word; /* Thêm thuộc tính này để đảm bảo cho các trình duyệt khác nhau */
}

.article-full-content p {
  margin-bottom: 10px;
}

.back-button {
  display: inline-block;
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.back-button:hover {
  background-color: #0056b3;
}
</style>
