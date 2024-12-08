CREATE DATABASE QLTV CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
use QLTV;
CREATE TABLE THELOAI (
    MATL VARCHAR(20) PRIMARY KEY,
    TENTL VARCHAR(50) NOT NULL
);

CREATE TABLE SACH (
    MASACH VARCHAR(20) PRIMARY KEY,
    TENSACH VARCHAR(100) NOT NULL,
    TACGIA VARCHAR(50),
    NXB VARCHAR(50),
    NAMXB DATE,
    SOLUONGQUYEN INT NOT NULL,
    TINHTRANG VARCHAR(50),
    MATL VARCHAR(20),
    FOREIGN KEY (MATL) REFERENCES THELOAI(MATL) ON DELETE CASCADE ON UPDATE CASCADE
    
);


CREATE TABLE TACGIA (
    MATG VARCHAR(20) PRIMARY KEY,
    TENTG VARCHAR(100) NOT NULL
);

CREATE TABLE KHACHHANG (
    MAKH VARCHAR(20) PRIMARY KEY,
    TENKH VARCHAR(50) NOT NULL,
    GIOITINH VARCHAR(5),
    NGAYSINH DATE,
    DIACHI VARCHAR(100),
    SDT VARCHAR(15),
    EMAIL VARCHAR(50),
    TRANGTHAI VARCHAR(20),
    SOLUONGMUON INT
);

CREATE TABLE THUTHU (
    MATT VARCHAR(20) PRIMARY KEY,
    TENTT VARCHAR(50) NOT NULL,
    NGAYSINH DATE,
    DIACHI VARCHAR(100),
    SDT VARCHAR(15),
    EMAIL VARCHAR(50),
    TENDN VARCHAR(50),
    MATKHAU VARCHAR(50) NOT NULL,
    VAITRO VARCHAR(20) NOT NULL
);

CREATE TABLE PHIEUMUON (
    MAPM INT PRIMARY KEY AUTO_INCREMENT,
    MAKH VARCHAR(20) NOT NULL,
    MATT VARCHAR(20),
    NGAYMUON DATE NOT NULL,
    NGAYTRA DATE,
    TRANGTHAI VARCHAR(20),
    FOREIGN KEY (MAKH) REFERENCES KHACHHANG(MAKH) ON DELETE NO ACTION ON UPDATE CASCADE,
    FOREIGN KEY (MATT) REFERENCES THUTHU(MATT)
);

