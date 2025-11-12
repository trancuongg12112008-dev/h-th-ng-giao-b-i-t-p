// Lưu trữ dữ liệu
let assignments = JSON.parse(localStorage.getItem('assignments')) || [];
let currentUser = null;
let userRole = null;

// Tài khoản mặc định
let accounts = JSON.parse(localStorage.getItem('accounts')) || {
    teacher: { username: 'admin', password: 'admin123', name: 'Giáo Viên' },
    students: [
        { username: 'hocsinh', password: 'hs123', name: 'Học Sinh' }
    ]
};

// Khởi tạo khi tải trang
window.addEventListener('DOMContentLoaded', function() {
    // Kiểm tra đăng nhập
    const savedUser = localStorage.getItem('currentUser');
    const savedRole = localStorage.getItem('userRole');
    
    if (savedUser && savedRole) {
        currentUser = savedUser;
        userRole = savedRole;
        showMainScreen();
    }
    
    // Xử lý form giao bài tập tự luận
    const assignmentForm = document.getElementById('assignment-form');
    if (assignmentForm) {
        assignmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const title = document.getElementById('assignment-title').value;
            const deadline = document.getElementById('assignment-deadline').value;
            
            if (editingAssignmentId) {
                // Đang chỉnh sửa bài tập
                const assignment = assignments.find(a => a.id === editingAssignmentId);
                if (assignment) {
                    assignment.title = title;
                    assignment.deadline = deadline;
                    // Giữ nguyên submissions
                }
                editingAssignmentId = null;
                alert('✅ Đã cập nhật bài tập thành công!');
            } else {
                // Tạo bài tập mới
                const assignment = {
                    id: Date.now(),
                    type: 'essay',
                    title: title,
                    deadline: deadline,
                    submissions: []
                };
                assignments.push(assignment);
                alert('✅ Đã giao bài tập thành công!');
            }
            
            localStorage.setItem('assignments', JSON.stringify(assignments));
            this.reset();
            displayAssignments();
        });
    }
    
    // Xử lý form giao bài tập trắc nghiệm
    const quizForm = document.getElementById('quiz-form');
    if (quizForm) {
        quizForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (quizQuestions.length === 0) {
                alert('❌ Vui lòng thêm ít nhất 1 câu hỏi!');
                return;
            }
            
            // Kiểm tra câu hỏi hợp lệ
            for (let q of quizQuestions) {
                if (!q.question.trim()) {
                    alert('❌ Vui lòng nhập đầy đủ câu hỏi!');
                    return;
                }
                for (let opt of q.options) {
                    if (!opt.trim()) {
                        alert('❌ Vui lòng nhập đầy đủ các đáp án!');
                        return;
                    }
                }
            }
            
            const title = document.getElementById('quiz-title').value;
            const deadline = document.getElementById('quiz-deadline').value;
            const duration = parseInt(document.getElementById('quiz-duration').value);
            
            if (editingAssignmentId) {
                // Đang chỉnh sửa bài tập trắc nghiệm
                const assignment = assignments.find(a => a.id === editingAssignmentId);
                if (assignment) {
                    assignment.title = title;
                    assignment.deadline = deadline;
                    assignment.duration = duration;
                    assignment.questions = JSON.parse(JSON.stringify(quizQuestions));
                    // Giữ nguyên submissions
                }
                editingAssignmentId = null;
                alert('✅ Đã cập nhật bài tập trắc nghiệm thành công!');
            } else {
                // Tạo bài tập trắc nghiệm mới
                const assignment = {
                    id: Date.now(),
                    type: 'quiz',
                    title: title,
                    deadline: deadline,
                    duration: duration,
                    questions: JSON.parse(JSON.stringify(quizQuestions)),
                    submissions: []
                };
                assignments.push(assignment);
                alert('✅ Đã giao bài tập trắc nghiệm thành công!');
            }
            
            localStorage.setItem('assignments', JSON.stringify(assignments));
            
            this.reset();
            quizQuestions = [];
            renderQuizQuestions();
            displayAssignments();
        });
    }
});

// Hiển thị form đăng nhập
function showLoginForm(type) {
    document.querySelectorAll('.login-form').forEach(form => {
        form.classList.remove('active');
    });
    document.querySelectorAll('.login-tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    if (type === 'teacher') {
        document.getElementById('teacher-login-form').classList.add('active');
        document.querySelector('.login-tab-btn:first-child').classList.add('active');
    } else {
        document.getElementById('student-login-form').classList.add('active');
        document.querySelector('.login-tab-btn:last-child').classList.add('active');
    }
}

// Hiển thị form đăng ký
function showRegisterForm() {
    document.querySelectorAll('.login-form').forEach(form => {
        form.classList.remove('active');
    });
    document.getElementById('student-register-form').classList.add('active');
}

