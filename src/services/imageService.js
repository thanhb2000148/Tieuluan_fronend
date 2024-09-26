import createApiClient from './api.service'; 

const api = createApiClient();

export async function uploadImage(file) {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post('/api/v1/upload/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.data.success) {
      return response.data.data.url; // Trả về URL ảnh nếu upload thành công
    } else {
      console.error('Upload thất bại:', response.data.message);
      return null;
    }
  } catch (error) {
    console.error('Lỗi khi upload ảnh:', error);
    return null;
  }
}
