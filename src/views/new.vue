<template>
  <div class="news-container">
    <!-- Header Section -->
    <div class="news-header">
      <h1 class="main-title">Tin Tức & Bài Viết</h1>
      <div class="news-filters">
        <select v-model="selectedCategory" class="category-select">
          <option value="">Tất cả danh mục</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">
            {{ cat.name }}
          </option>
        </select>
        <div class="search-box">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Tìm kiếm bài viết..."
            class="search-input"
          >
        </div>
      </div>
    </div>

    <!-- Articles Grid -->
    <div class="articles-grid">
      <article 
        v-for="article in filteredArticles" 
        :key="article.id"
        class="article-card"
      >
        <div class="article-image">
          <img :src="article.image" :alt="article.title">
        </div>
        <div class="article-content">
          <div class="article-category">{{ article.category }}</div>
          <h3 class="article-title">{{ article.title }}</h3>
          <p class="article-excerpt">{{ article.excerpt }}</p>
          <div class="article-footer">
            <span class="article-date">{{ article.date }}</span>
            <button class="read-more" @click="readMore(article)">
              Đọc thêm
            </button>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NewList',
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
      articles: [
        {
          id: 1,
          title: 'Xu hướng công nghệ mới nhất năm 2024',
          category: 'Công nghệ',
          excerpt: 'Khám phá những xu hướng công nghệ đang định hình tương lai của chúng ta trong năm 2024...',
          content: 'Nội dung chi tiết về xu hướng công nghệ...',
          image: '/images/tech1.jpg', // Thay bằng URL thực tế của bạn
          date: '23/10/2024',
          author: 'John Doe'
        },
        {
          id: 2,
          title: 'Top 10 địa điểm du lịch hot nhất 2024',
          category: 'Du lịch',
          excerpt: 'Khám phá những điểm đến tuyệt vời nhất cho kỳ nghỉ của bạn trong năm nay...',
          content: 'Nội dung chi tiết về địa điểm du lịch...',
          image: '/images/travel1.jpg',
          date: '22/10/2024',
          author: 'Jane Smith'
        },
        {
          id: 3,
          title: 'Bí quyết khởi nghiệp thành công',
          category: 'Kinh doanh',
          excerpt: 'Những điều cần biết khi bắt đầu khởi nghiệp và cách xây dựng doanh nghiệp bền vững...',
          content: 'Nội dung chi tiết về khởi nghiệp...',
          image: '/images/business1.jpg',
          date: '21/10/2024',
          author: 'David Brown'
        },
        {
          id: 4,
          title: 'Cách sống lành mạnh trong thời đại số',
          category: 'Đời sống',
          excerpt: 'Những tips giúp bạn cân bằng cuộc sống và công việc trong thời đại công nghệ...',
          content: 'Nội dung chi tiết về lối sống lành mạnh...',
          image: '/images/lifestyle1.jpg',
          date: '20/10/2024',
          author: 'Mary Johnson'
        }
        // Thêm nhiều bài viết khác ở đây
      ]
    }
  },
  computed: {
    filteredArticles() {
      let filtered = this.articles;
      
      // Lọc theo danh mục
      if (this.selectedCategory) {
        filtered = filtered.filter(article => 
          article.category === this.categories.find(cat => cat.id === this.selectedCategory)?.name
        );
      }
      
      // Lọc theo từ khóa tìm kiếm
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
    readMore(article) {
      // Có thể thêm navigation đến trang chi tiết
      console.log('Reading article:', article.title);
    }
  }
}
</script>

<style scoped>
.news-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.news-header {
  margin-bottom: 2rem;
}

.main-title {
  font-size: 2.5rem;
  color: #1a1a1a;
  margin-bottom: 1.5rem;
  text-align: center;
}

.news-filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.category-select {
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background: white;
  min-width: 200px;
  font-size: 1rem;
}

.search-box {
  flex: 1;
  max-width: 400px;
}

.search-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1rem;
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.article-card {
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.article-card:hover {
  transform: translateY(-5px);
}

.article-image {
  height: 200px;
  overflow: hidden;
}

.article-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.article-card:hover .article-image img {
  transform: scale(1.05);
}

.article-content {
  padding: 1.5rem;
}

.article-category {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: #2563eb;
  color: white;
  border-radius: 9999px;
  font-size: 0.875rem;
  margin-bottom: 0.75rem;
}

.article-title {
  font-size: 1.25rem;
  color: #1a1a1a;
  margin-bottom: 0.75rem;
  line-height: 1.4;
}

.article-excerpt {
  color: #4b5563;
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.article-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.article-date {
  color: #6b7280;
  font-size: 0.875rem;
}

.read-more {
  padding: 0.5rem 1rem;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.read-more:hover {
  background: #1d4ed8;
}

@media (max-width: 768px) {
  .news-filters {
    flex-direction: column;
  }
  
  .search-box {
    max-width: 100%;
  }
  
  .articles-grid {
    grid-template-columns: 1fr;
  }
}
</style>