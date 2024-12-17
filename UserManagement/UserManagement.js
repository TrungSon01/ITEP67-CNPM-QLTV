// Load user data into the table
const API_USER = "http://localhost:3000/users"; // Thay bằng URL API của bạn
const API_ACCOUNT ="http://localhost:3000/accounts";
// Hàm lưu dữ liệu vào API_USER
function saveToAPIUser(userData) {
    return fetch(API_USER, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
    })
        .then(response => {
            if (!response.ok) throw new Error('Lưu dữ liệu thất bại!');
            return response.json();
        })
        .then(data => {
            console.log('Dữ liệu đã được lưu vào API_USER:', data);
            return data;
        });
}

// Add a new user
async function addUser() {
    const tableBody = document.querySelector("#userTable tbody");

    // Lấy dữ liệu từ cả API_USER và API_ACCOUNT
    const [users, accounts] = await Promise.all([fetch(API_USER).then(res => res.json()), fetch(API_ACCOUNT).then(res => res.json())]);

    // Tính toán ID người dùng mới dựa trên độ dài của dữ liệu từ cả API
    const newUserId = users.length + accounts.length + 1;

    // Tạo một dòng mới với các ô input
    const row = document.createElement("tr");

    // Thêm cột UserID tự động và các cột input khác
    row.innerHTML = `
      <td>${newUserId}</td> <!-- User ID tự động tăng -->
      <td>null</td>
      <td><input type="text" placeholder="Enter Name" class="input-field"></td>
      <td><input type="email" placeholder="Enter Email" class="input-field" id="emailInput"></td>
      <td>
        <select class="input-field" id="statusInput">
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </td>
    `;

    // Thêm dòng mới vào bảng
    tableBody.appendChild(row);

    // Lắng nghe sự kiện Enter cho tất cả các trường nhập liệu (input và select)
    const inputs = row.querySelectorAll("input");
    const statusSelect = row.querySelectorAll("select");
    
    // Lắng nghe sự kiện "Enter" để lưu người dùng ngay khi nhấn Enter
    [...inputs, ...statusSelect].forEach(element => {
        element.addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                event.preventDefault();  // Ngăn không cho form submit (nếu có)
                saveUser(row, newUserId);  // Lưu người dùng ngay khi nhấn Enter
            }
        });
    });
}

// Lưu thông tin người dùng khi nhấn Enter và đóng input
function saveUser(row, newUserId) {
    // Lấy tất cả các phần tử input và select trong dòng hiện tại
    const inputs = row.querySelectorAll('input');
    const statusSelect = row.querySelector('#statusInput'); // Lấy giá trị từ select

    // Kiểm tra nếu các phần tử được truy vấn đúng
    if (!inputs || !statusSelect) {
        alert("Error: Input elements not found!");
        return;
    }

    // Lấy giá trị từ các ô input
    const accountId="null"
    const name = inputs[0] ? inputs[0].value.trim() : ''; // Kiểm tra phần tử thứ hai có tồn tại không
    const email = inputs[1] ? inputs[1].value.trim() : ''; // Kiểm tra phần tử thứ ba có tồn tại không
    const status = statusSelect ? statusSelect.value : ''; // Lấy giá trị từ select status

    // Kiểm tra nếu tất cả các thông tin đều hợp lệ
    if ( !name || !email ) {
        alert("All fields are required!");
        return;
    }

    // Kiểm tra email hợp lệ
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(email)) {
        alert("Please enter a valid email!");
        return;
    }

    // Tạo đối tượng người dùng mới
    const newUser = {
        userId: newUserId, // Sử dụng ID tự động
        id: newUserId,  // Sử dụng ID tự động
        accountId,
        name,
        email,
        status,
        borrowedBooks: [],
    };

    // Thêm người dùng vào db.json
    saveToAPIUser(newUser);

    // Đóng các ô input sau khi nhấn Enter
    inputs.forEach(input => {
        input.setAttribute('readonly', true); // Chuyển các ô nhập liệu thành readonly
    });
    statusSelect.setAttribute('disabled', true); // Không cho chọn lại trạng thái
}

