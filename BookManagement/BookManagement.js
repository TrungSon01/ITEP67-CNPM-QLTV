const API_URL = "/api/books";

let currentBookId = null;

// Load sách khi trang được tải
document.addEventListener("DOMContentLoaded", () => {
  console.log("Page loaded, fetching books...");
  fetchBooks();
});

// Lấy danh sách sách từ server
function fetchBooks() {
  fetch(API_URL)
    .then((response) => {
      if (!response.ok) throw new Error("Không thể kết nối với server");
      return response.json();
    })
    .then((books) => {
      const tableBody = document.querySelector("#bookTable tbody");
      tableBody.innerHTML = "";

      books.forEach((book, index) => {
        const row = document.createElement("tr");
        row.className = "hover:bg-gray-50 cursor-pointer";
        row.innerHTML = `
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${
            index + 1
          }</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${
            book.name
          }</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${
            book.author
          }</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${
            book.category
          }</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${
            book.date
          }</td>
        `;
        row.addEventListener("click", () => showBookDetail(book.id));
        tableBody.appendChild(row);
      });
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Không thể tải danh sách sách: " + error.message);
    });
}

// Thêm các hàm xử lý modal chi tiết
function showBookDetail(id) {
  currentBookId = id;
  fetch(`${API_URL}/${id}`)
    .then((response) => response.json())
    .then((book) => {
      const detailContent = document.querySelector(".book-detail-content");
      detailContent.innerHTML = `
        <div class="grid grid-cols-2 gap-4">
          <div class="font-medium text-gray-500">Tên sách:</div>
          <div>${book.name}</div>
          <div class="font-medium text-gray-500">Tác giả:</div>
          <div>${book.author}</div>
          <div class="font-medium text-gray-500">Thể loại:</div>
          <div>${book.category}</div>
          <div class="font-medium text-gray-500">Ngày xuất bản:</div>
          <div>${book.date}</div>
          <div class="font-medium text-gray-500">Mô tả:</div>
          <div class="col-span-2">${book.description}</div>
        </div>
      `;
      showModal("detailModal");
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Không thể tải thông tin sách");
    });
}

function closeDetailModal() {
  closeModal("detailModal");
  currentBookId = null;
}

function handleDelete() {
  if (currentBookId && confirm("Bạn có chắc muốn xóa sách này?")) {
    deleteBook(currentBookId);
    closeDetailModal();
  }
}

// Xử lý thêm sách mới
document.getElementById("bookForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const newBook = {
    name: document.getElementById("name").value,
    author: document.getElementById("author").value,
    category: document.getElementById("category").value,
    description: document.getElementById("description").value,
    date: document.getElementById("date").value,
  };

  fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newBook),
  })
    .then((response) => {
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      return response.json();
    })
    .then((data) => {
      alert("Thêm sách thành công!");
      this.reset();
      fetchBooks();
      closeAddModal();
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Lỗi khi thêm s��ch: " + error.message);
    });
});

// Thêm các hàm xử lý modal
function showUpdateModal(id) {
  closeDetailModal();
  fetch(`${API_URL}/${id}`)
    .then((response) => {
      if (!response.ok) throw new Error("Không thể lấy thông tin sách");
      return response.json();
    })
    .then((book) => {
      document.getElementById("updateBookId").value = book.id;
      document.getElementById("updateName").value = book.name;
      document.getElementById("updateAuthor").value = book.author;
      document.getElementById("updateCategory").value = book.category;
      document.getElementById("updateDescription").value = book.description;
      document.getElementById("updateDate").value = book.date;
      showModal("updateModal");
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Lỗi khi lấy thông tin sách: " + error.message);
    });
}

function closeUpdateModal() {
  closeModal("updateModal");
}

// Sửa lại hàm updateBook
function updateBook(id) {
  console.log("updateBook called with id:", id);
  showUpdateModal(id);
}

// Thêm xử lý form cập nhật
document.getElementById("updateForm").addEventListener("submit", function (e) {
  console.log("Update form submitted");
  e.preventDefault();

  const id = document.getElementById("updateBookId").value;
  const updatedBook = {
    name: document.getElementById("updateName").value,
    author: document.getElementById("updateAuthor").value,
    category: document.getElementById("updateCategory").value,
    description: document.getElementById("updateDescription").value,
    date: document.getElementById("updateDate").value,
  };

  fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedBook),
  })
    .then((response) => {
      if (!response.ok) throw new Error("Lỗi khi cập nhật sách");
      return response.json();
    })
    .then((data) => {
      alert("Cập nhật sách thành công!");
      closeUpdateModal();
      fetchBooks();
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Lỗi khi cập nhật sách: " + error.message);
    });
});

// Hàm xóa sách
function deleteBook(id) {
  if (!confirm("Bạn có chắc muốn xóa sách này?")) return;

  fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok) throw new Error("Lỗi khi xóa sách");
      return response.json();
    })
    .then((data) => {
      alert("Xóa sách thành công!");
      fetchBooks();
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Lỗi khi xóa sách: " + error.message);
    });
}

// Thêm các hàm xử lý modal thêm sách
function showAddModal() {
  showModal("addModal");
}

function closeAddModal() {
  closeModal("addModal");
  document.getElementById("bookForm").reset();
}

// Thêm các hàm xử lý dropdown
function toggleDropdown() {
  document.getElementById("bookDropdown").classList.toggle("show");
}

// Đóng dropdown khi click ra ngoài
window.onclick = function (event) {
  if (
    !event.target.matches(".fa-book-open") &&
    !event.target.closest(".dropdown button")
  ) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    for (var i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains("show")) {
        openDropdown.classList.remove("show");
      }
    }
  }
};

// Hàm xử lý lọc sách (có th thêm sau)
function showFilterOptions() {
  // Thêm code xử lý lọc sách ở đây
  alert("Tính năng đang được phát triển");
}

function showModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.classList.remove("hidden");
  // Đảm bảo animation chạy mỗi lần hiển thị
  const modalContent = modal.querySelector("div");
  modalContent.style.animation = "none";
  modalContent.offsetHeight; // Trigger reflow
  modalContent.style.animation = null;
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.classList.add("hidden");
}