// Đăng ký học sinh mới
function registerStudent(event) {
    event.preventDefault();
    
    const fullname = document.getElementById('register-fullname').value.trim();
    const username = document.getElementById('register-username').value.trim();
    const password = document.getElementById('register-password').value;
    
    // Kiểm tra tên đăng nhập đã tồn tại
    const existingStudent = accounts.students.find(s => s.username === username);
    if (existingStudent) {
        alert('❌ Tên đăng nhập đã tồn tại! Vui lòng chọn tên khác.');
        return;
    }
    
    // Thêm học sinh mới
    accounts.students.push({
        username: username,
        password: password,
        name: fullname
    });
    
    // Lưu vào localStorage
    localStorage.setItem('accounts', JSON.stringify(accounts));
    
    alert('✅ Đăng ký thành công! Bạn có thể đăng nhập ngay.');
    
    // Reset form và chuyển về form đăng nhập
    document.getElementById('register-fullname').value = '';
    document.getElementById('register-username').value = '';
    document.getElementById('register-password').value = '';
    showLoginForm('student');
}

// Đăng nhập giáo viên
function loginTeacher(event) {
    event.preventDefault();
    
    const username = document.getElementById('teacher-username').value;
    const password = document.getElementById('teacher-password').value;
    
    if (username === accounts.teacher.username && password === accounts.teacher.password) {
        currentUser = accounts.teacher.name;
        userRole = 'teacher';
        localStorage.setItem('currentUser', currentUser);
        localStorage.setItem('userRole', userRole);
        showMainScreen();
    } else {
        alert('❌ Tên đăng nhập hoặc mật khẩu không đúng!');
    }
}

// Đăng nhập học sinh
function loginStudent(event) {
    event.preventDefault();
    
    const username = document.getElementById('student-username').value;
    const password = document.getElementById('student-password').value;
    
    const student = accounts.students.find(s => s.username === username && s.password === password);
    
    if (student) {
        currentUser = student.name;
        userRole = 'student';
        localStorage.setItem('currentUser', currentUser);
        localStorage.setItem('userRole', userRole);
        showMainScreen();
    } else {
        alert('❌ Tên đăng nhập hoặc mã học sinh không đúng!');
    }
}

// Hiển thị màn hình chính
function showMainScreen() {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('main-screen').style.display = 'block';
    document.getElementById('current-user').textContent = `👤 ${currentUser}`;
    
    if (userRole === 'teacher') {
        document.getElementById('main-tabs').style.display = 'flex';
        showTab('teacher');
    } else {
        document.getElementById('main-tabs').style.display = 'none';
        showTab('student');
    }
}

// Đăng xuất
function logout() {
    currentUser = null;
    userRole = null;
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userRole');
    
    document.getElementById('login-screen').style.display = 'block';
    document.getElementById('main-screen').style.display = 'none';
    
    // Reset form và hiển thị form đăng nhập giáo viên
    document.getElementById('teacher-username').value = '';
    document.getElementById('teacher-password').value = '';
    document.getElementById('student-username').value = '';
    document.getElementById('student-password').value = '';
    showLoginForm('teacher');
}

// Chuyển đổi tab
function showTab(tab) {
    const mainTabs = document.getElementById('main-tabs');
    const tabContents = document.querySelectorAll('#main-screen .tab-content');
    
    tabContents.forEach(content => {
        content.classList.remove('active');
    });
    
    if (mainTabs.style.display !== 'none') {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
    }
    
    if (tab === 'teacher') {
        document.getElementById('teacher-tab').classList.add('active');
        if (mainTabs.style.display !== 'none') {
            document.querySelector('.tab-btn:first-child').classList.add('active');
        }
        displayAssignments();
    } else {
        document.getElementById('student-tab').classList.add('active');
        if (mainTabs.style.display !== 'none') {
            document.querySelector('.tab-btn:last-child').classList.add('active');
        }
        displayStudentAssignments();
    }
}

// Biến lưu ID bài tập đang chỉnh sửa
let editingAssignmentId = null;

// Biến lưu câu hỏi trắc nghiệm
let quizQuestions = [];

// Chuyển đổi loại bài tập
function toggleAssignmentType() {
    const type = document.querySelector('input[name="assignment-type"]:checked').value;
    const essayForm = document.getElementById('assignment-form');
    const quizForm = document.getElementById('quiz-form');
    
    if (type === 'essay') {
        essayForm.style.display = 'block';
        quizForm.style.display = 'none';
    } else {
        essayForm.style.display = 'none';
        quizForm.style.display = 'block';
        if (quizQuestions.length === 0) {
            addQuizQuestion();
        }
    }
}

// Thêm câu hỏi trắc nghiệm
function addQuizQuestion() {
    const questionId = Date.now();
    quizQuestions.push({
        id: questionId,
        question: '',
        image: null,
        options: ['', '', '', ''],
        correctAnswer: 0
    });
    renderQuizQuestions();
}

// Upload hình ảnh cho câu hỏi
function uploadQuestionImage(questionId, event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
        alert('❌ Vui lòng chọn file hình ảnh!');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const question = quizQuestions.find(q => q.id === questionId);
        if (question) {
            question.image = e.target.result;
            renderQuizQuestions();
        }
    };
    reader.readAsDataURL(file);
}

