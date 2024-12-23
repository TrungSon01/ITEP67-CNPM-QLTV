// Biến để theo dõi trạng thái sắp xếp hiện tại
let currentSortField = null;
let isAscending = true;

// Hàm khởi tạo sắp xếp
function initializeSort() {
  // Thêm các nút sắp xếp vào header của bảng
  const headerRow = document.querySelector("#bookTable thead tr");
  if (!headerRow) return; // Thoát nếu không tìm thấy header

  const headers = headerRow.querySelectorAll("th");

  // Thêm icon và xử lý sự kiện cho các cột có thể sắp xếp
  const sortableColumns = [
    { index: 0, field: "bookId", title: "ID" },
    { index: 1, field: "title", title: "Tên Sách" },
    { index: 3, field: "category", title: "Thể Loại" },
    { index: 5, field: "publishDate", title: "Ngày xuất bản" },
  ];

  sortableColumns.forEach((column) => {
    const header = headers[column.index];
    if (!header) return; // Kiểm tra header tồn tại

    const titleSpan = document.createElement("span");
    titleSpan.textContent = column.title;

    const sortIcon = document.createElement("i");
    sortIcon.className = "material-icons ml-1 text-gray-400 cursor-pointer";
    sortIcon.textContent = "import_export";
    sortIcon.style.fontSize = "18px";
    sortIcon.style.verticalAlign = "middle";

    // Xóa nội dung cũ và thêm các phần tử mới
    header.textContent = "";
    header.appendChild(titleSpan);
    header.appendChild(sortIcon);

    // Thêm sự kiện click
    sortIcon.addEventListener("click", () => handleSort(column.field));
  });
}

// Hàm xử lý sắp xếp
function handleSort(field) {
  // Đảo chiều sắp xếp nếu click vào cùng một trường
  if (currentSortField === field) {
    isAscending = !isAscending;
  } else {
    currentSortField = field;
    isAscending = true;
  }

  // Lấy danh sách sách cần sắp xếp (từ filteredBooks nếu có, không thì từ allBooks)
  const booksToSort = filteredBooks.length > 0 ? filteredBooks : allBooks;

  // Tạo bản sao của mảng để sắp xếp
  const sortedBooks = [...booksToSort];

  // Sắp xếp theo trường được chọn
  sortedBooks.sort((a, b) => {
    let comparison = 0;

    switch (field) {
      case "bookId":
        comparison = a.bookId - b.bookId;
        break;

      case "title":
        comparison = a.title.localeCompare(b.title, "vi");
        break;

      case "category":
        comparison = a.category.localeCompare(b.category, "vi");
        break;

      case "publishDate":
        comparison = new Date(a.publishDate) - new Date(b.publishDate);
        break;
    }

    // Đảo ngược kết quả nếu đang sắp xếp giảm dần
    return isAscending ? comparison : -comparison;
  });

  // Cập nhật danh sách đã sắp xếp
  if (filteredBooks.length > 0) {
    filteredBooks = sortedBooks;
  } else {
    allBooks = sortedBooks;
  }

  // Cập nhật hiển thị
  currentPage = 1;
  updateTableDisplay();

  // Cập nhật hiển thị icon sắp xếp
  updateSortIcons(field);
}

// Hàm cập nhật hiển thị icon sắp xếp
function updateSortIcons(activeField) {
  const headers = document.querySelectorAll("#bookTable th i.material-icons");
  headers.forEach((icon) => {
    // Reset về icon mặc định
    icon.textContent = "import_export";
    icon.classList.remove("text-green-500");
    icon.classList.add("text-gray-400");
  });

  // Tìm và cập nhật icon của cột đang được sắp xếp
  const activeHeader = Array.from(headers).find((icon) =>
    icon.parentElement.textContent.includes(
      activeField === "bookId"
        ? "ID"
        : activeField === "title"
        ? "Tên Sách"
        : activeField === "category"
        ? "Thể Loại"
        : "Ngày xuất bản"
    )
  );

  if (activeHeader) {
    activeHeader.textContent = isAscending ? "arrow_upward" : "arrow_downward";
    activeHeader.classList.remove("text-gray-400");
    activeHeader.classList.add("text-green-500");
  }
}

// Export hàm initializeSort để có thể gọi từ bên ngoài
window.initializeSort = initializeSort;
