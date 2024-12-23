// Biến để lưu timeout của debounce
let searchDebounceTimeout;

// Hàm thực hiện tìm kiếm
function performSearch(searchTerm) {
  console.log("Searching for:", searchTerm);

  if (searchTerm === "") {
    // Nếu ô tìm kiếm trống, áp dụng lại bộ lọc hiện tại
    if (
      activeFilters.authors.length > 0 ||
      activeFilters.categories.length > 0
    ) {
      applyActiveFilters();
    } else {
      filteredBooks = [];
      currentPage = 1;
      updateTableDisplay();
    }
    return;
  }

  // Tìm kiếm trong danh sách đã được lọc (nếu có)
  const booksToSearch =
    activeFilters.authors.length > 0 || activeFilters.categories.length > 0
      ? filteredBooks
      : allBooks;

  // Lọc sách dựa trên từ khóa tìm kiếm
  filteredBooks = booksToSearch.filter((book) => {
    return (
      book.title.toLowerCase().includes(searchTerm) ||
      book.author.toLowerCase().includes(searchTerm) ||
      book.category.toLowerCase().includes(searchTerm) ||
      (book.description && book.description.toLowerCase().includes(searchTerm))
    );
  });

  currentPage = 1;
  updateTableDisplay();
}

// Khởi tạo các event listeners cho tìm kiếm
function initializeSearch() {
  const searchInput = document.getElementById("searchInput");

  // Event listener cho input (debounce)
  searchInput.addEventListener("input", function (e) {
    // Clear timeout cũ nếu có
    clearTimeout(searchDebounceTimeout);

    // Tạo timeout mới và lưu lại
    searchDebounceTimeout = setTimeout(() => {
      const searchTerm = e.target.value.toLowerCase().trim();
      performSearch(searchTerm);
    }, 3000); // Đợi 500ms sau lần gõ cuối cùng mới thực hiện tìm kiếm
  });

  // Event listener cho keypress (Enter)
  searchInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      // Hủy timeout debounce nếu có
      clearTimeout(searchDebounceTimeout);

      // Thực hiện tìm kiếm ngay lập tức
      const searchTerm = e.target.value.toLowerCase().trim();
      performSearch(searchTerm);
    }
  });
}

window.initializeSearch = initializeSearch;