// Xóa hình ảnh câu hỏi
function removeQuestionImage(questionId) {
    const question = quizQuestions.find(q => q.id === questionId);
    if (question) {
        question.image = null;
        renderQuizQuestions();
    }
}

// Xóa câu hỏi trắc nghiệm
function removeQuizQuestion(questionId) {
    quizQuestions = quizQuestions.filter(q => q.id !== questionId);
    renderQuizQuestions();
}

// Escape HTML để tránh lỗi khi có ký tự đặc biệt
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Hiển thị danh sách câu hỏi
function renderQuizQuestions() {
    const container = document.getElementById('quiz-questions-container');
    
    // Xóa nội dung cũ
    container.innerHTML = '';
    
    quizQuestions.forEach((q, index) => {
        const questionCard = document.createElement('div');
        questionCard.className = 'quiz-question-card';
        
        // Header với số câu và nút xóa
        const header = document.createElement('div');
        header.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;';
        header.innerHTML = `
            <strong>Câu ${index + 1}</strong>
            <button type="button" class="btn-delete" onclick="removeQuizQuestion(${q.id})" style="padding: 5px 10px; font-size: 12px;">
                🗑️ Xóa
            </button>
        `;
        questionCard.appendChild(header);
        
        // Input câu hỏi
        const questionGroup = document.createElement('div');
        questionGroup.className = 'form-group';
        questionGroup.innerHTML = '<label>Câu hỏi:</label>';
        
        const questionInput = document.createElement('input');
        questionInput.type = 'text';
        questionInput.value = q.question;
        questionInput.required = true;
        questionInput.id = `question-input-${q.id}`;
        questionInput.style.pointerEvents = 'auto';
        questionInput.style.userSelect = 'text';
        questionInput.disabled = false;
        questionInput.readOnly = false;
        questionInput.oninput = function() {
            updateQuestion(q.id, this.value);
        };
        questionInput.onchange = function() {
            updateQuestion(q.id, this.value);
        };
        questionInput.onfocus = function() {
            console.log('Question input focused:', q.id);
        };
        questionGroup.appendChild(questionInput);
        
        // Upload hình ảnh
        const imageUploadDiv = document.createElement('div');
        imageUploadDiv.style.marginTop = '10px';
        
        if (q.image) {
            const imgPreview = document.createElement('img');
            imgPreview.src = q.image;
            imgPreview.style.maxWidth = '100%';
            imgPreview.style.maxHeight = '200px';
            imgPreview.style.borderRadius = '8px';
            imgPreview.style.marginBottom = '10px';
            imageUploadDiv.appendChild(imgPreview);
            
            const removeBtn = document.createElement('button');
            removeBtn.type = 'button';
            removeBtn.className = 'btn-delete';
            removeBtn.textContent = '🗑️ Xóa hình';
            removeBtn.style.fontSize = '12px';
            removeBtn.style.padding = '5px 10px';
            removeBtn.onclick = function() {
                removeQuestionImage(q.id);
            };
            imageUploadDiv.appendChild(removeBtn);
        } else {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*';
            fileInput.onchange = function(e) {
                uploadQuestionImage(q.id, e);
            };
            imageUploadDiv.appendChild(fileInput);
        }
        
        questionGroup.appendChild(imageUploadDiv);
        questionCard.appendChild(questionGroup);
        
        // Các đáp án
        const optionsGroup = document.createElement('div');
        optionsGroup.className = 'form-group';
        optionsGroup.innerHTML = '<label>Các đáp án (chọn đáp án đúng):</label>';
        
        q.options.forEach((opt, optIndex) => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'quiz-option';
            
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = `correct-${q.id}`;
            radio.value = optIndex;
            radio.checked = q.correctAnswer === optIndex;
            radio.onchange = function() {
                updateCorrectAnswer(q.id, optIndex);
            };
            
            const label = document.createElement('span');
            label.textContent = `Đáp án ${String.fromCharCode(65 + optIndex)}:`;
            
            const optionInput = document.createElement('input');
            optionInput.type = 'text';
            optionInput.value = opt;
            optionInput.placeholder = `Nhập đáp án ${String.fromCharCode(65 + optIndex)}`;
            optionInput.required = true;
            optionInput.id = `option-input-${q.id}-${optIndex}`;
            optionInput.style.pointerEvents = 'auto';
            optionInput.style.userSelect = 'text';
            optionInput.disabled = false;
            optionInput.readOnly = false;
            optionInput.oninput = function() {
                updateOption(q.id, optIndex, this.value);
            };
            optionInput.onchange = function() {
                updateOption(q.id, optIndex, this.value);
            };
            optionInput.onfocus = function() {
                console.log('Option input focused:', q.id, optIndex);
            };
            
            optionDiv.appendChild(radio);
            optionDiv.appendChild(label);
            optionDiv.appendChild(optionInput);
            optionsGroup.appendChild(optionDiv);
        });
        
        questionCard.appendChild(optionsGroup);
        container.appendChild(questionCard);
    });
}

