import CreateApi from "../services/api.service";
import { jwtDecode } from "jwt-decode"; // Sử dụng cú pháp import với named export

function isLoggedIn() {
  const api = CreateApi(process.env.VUE_APP_API_BASE_URL); // Tạo instance axios
  const token = api.defaults.headers.token;

  if (token) {
    try {
      const decodedToken = jwtDecode(token); // Sử dụng jwtDecode
      const currentTime = Date.now() / 1000; // Thời gian hiện tại tính bằng giây

      if (decodedToken.exp > currentTime) {
        return true;
      } else {
        return false; // Token đã hết hạn
      }
    } catch (error) {
      console.error("Token không hợp lệ:", error);
      return false;
    }
  } else {
    return false; // Không có token
  }
}

export default isLoggedIn;
