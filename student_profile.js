
/**
 * SYSTEMATIC STUDENT JS (v2.1) 
 * All-in-One: Profile, Fees, Attendance, Photo & Leaves
 */

// --- 1. ACCESS CONTROL ---
if (localStorage.getItem("studentActive") !== "true") {
    window.location.href = "student_login.html";
}

// Global variable for easy access
let student = JSON.parse(localStorage.getItem('currentStudent'));

// --- 2. PAGE LOAD LOGIC ---
window.onload = function() {
    if (!student) {
        window.location.href = "student_login.html";
        return;
    }
    
    // Sabse pehle profile data render karein
    renderAllData(); 
    
    // Baaki dashboard features load karein
    if(document.getElementById('attendancePercent')) updateAttendanceUI();
    if(document.getElementById('feeTotal') || document.getElementById('feePending')) updateFeeStatus();
};

/**
 * 3. MASTER RENDER FUNCTION (Iska naam wahi hai jo aapne pucha)
 */
function renderAllData() {
    // UI Elements ki IDs fetch karein
    const dispName = document.getElementById('dispName');
    const dispClass = document.getElementById('dispClass');
    const profName = document.getElementById('profName');
    const profId = document.getElementById('profId');
    const profFather = document.getElementById('profFather');
    const profBlood = document.getElementById('profBlood');
    const userPhoto = document.getElementById('userPhoto');

    // Admin Portal ke variables ke hisaab se fallbacks
    const sRoll = student.rollNo || student.roll || "N/A";
    const sFather = student.fatherName || student.father || "N/A";
    const sClass = student.currentClass || student.class || "N/A";
    const sBlood = student.bloodGroup || "B+";

    // Data Fill-up Logic
    if(dispName) dispName.innerText = `Namaste, ${student.name}! 👋`;
    if(dispClass) dispClass.innerText = `Class: ${sClass} | Father: ${sFather}`;
    
    if(profName) profName.innerText = student.name;
    if(profId) profId.innerText = `Roll No: ${sRoll} | Class: ${sClass}`;
    if(profFather) profFather.innerText = sFather;
    if(profBlood) profBlood.innerText = `${student.bloodGroup || "B+"} Positive`;

    // Photo Loading
    if(userPhoto) {
        userPhoto.src = student.photo || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
    }
}

/**
 * 4. FEES SYNC (Admin Portal 'schoolFees' se synced)
 */
function updateFeeStatus() {
    const sRoll = student.rollNo || student.roll;
    const schoolFees = JSON.parse(localStorage.getItem('schoolFees')) || {};
    
    // Admin se synced data uthao, agar nahi hai toh student object se lo
    const myFees = schoolFees[sRoll] || {
        total: student.totalFees || 0,
        paid: student.paidAmount || 0,
        pending: (student.totalFees || 0) - (student.paidAmount || 0)
    };

    // Card Displays
    const feePendingEl = document.getElementById('feePending');
    const feePaidEl = document.getElementById('feePaid');
    const feeTotalEl = document.getElementById('feeTotal');

    if(feePendingEl) {
        feePendingEl.innerText = "₹" + myFees.pending.toLocaleString();
        feePendingEl.style.color = myFees.pending > 0 ? "#e11d48" : "#059669";
    }
    if(feePaidEl) feePaidEl.innerText = "₹" + myFees.paid.toLocaleString();
    if(feeTotalEl) feeTotalEl.innerText = "₹" + myFees.total.toLocaleString();
    
    // Detailed Tuition element agar ho
    if(document.getElementById('feeTuition')) {
        document.getElementById('feeTuition').innerText = "₹" + myFees.total.toLocaleString();
    }
}

/**
 * 5. ATTENDANCE LOGIC
 */
function updateAttendanceUI() {
    const sRoll = student.rollNo || student.roll;
    const history = JSON.parse(localStorage.getItem('attendanceData')) || {};
    let totalDays = Object.keys(history).length;
    let presentDays = 0;

    if (totalDays > 0) {
        for (let date in history) {
            if (history[date][sRoll] === 'P') presentDays++;
        }
        let percent = Math.round((presentDays / totalDays) * 100);
        const el = document.getElementById('attendancePercent');
        if(el) {
            el.innerText = percent + "%";
            el.style.color = (percent < 75) ? "#e11d48" : "#059669";
        }
    }
}

/**
 * 6. LEAVE REQUEST LOGIC
 */
function sendLeaveRequest() {
    const dates = document.getElementById('leaveDates')?.value;
    const reason = document.getElementById('leaveReason')?.value;

    if(!dates || !reason) return alert("Please enter Dates and Reason!");

    const leaveData = {
        rollNo: student.rollNo || student.roll,
        name: student.name,
        dates: dates,
        reason: reason,
        status: "Pending",
        time: new Date().toLocaleString()
    };

    let allLeaves = JSON.parse(localStorage.getItem('leaveRequests')) || [];
    allLeaves.push(leaveData);
    localStorage.setItem('leaveRequests', JSON.stringify(allLeaves));

    alert("✅ Leave Request Sent Successfully!");
    document.getElementById('leaveDates').value = "";
    document.getElementById('leaveReason').value = "";
}

/**
 * 7. PHOTO UPLOAD & PERMANENT STORAGE
 */
function previewImage(event) {
    const file = event.target.files[0];
    if(!file) return;

    const reader = new FileReader();
    reader.onload = function() {
        const base64Photo = reader.result;
        if(document.getElementById('userPhoto')) document.getElementById('userPhoto').src = base64Photo;

        // Update current session
        student.photo = base64Photo;
        localStorage.setItem('currentStudent', JSON.stringify(student));

        // Update Main Database (allStudents)
        let allStudents = JSON.parse(localStorage.getItem('allStudents')) || [];
        let sRoll = student.rollNo || student.roll;
        let idx = allStudents.findIndex(s => (s.rollNo === sRoll || s.roll === sRoll));
        if(idx !== -1) {
            allStudents[idx].photo = base64Photo;
            localStorage.setItem('allStudents', JSON.stringify(allStudents));
            alert("✅ Profile Photo Updated!");
        }
    };
    reader.readAsDataURL(file);
}

/**
 * 8. LOGOUT
 */
function logout() {
    if(confirm("Logout confirm karein?")) {
        localStorage.removeItem("studentActive");
        localStorage.removeItem("currentStudent");
        window.location.href = "student_login.html";
    }
}
