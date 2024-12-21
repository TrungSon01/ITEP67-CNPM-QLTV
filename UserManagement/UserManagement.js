// Load user data into the table
const API = "http://localhost:3000";

///////////xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
function deleteUser(userID) {
    if (!confirm("Are you sure you want to delete this user?")) return;

    // Fetch the user details from the API
    fetch(`${API}/users?userID=${userID}`)
        .then(userResponse => {
            if (!userResponse.ok) {
                alert("User or Account not found.");
                throw new Error("User or Account not found.");
            }
            return userResponse.json();
        })
        .then(() => {
            // If user exists, proceed to delete
            return fetch(`${API}/users?userID=${userID}`, { method: "DELETE" });
        })
        .then(deleteResponse => {
            if (!deleteResponse.ok) {
                throw new Error("Failed to delete user");
            }
            alert("User deleted successfully!");
            loadUsers(); // Reload the table after deletion
        })
        .catch(error => {
            console.error("Error deleting entity:", error);
            alert("Failed to delete entity.");
        });
}

////xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx



//////////xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
// Xử lý nút Trả
function removeBorrowedBook(userID,borrowID, duedate) {
    // Xác nhận trả sách
    if (!confirm("Bạn có chắc chắn muốn trả cuốn sách này không?")) return;

    // Tính toán số ngày trễ hạn
    const currentDate = new Date();
    const dueDateObj = new Date(duedate);
    let lateDays = Math.ceil((currentDate - dueDateObj) / (1000 * 60 * 60 * 24)); // Đổi ms sang ngày

    if (lateDays > 0) {
        alert(`Số ngày trễ hạn: ${lateDays} ngày.`);
    } else {
        alert("Trả sách đúng hạn. Cảm ơn bạn!");
    }

    // Xóa dữ liệu khỏi bảng borrowBooks
    const table = document.getElementById("borrowedBooksTable");
    const rows = table.getElementsByTagName("tr");

    for (let i = 1; i < rows.length; i++) {
        const borrowIdCell = rows[i].getElementsByTagName("td")[0];
        if (borrowIdCell && parseInt(borrowIdCell.textContent) === borrowID) {
            table.deleteRow(i);
            break;
        }
    }

    // Gửi yêu cầu DELETE đến API (nếu cần thiết)
    fetch(`${API}/borrowBooks?borrowID=${borrowID}`, {
        method: "DELETE",
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Xóa dữ liệu thất bại!");
            }
            console.log("Dữ liệu đã được xóa thành công.");
        })
        .catch(error => {
            console.error("Lỗi khi xóa dữ liệu:", error);
            alert("Không thể xóa dữ liệu, vui lòng thử lại sau!");
        });
}

///////////xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx


function findBorrowedBook(userID) {
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
            displayBookDetails(book[0],userID);
        })
        .catch(error => {
            console.error("Error fetching book data:", error);
            alert("Không thể lấy thông tin sách. Vui lòng thử lại sau!");
        });
}

function displayBookDetails(book,userID) {
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
        <button onclick="addBorrowedBook(${userID})">Mượn</button>
    `;
}

function closeBookModal(modalId) {
    document.getElementById(modalId).style.display = "none";
}


/////////////////////////////////////////////////////////////////?????
fetch(`${API}/borrowBooks`)
    .then(response => response.json())
    .then(borrowedBooks => {
        currentBorrowID = borrowedBooks.reduce((maxID, book) => Math.max(maxID, book.borrowID), 0) ;
    });
////////////////////////////////////////////////////////////???????

function addBorrowedBook(userID) {
    // Lấy thông tin sách từ modal
    const bookModalContent = document.querySelector(".bookModal-content");

    // Lấy Mã sách (chuyển đổi sang kiểu int)
    const bookIDParagraph = bookModalContent.querySelector("p strong").parentNode;
    const bookID = parseInt(bookIDParagraph.textContent.replace("Mã sách:", "").trim(), 10); // Chuyển mã sách thành số nguyên

    // Lấy tên sách
    const booktitle = bookModalContent.querySelector("h2").textContent.trim(); // Lấy tên sách từ thẻ <h2>

    // Kiểm tra dữ liệu
    if (!bookID || !booktitle) {
        alert("Không có thông tin sách để mượn!");
        return;
    }

    // Thêm hàng mới vào bảng
    const booksTableBody = document.querySelector("#borrowedBooksTable tbody");

    // Tạo input để người dùng nhập ngày mượn
    const borrowDateInput = document.createElement("input");
    borrowDateInput.type = "date";
    borrowDateInput.addEventListener("change", () => {
        const borrowDate = new Date(borrowDateInput.value);
        const dueDate = new Date(borrowDate);
        dueDate.setDate(borrowDate.getDate() + 30); // Cộng thêm 30 ngày
        row.querySelector(".duedate").textContent = dueDate.toISOString().split("T")[0];
    });

    // Tạo hàng mới
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${currentBorrowID}</td>
        <td>${bookID}</td>
        <td>${booktitle}</td>
        <td></td> <!-- Sẽ được thay thế bằng borrowDateInput -->
        <td class="duedate"></td>
        <td>
            <button onclick="removeBorrowedBook(${currentBorrowID})">Trả</button>
        </td>
    `;
    row.cells[3].appendChild(borrowDateInput); // Gắn borrowDateInput vào ô thứ 4 (Ngày mượn)
    booksTableBody.appendChild(row);

    // Chờ người dùng nhập ngày mượn và tự động cập nhật ngày trả
    borrowDateInput.addEventListener("change", () => {
        const borrowDate = new Date(borrowDateInput.value);
        const dueDate = new Date(borrowDate);
        dueDate.setDate(borrowDate.getDate() + 30); // Cộng thêm 30 ngày
        // Cập nhật lại duedate trong bảng
        row.querySelector(".duedate").textContent = dueDate.toISOString().split("T")[0];
        
        // Cập nhật ngày mượn và ngày trả vào cơ sở dữ liệu
        const borrowData = {
            userID: userID,
            borrowID: currentBorrowID,
            bookID: bookID,
            booktitle: booktitle,
            borrowdate: borrowDate.toISOString().split("T")[0], // Chuyển đổi ngày mượn sang định dạng YYYY-MM-DD
            duedate: dueDate.toISOString().split("T")[0] // Chuyển đổi ngày trả sang định dạng YYYY-MM-DD
        };

        // Lưu vào API borrowBooks
        fetch(`${API}/borrowBooks`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(borrowData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Không thể thêm mượn sách vào API!");
            }
            return response.json();
        })
        .then(() => {
            alert("Sách đã được thêm vào danh sách mượn!");
        })
        .catch(error => {
            console.error("Error adding borrowed book:", error);
            alert("Không thể thêm sách vào danh sách mượn. Vui lòng thử lại sau!");
        });
    });

/////////////////?????????????????????????????????????????????????
    // Tăng BorrowID
    currentBorrowID++;
/////////////////////////////?????????????????????????????????????

    // Đóng modal
    closeBookModal("bookDetail");
}

///////////////////////////////////


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
                      <button onclick="removeBorrowedBook(${userID}, ${book.borrowID},${book.duedate})">Trả</button>
                    </td>
                `;
                booksTableBody.appendChild(row);
            });

            ///////////////////
            //Lấy nút và thêm sự kiện click
            document.getElementById("findbook").addEventListener("click", function() {
                findBorrowedBook(userID) // Truyền tham số vào phương thức A khi click
            });
             ////////////////////////////

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