// Cập nhật câu hỏi
function updateQuestion(questionId, value) {
    const question = quizQuestions.find(q => q.id === questionId);
    if (question) question.question = value;
}

// Cập nhật đáp án
function updateOption(questionId, optionIndex, value) {
    const question = quizQuestions.find(q => q.id === questionId);
    if (question) question.options[optionIndex] = value;
}

// Cập nhật đáp án đúng
function updateCorrectAnswer(questionId, optionIndex) {
    const question = quizQuestions.find(q => q.id === questionId);
    if (question) question.correctAnswer = optionIndex;
}

// Xử lý upload file câu hỏi trắc nghiệm
function handleQuizFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (file.name.endsWith('.docx') || file.name.endsWith('.doc')) {
        // Xử lý file Word
        handleWordFile(file, event);
    } else {
        // Xử lý file TXT hoặc JSON
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const content = e.target.result;
            
            try {
                if (file.name.endsWith('.json')) {
                    // Xử lý file JSON
                    const data = JSON.parse(content);
                    parseJSONQuestions(data);
                } else {
                    // Xử lý file TXT
                    parseTXTQuestions(content);
                }
                
                // Reset input file
                event.target.value = '';
                
                alert(`✅ Đã nhập ${quizQuestions.length} câu hỏi từ file!`);
            } catch (error) {
                alert('❌ Lỗi khi đọc file! Vui lòng kiểm tra định dạng file.');
                console.error(error);
            }
        };
        
        reader.readAsText(file);
    }
}

// Xử lý file Word
function handleWordFile(file, event) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const arrayBuffer = e.target.result;
        
        // Kiểm tra xem mammoth có tồn tại không
        if (typeof mammoth === 'undefined') {
            alert('❌ Không thể đọc file Word. Vui lòng kiểm tra kết nối internet.');
            return;
        }
        
        // Trích xuất text và hình ảnh
        const options = {
            convertImage: mammoth.images.imgElement(function(image) {
                return image.read("base64").then(function(imageBuffer) {
                    return {
                        src: "data:" + image.contentType + ";base64," + imageBuffer
                    };
                });
            })
        };
        
        mammoth.convertToHtml({ arrayBuffer: arrayBuffer }, options)
            .then(function(result) {
                const html = result.value;
                
                try {
                    parseWordHTMLQuestions(html);
                    
                    // Reset input file
                    event.target.value = '';
                    
                    alert(`✅ Đã nhập ${quizQuestions.length} câu hỏi từ file Word!`);
                } catch (error) {
                    alert('❌ Lỗi khi đọc file Word! Vui lòng kiểm tra định dạng.');
                    console.error(error);
                }
            })
            .catch(function(error) {
                alert('❌ Không thể đọc file Word! Vui lòng thử lại.');
                console.error(error);
            });
    };
    
    reader.readAsArrayBuffer(file);
}

// Parse câu hỏi từ HTML của Word (có hình ảnh)
function parseWordHTMLQuestions(html) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    const paragraphs = Array.from(tempDiv.querySelectorAll('p'));
    const images = Array.from(tempDiv.querySelectorAll('img'));
    
    let currentQuestion = null;
    let currentImage = null;
    let options = [];
    let correctAnswer = 0;
    let imageIndex = 0;
    
    paragraphs.forEach((p, index) => {
        const text = p.textContent.trim();
        
        // Kiểm tra xem có hình ảnh trong đoạn này không
        const imgInParagraph = p.querySelector('img');
        if (imgInParagraph && imgInParagraph.src) {
            currentImage = imgInParagraph.src;
            return;
        }
        
        if (!text) return;
        
        // Kiểm tra dòng câu hỏi
        if (!text.match(/^[A-D]\./i) && !text.match(/^Đáp án:/i)) {
            // Nếu đã có câu hỏi trước đó, lưu lại
            if (currentQuestion && options.length === 4) {
                quizQuestions.push({
                    id: Date.now() + quizQuestions.length,
                    question: currentQuestion,
                    image: currentImage,
                    options: [...options],
                    correctAnswer: correctAnswer
                });
            }
            
            // Bắt đầu câu hỏi mới
            currentQuestion = text;
            currentImage = null;
            options = [];
            correctAnswer = 0;
        }
        // Kiểm tra dòng đáp án
        else if (text.match(/^[A-D]\./i)) {
            const optionText = text.substring(2).trim();
            options.push(optionText);
        }
        // Kiểm tra dòng đáp án đúng
        else if (text.match(/^Đáp án:/i)) {
            const answer = text.substring(7).trim().toUpperCase();
            correctAnswer = answer.charCodeAt(0) - 65;
        }
    });
    
    // Lưu câu hỏi cuối cùng
    if (currentQuestion && options.length === 4) {
        quizQuestions.push({
            id: Date.now() + quizQuestions.length,
            question: currentQuestion,
            image: currentImage,
            options: [...options],
            correctAnswer: correctAnswer
        });
    }
    
    renderQuizQuestions();
}

