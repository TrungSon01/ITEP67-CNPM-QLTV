function loadBookManagement() {
  console.log("Loading Book Management...");
  fetch("/BookManagement/content")
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

      const oldScript = document.querySelector(
        'script[src="/BookManagement/BookManagement.js"]'
      );
      if (oldScript) {
        console.log("Removing old script...");
        oldScript.remove();
      }

      console.log("Loading new script...");
      const script = document.createElement("script");
      script.src = "/BookManagement/BookManagement.js";
      script.onload = function () {
        console.log("Script loaded, fetching books...");
        if (typeof fetchBooks === "function") {
          fetchBooks();
        } else {
          console.error("fetchBooks function not found!");
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
