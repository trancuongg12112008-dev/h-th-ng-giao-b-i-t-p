# 📚 Hệ Thống Quản Lý Bài Tập

Hệ thống quản lý bài tập trực tuyến đơn giản, hỗ trợ cả bài tập tự luận và trắc nghiệm với tính năng đếm giờ tự động.

## ✨ Tính năng

### 👨‍🏫 Dành cho Giáo viên
- ✍️ Giao bài tập tự luận
- 📝 Tạo bài tập trắc nghiệm với nhiều câu hỏi
- 📁 Upload câu hỏi từ file (TXT, JSON, Word)
- 🖼️ Thêm hình ảnh vào câu hỏi
- ⏱️ Đặt thời gian làm bài
- ✏️ Chỉnh sửa và xóa bài tập
- 📊 Xem danh sách bài nộp và điểm số

### 👨‍🎓 Dành cho Học sinh
- 📖 Xem danh sách bài tập
- ✍️ Nộp bài tập tự luận
- 📝 Làm bài trắc nghiệm với timer đếm ngược
- ⏰ Tự động nộp bài khi hết giờ
- ✏️ Chỉnh sửa và xóa bài đã nộp
- 📊 Xem điểm số ngay sau khi nộp

## 🚀 Cài đặt

### Yêu cầu
- Trình duyệt web hiện đại (Chrome, Firefox, Edge, Safari)
- Không cần server, chạy hoàn toàn trên client

### Cách sử dụng
1. Clone repository:
```bash
git clone https://github.com/your-username/he-thong-quan-ly-bai-tap.git
cd he-thong-quan-ly-bai-tap
```

2. Mở file `index.html` bằng trình duyệt

## 🔐 Tài khoản mặc định

### Giáo viên
- Tên đăng nhập: `admin`
- Mật khẩu: `admin123`

### Học sinh
- Tên đăng nhập: `hocsinh`
- Mật khẩu: `hs123`

Hoặc đăng ký tài khoản học sinh mới

## 📖 Hướng dẫn sử dụng

### Tạo bài tập trắc nghiệm

#### Cách 1: Thủ công
1. Đăng nhập với tài khoản giáo viên
2. Chọn "Bài tập trắc nghiệm"
3. Nhập tiêu đề, hạn nộp, thời gian làm bài
4. Click "➕ Thêm câu hỏi thủ công"
5. Nhập câu hỏi, đáp án và chọn đáp án đúng
6. Click "Giao Bài Tập"

#### Cách 2: Upload file
Hỗ trợ 3 định dạng file:

**File TXT:**
```
Câu hỏi 1?
A. Đáp án A
B. Đáp án B
C. Đáp án C
D. Đáp án D
Đáp án: A

Câu hỏi 2?
...
```

**File JSON:**
```json
{
  "questions": [
    {
      "question": "Câu hỏi?",
      "image": "URL hoặc Base64 (tùy chọn)",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": 0
    }
  ]
}
```

**File Word (.docx):**
- Tạo file Word với định dạng giống TXT
- Có thể chèn hình ảnh trực tiếp vào câu hỏi

### Định dạng đáp án được hỗ trợ
- `Đáp án: A`
- `Answer: B`
- `Correct: C`
- `Đúng: D`
- `* A. Đáp án đúng` (dấu sao đánh dấu)
- `A)` hoặc `A.` (cả hai đều được)

## 🛠️ Công nghệ sử dụng

- **HTML5** - Cấu trúc trang web
- **CSS3** - Giao diện và animation
- **JavaScript (Vanilla)** - Logic xử lý
- **LocalStorage** - Lưu trữ dữ liệu
- **Mammoth.js** - Đọc file Word

## 📁 Cấu trúc thư mục

```
.
├── index.html                      # Trang chính
├── style.css                       # CSS styling
├── script.js                       # JavaScript logic
├── README.md                       # File này
├── LICENSE                         # Giấy phép
├── .gitignore                      # Git ignore
│
├── examples/                       # Các file mẫu
│   ├── cau-hoi-mau.txt
│   ├── cau-hoi-mau.json
│   ├── cau-hoi-co-hinh-mau.json
│   └── cau-hoi-nhieu-dinh-dang.txt
│
└── docs/                          # Tài liệu hướng dẫn
    ├── HUONG-DAN-TAO-FILE-WORD.txt
    ├── HUONG-DAN-THEM-HINH-ANH.txt
    └── DINH-DANG-DAP-AN.txt
```

## 🎯 Tính năng nổi bật

### Timer tự động
- Đếm ngược thời gian làm bài
- Cảnh báo khi còn 5 phút
- Tự động nộp bài khi hết giờ
- Khóa form sau khi hết giờ

### Upload hình ảnh
- Upload trực tiếp từ máy tính
- Nhận dạng hình ảnh từ file Word
- Hỗ trợ Base64 trong JSON
- Xem trước hình ảnh

### Quản lý linh hoạt
- Chỉnh sửa bài tập (giữ nguyên bài nộp)
- Xóa bài tập
- Học sinh có thể sửa/xóa bài nộp

## 🔒 Bảo mật

- Dữ liệu lưu trữ local trên trình duyệt
- Không gửi dữ liệu lên server
- Phù hợp cho môi trường học tập nhỏ

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! Vui lòng:
1. Fork repository
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit thay đổi (`git commit -m 'Add some AmazingFeature'`)
4. Push lên branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📝 License

Dự án này được phân phối dưới giấy phép MIT. Xem file `LICENSE` để biết thêm chi tiết.

## 👥 Tác giả

Được phát triển với ❤️ bởi [Your Name]

## 📧 Liên hệ

- Email: your.email@example.com
- GitHub: [@your-username](https://github.com/your-username)

## 🙏 Lời cảm ơn

- [Mammoth.js](https://github.com/mwilliamson/mammoth.js) - Thư viện đọc file Word
- Cộng đồng open source

---

⭐ Nếu bạn thấy project hữu ích, hãy cho một star nhé!