// Parse câu hỏi từ file TXT
function parseTXTQuestions(content) {
    const lines = content.split('\n').map(line => line.trim()).filter(line => line);
    
    let currentQuestion = null;
    let options = [];
    let correctAnswer = 0;
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Kiểm tra dòng câu hỏi (không bắt đầu bằng A., B., C., D. hoặc "Đáp án:")
        if (!line.match(/^[A-D][\.\)]/i) && 
            !line.match(/^(Đáp án|Answer|Correct|Đúng):/i) && 
            !line.match(/^\*\s*[A-D]\./i)) {
            // Nếu đã có câu hỏi trước đó, lưu lại
            if (currentQuestion && options.length === 4) {
                quizQuestions.push({
                    id: Date.now() + quizQuestions.length,
                    question: currentQuestion,
                    options: [...options],
                    correctAnswer: correctAnswer
                });
            }
            
            // Bắt đầu câu hỏi mới
            currentQuestion = line;
            options = [];
            correctAnswer = 0;
        }
        // Kiểm tra dòng đáp án
        else if (line.match(/^[A-D][\.\)]/i)) {
            const optionText = line.substring(2).trim();
            options.push(optionText);
        }
        // Hỗ trợ định dạng: "A) Đáp án"
        else if (line.match(/^[A-D]\)/i)) {
            const optionText = line.substring(2).trim();
            options.push(optionText);
        }
        // Kiểm tra dòng đáp án đúng - hỗ trợ nhiều định dạng
        else if (line.match(/^(Đáp án|Answer|Correct|Đúng):/i)) {
            // Tách phần sau dấu ":"
            const answerPart = line.split(':')[1].trim().toUpperCase();
            
            // Lấy ký tự đầu tiên là A, B, C, hoặc D
            const match = answerPart.match(/[A-D]/);
            if (match) {
                correctAnswer = match[0].charCodeAt(0) - 65; // A=0, B=1, C=2, D=3
            }
        }
        // Hỗ trợ định dạng khác: "* A. Đáp án đúng" (có dấu sao)
        else if (line.match(/^\*\s*[A-D]\./i)) {
            const optionLetter = line.match(/[A-D]/i)[0].toUpperCase();
            correctAnswer = optionLetter.charCodeAt(0) - 65;
            const optionText = line.substring(line.indexOf('.') + 1).trim();
            options.push(optionText);
        }
    }
    
    // Lưu câu hỏi cuối cùng
    if (currentQuestion && options.length === 4) {
        quizQuestions.push({
            id: Date.now() + quizQuestions.length,
            question: currentQuestion,
            image: null,
            options: [...options],
            correctAnswer: correctAnswer
        });
    }
    
    renderQuizQuestions();
}

// Parse câu hỏi từ file JSON
function parseJSONQuestions(data) {
    if (Array.isArray(data)) {
        data.forEach(item => {
            if (item.question && item.options && item.options.length === 4) {
                quizQuestions.push({
                    id: Date.now() + quizQuestions.length,
                    question: item.question,
                    image: item.image || null,
                    options: item.options,
                    correctAnswer: item.correctAnswer || 0
                });
            }
        });
    } else if (data.questions && Array.isArray(data.questions)) {
        data.questions.forEach(item => {
            if (item.question && item.options && item.options.length === 4) {
                quizQuestions.push({
                    id: Date.now() + quizQuestions.length,
                    question: item.question,
                    image: item.image || null,
                    options: item.options,
                    correctAnswer: item.correctAnswer || 0
                });
            }
        });
    }
    
    renderQuizQuestions();
}

// Hiển thị danh sách bài tập (tab giáo viên)
function displayAssignments() {
    const container = document.getElementById('assignments-list');
    
    if (assignments.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #718096;">Chưa có bài tập nào.</p>';
        return;
    }
    
    container.innerHTML = assignments.map(assignment => {
        const isQuiz = assignment.type === 'quiz';
        
        return `
        <div class="assignment-card">
            <div style="display: flex; justify-content: space-between; align-items: start;">
                <div style="flex: 1;">
                    <h3>${isQuiz ? '📝' : '✍️'} ${assignment.title}</h3>
                    <p>${assignment.description}</p>
                    <p class="deadline">⏰ Hạn nộp: ${formatDate(assignment.deadline)}</p>
                    ${isQuiz ? `<p><strong>Số câu hỏi: ${assignment.questions.length}</strong></p>` : ''}
                    <p><strong>📝 Số bài nộp: ${assignment.submissions.length}</strong></p>
                </div>
                <div style="display: flex; gap: 10px;">
                    <button class="btn-edit" onclick="${isQuiz ? 'editQuizAssignment' : 'editAssignment'}(${assignment.id})">✏️ Sửa</button>
                    <button class="btn-delete" onclick="deleteAssignment(${assignment.id})">🗑️ Xóa</button>
                </div>
            </div>
            ${assignment.submissions.length > 0 ? `
                <div style="margin-top: 10px;">
                    <strong>Danh sách bài nộp:</strong>
                    ${assignment.submissions.map(sub => `
                        <div class="submission-item">
                            <strong>${sub.studentName}</strong> - ${formatDate(sub.submittedAt)}
                            ${isQuiz ? `<br><strong>Điểm: ${sub.score}/${assignment.questions.length}</strong>` : `<br><em>${sub.content}</em>`}
                        </div>
                    `).join('')}
                </div>
            ` : ''}
        </div>
        `;
    }).join('');
}

