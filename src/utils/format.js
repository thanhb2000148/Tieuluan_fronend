// utils/format.js
function formatNumber() {
  return function (number) {
    return number.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };
}

export default {
  formatNumber,
};
