<template>
  <div>
    <NavBar />
    <div class="page-container">
      <div class="news-container">
        <div class="news-header">
          <h1 class="main-title " style="padding-top: 39px;" >Tin Tức & Bài Viết</h1>
          <div class="header-decoration"></div>
          <p class="subtitle">Cập nhật những tin tức mới nhất từ khắp nơi trên thế giới</p>
          
          <div class="search-container">
            <div class="search-box">
              <input 
                type="text" 
                v-model="searchQuery" 
                placeholder="Tìm kiếm bài viết..."
                class="search-input"
              >
              <i class="fas fa-search search-icon"></i>
            </div>
          </div>
        </div>

        <transition-group 
          name="article-list" 
          tag="div" 
          class="articles-grid"
        >
          <article 
            v-for="article in filteredArticles" 
            :key="article._id"
            class="article-card"
          >
            <div class="article-image">
              <img :src="article.image" :alt="article.title">
              <div class="article-overlay">
                <button class="read-more-overlay" @click="readMore(article._id)">
                  Đọc ngay
                  <i class="fas fa-arrow-right"></i>
                </button>
              </div>
            </div>
            <div class="article-content">
              <div class="article-meta">
                <span class="article-date">
                  <i class="far fa-calendar-alt"></i>
                  {{ formatDate(article.date) }}
                </span>
                <span class="article-views">
                  <i class="far fa-eye"></i>
                  {{ Math.floor(Math.random() * 1000) + 100 }}
                </span>
              </div>
              <h3 class="article-title">{{ article.title }}</h3>
              <p class="article-excerpt">{{ article.excerpt }}</p>
              <div class="article-footer">
                <button class="read-more-button" @click="readMore(article._id)">
                  <span>Xem chi tiết</span>
                  <i class="fas fa-long-arrow-alt-right"></i>
                </button>
              </div>
            </div>
          </article>
        </transition-group>

        <div v-if="loading" class="loading-container">
          <div class="loading-spinner"></div>
          <p>Đang tải bài viết...</p>
        </div>

        <div v-if="error" class="error-message">
          <i class="fas fa-exclamation-circle"></i>
          <p>{{ error }}</p>
          <button @click="fetchArticles" class="retry-button">
            Thử lại
          </button>
        </div>
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
  name: 'NewList',
  components: {
    NavBar,
    AppFooter,
  },
  data() {
    return {
      searchQuery: '',
      articles: [],
      loading: false,
      error: null
    }
  },
  computed: {
    filteredArticles() {
      let filtered = this.articles;

      if (this.searchQuery) {
        const search = this.searchQuery.toLowerCase();
        filtered = filtered.filter(article =>
          article.title.toLowerCase().includes(search) ||
          article.excerpt.toLowerCase().includes(search)
        );
      }

      return filtered;
    }
  },
  methods: {
    async fetchArticles() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await axios.get('http://localhost:8000/v1/news/');
        this.articles = response.data.articles;
      } catch (error) {
        this.error = "Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.";
        console.error("Error fetching articles:", error);
      } finally {
        this.loading = false;
      }
    },
    readMore(articleId) {
      this.$router.push({ 
        name: 'NewDetail', 
        params: { id: articleId } 
      });
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
    }
  },
  mounted() {
    this.fetchArticles();
  }
}
</script>

<style scoped>
.page-container {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  min-height: 100vh;
  padding-top: 80px;
}

.news-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

.news-header {
  text-align: center;
  margin-bottom: 4rem;
  position: relative;
}

.main-title {
  font-size: 3rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 1rem;
  letter-spacing: -0.025em;
  text-transform: uppercase;
  background: linear-gradient(to right, #1e293b, #3b82f6);
  -webkit-background-clip: text;
  background-clip: text; /* Thêm thuộc tính chuẩn */
  -webkit-text-fill-color: transparent;
}

.header-decoration {
  width: 100px;
  height: 4px;
  background: linear-gradient(to right, #3b82f6, #60a5fa);
  margin: 1rem auto;
  border-radius: 2px;
}

.subtitle {
  color: #64748b;
  font-size: 1.2rem;
  margin-bottom: 2.5rem;
  font-weight: 400;
}

.search-container {
  max-width: 600px;
  margin: 0 auto;
}

.search-box {
  position: relative;
  width: 100%;
}

.search-input {
  width: 100%;
  padding: 1rem 3rem 1rem 1.5rem;
  border: 2px solid #e2e8f0;
  border-radius: 1rem;
  background: white;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.search-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  outline: none;
}

.search-icon {
  position: absolute;
  right: 1.5rem;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  transition: color 0.3s ease;
}

.search-input:focus + .search-icon {
  color: #3b82f6;
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2.5rem;
  margin-top: 3rem;
}

.article-card {
  background: white;
  border-radius: 1.5rem;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
              0 2px 4px -2px rgba(0, 0, 0, 0.1);
  transition: all 0.4s ease;
}

.article-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
              0 8px 10px -6px rgba(0, 0, 0, 0.1);
}

.article-image {
  position: relative;
  height: 250px;
  overflow: hidden;
}

.article-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.article-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.article-card:hover .article-overlay {
  opacity: 1;
}

.read-more-overlay {
  padding: 1rem 2rem;
  background: white;
  color: #1e293b;
  border: none;
  border-radius: 9999px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  transform: translateY(20px);
  transition: all 0.4s ease;
}

.article-card:hover .read-more-overlay {
  transform: translateY(0);
}

.article-content {
  padding: 2rem;
}

.article-meta {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1rem;
  color: #64748b;
  font-size: 0.9rem;
}

.article-date,
.article-views {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.article-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-excerpt {
  color: #64748b;
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-footer {
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;  
}

.read-more-button {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(to right, #3b82f6, #60a5fa);
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  justify-content: center;
}

.read-more-button:hover {
  background: linear-gradient(to right, #2563eb, #3b82f6);
  transform: translateX(5px);
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  color: #64748b;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #e2e8f0;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1.5rem;
}

.error-message {
  text-align: center;
  padding: 3rem;
  color: #ef4444;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.retry-button {
  padding: 0.75rem 2rem;
  background: linear-gradient(to right, #ef4444, #f87171);
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-button:hover {
  background: linear-gradient(to right, #dc2626, #ef4444);
  transform: scale(1.05);
}

.article-list-enter-active,
.article-list-leave-active {
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.article-list-enter-from,
.article-list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .page-container {
    padding-top: 64px;
  }

  .news-container {
    padding: 0 1rem;
  }

  .main-title {
    font-size: 2.25rem;
  }

  .subtitle {
    font-size: 1.1rem;
  }

  .articles-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .article-card {
    margin: 0 0.5rem;
  }
  
  .search-container {
    margin: 0 1rem;
  }
  
  .search-input {
    padding: 0.875rem 2.5rem 0.875rem 1.25rem;
  }
}

/* Tablet Responsive */
@media (min-width: 769px) and (max-width: 1024px) {
  .articles-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }

  .article-card {
    margin: 0;
  }
}
  
/* Larger screens */
@media (min-width: 1536px) {
  .news-container {
    max-width: 1600px;
  }

  .articles-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>