// Chỉnh sửa bài tập tự luận
function editAssignment(assignmentId) {
    const assignment = assignments.find(a => a.id === assignmentId);
    if (!assignment) return;
    
    // Chuyển sang tab bài tập tự luận
    document.querySelector('input[name="assignment-type"][value="essay"]').checked = true;
    toggleAssignmentType();
    
    // Lưu ID bài tập đang chỉnh sửa
    editingAssignmentId = assignmentId;
    
    // Điền thông tin vào form
    document.getElementById('assignment-title').value = assignment.title;
    document.getElementById('assignment-description').value = assignment.description;
    document.getElementById('assignment-deadline').value = assignment.deadline;
    
    // Scroll lên form
    document.getElementById('assignment-form').scrollIntoView({ behavior: 'smooth' });
    document.getElementById('assignment-title').focus();
    
    alert('📝 Đang chỉnh sửa bài tập. Vui lòng cập nhật thông tin và nhấn "Giao Bài Tập".');
}

// Chỉnh sửa bài tập trắc nghiệm
function editQuizAssignment(assignmentId) {
    const assignment = assignments.find(a => a.id === assignmentId);
    if (!assignment) return;
    
    // Chuyển sang tab bài tập trắc nghiệm
    document.querySelector('input[name="assignment-type"][value="quiz"]').checked = true;
    toggleAssignmentType();
    
    // Lưu ID bài tập đang chỉnh sửa
    editingAssignmentId = assignmentId;
    
    // Điền thông tin vào form
    document.getElementById('quiz-title').value = assignment.title;
    document.getElementById('quiz-description').value = assignment.description;
    document.getElementById('quiz-deadline').value = assignment.deadline;
    
    // Load câu hỏi
    quizQuestions = JSON.parse(JSON.stringify(assignment.questions));
    renderQuizQuestions();
    
    // Scroll lên form
    document.getElementById('quiz-form').scrollIntoView({ behavior: 'smooth' });
    document.getElementById('quiz-title').focus();
    
    alert('📝 Đang chỉnh sửa bài tập trắc nghiệm. Vui lòng cập nhật thông tin và nhấn "Giao Bài Tập".');
}

// Xóa bài tập
function deleteAssignment(assignmentId) {
    if (!confirm('⚠️ Bạn có chắc muốn xóa bài tập này? Tất cả bài nộp cũng sẽ bị xóa.')) {
        return;
    }
    
    assignments = assignments.filter(a => a.id !== assignmentId);
    localStorage.setItem('assignments', JSON.stringify(assignments));
    displayAssignments();
    alert('✅ Đã xóa bài tập thành công!');
}

// Lưu trữ timer đang chạy
let activeTimers = {};

