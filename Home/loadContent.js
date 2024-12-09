function loadBookManagement() {
  console.log("Loading Book Management...");
  fetch("/BookManagement/BookManagement.html")
    .then((response) => {
      console.log("Content loaded, status:", response.status);
      if (!response.ok) {
        throw new Error("Mạng lỗi, không thể tải file");
      }
      return response.text();
    })
    .then((html) => {
      console.log("Setting up content...");
      document.getElementById("mainContent").innerHTML = html;

      // Load script và khởi tạo dữ liệu
      const script = document.createElement("script");
      script.src = "/BookManagement/BookManagement.js";
      script.onload = function () {
        // Đảm bảo fetchBooks được gọi sau khi script đã load
        if (typeof initializeUI === "function") {
          initializeUI();
        }
      };
      document.body.appendChild(script);
    })
    .catch((error) => {
      console.error("Lỗi khi tải trang:", error);
      document.getElementById("mainContent").innerHTML =
        "<p>Không thể tải nội dung. Vui lòng thử lại sau.</p>";
    });
}

function loadReport() {
  console.log("Loading Report & Analytics...");
  fetch("/Report/ReportAnalytics.html")
    .then((response) => {
      console.log("Content loaded, status:", response.status);
      if (!response.ok) {
        throw new Error("Mạng lỗi, không thể tải file");
      }
      return response.text();
    })
    .then((html) => {
      console.log("Setting up report content...");
      document.getElementById("mainContent").innerHTML = html;
    })
    .catch((error) => {
      console.error("Lỗi khi tải trang:", error);
      document.getElementById("mainContent").innerHTML =
        "<p>Không thể tải nội dung báo cáo. Vui lòng thử lại sau.</p>";
    });
}
