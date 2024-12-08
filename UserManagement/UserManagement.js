// Sample data for demonstration
let users = [
  { userId: 1, accountId: 101, name: "John Doe", email: "john@example.com", status: "Active", borrowedBooks: [] },
  { userId: 2, accountId: null, name: "Jane Smith", email: "jane@example.com", status: "Inactive", borrowedBooks: [] },
];

let bookIdCounter = 1;

// Load user data into the table
function loadUsers() {
  const tableBody = document.querySelector("#userTable tbody");
  tableBody.innerHTML = "";

  users.forEach(user => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${user.userId}</td>
      <td>${user.accountId || "null"}</td>
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.status}</td>
      <td>
        <button onclick="viewUserDetails(${user.userId})">View</button>
        <button onclick="editUser(${user.userId})">Edit</button>
        <button onclick="deleteUser(${user.userId})">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// Add a new user
function openAddUserModal() {
  const name = prompt("Enter Name:");
  const email = prompt("Enter Email:");
  const accountId = prompt("Enter Account ID (leave blank for null):");
  const status = prompt("Enter Status (Active/Inactive):");

  if (name && email && status) {
    const newUser = {
      userId: users.length + 1,
      accountId: accountId ? parseInt(accountId) : null,
      name,
      email,
      status,
      borrowedBooks: [],
    };
    users.push(newUser);
    loadUsers();
    alert("User added successfully!");
  } else {
    alert("All fields are required!");
  }
}

// Edit an existing user
function editUser(userId) {
  const user = users.find(u => u.userId === userId);
  if (user) {
    const name = prompt("Edit Name:", user.name);
    const email = prompt("Edit Email:", user.email);
    const accountId = prompt("Edit Account ID:", user.accountId || "null");
    const status = prompt("Edit Status (Active/Inactive):", user.status);

    if (name && email && status) {
      user.name = name;
      user.email = email;
      user.accountId = accountId ? parseInt(accountId) : null;
      user.status = status;
      loadUsers();
      alert("User updated successfully!");
    } else {
      alert("All fields are required!");
    }
  }
}

// Delete a user
function deleteUser(userId) {
  const confirmDelete = confirm("Are you sure you want to delete this user?");
  if (confirmDelete) {
    users = users.filter(user => user.userId !== userId);
    loadUsers();
    alert("User deleted successfully!");
  }
}

// Search for users by ID or Name
function searchUser() {
  const query = document.getElementById("searchInput").value.toLowerCase();
  const filteredUsers = users.filter(user =>
    user.userId.toString().includes(query) || user.name.toLowerCase().includes(query)
  );

  const tableBody = document.querySelector("#userTable tbody");
  tableBody.innerHTML = "";

  filteredUsers.forEach(user => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${user.userId}</td>
      <td>${user.accountId || "null"}</td>
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.status}</td>
      <td>
        <button onclick="viewUserDetails(${user.userId})">View</button>
        <button onclick="editUser(${user.userId})">Edit</button>
        <button onclick="deleteUser(${user.userId})">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// View user details and borrowed books
function viewUserDetails(userId) {
  const user = users.find(u => u.userId === userId);
  if (user) {
    document.getElementById("userId").textContent = user.userId;
    document.getElementById("userName").textContent = user.name;

    const booksTableBody = document.querySelector("#borrowedBooksTable tbody");
    booksTableBody.innerHTML = "";

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
  }
}

// Add a borrowed book
function addBorrowedBook() {
  const userId = parseInt(document.getElementById("userId").textContent);
  const user = users.find(u => u.userId === userId);

  if (user) {
    const title = prompt("Enter Book Title:");
    const borrowDate = prompt("Enter Borrow Date (YYYY-MM-DD):");
    const dueDate = prompt("Enter Due Date (YYYY-MM-DD):");

    if (title && borrowDate && dueDate) {
      const newBook = {
        bookId: bookIdCounter++,
        title,
        borrowDate,
        dueDate,
      };
      user.borrowedBooks.push(newBook);
      viewUserDetails(userId); // Refresh modal
      alert("Book added successfully!");
    } else {
      alert("All fields are required!");
    }
  }
}

// Remove a borrowed book
function removeBorrowedBook(userId, bookId) {
  const user = users.find(u => u.userId === userId);
  if (user) {
    user.borrowedBooks = user.borrowedBooks.filter(book => book.bookId !== bookId);
    viewUserDetails(userId); // Refresh modal
    alert("Book removed successfully!");
  }
}

// Close modal
function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none";
}

// Initialize table on page load
document.addEventListener("DOMContentLoaded", loadUsers);
