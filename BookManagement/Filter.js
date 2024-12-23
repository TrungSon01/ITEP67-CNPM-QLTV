// Thêm vào đầu file
window.activeFilters = window.activeFilters || {
  authors: [],
  categories: [],
};

// Biến để lưu trạng thái lọc
let activeFilters = {
  authors: [],
  categories: [],
};

// Hiển thị panel lọc
function showFilterOptions() {
  const authors = [...new Set(allBooks.map((book) => book.author))].sort();
  const categories = [...new Set(allBooks.map((book) => book.category))].sort();

  const filterPanel = document.createElement("div");
  filterPanel.id = "filterPanel";
  filterPanel.className =
    "fixed right-0 top-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 z-40";
  filterPanel.innerHTML = `
    <div class="p-4">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold">Bộ lọc</h3>
        <button onclick="closeFilterPanel()" class="text-gray-500 hover:text-gray-700">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <div class="mb-4">
        <h4 class="font-medium mb-2">Tác giả</h4>
        <div class="max-h-40 overflow-y-auto">
          ${authors
            .map(
              (author) => `
            <label class="flex items-center space-x-2 mb-2">
              <input type="checkbox" value="${author}" class="author-filter"
                ${activeFilters.authors.includes(author) ? "checked" : ""}>
              <span>${author}</span>
            </label>
          `
            )
            .join("")}
        </div>
      </div>

      <div class="mb-4">
        <h4 class="font-medium mb-2">Thể loại</h4>
        <div class="max-h-40 overflow-y-auto">
          ${categories
            .map(
              (category) => `
            <label class="flex items-center space-x-2 mb-2">
              <input type="checkbox" value="${category}" class="category-filter"
                ${activeFilters.categories.includes(category) ? "checked" : ""}>
              <span>${category}</span>
            </label>
          `
            )
            .join("")}
        </div>
      </div>

      <div class="flex space-x-2 mt-4">
        <button onclick="applyFilters()" class="flex-1 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
          Áp dụng
        </button>
        <button onclick="clearFilters()" class="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400">
          Xóa lọc
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(filterPanel);

  requestAnimationFrame(() => {
    filterPanel.style.transform = "translateX(100%)";
    requestAnimationFrame(() => {
      filterPanel.style.transform = "translateX(0)";
    });
  });
}

// Đóng panel lọc
function closeFilterPanel() {
  const filterPanel = document.getElementById("filterPanel");
  if (filterPanel) {
    filterPanel.style.transform = "translateX(100%)";
    setTimeout(() => {
      filterPanel.remove();
    }, 300);
  }
}

// Áp dụng bộ lọc
function applyFilters() {
  const selectedAuthors = Array.from(
    document.querySelectorAll(".author-filter:checked")
  ).map((cb) => cb.value);
  const selectedCategories = Array.from(
    document.querySelectorAll(".category-filter:checked")
  ).map((cb) => cb.value);

  // Lưu trạng thái lọc
  activeFilters.authors = selectedAuthors;
  activeFilters.categories = selectedCategories;

  // Áp dụng bộ lọc
  applyActiveFilters();

  closeFilterPanel();
}

// Áp dụng bộ lọc hiện tại
function applyActiveFilters() {
  // Lọc sách theo bộ lọc đang active
  filteredBooks = allBooks.filter((book) => {
    const authorMatch =
      activeFilters.authors.length === 0 ||
      activeFilters.authors.includes(book.author);
    const categoryMatch =
      activeFilters.categories.length === 0 ||
      activeFilters.categories.includes(book.category);
    return authorMatch && categoryMatch;
  });

  currentPage = 1;
  updateTableDisplay();
}

// Xóa bộ lọc
function clearFilters() {
  // Xóa trạng thái lọc
  activeFilters.authors = [];
  activeFilters.categories = [];

  // Bỏ chọn tất cả các checkbox
  document
    .querySelectorAll(".author-filter, .category-filter")
    .forEach((cb) => {
      cb.checked = false;
    });

  // Xóa bộ lọc và hiển thị lại tất cả sách
  filteredBooks = [];
  currentPage = 1;
  updateTableDisplay();
  closeFilterPanel();
}
