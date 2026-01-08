if (localStorage.getItem("teacherActive") !== "true") {
    window.location.href = "teacher_login.html";
}

// 1. DATABASE (Student Data)
const allStudents = {
    "10-A": [
        { name: "Riya Kumari", roll: 101 },
        { name: "Amit Sharma", roll: 102 }
    ],
    "10-B": [
        { name: "Rahul Verma", roll: 105 }
    ],
    "NUR-A": [
        { name: "Aarav Kumar", roll: 1 },
        { name: "Pari Kumari", roll: 2 }
    ]
};

// 2. INITIAL LOAD (Sirf ek baar)
window.onload = function() {
    const tName = localStorage.getItem("teacherName") || "Teacher Sir";
    const welcomeElem = document.getElementById("tWelcome");
    if(welcomeElem) welcomeElem.innerText = `Welcome, ${tName}! 👨‍🏫`;
    
    updateStudentList(); // Default list load karein
};

// 3. ATTENDANCE SYSTEM
function updateStudentList() {
    const selectedClass = document.getElementById('classSelect').value;
    const selectedSection = document.getElementById('sectionSelect').value;
    const key = `${selectedClass}-${selectedSection}`;
    
    const listContainer = document.getElementById('studentListContainer');
    if(!listContainer) return; // Error handle

    const students = allStudents[key] || [];
    let html = `<h3 style="font-size: 15px; margin-bottom: 15px; color:#333;">
                Attendance: ${selectedClass.toUpperCase()} - ${selectedSection}</h3>`;

    if (students.length === 0) {
        html += `<p style="text-align:center; color:#999; padding:20px;">No students found.</p>`;
    } else {
        students.forEach(s => {
            html += `
            <div class="student-item">
                <div class="s-name"><h5>${s.name}</h5><span>Roll: ${s.roll}</span></div>
                <div class="att-btns">
                    <button class="btn-p" onclick="markAttendance(this, 'P')">P</button>
                    <button class="btn-a" onclick="markAttendance(this, 'A')">A</button>
                </div>
            </div>`;
        });
    }
    listContainer.innerHTML = html;
}

// 1. Ek temp object banayein jo aaj ki attendance hold karega
let currentAttendanceData = {};

function markAttendance(button, status) {
    const parent = button.parentElement;
    const studentItem = button.closest('.student-item');
    const rollNo = studentItem.querySelector('span').innerText.replace('Roll: ', '');

    // Buttons UI update
    const buttons = parent.querySelectorAll('button');
    buttons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    // Attendance ko memory mein save karna
    currentAttendanceData[rollNo] = status;
}

// 2. Final Submit Function (Ise teacher dashboard ke 'Submit' button par lagayein)
function submitAttendance() {
    if (Object.keys(currentAttendanceData).length === 0) {
        alert("Pehle attendance mark karein!");
        return;
    }

    let attendanceHistory = JSON.parse(localStorage.getItem('attendanceData')) || {};
    let today = new Date().toISOString().split('T')[0]; // Aaj ki date: 2026-01-08

    // Aaj ka data save karna
    attendanceHistory[today] = currentAttendanceData;
    localStorage.setItem('attendanceData', JSON.stringify(attendanceHistory));

    alert("✅ Attendance successfully saved for today!");
}

// 4. MODAL MANAGEMENT (Common Functions)
function openModal(modalId, targetId) {
    const cls = document.getElementById('classSelect').value;
    const sec = document.getElementById('sectionSelect').value;
    const targetElem = document.getElementById(targetId);
    if(targetElem) targetElem.innerText = `Target: Class ${cls.toUpperCase()} - ${sec}`;
    document.getElementById(modalId).style.display = "flex";
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = "none";
}

// Global click to close ANY modal
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = "none";
    }
};


// 5. BUTTON FUNCTIONS
function openHomeworkModal() { openModal('hwModal', 'hwTargetText'); }
function openExamModal() { openModal('examModal', 'examTargetText'); }
function openEventModal() { openModal('eventModal', 'eventTargetText'); }

function saveHomework() {
    const text = document.getElementById('homeworkInput').value;
    if(!text.trim()) return alert("Enter homework details!");
    saveToStorage('homework', text);
    closeModal('hwModal');
}

function saveExamData() {
    const text = document.getElementById('examInput').value;
    if(!text.trim()) return alert("Enter exam details!");
    saveToStorage('exam', text);
    closeModal('examModal');
}

function saveEventData() {
    const text = document.getElementById('eventInput').value;
    if(!text.trim()) return alert("Enter event details!");
    saveToStorage('event', text);
    closeModal('eventModal');
}

// Helper to save data
function saveToStorage(type, content) {
    const cls = document.getElementById('classSelect').value;
    const sec = document.getElementById('sectionSelect').value;
    const data = { content, date: new Date().toLocaleDateString(), class: cls, section: sec };
    localStorage.setItem(`${type}_${cls}_${sec}`, JSON.stringify(data));
    alert(`${type.toUpperCase()} saved successfully! ✅`);
    
    // Clear textarea
    const inputId = type === 'homework' ? 'homeworkInput' : (type + 'Input');
    document.getElementById(inputId).value = "";
}
// Notice modal kholne ke liye
function openNoticeModal() {
    openModal('noticeModal', 'noticeTargetText');
}

// Notice save karne ke liye (Optional: agar aapne saveNotice pehle nahi likha)
function saveNotice() {
    const text = document.getElementById('noticeInput').value;
    if(!text.trim()) return alert("Enter notice details!");
    
    saveToStorage('notice', text); // Hamara banaya hua helper function use karein
    closeModal('noticeModal');
}