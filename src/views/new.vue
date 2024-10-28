<template>
  <div>
    <NavBar />
    <div class="page-container">
      <div class="news-container">
        <div class="news-header">
          <h1 class="main-title">Tin Tức & Bài Viết</h1>
          <p class="subtitle">Cập nhật những tin tức mới nhất</p>
          
          <div class="news-filters">
            <div class="filter-group">
              <label class="filter-label">Danh mục:</label>
              <select v-model="selectedCategory" class="category-select">
                <option value="">Tất cả danh mục</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                  {{ cat.name }}
                </option>
              </select>
            </div>
            
            <div class="filter-group">
              <label class="filter-label">Tìm kiếm:</label>
              <div class="search-box">
                <i class="fas fa-search search-icon"></i>
                <input 
                  type="text" 
                  v-model="searchQuery" 
                  placeholder="Tìm kiếm bài viết..."
                  class="search-input"
                >
              </div>
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
              <div class="article-category">{{ article.category }}</div>
            </div>
            <div class="article-content">
              <h3 class="article-title">{{ article.title }}</h3>
              <p class="article-excerpt">{{ article.excerpt }}</p>
              <div class="article-footer">
                <div class="article-meta">
                  <i class="far fa-calendar-alt"></i>
                  <span class="article-date">
                    {{ formatDate(article.date) }}
                  </span>
                </div>
                <button class="read-more" @click="readMore(article._id)">
                  <span>Đọc thêm</span>
                  <i class="fas fa-arrow-right"></i>
                </button>
              </div>
            </div>
          </article>
        </transition-group>

        <!-- Loading State -->
        <div v-if="loading" class="loading-container">
          <div class="loading-spinner"></div>
          <p>Đang tải bài viết...</p>
        </div>

        <!-- Error State -->
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
      selectedCategory: '',
      searchQuery: '',
      categories: [
        { id: 1, name: 'Công nghệ' },
        { id: 2, name: 'Kinh doanh' },
        { id: 3, name: 'Đời sống' },
        { id: 4, name: 'Du lịch' }
      ],
      articles: [],
      loading: false,
      error: null
    }
  },
  computed: {
    filteredArticles() {
      let filtered = this.articles;

      if (this.selectedCategory) {
        filtered = filtered.filter(article => 
          article.category === this.categories.find(cat => 
            cat.id === this.selectedCategory
          )?.name
        );
      }

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
  background-color: #f8fafc;
  min-height: 100vh;
  padding: 2rem 1rem;
}

.news-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.news-header {
  text-align: center;
  margin-bottom: 3rem;
}

.main-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
  letter-spacing: -0.025em;
}

.subtitle {
  color: #64748b;
  font-size: 1.1rem;
  margin-bottom: 2rem;
}

.news-filters {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 2rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 250px;
}

.filter-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #475569;
  text-align: left;
}

.category-select,
.search-input {
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  background: white;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  width: 100%;
}

.search-box {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
}

.search-input {
  padding-left: 2.5rem;
}

.category-select:focus,
.search-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  outline: none;
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.article-card {
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
              0 2px 4px -2px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.article-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
              0 4px 6px -4px rgba(0, 0, 0, 0.1);
}

.article-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.article-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.article-card:hover .article-image img {
  transform: scale(1.1);
}

.article-category {
  position: absolute;
  top: 1rem;
  left: 1rem;
  padding: 0.5rem 1rem;
  background: rgba(59, 130, 246, 0.9);
  color: white;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  backdrop-filter: blur(4px);
}

.article-content {
  padding: 1.5rem;
}

.article-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.75rem;
  line-height: 1.4;
  /* Thay thế cách cũ */
  display: block;
  max-height: 2.8em; /* 2 dòng * 1.4 line-height */
  overflow: hidden;
  position: relative;
}
.article-title::after {
  content: "...";
  position: absolute;
  right: 0;
  bottom: 0;
  padding-left: 40px;
  background: linear-gradient(to right, transparent, white 50%);
}

.article-excerpt {
  color: #64748b;
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  /* Thay thế cách cũ */
  display: block;
  max-height: 4.8em; /* 3 dòng * 1.6 line-height */
  overflow: hidden;
  position: relative;
}
.article-excerpt::after {
  content: "...";
  position: absolute;
  right: 0;
  bottom: 0;
  padding-left: 40px;
  background: linear-gradient(to right, transparent, white 50%);
}

.article-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #64748b;
  font-size: 0.875rem;
}

.read-more {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.read-more:hover {
  background: #2563eb;
  transform: translateX(5px);
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: #64748b;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e2e8f0;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

.error-message {
  text-align: center;
  padding: 2rem;
  color: #ef4444;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.retry-button {
  padding: 0.5rem 1rem;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.retry-button:hover {
  background: #dc2626;
}

/* Animation for article list */
.article-list-enter-active,
.article-list-leave-active {
  transition: all 0.5s ease;
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
  .news-container {
    padding: 1rem;
  }

  .main-title {
    font-size: 2rem;
  }

  .filter-group {
    min-width: 100%;
  }

  .articles-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}
</style>