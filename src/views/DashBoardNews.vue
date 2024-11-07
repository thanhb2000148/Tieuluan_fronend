<template>
    <div class="wrapper">
        <Slider />
        <div class="main">
        <Nav />
        <main class="content px-3 py-2">
            <div class="container-fluid">
            <h1 class="mb-4 text-center">Quản lý bài viết</h1>
            <div class="d-flex justify-content-between align-items-center mb-4">
                <button class="btn btn-primary" @click="showAddArticleForm">Thêm bài viết</button>
                <form class="form-inline" @submit.prevent>
                <div class="input-group">
                    <input
                    class="form-control"
                    type="search"
                    placeholder="Tìm kiếm..."
                    aria-label="Search"
                    v-model="searchText"
                    />
                    <div class="input-group-append">
                    <button class="btn btn-outline-success" type="submit">
                        <i class="fas fa-search"></i>
                    </button>
                    </div>
                </div>
                </form>
            </div>

            <!-- Modal thêm bài viết -->
    <div v-if="showAddForm" class="modal fade show" tabindex="-1" role="dialog" style="display: block;">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Thêm bài viết</h5>
                <button type="button" class="close" @click="closeAddModal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <input type="text" v-model="newArticle.title" placeholder="Tiêu đề bài viết" class="form-control mb-2" />
                <input type="text" v-model="newArticle.excerpt" placeholder="Mô tả ngắn" class="form-control mb-2" />
                
                <!-- Thay thế textarea bằng Quill Editor -->
            <quill-editor
                v-model="newArticle.content"
                :options="editorOptions"
                @ready="onEditorReady"
                @change="onEditorChange"
                @blur="onEditorBlur"
                @focus="onEditorFocus"
                @text-change="onContentChanged"
                class="mb-2"
                ref="quillEditor"
            ></quill-editor>
                <input type="file" @change="handleFileUpload" class="form-control mb-2" />
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" @click="closeAddModal">Hủy</button>
                <button type="button" class="btn btn-success" @click="addArticle" :disabled="isLoading">
            <span v-if="isLoading"><i class="fas fa-spinner fa-spin"></i> Đang tải...</span>
            <span v-else>Thêm</span>
            </button>
            </div>
            </div>
        </div>
    </div>



            <!-- Modal sửa bài viết -->
    <div v-if="showEditForm" class="modal fade show" tabindex="-1" role="dialog" style="display: block;">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title">Sửa bài viết</h5>
            <button type="button" class="close" @click="closeEditModal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body">
            <input type="text" v-model="editArticledata.title" placeholder="Tiêu đề bài viết" class="form-control mb-2" />
            <input type="text" v-model="editArticledata.excerpt" placeholder="Mô tả ngắn" class="form-control mb-2" />
            
            <quill-editor
            v-model="editArticledata.content"
            :options="editorOptions"
            class="mb-2"
            ref="quillEditorEdit"
            ></quill-editor>
            
            <input type="file" @change="handleFileUpload" class="form-control mb-2" />
            <img :src="editArticledata.image" alt="Hình ảnh bài viết" class="img-fluid mb-2" /> <!-- Hiển thị hình ảnh -->
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeEditModal">Hủy</button>
            <button type="button" class="btn btn-success" @click="updateArticle">Cập nhật</button>
        </div>
        </div>
    </div>
    </div>

    <!-- Bảng các bài viết -->
    <table class="table table-bordered table-hover">
        <thead>
            <tr class="text-center">
            <th scope="col" class="space-title">Tiêu đề bài viết</th>
                    <!-- <th scope="col" class="space-image">Hình ảnh</th>  -->
            <th scope="col" class="space-content">Nội dung</th>
            <th scope="col" class="space-handle">Ngày Đăng</th>
            <th scope="col" class="space-hanle">Xử lý</th>
            </tr>
        </thead>
        <tbody>
    <tr v-for="article in paginatedArticles" :key="article._id" class="align-middle">
      <td class="px-4 py-3">
        <div class="d-flex align-items-center gap-3">
          <img 
            :src="article.image" 
            alt="Thumbnail" 
            class="article-thumbnail"
            style="width: 70px; height: 70px; object-fit: cover; border-radius: 4px;"
          />
          <a href="#" class="article-title text-decoration-none">{{ article.title }}</a>
        </div>
      </td>
      <td class="px-4 py-3 text-gray-600">{{ article.excerpt }}</td>
      <td class="px-4 py-3">{{ new Date(article.date).toLocaleDateString() }}</td>
      <td class="px-4 py-3">
        <div class="d-flex justify-content-center gap-2">
          <button 
            class="btn btn-sm btn-outline-primary"
            @click="editArticle(article)"
          >
            <i class="fas fa-edit"></i>
          </button>
          <button 
            class="btn btn-sm btn-outline-danger"
            @click="deleteArticle(article._id)"
          >
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  </tbody>
    </table>

        <!-- Phân trang -->
        <nav aria-label="Page navigation" class="mt-4">
        <ul class="pagination justify-content-center mb-0">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <a class="page-link" @click.prevent="changePage(currentPage - 1)">
                <i class="fas fa-chevron-left"></i>
            </a>
            </li>
            <li class="page-item">
            <span class="page-link">
                Trang {{ currentPage }} / {{ totalPages }}
            </span>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <a class="page-link" @click.prevent="changePage(currentPage + 1)">
                <i class="fas fa-chevron-right"></i>
            </a>
            </li>
        </ul>
        </nav>



        </div>
     </main>
    </div>
 </div>
