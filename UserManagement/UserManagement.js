// Load user data into the table
const API = "http://localhost:3000";





function findBorrowedBook() {
    // Lấy giá trị bookID từ input
    const bookID = document.getElementById("searchBook").value.trim();

    if (!bookID) {
        alert("Vui lòng nhập Mã sách!");
        return;
    }

    // Gọi API để lấy thông tin sách
    fetch(`${API}/books?bookID=${bookID}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Không tìm thấy sách với mã đã nhập!");
            }
            return response.json();
        })
        .then(book => {
            if (!book) {
                alert("Không tìm thấy sách!");
                return;
            }
            // Hiển thị thông tin sách trong modal
            displayBookDetails(book[0]);
        })
        .catch(error => {
            console.error("Error fetching book data:", error);
            alert("Không thể lấy thông tin sách. Vui lòng thử lại sau!");
        });
}

function displayBookDetails(book) {
    // Lấy modal và hiển thị
    const bookModal = document.getElementById("bookDetail");
    bookModal.style.display = "block";

    // Gán thông tin sách vào modal
    const modalContent = bookModal.querySelector(".bookModal-content");
    modalContent.innerHTML = `
        <img src="${book.imageUrl}" alt="Book Image" style="width:150px; height:auto;"/>
        <h2>${book.title || "Chưa có tiêu đề"}</h2>
        <p><strong>Mã sách:</strong> ${book.bookID}</p>
        <p><strong>Tác giả:</strong> ${book.author || "Không rõ"}</p>
        <p><strong>Thể loại:</strong> ${book.genre || "Không rõ"}</p>
        <p><strong>Ngày xuất bản:</strong> ${book.publishDate || "Không rõ"}</p>
        <p><strong>Tổng số lượng:</strong> ${book.totalQuantity || 0}</p>
        <p><strong>Số còn lại:</strong> ${book.availableQuantity || 0}</p>
        <p><strong>Đánh giá:</strong> ${book.rating || "Chưa có"}</p>
        <p><strong>Mô tả:</strong> ${book.description || "Không có mô tả"}</p>
    `;
}

function closeBookModal(modalId) {
    document.getElementById(modalId).style.display = "none";
}

function addBorrowedBook() {
    alert("Sách đã được thêm vào danh sách mượn!");
    closeBookModal("bookDetail");
}






// View user details and borrowed books from two different APIs (API_USER and API_BORROWED_BOOKS)
function viewUserDetails(userID) {
    // Fetch thông tin người dùng từ API_USER
    fetch(`${API}/users`)
        .then(response => response.json())
        .then(users => {
            // Tìm người dùng trong danh sách từ API_USER
            const user = users.find(u => u.userID === userID);
            if (user) {
                document.getElementById("userId").textContent = user.userID;
                document.getElementById("userName").textContent = user.username;

                // Fetch danh sách sách đã mượn từ API_BORROWED_BOOKS sử dụng userId
                return fetch(`${API}/borrowBooks?userID=${userID}`);
            } else {
                throw new Error("User not found!");
            }
        })
        .then(response => response.json())
        .then(borrowedBooks => {
            const booksTableBody = document.querySelector("#borrowedBooksTable tbody");
            booksTableBody.innerHTML = "";

            // Hiển thị danh sách sách đã mượn
            borrowedBooks.forEach(book => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${book.borrowID}</td>
                    <td>${book.bookID}</td>
                    <td>${book.booktitle}</td>
                    <td>${book.borrowdate}</td>
                    <td>${book.duedate}</td>
                    <td>
                      <button onclick="removeBorrowedBook(${userID}, ${book.borrowID})">Trả</button>
                    </td>
                `;
                booksTableBody.appendChild(row);
            });

            document.getElementById("userDetailsModal").style.display = "flex";
        })
        .catch(error => {
            console.error("Error fetching user data:", error);
            alert("Failed to load user details.");
        });
}
// Close modal
function closeModal(modalId) {
    document.getElementById(modalId).style.display = "none";
}




// Search for users by ID or Name 
function searchUser() {
    const query = document.getElementById("searchInput").value.toLowerCase();

    // Lấy dữ liệu từ API_USER (chỉ một API)
    fetch(`${API}/users`)
        .then(response => response.json())
        .then(users => {
            // Lọc dữ liệu theo query (ID hoặc Name)
            const filteredData = users.filter(item =>
                item.userID.toString().includes(query) || item.name.toLowerCase().includes(query)
            );
            // Tính toán phân trang 
            const totalItems = filteredData.length;
            const totalPages = Math.ceil(totalItems / pageSize);
            const startIndex = (currentPage - 1) * pageSize;
            const endIndex = Math.min(startIndex + pageSize, totalItems);
            const currentPageData = filteredData.slice(startIndex, endIndex);
            // Hiển thị dữ liệu
            renderTable(currentPageData);

            // Hiển thị phân trang
            renderPagination(totalPages);
        })
        .catch(error => {
            console.error('Error searching users:', error);
        });
}



// Các tham số phân trang
let currentPage = 1;
let pageSize = 5;  // Số lượng user mỗi trang
// Hàm load dữ liệu từ api
function loadUsers() {
    fetch(`${API}/users`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(users => {
            // Tính toán phân trang 
            const totalItems = users.length;
            const totalPages = Math.ceil(totalItems / pageSize);
            const startIndex = (currentPage - 1) * pageSize;
            const endIndex = Math.min(startIndex + pageSize, totalItems);
            const currentPageData = users.slice(startIndex, endIndex);

            // Hiển thị dữ liệu
            renderTable(currentPageData);

            // Hiển thị phân trang
            renderPagination(totalPages);
        })
        .catch(error => console.error('Error loading users:', error));
}



// Hàm render bảng
function renderTable(data) {
    const tableBody = document.querySelector("#userTable tbody");
    tableBody.innerHTML = ''; // Xóa bảng cũ trước khi vẽ lại

    data.forEach(item => {
        const row = document.createElement("tr");
        row.id = `${item.userID}`
        row.innerHTML = `
            <td>${item.userID}</td>
            <td>${item.username}</td>
            <td>${item.email}</td>
            <td>${item.name}</td>
            <td>${item.phone}</td>
            <td>${item.address}</td>
            <td>
                <button onclick="viewUserDetails(${item.userID})">Xem</button>
                <button onclick="deleteUser(${item.userID})">Xóa</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Hàm render phân trang
function renderPagination(totalPages) {
    const paginationContainer = document.getElementById("pagination");
    paginationContainer.innerHTML = ''; // Xóa các nút phân trang cũ

    // Tạo các nút phân trang
    for (let page = 1; page <= totalPages; page++) {
        const pageButton = document.createElement("button");
        pageButton.textContent = page;
        pageButton.disabled = (page === currentPage); // Đặt disabled cho trang hiện tại
        pageButton.addEventListener("click", () => {
            currentPage = page;  // Chuyển đến trang đã chọn
            loadUsers();          // Gọi lại loadUsers để cập nhật bảng và phân trang
        });
        paginationContainer.appendChild(pageButton);
    }
}

// Gọi hàm loadUsers khi trang tải xong
document.addEventListener("DOMContentLoaded", loadUsers);