CREATE TABLE CTPHIEUMUON (
    MAPM INT NOT NULL,
    MASACH VARCHAR(20) NOT NULL,
    TINHTRANGSACH VARCHAR(50),
    TIENPHAT INT,
    NGAYTHUCTRA DATE,
    PRIMARY KEY (MAPM, MASACH),
    FOREIGN KEY (MAPM) REFERENCES PHIEUMUON(MAPM) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (MASACH) REFERENCES SACH(MASACH) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE PHIEUTRA (
    MAPM INT NOT NULL,
    MASACH VARCHAR(20) NOT NULL,
    TIENPHAT INT,
    NGAYTRASACH DATE,
    PRIMARY KEY (MAPM, MASACH),
    FOREIGN KEY (MAPM) REFERENCES PHIEUMUON(MAPM) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (MASACH) REFERENCES SACH(MASACH) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE NXB (
    MANXB VARCHAR(20) PRIMARY KEY,
    TENNXB VARCHAR(100) NOT NULL,
    DIACHI VARCHAR(100),
    SDT VARCHAR(15)
);

CREATE TABLE LOGIN (
    USERNAME VARCHAR(50) PRIMARY KEY,
    PASSWORD VARCHAR(50) NOT NULL,
    ROLE VARCHAR(20) NOT NULL
);

CREATE TABLE LICHSUMUON (
    MAKH VARCHAR(20) NOT NULL,
    MAPM INT NOT NULL,
    NGAYMUON DATE NOT NULL,
    NGAYTRA DATE,
    TRANGTHAI VARCHAR(20),
    PRIMARY KEY (MAKH, MAPM),
    FOREIGN KEY (MAKH) REFERENCES KHACHHANG(MAKH) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (MAPM) REFERENCES PHIEUMUON(MAPM) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE PHIPHAT (
    MAPM INT NOT NULL,
    SOTIENPHAT INT NOT NULL,
    LYDO VARCHAR(100),
    NGAYNOP DATE,
    PRIMARY KEY (MAPM),
    FOREIGN KEY (MAPM) REFERENCES PHIEUMUON(MAPM) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE DANHGIA (
    MADG INT PRIMARY KEY AUTO_INCREMENT, -- Mã đánh giá, tự động tăng
    MASACH VARCHAR(20) NOT NULL,         -- Mã sách (khóa ngoại)
    MAKH VARCHAR(20) NOT NULL,           -- Mã khách hàng (khóa ngoại)
    SO_STAR INT CHECK (SO_STAR BETWEEN 1 AND 5), -- Số sao đánh giá (từ 1 đến 5)
    NOIDUNG TEXT,                        -- Nội dung đánh giá
    NGAYDG DATE NOT NULL,                -- Ngày đánh giá
    FOREIGN KEY (MASACH) REFERENCES SACH(MASACH) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (MAKH) REFERENCES KHACHHANG(MAKH) ON DELETE CASCADE ON UPDATE CASCADE
);


ALTER TABLE SACH ADD MANXB VARCHAR(20), 
ADD FOREIGN KEY (MANXB) REFERENCES NXB(MANXB) ON DELETE SET NULL ON UPDATE CASCADE;


CREATE TABLE KhuVuc (
    MAKV VARCHAR(20) PRIMARY KEY,      
    TENKV VARCHAR(100) NOT NULL,        
    MOTA VARCHAR(200)                   
);

ALTER TABLE SACH
ADD MAKV VARCHAR(20),                  
ADD FOREIGN KEY (MAKV) REFERENCES KhuVuc(MAKV) 
ON DELETE SET NULL ON UPDATE CASCADE;    

-- SINH DU LIEU CHO BANG 
INSERT INTO THELOAI (MATL, TENTL) VALUES 
('TL001', 'Khoa học'),
('TL002', 'Văn học cổ điển'),
('TL003', 'Công nghệ thông tin'),
('TL004', 'Truyện tranh'),
('TL005', 'Tiểu thuyết');



INSERT INTO TACGIA (MATG, TENTG) VALUES
('TG001', 'Nguyễn Du'),
('TG002', 'Lev Tolstoy'),
('TG003', 'Stephen Hawking'),
('TG004', 'J.K. Rowling'),
('TG005', 'Masashi Kishimoto'),
('TG006', 'Carl Sagan');


INSERT INTO KHACHHANG (MAKH, TENKH, GIOITINH, NGAYSINH, DIACHI, SDT, EMAIL, TRANGTHAI, SOLUONGMUON) VALUES
('KH001', 'Nguyễn Văn A', 'Nam', '1990-05-15', 'Hà Nội', '0912345678', 'nguyenvana@gmail.com', 'Hoạt động', 2),
('KH002', 'Trần Thị B', 'Nữ', '1985-10-22', 'Hồ Chí Minh', '0912345679', 'tranthib@gmail.com', 'Hoạt động', 3),
('KH003', 'Lê Văn C', 'Nam', '1993-03-12', 'Đà Nẵng', '0912345680', 'levanc@gmail.com', 'Hoạt động', 1),
('KH004', 'Phạm Thị D', 'Nữ', '2000-07-07', 'Cần Thơ', '0912345681', 'phamthid@gmail.com', 'Hoạt động', 0),
('KH005', 'Ngô Văn E', 'Nam', '1995-02-28', 'Hải Phòng', '0912345682', 'ngovane@gmail.com', 'Hoạt động', 4),
('KH006', 'Đỗ Thị F', 'Nữ', '1997-09-09', 'Quảng Ninh', '0912345683', 'dothif@gmail.com', 'Hoạt động', 1),
('KH007', 'Vũ Văn G', 'Nam', '1988-11-11', 'Bình Dương', '0912345684', 'vuvang@gmail.com', 'Hoạt động', 2),
('KH008', 'Hoàng Thị H', 'Nữ', '1992-12-25', 'Thái Nguyên', '0912345685', 'hoangthih@gmail.com', 'Hoạt động', 3),
('KH009', 'Phan Văn I', 'Nam', '1984-08-30', 'Nghệ An', '0912345686', 'phanvani@gmail.com', 'Hoạt động', 5),
('KH010', 'Bùi Thị K', 'Nữ', '1996-04-17', 'Huế', '0912345687', 'buithik@gmail.com', 'Hoạt động', 2);


INSERT INTO THUTHU (MATT, TENTT, NGAYSINH, DIACHI, SDT, EMAIL, TENDN, MATKHAU, VAITRO)
VALUES 
('TT001', 'Nguyễn Văn A', '1985-03-12', '123 Đường A, TP. Hà Nội', '0981234567', 'nguyenvana@gmail.com', 'nguyenvana@gmail.com','matkhau123', 'Thủ thư trưởng'),
('TT002', 'Trần Thị B', '1990-07-05', '456 Đường B, TP. Đà Nẵng', '0972345678', 'tranthib@gmail.com',  'tranthib@gmail.com','matkhau456', 'Thủ thư'),
('TT003', 'Lê Minh C', '1995-11-23', '789 Đường C, TP. Hồ Chí Minh', '0963456789', 'leminhc@gmail.com', 'leminhc@gmail.com','matkhau789', 'Thủ thư');


INSERT INTO PHIEUMUON (MAKH, MATT, NGAYMUON, NGAYTRA, TRANGTHAI)
VALUES 
('KH001', 'TT001', '2024-10-01', '2024-10-15', 'Chưa trả'),
('KH002', 'TT002', '2024-10-02', '2024-10-16', 'Chưa trả'),
('KH003', 'TT003', '2024-10-03', '2024-10-17', 'Chưa trả'),
('KH004', 'TT001', '2024-10-04', '2024-10-18', 'Chưa trả'),
('KH005', 'TT002', '2024-10-05', '2024-10-19', 'Chưa trả'),
('KH006', 'TT003', '2024-10-06', '2024-10-20', 'Chưa trả'),
('KH007', 'TT001', '2024-10-07', '2024-10-21', 'Chưa trả'),
('KH008', 'TT002', '2024-10-08', '2024-10-22', 'Chưa trả');



INSERT INTO NXB (MANXB, TENNXB, DIACHI, SDT) VALUES
('NXB001', 'Nhà xuất bản Văn Học', 'Hà Nội', '0123456785'),
('NXB002', 'Nhà xuất bản Giáo Dục', 'Đà Nẵng', '0987654325'),
('NXB003', 'Nhà xuất bản Chính Trị', 'Hồ Chí Minh', '0123456786'),
('NXB004', 'Nhà xuất bản Khoa Học', 'Nha Trang', '0987654326');

INSERT INTO KhuVuc (MAKV, TENKV, MOTA) VALUES
('KHU1', 'Khu Truyện', 'Khu vực dành cho các loại truyện'),
('KHU2', 'Khu Khoa Học', 'Khu vực dành cho sách khoa học'),
('KHU3', 'Khu Lịch Sử', 'Khu vực dành cho sách lịch sử'),
('KHU4', 'Khu Văn Học', 'Khu vực dành cho sách văn học'),
('KHU5', 'Khu Giáo Dục', 'Khu vực dành cho sách giáo dục');


INSERT INTO SACH (MASACH, TENSACH, TACGIA, NXB, NAMXB, TINHTRANG, MATL, MANXB, MAKV, SOLUONGQUYEN) VALUES 
('S001', 'Vũ Trụ Và Những Điều Kỳ Thú', 'Carl Sagan', 'NXB Khoa Học', '2019-02-10', 'Mới', 'TL001', 'NXB001', 'KHU1', 5),
('S002', 'Lý Thuyết Vạn Vật', 'Stephen Hawking', 'NXB Khoa Học', '2020-05-25', 'Cũ', 'TL001', 'NXB001', 'KHU1', 3),
('S003', 'Chiến Tranh và Hòa Bình', 'Lev Tolstoy', 'NXB Văn Học', '2005-11-13', 'Mới', 'TL002', 'NXB002', 'KHU2', 7),
('S004', 'Truyện Kiều', 'Nguyễn Du', 'NXB Văn Học', '1998-01-01', 'Cũ', 'TL002', 'NXB002', 'KHU2', 10),
('S005', 'Lập Trình Python Cơ Bản', 'Nguyễn Văn A', 'NXB Công Nghệ', '2023-03-12', 'Mới', 'TL003', 'NXB003', 'KHU2', 15),
('S006', 'Nhập Môn AI', 'Trần B', 'NXB Công Nghệ', '2021-07-21', 'Mới', 'TL003', 'NXB003', 'KHU2', 10),
('S007', 'Doraemon Tập 1', 'Fujiko F. Fujio', 'NXB Kim Đồng', '2017-06-01', 'Mới', 'TL004', 'NXB004', 'KHU1', 20),
('S008', 'Naruto Tập 5', 'Masashi Kishimoto', 'NXB Kim Đồng', '2018-08-10', 'Mới', 'TL004', 'NXB004', 'KHU1', 25),
('S009', 'Truyện Tranh Conan Tập 15', 'Gosho Aoyama', 'NXB Kim Đồng', '2022-12-24', 'Mới', 'TL004', 'NXB004', 'KHU1', 30),
('S010', 'Truyện Tranh Bảy Viên Ngọc Rồng', 'Akira Toriyama', 'NXB Kim Đồng', '2020-04-10', 'Mới', 'TL004', 'NXB004', 'KHU1', 15),
('S011', 'Tiểu Thuyết Harry Potter', 'J.K. Rowling', 'NXB Trẻ', '2010-05-15', 'Mới', 'TL005', 'NXB002', 'KHU3', 12),
('S012', 'The Great Gatsby', 'F. Scott Fitzgerald', 'NXB Văn Học', '2019-09-12', 'Mới', 'TL002', 'NXB002', 'KHU2', 8),
('S013', 'Nghệ Thuật Tư Duy Phản Biện', 'Edward de Bono', 'NXB Tri Thức', '2019-10-10', 'Mới', 'TL001', 'NXB001', 'KHU3', 10),
('S014', 'Lập Trình Java Nâng Cao', 'Lê C', 'NXB Công Nghệ', '2020-11-20', 'Mới', 'TL003', 'NXB003', 'KHU2', 20),
('S015', 'Tiểu Thuyết Sông Đông Êm Đềm', 'Mikhail Sholokhov', 'NXB Văn Học', '2005-01-01', 'Cũ', 'TL005', 'NXB001', 'KHU2', 6),
('S016', 'Lược Sử Thời Gian', 'Stephen Hawking', 'NXB Khoa Học', '1999-09-21', 'Mới', 'TL001', 'NXB001', 'KHU1', 5),
('S017', 'Tiếng Chim Hót Trong Bụi Mận Gai', 'Colleen McCullough', 'NXB Trẻ', '2010-08-12', 'Cũ', 'TL005', 'NXB002', 'KHU3', 7),
('S018', 'Hạt Giống Tâm Hồn', 'Nhiều Tác Giả', 'NXB Trẻ', '2015-03-14', 'Mới', 'TL002', 'NXB002', 'KHU2', 20),
('S019', 'Hành Trình Về Phương Đông', 'Baird T. Spalding', 'NXB Tri Thức', '2017-07-07', 'Mới', 'TL002', 'NXB002', 'KHU2', 18),
('S020', 'Sức Mạnh Tiềm Thức', 'Joseph Murphy', 'NXB Tri Thức', '2019-11-30', 'Mới', 'TL005', 'NXB004', 'KHU3', 15);

INSERT INTO PHIPHAT (MAPM, SOTIENPHAT, LYDO, NGAYNOP) VALUES
(1, 10000, 'Trả trễ', '2024-10-16'),
(2, 15000, 'Trả trễ', '2024-10-17'),
(3, 20000, 'Trả trễ', '2024-10-18'),
(4, 12000, 'Trả trễ', '2024-10-19'),
(5, 18000, 'Trả trễ', '2024-10-20'),
(6, 25000, 'Trả trễ', '2024-10-21'),
(7, 30000, 'Trả trễ', '2024-10-22'),
(8, 5000, 'Trả trễ', '2024-10-23');

INSERT INTO LICHSUMUON (MAKH, MAPM, NGAYMUON, NGAYTRA, TRANGTHAI) VALUES
('KH001', 1, '2024-10-01', '2024-10-15', 'Hoàn thành'),
('KH002', 2, '2024-10-02', '2024-10-16', 'Hoàn thành'),
('KH003', 3, '2024-10-03', '2024-10-17', 'Hoàn thành'),
('KH004', 4, '2024-10-04', '2024-10-18', 'Hoàn thành'),
('KH005', 5, '2024-10-05', '2024-10-19', 'Hoàn thành'),
('KH006', 6, '2024-10-06', '2024-10-20', 'Hoàn thành'),
('KH007', 7, '2024-10-07', '2024-10-21', 'Hoàn thành'),
('KH008', 8, '2024-10-08', '2024-10-22', 'Hoàn thành');


INSERT INTO CTPHIEUMUON (MAPM, MASACH, TINHTRANGSACH, TIENPHAT, NGAYTHUCTRA) VALUES
(1, 'S001', 'Còn mới', 0, '2024-10-15'),  
(1, 'S002', 'Còn mới', 0, '2024-10-15'),  
(2, 'S003', 'Còn mới', 0, '2024-10-16'), 
(2, 'S004', 'Còn mới', 0, '2024-10-16'), 
(3, 'S005', 'Còn mới', 0, '2024-10-17'),  
(4, 'S001', 'Còn mới', 0, '2024-10-18'),  
(4, 'S006', 'Còn mới', 0, '2024-10-18'), 
(5, 'S002', 'Còn mới', 0, '2024-10-19'),  
(5, 'S003', 'Còn mới', 0, '2024-10-19'),  
(6, 'S004', 'Còn mới', 0, '2024-10-20'),
(7, 'S005', 'Còn mới', 0, '2024-10-21'), 
(8, 'S006', 'Còn mới', 0, '2024-10-22');  

INSERT INTO DANHGIA (MASACH, MAKH, SO_STAR, NOIDUNG, NGAYDG) VALUES
('S001', 'KH001', 5, 'Một tác phẩm tuyệt vời, rất cảm động!', '2024-10-01'),  
('S003', 'KH003', 3, 'Câu chuyện thú vị nhưng có phần nhàm chán.', '2024-10-03'),  
('S004', 'KH004', 5, 'Lịch sử Việt Nam rất hấp dẫn!', '2024-10-04'),  
('S005', 'KH005', 4, 'Khoa học thú vị, dễ hiểu.', '2024-10-05'),  
('S006', 'KH006', 5, 'Sách tâm lý rất hay, giúp tôi hiểu bản thân hơn.', '2024-10-06'),  
('S001', 'KH007', 4, 'Truyện Kiều là một tác phẩm kinh điển.', '2024-10-07'),  
('S002', 'KH008', 3, 'Lão Hạc có nhiều tình tiết buồn.', '2024-10-08'), 
('S003', 'KH009', 5, 'Nội dung sâu sắc, rất đáng đọc.', '2024-10-09'),  
('S004', 'KH010', 2, 'Câu chuyện không có nhiều điều mới.', '2024-10-10');  


INSERT INTO PHIEUTRA (MAPM, MASACH, TIENPHAT, NGAYTRASACH) VALUES
(1, 'S001', 0, '2024-10-15'),
(2, 'S002', 0, '2024-10-16'),
(3, 'S003', 0, '2024-10-17'),
(4, 'S004', 0, '2024-10-18'),
(5, 'S005', 0, '2024-10-19'),
(6, 'S006', 0, '2024-10-20'),
(7, 'S001', 0, '2024-10-21'),
(8, 'S002', 0, '2024-10-22');

--      TRIGGER ---------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- ĐĂNG KÝ MỘT KHÁCH HÀNG VÀ XÓA ĐI MỘT KHÁCH HÀNG
DELIMITER //

CREATE TRIGGER AfterInsertLogin
AFTER INSERT ON LOGIN
FOR EACH ROW
BEGIN
    INSERT INTO KHACHHANG (MAKH, TENKH, GIOITINH, NGAYSINH, DIACHI, SDT, EMAIL, TRANGTHAI, SOLUONGMUON)
    VALUES (NEW.USERNAME, NEW.USERNAME, NULL, NULL, NULL, NULL, NULL, 'Active', 0);
END;

//

DELIMITER ;

DELIMITER //

CREATE TRIGGER BeforeDeleteLogin
BEFORE DELETE ON LOGIN
FOR EACH ROW
BEGIN
    DELETE FROM KHACHHANG WHERE MAKH = OLD.USERNAME;
END;

//

DELIMITER ;


-- TRIGGER ĐỂ THÊM SÁCH KHI THIW VIỆN CẬP NHẬT SÁCH MỚI
CREATE TABLE THAYDOI_SACH (
    LOG_ID INT AUTO_INCREMENT PRIMARY KEY,
    MASACH VARCHAR(20),
    TENSACH VARCHAR(100),
    TACGIA VARCHAR(50),
    NXB VARCHAR(50),
    NAMXB DATE,
    SOLUONGQUYEN INT,
    TINHTRANG VARCHAR(50),
    MATL VARCHAR(20),
    MANXB VARCHAR(20),
    MAKV VARCHAR(20),
    THOIGIAN_THAY_DOI DATETIME DEFAULT CURRENT_TIMESTAMP,
    LOAI_THAY_DOI VARCHAR(20) -- 'UPDATE' hoặc 'DELETE'
);

DELIMITER //

CREATE TRIGGER BeforeUpdateSACH
BEFORE UPDATE ON SACH
FOR EACH ROW
BEGIN
    INSERT INTO THAYDOI_SACH (MASACH, TENSACH, TACGIA, NXB, NAMXB, SOLUONGQUYEN, TINHTRANG, MATL, MANXB, MAKV, LOAI_THAY_DOI)
    VALUES (OLD.MASACH, OLD.TENSACH, OLD.TACGIA, OLD.NXB, OLD.NAMXB, OLD.SOLUONGQUYEN, OLD.TINHTRANG, OLD.MATL, OLD.MANXB, OLD.MAKV, 'UPDATE');
END;
//

DELIMITER ;
DELIMITER //

CREATE TRIGGER BeforeDeleteSACH
BEFORE DELETE ON SACH
FOR EACH ROW
BEGIN
    INSERT INTO THAYDOI_SACH (MASACH, TENSACH, TACGIA, NXB, NAMXB, SOLUONGQUYEN, TINHTRANG, MATL, MANXB, MAKV, LOAI_THAY_DOI)
    VALUES (OLD.MASACH, OLD.TENSACH, OLD.TACGIA, OLD.NXB, OLD.NAMXB, OLD.SOLUONGQUYEN, OLD.TINHTRANG, OLD.MATL, OLD.MANXB, OLD.MAKV, 'DELETE');
END;
//

DELIMITER ;

DELIMITER //

CREATE TRIGGER AfterInsertSACH
AFTER INSERT ON SACH
FOR EACH ROW
BEGIN
    INSERT INTO THAYDOI_SACH (MASACH, TENSACH, TACGIA, NXB, NAMXB, SOLUONGQUYEN, TINHTRANG, MATL, MANXB, MAKV, LOAI_THAY_DOI)
    VALUES (NEW.MASACH, NEW.TENSACH, NEW.TACGIA, NEW.NXB, NEW.NAMXB, NEW.SOLUONGQUYEN, NEW.TINHTRANG, NEW.MATL, NEW.MANXB, NEW.MAKV, 'INSERT');
END;
//

DELIMITER ;

-- DEMO TRIGGER
INSERT INTO SACH (MASACH, TENSACH, TACGIA, NXB, NAMXB, SOLUONGQUYEN, TINHTRANG, MATL, MANXB, MAKV)
VALUES ('S0023', 'Tên Sách 1', 'Tác Giả', 'Nhà Xuất Bản Văn Học', '2024-01-01', 10, 'Mới', 'TL001', 'NXB001', 'KHU1');

UPDATE SACH
SET TENSACH = 'Tên Sách Mới'
WHERE MASACH = 'S0023';

DELETE FROM SACH
WHERE MASACH = 'S0023';