</template>

    <script>
    import Slider from "../components/admin/Slider.vue";
    import Nav from "../components/admin/Nav.vue";
    import articleService from "@/services/article.service.js";
    import Swal from 'sweetalert2';
    import axios from 'axios';
    import { quillEditor } from 'vue-quill-editor';
    import 'quill/dist/quill.core.css';
    import 'quill/dist/quill.snow.css';
    import 'quill/dist/quill.bubble.css';

    export default {
    name: "DashboardNews",
    components: {
        Slider,
        Nav,
        quillEditor, // Đăng ký component Quill
    },
    data() {
        return {
        searchText: "",
        articles: [],
        showAddForm: false,
        newArticle: {
            title: '',
            content: '',
            excerpt: '',
            image: '',
        },
        showEditForm: false,
        editArticleId: null,
        editArticledata: {
            title: '',
            content: '',
            excerpt: '',
            image: '',
        },
            editorOptions: {
                modules: {
                    toolbar: [
                        ['bold', 'italic', 'underline', 'strike'],
                        ['blockquote', 'code-block'],
                        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                        ['link', 'image'],
                        ['clean']
                    ]
                },
                placeholder: 'Nhập nội dung bài viết của bạn tại đây...',
                theme: 'snow'
            },
        currentPage: 1, // Trang hiện tại
            itemsPerPage: 3, // Số bài viết hiển thị trên mỗi trang
                    isLoading: false, // Biến trạng thái loading

        };
    },
    created() {
        this.getArticles();
    },
        computed: {
            filteredArticles() {
                const filtered = this.articles.filter((article) =>
                    (article.title ?? '').toLowerCase().includes(this.searchText.toLowerCase())
                );
                return filtered;
            },
            filteredArticlesCount() {
            return this.filteredArticles.length;
            },
            paginatedArticles() {
                const start = (this.currentPage - 1) * this.itemsPerPage;
                const end = start + this.itemsPerPage;
                return this.filteredArticles.slice(start, end);
            },
            totalPages() {
            return Math.ceil(this.filteredArticles.length / this.itemsPerPage);
            },
        },
    watch: {
    showEditForm(newVal) {
        if (newVal) {
        this.$nextTick(() => {
            if (this.$refs.quillEditorEdit) {
            this.$refs.quillEditorEdit.quill.root.innerHTML = this.editArticledata.content;
            }
        });
        }
    },
    },
        methods: {
            changePage(page) {
        if (page < 1 || page > this.totalPages) return; // Kiểm tra trang hợp lệ
        this.currentPage = page;
    },
        onContentChanged({ html }) {
            this.newArticle.content = html;
            console.log("Content changed:", html);
        },
        onEditorReady(editor) {
            console.log('Editor ready!', editor);
        },

        onEditorChange({ html, text }) {
            console.log('Editor change!', html, text);
            this.newArticle.content = html;
        },

        onEditorBlur(editor) {
            console.log('Editor blur!', editor);
        },

        onEditorFocus(editor) {
            console.log('Editor focus!', editor);
        },

        // Sửa lại method addArticle
            async addArticle() {
            // Nếu đang loading, không cho phép thêm bài viết
    if (this.isLoading) {
        return;
    }
        try {
            // Log để kiểm tra dữ liệu
            console.log("Submitting article:", this.newArticle);
            
            // Lấy nội dung trực tiếp từ Quill Editor
            const editor = this.$refs.quillEditor.quill;
            const content = editor.root.innerHTML;
            this.newArticle.content = content;

            console.log("Final content:", this.newArticle.content);

            // Kiểm tra các trường bắt buộc
            if (!this.newArticle.title.trim()) {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: 'Vui lòng nhập tiêu đề bài viết!',
                    confirmButtonText: 'OK'
                });
                return;
            }

            if (!this.newArticle.excerpt.trim()) {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: 'Vui lòng nhập mô tả ngắn!',
                    confirmButtonText: 'OK'
                });
                return;
            }

            // Kiểm tra nội dung
            if (!this.newArticle.content || this.newArticle.content.trim() === '<p><br></p>') {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: 'Nội dung bài viết không được để trống!',
                    confirmButtonText: 'OK',
                });
                return;
            }

            if (!this.newArticle.image) {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: 'Vui lòng chọn hình ảnh cho bài viết!',
                    confirmButtonText: 'OK'
                });
                return;
            }

            // Gửi dữ liệu lên server
            const response = await articleService.createArticle({
                title: this.newArticle.title,
                content: this.newArticle.content,
                excerpt: this.newArticle.excerpt,
                image: this.newArticle.image
            });

            // Kiểm tra response từ server
            if (response && response.success) {
                // Thêm bài viết mới vào danh sách
                this.articles.push(response.article);
                
                // Đóng modal
                this.showAddForm = false;
                
                // Reset form
                this.newArticle = {
                    title: '',
                    content: '',
                    excerpt: '',
                    image: ''
                };

                // Hiển thị thông báo thành công
                Swal.fire({
                    icon: 'success',
                    title: 'Thành công!',
                    text: 'Thêm bài viết mới thành công!',
                    confirmButtonText: 'OK'
                });

                // Cập nhật lại danh sách bài viết
                await this.getArticles();
            } else {
                throw new Error('Không nhận được phản hồi thành công từ server');
            }

        } catch (error) {
            console.error("Lỗi khi thêm bài viết:", error);
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: error.message || 'Đã xảy ra lỗi khi thêm bài viết',
                confirmButtonText: 'OK',
            });
        }
    },

        showAddArticleForm() {
            this.newArticle = {
                title: '',
                content: '',
                excerpt: '',
                image: ''
            };
            this.showAddForm = true;
            // Đợi một chút để modal hiển thị và editor được khởi tạo
            this.$nextTick(() => {
                if (this.$refs.quillEditor) {
                    this.$refs.quillEditor.quill.focus();
                }
            });
        },
           async handleFileUpload(event) {
    const file = event.target.files[0]; // Lấy file từ input
    if (file) {
        this.isLoading = true; // Bắt đầu quá trình tải ảnh
        const imageUrl = await this.uploadImage(file); // Gọi API upload ảnh
        this.isLoading = false; // Kết thúc quá trình tải ảnh
        if (imageUrl) {
            this.newArticle.image = imageUrl; // Gán URL ảnh vào newArticle.image
        } else {
            Swal.fire('Lỗi!', 'Đã xảy ra lỗi khi tải ảnh lên.', 'error');
        }
    }
},


            async uploadImage(file) {
            try {
                const formData = new FormData();
                formData.append('image', file); // Thêm file vào FormData

                // Gọi API upload ảnh
                const response = await axios.post('http://localhost:8000/v1/upload/', formData);
                return response.data.data.url; // Trả về URL ảnh từ API
            } catch (error) {
                console.error('Lỗi khi tải ảnh lên:', error);
                return null; // Trả về null nếu có lỗi
            }
            },
            closeEditModal() {
            this.showEditForm = false;
            },
            closeAddModal() {
                this.showAddForm = false;
            },
            async updateArticle() {
        try {
            // Lấy nội dung từ Quill Editor trước khi gửi
            if (this.$refs.quillEditorEdit) {
                const editor = this.$refs.quillEditorEdit.quill;
                this.editArticledata.content = editor.root.innerHTML;
            }

            // Gửi yêu cầu cập nhật bài viết
            const response = await articleService.updateArticle(this.editArticleId, this.editArticledata);

            if (response && response.success) {
                // Cập nhật bài viết trong danh sách
                const index = this.articles.findIndex(article => article._id === this.editArticleId);
                if (index !== -1) {
                    this.articles.splice(index, 1, response.article); // Cập nhật bài viết với thông tin mới
                }

                // Hiển thị thông báo thành công
                Swal.fire({
                    icon: 'success',
                    title: 'Thành công!',
                    text: 'Bài viết đã được cập nhật thành công!',
                    confirmButtonText: 'OK',
                });

                // Đóng modal
                this.closeEditModal();
            } else {
                throw new Error('Không nhận được phản hồi thành công từ server');
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật bài viết:", error);
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: error.message || 'Đã xảy ra lỗi khi cập nhật bài viết',
                confirmButtonText: 'OK',
            });
        }
    },
    editArticle(article) {
        this.editArticleId = article._id;
        this.editArticledata = { 
            title: article.title, 
            content: article.content, 
            excerpt: article.excerpt, 
            image: article.image 
        };
        console.log("Dữ liệu để sửa:", this.editArticledata); 
        this.showEditForm = true;
        // Khởi tạo lại editor với nội dung mới
        this.$nextTick(() => {
            if (this.$refs.quillEditorEdit) {
                this.$refs.quillEditorEdit.quill.root.innerHTML = this.editArticledata.content;
            }
        });
    },



            async getArticles() {
            try {
                const response = await articleService.getAll();
                console.log("Phản hồi từ server:", response); // In phản hồi ra console
                if (response && response.success) {
                this.articles = response.articles; // Đảm bảo articles được gán đúng
                console.log("Danh sách bài viết:", this.articles); // In danh sách bài viết ra console
                }
            } catch (error) {
                console.error("Lỗi khi lấy danh sách bài viết:", error);
            }
            },
            async deleteArticle(articleId) {
        const confirmation = await Swal.fire({
            title: 'Bạn có chắc chắn?',
            text: "Bạn sẽ không thể khôi phục lại bài viết này!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy'
        });

        if (confirmation.isConfirmed) {
            try {
                // Gọi API để xóa bài viết
                const response = await articleService.deleteArticle(articleId);
                if (response.success) {
                    // Xóa bài viết khỏi danh sách local
                    this.articles = this.articles.filter(article => article._id !== articleId);
                    Swal.fire('Thành công!', 'Bài viết đã được xóa thành công!', 'success');
                } else {
                    Swal.fire('Lỗi!', 'Đã xảy ra lỗi khi xóa bài viết. Vui lòng thử lại.', 'error');
                }
            } catch (error) {
                console.error("Lỗi khi xóa bài viết:", error);
                Swal.fire('Lỗi!', 'Đã xảy ra lỗi khi xóa bài viết. Vui lòng thử lại.', 'error');
            }
        }
    }

        },
    };
    </script>


    <style scoped>
    @import '../style.css/dasboardnews.css';

    </style>
