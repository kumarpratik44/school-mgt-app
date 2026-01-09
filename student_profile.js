// --- 1. SECURITY CHECK ---
if (localStorage.getItem("studentActive") !== "true") {
    window.location.href = "student_login.html";
}

// --- 2. GLOBAL PAGE LOAD ---
window.onload = function() {
    renderAllData();
    if(document.querySelector('.notice-card')) renderAdminNotice();
    if(document.getElementById('attendancePercent')) updateAttendanceUI();
    if(document.querySelector('.stat-card')) updateFeeStatus();
};

// --- 3. MASTER RENDER FUNCTION ---
function renderAllData() {
    // LocalStorage se data uthao
    const student = JSON.parse(localStorage.getItem('currentStudent'));

    // AGAR DATA NAHI HAI TOH LOGIN PAR BHEJO (Safety First)
    if (!student) {
        // Sirf un pages par login par bheje jo dashboard ke andar hain
        if(!window.location.href.includes('login')) {
            window.location.href = 'student-login.html';
        }
        return;
    }

    // --- Dashboard Elements ---
    const dispName = document.getElementById('dispName');
    const dispClass = document.getElementById('dispClass');
    
    // --- Profile Page Elements ---
    const profName = document.getElementById('profName');
    const profId = document.getElementById('profId');
    const profFather = document.getElementById('profFather');
    const profBlood = document.getElementById('profBlood');
    const headerBlood = document.getElementById('headerBlood');

    // UI Updates with Dynamic Data
    if(dispName) dispName.innerText = `Namaste, ${student.name}! 👋`;
    
    // Class aur Section ko profile ke hisaab se dikhana
    const classDisplay = `Class: ${student.class}-${student.section}`;
    if(dispClass) dispClass.innerText = `${classDisplay} | F. Name: ${student.fatherName}`;
    
    if(profName) profName.innerText = student.name;
    
    // ID ya RollNo jo bhi aapne save kiya ho
    const rollNo = student.rollNo || student.id || "101";
    if(profId) profId.innerText = `Roll No: ${rollNo} | ${classDisplay}`;
    
    if(profFather) profFather.innerText = student.fatherName;
    if(profBlood) profBlood.innerText = `${student.bloodGroup || "B+"} Positive`;
    if(headerBlood) headerBlood.innerHTML = `<i class="fas fa-tint"></i> Blood Group: ${student.bloodGroup || "B+"}`;

    // --- Photo Load Logic (Updated) ---
    const imgElement = document.getElementById('userPhoto');
    // Pehle dekho kya 'currentStudent' ke andar photo hai?
    if(imgElement) {
        if(student.photo) {
            imgElement.src = student.photo;
        } else {
            // Default image agar bache ne photo upload nahi ki
            imgElement.src = "/image/default-avatar.jpg";
        }
    }
}

// --- 4. PHOTO PREVIEW & SAVE (Updated for better Sync) ---
function previewImage(event) {
    const file = event.target.files[0];
    if(!file) return;

    if(file.size > 2 * 1024 * 1024) return alert("Photo size should be less than 2MB");

    const reader = new FileReader();
    reader.onload = function() {
        const base64Photo = reader.result; // Ye hamari photo ka data hai
        
        const imgElement = document.getElementById('userPhoto');
        if(imgElement) imgElement.src = base64Photo;

        // 1. Current Session update karein
        let student = JSON.parse(localStorage.getItem('currentStudent'));
        if(student) {
            student.photo = base64Photo;
            localStorage.setItem('currentStudent', JSON.stringify(student));
        }

        // 2. SABSE ZAROORI: Main Database (allStudents) ko bhi update karein
        // Iske bina refresh karne par photo chali jayegi
        let allStudents = JSON.parse(localStorage.getItem('allStudents')) || [];
        let rollNo = student.rollNo || student.id;
        
        let index = allStudents.findIndex(s => s.rollNo === rollNo);
        if(index !== -1) {
            allStudents[index].photo = base64Photo; // Main Database mein photo daal di
            localStorage.setItem('allStudents', JSON.stringify(allStudents));
            console.log("Photo permanently saved in Database!");
        }
    };
    reader.readAsDataURL(file);
}
// --- 5. LOGOUT FUNCTION ---
function logout() {
    if(confirm("Kya aap logout karna chahte hain?")) {
        localStorage.removeItem("studentActive");
        // currentStudent ko delete nahi karenge taaki login fast ho sake
        window.location.href = "student_login.html";
    }
}

// --- 6. ATTENDANCE & FEES (Dashboard Specific) ---
function updateAttendanceUI() {
    const myRoll = localStorage.getItem("rollNo");
    const history = JSON.parse(localStorage.getItem('attendanceData')) || {};
    let totalDays = Object.keys(history).length;
    let presentDays = 0;

    if (totalDays > 0) {
        for (let date in history) {
            if (history[date][myRoll] === 'P') presentDays++;
        }
        let percent = Math.round((presentDays / totalDays) * 100);
        const el = document.getElementById('attendancePercent');
        if(el) {
            el.innerText = percent + "%";
            el.style.color = (percent < 75) ? "#ff4d4d" : "#00b09b";
        }
    }
}

function updateFeeStatus() {
    const student = JSON.parse(localStorage.getItem('currentStudent'));
    const allFeeRecords = JSON.parse(localStorage.getItem('studentFees')) || [];
    const paid = allFeeRecords
                .filter(f => f.name === student.name)
                .reduce((sum, f) => sum + parseInt(f.amount), 0);

    const pending = 20000 - paid; // Example Base Fee
    const feeDisplay = document.querySelectorAll('.stat-card h3');
    if(feeDisplay.length >= 2) {
        feeDisplay[1].innerText = `₹${pending > 0 ? pending : 0}`;
    }
}
