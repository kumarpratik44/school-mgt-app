// 1. Security & Initial Load
document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("studentActive") !== "true") {
        window.location.href = "student-login.html";
        return;
    }

    /// 2. Header Info Update
    const sName = localStorage.getItem("studentName") || "Student";
    const studentData = JSON.parse(localStorage.getItem('currentStudent'));
    
    if(document.getElementById('dispName')) {
        document.getElementById('dispName').innerText = "Exams: " + sName;
    }
    if(studentData && document.getElementById('dispClass')) {
        document.getElementById('dispClass').innerText = `Class: ${studentData.class}-${studentData.section}`;
    }

    // 3. DONO DATA LOAD KAREIN
    loadLiveSchedules();   // Teacher wala live schedule
    loadDynamicResults(); // Admin wala marksheet data
});

// 2. Tab Switching Logic
function showTab(tabName, event) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.style.display = 'none');
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

    const activeTab = document.getElementById(tabName);
    if(activeTab) activeTab.style.display = 'block';
    
    if(event) {
        event.currentTarget.classList.add('active');
    }
}

// Schedule tab mein Teacher ka post kiya hua data dikhane ke liye
function loadLiveSchedules() {
    const student = JSON.parse(localStorage.getItem('currentStudent'));
    const allNotes = JSON.parse(localStorage.getItem('schoolNotes')) || [];
    const scheduleContainer = document.getElementById('schedule');

    // Filter: Type 'exam' + Sahi Class
    const exams = allNotes.filter(n => n.type === 'exam' && n.class === student.class);

    if (exams.length > 0) {
        let liveHTML = '<h3 style="padding:10px; font-size:14px; color:#764ba2;">Latest from Teacher:</h3>';
        exams.reverse().forEach(ex => {
            liveHTML += `
                <div class="exam-card upcoming" style="border-left: 5px solid #764ba2;">
                    <div class="exam-date"><span>${ex.date.split('/')[0]}</span><br>${ex.date.split('/')[1]}</div>
                    <div class="exam-details">
                        <h4>${ex.subject}</h4>
                        <p>${ex.content}</p>
                        <small>Posted on: ${ex.date}</small>
                    </div>
                </div>`;
        });
        // Static cards ke upar live cards dikhana
        scheduleContainer.innerHTML = liveHTML + scheduleContainer.innerHTML;
    }
}


// 3. Dynamic Data Fetching & Table Rendering
function loadDynamicResults() {
    const rollNo = localStorage.getItem("rollNo");
    const allResults = JSON.parse(localStorage.getItem('schoolResults')) || {};
    const myResult = allResults[rollNo];

    // Results Tab ki Table pakadna
    const resultsTableBody = document.querySelector('.result-table tbody');
    // Final Marksheet ki Table pakadna
    const finalTableBody = document.querySelector('.final-table tbody');

    if (!myResult) {
        console.log("No marks found for this student yet.");
        return; 
    }

    

    let resultsHTML = "";
    let finalHTML = "";
    let grandTotalObtained = 0;
    let grandMaxPossible = 0;

    // Subjects loop
    Object.keys(myResult).forEach(subject => {
        const m = myResult[subject]; // marks object {ut1, ut2, hy, annual}
        
        const utTotal = (m.ut1 || 0) + (m.ut2 || 0);
        const subTotal = utTotal + (m.hy || 0) + (m.annual || 0);
        const subMax = 250; // UT1(25)+UT2(25)+HY(100)+ANNUAL(100)
        
        grandTotalObtained += subTotal;
        grandMaxPossible += subMax;

        const grade = calculateGrade(subTotal, subMax);

        // 1. Fill Results Tab Table
        resultsHTML += `
            <tr>
                <td>${subject}</td>
                <td>${m.ut1 || 0}/25</td>
                <td>${m.ut2 || 0}/25</td>
                <td>${m.hy || 0}/100</td>
                <td>${m.annual || 0}/100</td>
                <td><strong>${grade}</strong></td>
            </tr>
        `;

        // 2. Fill Final Marksheet Table
        finalHTML += `
            <tr>
                <td>${subject}</td>
                <td>${utTotal}</td>
                <td>${m.hy || 0}</td>
                <td>${m.annual || 0}</td>
                <td><b>${subTotal}</b></td>
                <td class="grade-${grade.toLowerCase().replace('+', '')}">${grade}</td>
            </tr>
        `;
    });

    if(resultsTableBody) resultsTableBody.innerHTML = resultsHTML;
    if(finalTableBody) finalTableBody.innerHTML = finalHTML;

    // Summary Update (Total, Percentage, Result)
    updateSummary(grandTotalObtained, grandMaxPossible);
}


// 4. Helper: Grade Calculation
function calculateGrade(score, max) {
    const per = (score / max) * 100;
    if (per >= 90) return "A+";
    if (per >= 80) return "A";
    if (per >= 70) return "B";
    if (per >= 60) return "C";
    return "D";
}

// 5. Helper: Summary Box Update
function updateSummary(total, max) {
    const percentage = ((total / max) * 100).toFixed(1);
    
    // HTML elements check karke update karna
    const totalElement = document.querySelector('.summary-item:nth-child(1) strong');
    const perElement = document.querySelector('.summary-item:nth-child(2) strong');
    const resultStatus = document.querySelector('.summary-item:nth-child(3) strong');
    const cgpaDisplay = document.querySelector('.circle-progress h3');

    if(totalElement) totalElement.innerText = `${total} / ${max}`;
    if(perElement) perElement.innerText = `${percentage}%`;
    if(resultStatus) {
        resultStatus.innerText = percentage >= 40 ? "PASSED" : "FAILED";
        resultStatus.style.color = percentage >= 40 ? "green" : "red";
    }
    if(cgpaDisplay) cgpaDisplay.innerText = (percentage / 10).toFixed(1);
}
