// --- 1. SECURITY CHECK (Sabse Pehle) ---
if (localStorage.getItem("studentActive") !== "true") {
    window.location.href = "student-login.html";
}
// 1. Page Load hote hi data fetch karein
window.onload = function() {
    renderStudentData();
    renderAdminNotice();
    updateFeeStatus();
};

// 2. Student ki basic info load karein
function renderStudentData() {
    const student = JSON.parse(localStorage.getItem('currentStudent')) || {
        name: "Riya Kumari",
        class: "10th",
        section: "B",
        fatherName: "Mr. Sharma",
        id: "STU101"
    };

    const nameEl = document.getElementById('dispName');
    const classEl = document.getElementById('dispClass');
    
    if(nameEl) nameEl.innerText = `Namaste, ${student.name}! 👋`;
    if(classEl) classEl.innerText = `Class: ${student.class}-${student.section} | F. Name: ${student.fatherName}`;
    
    const imgElement = document.getElementById('userPhoto');
    const savedPhoto = localStorage.getItem(`photo_${student.id}`);
    if(imgElement && savedPhoto) {
        imgElement.src = savedPhoto;
    }
}

// 3. Photo Preview
function previewImage(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    const student = JSON.parse(localStorage.getItem('currentStudent')) || {id: "STU101"};

    reader.onload = function() {
        const imgElement = document.getElementById('userPhoto');
        if(imgElement) imgElement.src = reader.result;
        localStorage.setItem(`photo_${student.id}`, reader.result);
    };
    if(file) reader.readAsDataURL(file);
}

// 4. Admin Notice
function renderAdminNotice() {
    const noticeElement = document.querySelector('.notice-card p');
    const timeElement = document.querySelector('.notice-card span');
    const latestNotice = localStorage.getItem('adminNotice');
    
    if(latestNotice && noticeElement) {
        noticeElement.innerHTML = `📢 ${latestNotice}`;
        if(timeElement) timeElement.innerText = "Updated recently";
    }
}

// 5. Safe Fee Status (Sabse Jaruri Fix)
function updateFeeStatus() {
    const student = JSON.parse(localStorage.getItem('currentStudent')) || {name: "Riya Kumari"};
    const allFeeRecords = JSON.parse(localStorage.getItem('studentFees')) || [];
    
    const paidAmount = allFeeRecords
        .filter(f => f.name === student.name)
        .reduce((sum, f) => sum + parseInt(f.amount), 0);

    const totalYearlyFee = 20000; 
    const pendingFee = totalYearlyFee - paidAmount;

    // Yahan fix hai: Pehle check karo ki card hai ya nahi
    const feeCards = document.querySelectorAll('.stat-card h3');
    if(feeCards.length >= 2) {
        feeCards[1].innerText = `₹${pendingFee > 0 ? pendingFee : 0}`;
    }
}
function updateAttendanceUI() {
    const myRoll = localStorage.getItem("rollNo"); // Login bache ka roll no
    const history = JSON.parse(localStorage.getItem('attendanceData')) || {};
    
    let totalWorkingDays = Object.keys(history).length; // Jitne din attendance li gayi
    let daysPresent = 0;

    if (totalWorkingDays === 0) {
        document.getElementById('attendancePercent').innerText = "0%";
        return;
    }

    // Har din check karo ki bacha present tha ya nahi
    for (let date in history) {
        if (history[date][myRoll] === 'P') {
            daysPresent++;
        }
    }

    // Percentage nikalein
    let percentage = Math.round((daysPresent / totalWorkingDays) * 100);

    // UI update karein (Aapke dashboard ke attendance card ki ID)
    const percentDisplay = document.getElementById('attendancePercent');
    if (percentDisplay) {
        percentDisplay.innerText = percentage + "%";
        
        // Agar attendance 75% se kam hai toh color badal dein (Optional)
        if (percentage < 75) {
            percentDisplay.style.color = "#ff7675"; // Red for alert
        } else {
            percentDisplay.style.color = "#00b09b"; // Green for safe
        }
    }
}

// Page load hote hi ise call karein
document.addEventListener("DOMContentLoaded", updateAttendanceUI);