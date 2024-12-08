const API_URL = "/api/books";

let currentBookId = null;
let currentPage = 1;
let rowsPerPage = 10;
let totalPages = 1;
let allBooks = [];
let filteredBooks = [];

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
      allBooks = books;
      filteredBooks = [];
      updateTableDisplay();
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Không thể tải danh sách sách: " + error.message);
    });
}

// Hàm cập nhật hiển thị bảng
function updateTableDisplay() {
  const startIndex = (currentPage - 1) * rowsPerPage;
  const booksToShow = filteredBooks.length > 0 ? filteredBooks : allBooks;
  const endIndex = Math.min(startIndex + rowsPerPage, booksToShow.length);
  const displayedBooks = booksToShow.slice(startIndex, endIndex);

  const tableBody = document.querySelector("#bookTable tbody");
  tableBody.innerHTML = "";

  displayedBooks.forEach((book, index) => {
    const row = document.createElement("tr");
    row.className = "hover:bg-gray-50 cursor-pointer";
    row.innerHTML = `
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${
        startIndex + index + 1
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
        book.availableQuantity
      }</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${
        book.date
      }</td>
    `;
    row.addEventListener("click", () => showBookDetail(book.id));
    tableBody.appendChild(row);
  });

  updatePagination(booksToShow.length);
}

// Hàm cập nhật thông tin phân trang
function updatePagination(totalBooks) {
  totalPages = Math.ceil(totalBooks / rowsPerPage);
  const startRow = (currentPage - 1) * rowsPerPage + 1;
  const endRow = Math.min(currentPage * rowsPerPage, totalBooks);

  document.getElementById("startRow").textContent = totalBooks ? startRow : 0;
  document.getElementById("endRow").textContent = endRow;
  document.getElementById("totalRows").textContent = totalBooks;

  const pageNumbers = document.getElementById("pageNumbers");
  pageNumbers.innerHTML = "";

  // Hiển thị các nút số trang
  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement("button");
    pageButton.className = `px-3 py-1 rounded-md ${
      i === currentPage
        ? "bg-green-500 text-white"
        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
    }`;
    pageButton.textContent = i;
    pageButton.addEventListener("click", () => {
      currentPage = i;
      updateTableDisplay();
    });
    pageNumbers.appendChild(pageButton);
  }

  // Cập nhật trạng thái nút Trước/Sau
  document.getElementById("prevPage").disabled = currentPage === 1;
  document.getElementById("nextPage").disabled = currentPage === totalPages;
}

// Thêm event listeners cho các nút điều hướng
document.getElementById("prevPage").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    updateTableDisplay();
  }
});

document.getElementById("nextPage").addEventListener("click", () => {
  if (currentPage < totalPages) {
    currentPage++;
    updateTableDisplay();
  }
});

// Thêm event listener cho dropdown chọn số dòng
document.getElementById("rowsPerPage").addEventListener("change", (e) => {
  rowsPerPage = parseInt(e.target.value);
  currentPage = 1; // Reset về trang đầu tiên
  updateTableDisplay();
});

// Thêm event listener cho ô tìm kiếm
document.getElementById("searchInput").addEventListener("input", function (e) {
  const searchTerm = e.target.value.toLowerCase();

  // Lọc sách dựa trên từ khóa tìm kiếm
  filteredBooks = allBooks.filter(
    (book) =>
      book.name.toLowerCase().includes(searchTerm) ||
      book.author.toLowerCase().includes(searchTerm) ||
      book.category.toLowerCase().includes(searchTerm)
  );

  currentPage = 1; // Reset về trang 1 khi tìm kiếm
  updateTableDisplay();
});

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
          <div class="font-medium text-gray-500">Tổng số lượng:</div>
          <div>${book.totalQuantity}</div>
          <div class="font-medium text-gray-500">Số lượng còn lại:</div>
          <div>${book.availableQuantity}</div>
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
    totalQuantity: parseInt(document.getElementById("totalQuantity").value),
    availableQuantity: parseInt(
      document.getElementById("availableQuantity").value
    ),
  };

  // Kiểm tra logic số lượng
  if (newBook.availableQuantity > newBook.totalQuantity) {
    alert("Số lượng còn lại không thể lớn hơn tổng số lượng!");
    return;
  }

  fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newBook),
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((err) => {
          throw new Error(
            err.message || `HTTP error! status: ${response.status}`
          );
        });
      }
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
      alert(error.message || "Lỗi khi thêm sách");
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
      document.getElementById("updateTotalQuantity").value = book.totalQuantity;
      document.getElementById("updateAvailableQuantity").value =
        book.availableQuantity;
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