// Hiển thị bài tập cho học sinh
function displayStudentAssignments() {
    const container = document.getElementById('student-assignments-list');
    
    // Dừng tất cả timer cũ
    Object.values(activeTimers).forEach(timer => clearInterval(timer));
    activeTimers = {};
    
    if (assignments.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #718096;">Chưa có bài tập nào.</p>';
        return;
    }
    
    container.innerHTML = assignments.map(assignment => {
        const mySubmission = assignment.submissions.find(s => s.studentName === currentUser);
        
        if (assignment.type === 'quiz') {
            // Bài tập trắc nghiệm
            return `
            <div class="assignment-card">
                <h3>📝 ${assignment.title}</h3>
                <p class="deadline">⏰ Hạn nộp: ${formatDate(assignment.deadline)}</p>
                <p><strong>Số câu hỏi: ${assignment.questions.length} | Thời gian: ${assignment.duration || 30} phút</strong></p>
                
                ${mySubmission ? `
                    <div class="quiz-result ${mySubmission.score >= assignment.questions.length * 0.5 ? 'correct' : 'incorrect'}">
                        <strong>✅ Đã làm bài</strong>
                        <p style="margin-top: 8px; font-size: 18px;">
                            <strong>Điểm: ${mySubmission.score}/${assignment.questions.length}</strong>
                        </p>
                        <p style="margin-top: 5px; font-size: 13px; color: #718096;">
                            Nộp lúc: ${formatDate(mySubmission.submittedAt)}
                        </p>
                    </div>
                ` : `
                    <div class="submission-form">
                        <div id="quiz-start-${assignment.id}">
                            <p style="text-align: center; margin: 20px 0; color: #4a5568;">
                                Nhấn nút bên dưới để bắt đầu làm bài.<br>
                                Timer sẽ tự động đếm ngược khi bạn bắt đầu.
                            </p>
                            <button type="button" class="btn btn-primary" onclick="startQuizTest(${assignment.id})" 
                                style="display: block; margin: 0 auto; padding: 15px 40px; font-size: 18px;">
                                🚀 Bắt đầu làm bài
                            </button>
                        </div>
                        <div id="quiz-content-${assignment.id}" style="display: none;">
                            <div class="quiz-timer" id="timer-${assignment.id}">
                                ⏱️ Thời gian: <span id="time-${assignment.id}">${assignment.duration || 30}:00</span>
                            </div>
                            <h4>Làm bài trắc nghiệm</h4>
                            <form id="quiz-form-${assignment.id}" onsubmit="submitQuiz(event, ${assignment.id})">
                                ${assignment.questions.map((q, qIndex) => `
                                    <div class="quiz-question-card">
                                        <strong>Câu ${qIndex + 1}: ${escapeHtml(q.question)}</strong>
                                        ${q.image ? `<img src="${q.image}" style="max-width: 100%; max-height: 300px; border-radius: 8px; margin: 10px 0; display: block;">` : ''}
                                        ${q.options.map((opt, optIndex) => `
                                            <div class="quiz-option">
                                                <input type="radio" name="answer-${assignment.id}-${qIndex}" 
                                                    value="${optIndex}" required>
                                                <span>${String.fromCharCode(65 + optIndex)}. ${escapeHtml(opt)}</span>
                                            </div>
                                        `).join('')}
                                    </div>
                                `).join('')}
                                <button type="submit" class="btn btn-success">Nộp Bài</button>
                            </form>
                        </div>
                    </div>
                `}
            </div>
            `;
        } else {
            // Bài tập tự luận
            return `
            <div class="assignment-card">
                <h3>✍️ ${assignment.title}</h3>
                <p class="deadline">⏰ Hạn nộp: ${formatDate(assignment.deadline)}</p>
                
                ${mySubmission ? `
                    <div style="margin-top: 15px; padding: 15px; background: #e6ffed; border-radius: 8px; border: 2px solid #48bb78;">
                        <strong style="color: #48bb78;">✅ Đã nộp bài</strong>
                        <p style="margin-top: 8px; color: #2d3748;"><em>${mySubmission.content}</em></p>
                        <p style="margin-top: 5px; font-size: 13px; color: #718096;">Nộp lúc: ${formatDate(mySubmission.submittedAt)}</p>
                        <div style="margin-top: 10px; display: flex; gap: 10px;">
                            <button class="btn-edit" onclick="editSubmission(${assignment.id})">✏️ Sửa bài</button>
                            <button class="btn-delete" onclick="deleteSubmission(${assignment.id})">🗑️ Xóa bài</button>
                        </div>
                    </div>
                ` : `
                    <div class="submission-form">
                        <h4>Nộp Bài</h4>
                        <form onsubmit="submitAssignment(event, ${assignment.id})">
                            <div class="form-group">
                                <label>Nội dung bài làm:</label>
                                <textarea id="submission-content-${assignment.id}" rows="3" required></textarea>
                            </div>
                            <button type="submit" class="btn btn-success">Nộp Bài</button>
                        </form>
                    </div>
                `}
            </div>
            `;
        }
    }).join('');
}

// Bắt đầu làm bài trắc nghiệm
function startQuizTest(assignmentId) {
    const assignment = assignments.find(a => a.id === assignmentId);
    if (!assignment) return;
    
    // Xác nhận trước khi bắt đầu
    if (!confirm(`Bạn có chắc muốn bắt đầu làm bài?\n\nThời gian: ${assignment.duration || 30} phút\nSố câu hỏi: ${assignment.questions.length}\n\nTimer sẽ bắt đầu đếm ngược ngay khi bạn nhấn OK.`)) {
        return;
    }
    
    // Ẩn nút bắt đầu, hiện nội dung bài thi
    document.getElementById(`quiz-start-${assignmentId}`).style.display = 'none';
    document.getElementById(`quiz-content-${assignmentId}`).style.display = 'block';
    
    // Bắt đầu timer
    startQuizTimer(assignmentId, assignment.duration || 30);
    
    // Scroll lên đầu
    document.getElementById(`timer-${assignmentId}`).scrollIntoView({ behavior: 'smooth' });
}

// Khởi động đếm ngược thời gian làm bài
function startQuizTimer(assignmentId, durationMinutes) {
    const timerElement = document.getElementById(`time-${assignmentId}`);
    const timerBox = document.getElementById(`timer-${assignmentId}`);
    const form = document.getElementById(`quiz-form-${assignmentId}`);
    
    if (!timerElement || !form) return;
    
    let timeLeft = durationMinutes * 60; // Chuyển sang giây
    
    activeTimers[assignmentId] = setInterval(() => {
        timeLeft--;
        
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        // Cảnh báo khi còn 5 phút
        if (timeLeft <= 300 && timeLeft > 0) {
            timerBox.classList.add('warning');
        }
        
        // Hết giờ - tự động nộp bài
        if (timeLeft <= 0) {
            clearInterval(activeTimers[assignmentId]);
            delete activeTimers[assignmentId];
            
            alert('⏰ Hết giờ làm bài! Bài thi sẽ được nộp tự động.');
            
            // Disable form
            const inputs = form.querySelectorAll('input, button');
            inputs.forEach(input => input.disabled = true);
            
            // Tự động nộp bài
            autoSubmitQuiz(assignmentId);
        }
    }, 1000);
}