// Hàm chỉnh sửa người dùng
async function editUser(userId, API_USER) {
    try {
        // 1. Kiểm tra xem userId có tồn tại trong API_USER không
        const response = await fetch(`${API_USER}/${userId}`);
        if (!response.ok) {
            alert("Bạn không có quyền thay đổi thông tin này.");
            return;
        }

        const user = await response.json(); // Lấy thông tin user ban đầu

        // 2. Chọn hàng trong bảng dựa trên userId
        const row = document.querySelector(`#userTable tbody tr[id="${userId}"]`);
        if (!row) {
            alert("User not found in the table!");
            return;
        }

        const cells = row.children;

        // 3. Bật chế độ chỉnh sửa cho các ô Name và Email
        cells[2].setAttribute("contenteditable", "true"); // Name
        cells[3].setAttribute("contenteditable", "true"); // Email

        // 4. Chuyển ô Status thành một select
        const statusOptions = ["Active", "Inactive"];
        const currentStatus = user.status || "Inactive"; // Lấy trạng thái hiện tại từ user
        const select = document.createElement("select");

        statusOptions.forEach(option => {
            const optionElement = document.createElement("option");
            optionElement.value = option;
            optionElement.textContent = option;
            if (option === currentStatus) optionElement.selected = true;
            select.appendChild(optionElement);
        });

        cells[4].innerHTML = ""; // Xóa nội dung cũ
        cells[4].appendChild(select);

        // 5. Lắng nghe sự kiện Enter để lưu dữ liệu
        row.addEventListener("keydown", async function (event) {
            if (event.key === "Enter") {
                event.preventDefault(); // Ngăn chặn hành động mặc định khi nhấn Enter

                // Lấy dữ liệu từ ô chỉnh sửa hoặc giữ nguyên giá trị ban đầu nếu không thay đổi
                const updatedUser = {
                    userId: user.userId, // Giữ userId
                    accountId: user.accountId, // Giữ accountId
                    name: cells[2].innerText.trim() || user.name,
                    email: cells[3].innerText.trim() || user.email,
                    status: select.value || user.status,
                    borrowedBooks: user.borrowedBooks || [], // Giữ borrowedBooks
                };

                try {
                    // Gửi yêu cầu PUT đến API để cập nhật dữ liệu
                    const updateResponse = await fetch(`${API_USER}/${userId}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(updatedUser),
                    });

                    if (!updateResponse.ok) throw new Error("Failed to update user");

                    alert("User updated successfully!");
                    loadUsers(); // Tải lại bảng dữ liệu
                } catch (error) {
                    console.error("Error updating user:", error);
                    alert("An error occurred while updating the user.");
                }

                // Tắt chế độ chỉnh sửa và khôi phục trạng thái
                cells[2].removeAttribute("contenteditable");
                cells[3].removeAttribute("contenteditable");
                cells[4].innerText = select.value; // Hiển thị giá trị đã chọn
            }
        });
    } catch (error) {
        console.error("Error fetching user:", error);
        alert("Bạn không có quyền thay đổi thông tin này.");
    }
}



// Delete a user or account based on entity type
async function deleteUser(userId) {
    if (!confirm("Are you sure you want to delete this user or account?")) return;

    try {
        // Check if it's a user or account by fetching from both APIs
        const userResponse = await fetch(`${API_USER}/${userId}`);
        const accountResponse = await fetch(`${API_ACCOUNT}/${userId}`);
        
        if (userResponse.ok) {
            // If found in the user API
            const response = await fetch(`${API_USER}/${userId}`, { method: "DELETE" });
            if (!response.ok) throw new Error("Failed to delete user");
            alert("User deleted successfully!");
        } else if (accountResponse.ok) {
            // If found in the account API
            const response = await fetch(`${API_ACCOUNT}/${userId}`, { method: "DELETE" });
            if (!response.ok) throw new Error("Failed to delete account");
            alert("Account deleted successfully!");
        } else {
            alert("User or Account not found.");
            return;
        }

        loadUsers(); // Reload the table after deletion
    } catch (error) {
        console.error("Error deleting entity:", error);
        alert("Failed to delete entity.");
    }
}

// Search for users by ID or Name from both API_USER and API_ACCOUNT
function searchUser() {
    const query = document.getElementById("searchInput").value.toLowerCase();

    // Lấy dữ liệu từ cả 2 API
    Promise.all([fetch(API_USER), fetch(API_ACCOUNT)])
        .then(responses => Promise.all(responses.map(response => response.json())))
        .then(([users, accounts]) => {
            // Kết hợp dữ liệu từ cả 2 nguồn API
            const combinedData = [...users, ...accounts];

            // Lọc dữ liệu theo query (ID hoặc Name)
            const filteredData = combinedData.filter(item =>
                item.userId.toString().includes(query) || item.name.toLowerCase().includes(query)
            );

            // Cập nhật bảng với dữ liệu đã lọc
            const tableBody = document.querySelector("#userTable tbody");
            tableBody.innerHTML = "";  // Xóa các dòng cũ trong bảng

            // Thêm dữ liệu đã lọc vào bảng
            filteredData.forEach(item => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${item.userId}</td>
                    <td>${item.accountId || "null"}</td>
                    <td>${item.name}</td>
                    <td>${item.email}</td>
                    <td>${item.status}</td>
                    <td>
                        <button onclick="viewUserDetails(${item.userId})">View</button>
                        <button onclick="editUser(${item.userId})">Edit</button>
                        <button onclick="deleteUser(${item.userId})">Delete</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error searching users:', error);
        });
}


// View user details and borrowed books from two different APIs (API_USER and API_ACCOUNT)
function viewUserDetails(userId) {
    Promise.all([fetch(API_USER), fetch(API_ACCOUNT)])
        .then(responses => Promise.all(responses.map(response => response.json())))
        .then(([users, accounts]) => {
            // Tìm user trong cả hai nguồn API
            const user = [...users, ...accounts].find(u => u.userId === userId);
            if (user) {
                document.getElementById("userId").textContent = user.userId;
                document.getElementById("userName").textContent = user.name;

                const booksTableBody = document.querySelector("#borrowedBooksTable tbody");
                booksTableBody.innerHTML = "";

                // Hiển thị danh sách sách đã mượn từ user
                user.borrowedBooks.forEach(book => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                    <td>${book.bookId}</td>
                    <td>${book.title}</td>
                    <td>${book.borrowDate}</td>
                    <td>${book.dueDate}</td>
                    <td>
                      <button onclick="removeBorrowedBook(${userId}, ${book.bookId})">Remove</button>
                    </td>
                  `;
                    booksTableBody.appendChild(row);
                });

                document.getElementById("userDetailsModal").style.display = "flex";
            } else {
                alert("User not found!");
            }
        })
        .catch(error => {
            console.error("Error fetching user data:", error);
            alert("Failed to load user details.");
        });
}

//add book
function addBorrowedBook() {
    const userId = parseInt(document.getElementById("userId").textContent);

    // Lấy dữ liệu từ 2 API để tìm người dùng
    Promise.all([fetch(API_USER), fetch(API_ACCOUNT)])
        .then(responses => Promise.all(responses.map(response => response.json())))
        .then(([users, accounts]) => {
            // Tìm user trong cả hai nguồn API
            const userFromAPIUser = users.find(u => u.userId === userId);
            const userFromAPIAccount = accounts.find(u => u.userId === userId);

            const user = userFromAPIUser || userFromAPIAccount;
            const sourceAPI = userFromAPIUser ? 'API_USER' : 'API_ACCOUNT';  // Xác định nguồn API

            if (user) {
                let bookIdCounter = Math.max(...user.borrowedBooks.map(book => book.bookId), 0) + 1;
                const row = document.createElement("tr");

                // Add book ID cell
                const bookIdCell = document.createElement("td");
                bookIdCell.textContent = bookIdCounter; // Book ID
                row.appendChild(bookIdCell);

                // Add editable columns
                const titleCell = document.createElement("td");
                titleCell.setAttribute("contenteditable", "true");
                titleCell.innerHTML = "Enter Book Title";
                titleCell.addEventListener("click", function () {
                    titleCell.innerHTML = ""; // Clear the default text when clicked
                });

                const borrowDateCell = document.createElement("td");
                borrowDateCell.setAttribute("contenteditable", "true");
                borrowDateCell.innerHTML = "Enter Borrow Date (YYYY-MM-DD)";
                borrowDateCell.addEventListener("click", function () {
                    borrowDateCell.innerHTML = ""; // Clear the default text when clicked
                });

                const dueDateCell = document.createElement("td");
                dueDateCell.setAttribute("contenteditable", "true");
                dueDateCell.innerHTML = "Enter Due Date (YYYY-MM-DD)";
                dueDateCell.addEventListener("click", function () {
                    dueDateCell.innerHTML = ""; // Clear the default text when clicked
                });

                const actionsCell = document.createElement("td");
                actionsCell.innerHTML = `<button onclick="removeBorrowedBook(${userId}, ${bookIdCounter}, '${sourceAPI}')">Remove</button>`;

                row.appendChild(titleCell);
                row.appendChild(borrowDateCell);
                row.appendChild(dueDateCell);
                row.appendChild(actionsCell);

                const booksTableBody = document.querySelector("#borrowedBooksTable tbody");
                booksTableBody.appendChild(row);

                // Handle the "Enter" key to save the book data
                const saveBook = () => {
                    const title = titleCell.textContent;
                    const borrowDate = borrowDateCell.textContent;
                    const dueDate = dueDateCell.textContent;

                    const newBook = {
                        bookId: bookIdCounter++,
                        title,
                        borrowDate,
                        dueDate,
                    };

                    // Add new book to borrowedBooks array
                    user.borrowedBooks.push(newBook);

                    // Optional: Update the correct API with new book data
                    updateUserBooks(userId, user, sourceAPI);  // Cập nhật toàn bộ user
                    viewUserDetails(userId); // Refresh modal
                    alert("Book added successfully!");
                   
                    // Close contenteditable and clean up
                    titleCell.removeAttribute("contenteditable");
                    borrowDateCell.removeAttribute("contenteditable");
                    dueDateCell.removeAttribute("contenteditable");
                };

                // Listen for "Enter" key to save book data
                titleCell.addEventListener("keydown", function (event) {
                    if (event.key === "Enter") {
                        saveBook();
                    }
                });

                borrowDateCell.addEventListener("keydown", function (event) {
                    if (event.key === "Enter") {
                        saveBook();
                    }
                });

                dueDateCell.addEventListener("keydown", function (event) {
                    if (event.key === "Enter") {
                        saveBook();
                    }
                });
            }
        })
        .catch(error => {
            console.error("Error fetching user data:", error);
            alert("Failed to load user data.");
        });
}
// Function to update user books in both APIs based on source API
function updateUserBooks(userId, updatedUser, sourceAPI) {
    const url = sourceAPI === 'API_USER' ? `${API_USER}/${userId}` : `${API_ACCOUNT}/${userId}`;

    fetch(url, {
        method: "PUT",
        body: JSON.stringify(updatedUser),  // Cập nhật toàn bộ thông tin user, bao gồm borrowedBooks
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(data => console.log(`User updated in ${sourceAPI}`, data))
    .then(() => {
        // Sau khi cập nhật thành công, gọi lại viewUserDetails để làm mới thông tin người dùng
        viewUserDetails(userId);
    })
    .catch(error => console.error(`Error updating user in ${sourceAPI}`, error));
}

//remove book
function removeBorrowedBook(userId, bookId, sourceAPI) {
    // Lấy dữ liệu từ 2 API để tìm người dùng
    Promise.all([fetch(API_USER), fetch(API_ACCOUNT)])
        .then(responses => Promise.all(responses.map(response => response.json())))
        .then(([users, accounts]) => {
            // Tìm user trong cả hai nguồn API
            const userFromAPIUser = users.find(u => u.userId === userId);
            const userFromAPIAccount = accounts.find(u => u.userId === userId);

            // Xác định người dùng và nguồn API
            const user = userFromAPIUser || userFromAPIAccount;
            const userSourceAPI = userFromAPIUser ? 'API_USER' : 'API_ACCOUNT';

            if (user) {
                // Lọc bỏ cuốn sách với bookId đã cho
                user.borrowedBooks = user.borrowedBooks.filter(book => book.bookId !== bookId);

                // Cập nhật lại thông tin người dùng sau khi xóa sách
                updateUserBooks(userId, user, userSourceAPI); // Cập nhật thông tin sách mượn lên đúng API

                // Tải lại sách và cập nhật bảng
              

                // Thông báo thành công
                alert("Book removed successfully!");
            }
        })
        .then(() => {
            // Sau khi cập nhật thành công, gọi lại viewUserDetails để làm mới thông tin người dùng
            viewUserDetails(userId);
        })
        .catch(error => {
            console.error("Error fetching user data:", error);
            alert("Failed to load user data.");
        });
}


// Close modal
function closeModal(modalId) {
    document.getElementById(modalId).style.display = "none";
}

// Các tham số phân trang
let currentPage = 1;
let pageSize = 5;  // Số lượng user mỗi trang

// Hàm load dữ liệu từ 2 API và phân trang
function loadUsers() {
    Promise.all([fetch(API_USER), fetch(API_ACCOUNT)])
        .then(responses => Promise.all(responses.map(response => response.json())))
        .then(([users, accounts]) => {
            const combinedData = [...users, ...accounts]; // Kết hợp dữ liệu từ cả 2 API

            // Tính toán phân trang
            const totalItems = combinedData.length;
            const totalPages = Math.ceil(totalItems / pageSize);
            const startIndex = (currentPage - 1) * pageSize;
            const endIndex = Math.min(startIndex + pageSize, totalItems);
            const currentPageData = combinedData.slice(startIndex, endIndex);

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
        row.id =`${item.userId}` 
        row.innerHTML = `
            <td>${item.userId}</td>
            <td>${item.accountId || "null"}</td>
            <td>${item.name}</td>
            <td>${item.email}</td>
            <td>${item.status}</td>
            <td>
                <button onclick="viewUserDetails(${item.userId})">View</button>
                <button onclick="editUser(${item.userId},API_USER)">Edit</button>
                <button onclick="deleteUser(${item.userId})">Delete</button>
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





