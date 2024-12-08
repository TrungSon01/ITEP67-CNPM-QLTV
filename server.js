const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

// Static files - Đảm bảo thứ tự đúng
app.use("/Assets", express.static(path.join(__dirname, "Assets")));
app.use(
  "/BookManagement",
  express.static(path.join(__dirname, "BookManagement"))
);
app.use(express.static(path.join(__dirname, "loginRegister")));
app.use(express.static(path.join(__dirname, "Home")));

// Path to data files
const DATA_FILE = path.join(__dirname, "data.json");
const DATA_FILE_BOOK = path.join(__dirname, "BookManagement", "data_book.json");

// Kiểm tra và tạo file data.json nếu chưa tồn tại
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({ users: [] }, null, 2), "utf8");
}

// Kiểm tra và tạo file data_book.json nếu chưa tồn tại
if (!fs.existsSync(DATA_FILE_BOOK)) {
  try {
    fs.writeFileSync(
      DATA_FILE_BOOK,
      JSON.stringify({ book: [] }, null, 2),
      "utf8"
    );
    console.log("Created new data_book.json file");
  } catch (error) {
    console.error("Error creating data_book.json:", error);
  }
}

// Utility functions
function readData() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  } catch (error) {
    console.error("Error reading users data:", error);
    return { users: [] };
  }
}

function writeData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf8");
  } catch (error) {
    console.error("Error writing users data:", error);
    throw error;
  }
}

function readData_book() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE_BOOK, "utf8"));
  } catch (error) {
    console.error("Error reading book data:", error);
    return { book: [] };
  }
}

function writeData_book(data) {
  try {
    console.log("Writing to file:", DATA_FILE_BOOK);
    console.log("Data to write:", data);
    fs.writeFileSync(DATA_FILE_BOOK, JSON.stringify(data, null, 2), "utf8");
    console.log("Write successful");
  } catch (error) {
    console.error("Error writing book data:", error);
    throw error;
  }
}

// Basic Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "loginRegister", "loginRegister.html"));
});

app.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, "Home", "home.html"));
});

// User Authentication APIs
app.post("/register", (req, res) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const data = readData();
  const userExists = data.users.find(
    (user) => user.username === username || user.email === email
  );

  if (userExists) {
    return res
      .status(409)
      .json({ message: "Username or email already exists" });
  }

  data.users.push({ email, username, password });
  writeData(data);
  res.status(201).json({ message: "User registered successfully" });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Vui lòng điền đầy đủ email và mật khẩu!" });
  }

  const data = readData();
  const user = data.users.find(
    (user) => user.email === email && user.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Email hoặc mật khẩu không đúng!" });
  }

  res.status(200).json({ message: "Đăng nhập thành công!", user });
});

// ============================================== BOOK MANAGEMENT APIs ====================================================
app.get("/BookManagement", (req, res) => {
  res.sendFile(path.join(__dirname, "BookManagement", "BookManagement.html"));
});

app.get("/BookManagement/content", (req, res) => {
  res.sendFile(path.join(__dirname, "BookManagement", "content.html"));
});

app.get("/api/books", (req, res) => {
  try {
    const data = readData_book();
    res.json(data.book);
  } catch (error) {
    console.error("Error getting books:", error);
    res.status(500).json({ message: "Lỗi khi lấy danh sách sách" });
  }
});

app.get("/api/books/:id", (req, res) => {
  try {
    const bookId = parseInt(req.params.id);
    const data = readData_book();
    const book = data.book.find((b) => b.id === bookId);

    if (!book) {
      return res.status(404).json({ message: "Không tìm thấy sách" });
    }

    res.json(book);
  } catch (error) {
    console.error("Error getting book:", error);
    res.status(500).json({ message: "Lỗi khi lấy thông tin sách" });
  }
});

app.post("/api/books", (req, res) => {
  try {
    const newBook = req.body;
    if (
      !newBook.name ||
      !newBook.author ||
      !newBook.category ||
      !newBook.description ||
      !newBook.date ||
      !newBook.totalQuantity ||
      !newBook.availableQuantity
    ) {
      return res.status(400).json({ message: "Thông tin sách chưa đầy đủ" });
    }

    // Kiểm tra logic số lượng
    if (newBook.availableQuantity > newBook.totalQuantity) {
      return res.status(400).json({
        message: "Số lượng còn lại không thể lớn hơn tổng số lượng",
      });
    }

    // Đọc dữ liệu hiện tại
    const data = readData_book();

    // Kiểm tra trùng tên sách (không phân biệt hoa thường)
    const bookExists = data.book.some(
      (book) => book.name.toLowerCase() === newBook.name.toLowerCase()
    );

    if (bookExists) {
      return res.status(409).json({
        message: "Sách này đã tồn tại trong thư viện!",
      });
    }

    const newId = data.book.length
      ? Math.max(...data.book.map((b) => b.id)) + 1
      : 1;
    newBook.id = newId;

    data.book.push(newBook);
    writeData_book(data);
    res.status(201).json(newBook);
  } catch (error) {
    console.error("Error adding book:", error);
    res.status(500).json({ message: "Lỗi khi thêm sách" });
  }
});

app.put("/api/books/:id", (req, res) => {
  try {
    const bookId = parseInt(req.params.id);
    const updatedBook = req.body;
    const data = readData_book();
    const bookIndex = data.book.findIndex((book) => book.id === bookId);

    if (bookIndex === -1) {
      return res.status(404).json({ message: "Không tìm thấy sách" });
    }

    data.book[bookIndex] = {
      ...data.book[bookIndex],
      ...updatedBook,
      id: bookId,
    };
    writeData_book(data);
    res.json(data.book[bookIndex]);
  } catch (error) {
    console.error("Error updating book:", error);
    res.status(500).json({ message: "Lỗi khi cập nhật sách" });
  }
});

app.delete("/api/books/:id", (req, res) => {
  try {
    const bookId = parseInt(req.params.id);
    const data = readData_book();
    const bookIndex = data.book.findIndex((book) => book.id === bookId);

    if (bookIndex === -1) {
      return res.status(404).json({ message: "Không tìm thấy sách" });
    }

    const deletedBook = data.book.splice(bookIndex, 1)[0];
    writeData_book(data);
    res.json(deletedBook);
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).json({ message: "Lỗi khi xóa sách" });
  }
});
// ========================================== END BOOK MANAGEMENT APIs ================================

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