// Tự động nộp bài khi hết giờ
function autoSubmitQuiz(assignmentId) {
    const assignment = assignments.find(a => a.id === assignmentId);
    if (!assignment) return;
    
    let score = 0;
    const answers = [];
    
    assignment.questions.forEach((q, qIndex) => {
        const selectedOption = document.querySelector(`input[name="answer-${assignmentId}-${qIndex}"]:checked`);
        if (selectedOption) {
            const answer = parseInt(selectedOption.value);
            answers.push(answer);
            if (answer === q.correctAnswer) {
                score++;
            }
        } else {
            answers.push(-1); // Không trả lời
        }
    });
    
    assignment.submissions.push({
        studentName: currentUser,
        answers: answers,
        score: score,
        submittedAt: new Date().toISOString(),
        autoSubmit: true
    });
    
    localStorage.setItem('assignments', JSON.stringify(assignments));
    
    alert(`⏰ Đã tự động nộp bài!\n\nĐiểm số: ${score}/${assignment.questions.length}`);
    displayStudentAssignments();
}

// Nộp bài trắc nghiệm thủ công
function submitQuiz(event, assignmentId) {
    event.preventDefault();
    
    // Dừng timer
    if (activeTimers[assignmentId]) {
        clearInterval(activeTimers[assignmentId]);
        delete activeTimers[assignmentId];
    }
    
    const assignment = assignments.find(a => a.id === assignmentId);
    if (!assignment) return;
    
    let score = 0;
    const answers = [];
    
    assignment.questions.forEach((q, qIndex) => {
        const selectedOption = document.querySelector(`input[name="answer-${assignmentId}-${qIndex}"]:checked`);
        if (selectedOption) {
            const answer = parseInt(selectedOption.value);
            answers.push(answer);
            if (answer === q.correctAnswer) {
                score++;
            }
        }
    });
    
    assignment.submissions.push({
        studentName: currentUser,
        answers: answers,
        score: score,
        submittedAt: new Date().toISOString()
    });
    
    localStorage.setItem('assignments', JSON.stringify(assignments));
    
    alert(`✅ Nộp bài thành công!\n\nĐiểm số: ${score}/${assignment.questions.length}`);
    displayStudentAssignments();
}

// Chỉnh sửa bài nộp
function editSubmission(assignmentId) {
    const assignment = assignments.find(a => a.id === assignmentId);
    if (!assignment) return;
    
    const mySubmission = assignment.submissions.find(s => s.studentName === currentUser);
    if (!mySubmission) return;
    
    // Xóa bài nộp cũ
    assignment.submissions = assignment.submissions.filter(s => s.studentName !== currentUser);
    localStorage.setItem('assignments', JSON.stringify(assignments));
    
    // Hiển thị lại và điền nội dung cũ vào form
    displayStudentAssignments();
    
    setTimeout(() => {
        const textarea = document.getElementById(`submission-content-${assignmentId}`);
        if (textarea) {
            textarea.value = mySubmission.content;
            textarea.scrollIntoView({ behavior: 'smooth' });
            textarea.focus();
        }
    }, 100);
    
    alert('📝 Đang chỉnh sửa bài nộp. Vui lòng cập nhật nội dung và nhấn "Nộp Bài".');
}

// Xóa bài nộp
function deleteSubmission(assignmentId) {
    if (!confirm('⚠️ Bạn có chắc muốn xóa bài nộp này?')) {
        return;
    }
    
    const assignment = assignments.find(a => a.id === assignmentId);
    if (!assignment) return;
    
    assignment.submissions = assignment.submissions.filter(s => s.studentName !== currentUser);
    localStorage.setItem('assignments', JSON.stringify(assignments));
    
    displayStudentAssignments();
    alert('✅ Đã xóa bài nộp thành công!');
}

// Nộp bài tập
function submitAssignment(event, assignmentId) {
    event.preventDefault();
    
    const studentName = currentUser || document.getElementById(`student-name-${assignmentId}`).value;
    const content = document.getElementById(`submission-content-${assignmentId}`).value;
    
    const assignment = assignments.find(a => a.id === assignmentId);
    if (assignment) {
        assignment.submissions.push({
            studentName: studentName,
            content: content,
            submittedAt: new Date().toISOString()
        });
        
        localStorage.setItem('assignments', JSON.stringify(assignments));
        
        alert('✅ Nộp bài thành công!');
        displayStudentAssignments();
    }
}

// Format ngày giờ
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN');
}
