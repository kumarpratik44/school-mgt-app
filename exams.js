// 1. Security & Initial Load
document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("studentActive") !== "true") {
        window.location.href = "student-login.html";
        return;
    }

    // Name aur Class header mein set karna
    const sName = localStorage.getItem("studentName") || "Student";
    const studentData = JSON.parse(localStorage.getItem('currentStudent'));
    
    if(document.getElementById('dispName')) {
        document.getElementById('dispName').innerText = "Exams: " + sName;
    }
    if(studentData && document.getElementById('dispClass')) {
        document.getElementById('dispClass').innerText = `Class: ${studentData.class}-${studentData.section}`;
    }

    // Default: Pehla data load karein
    loadDynamicResults();
});

// 2. Tab Switching Logic
function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.style.display = 'none');
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

    const activeTab = document.getElementById(tabName);
    if(activeTab) activeTab.style.display = 'block';
    
    if(event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }

    // Agar Results ya Marksheet tab khule toh data refresh karein
    if(tabName === 'results' || tabName === 'final-marksheet') {
        loadDynamicResults();
    }
}

// 3. Dynamic Data Fetching & Table Rendering
function loadDynamicResults() {
    const rollNo = localStorage.getItem("rollNo");
    const allResults = JSON.parse(localStorage.getItem('schoolResults')) || {};
    const myResult = allResults[rollNo];

    if (!myResult) {
        console.log("No marks found for this student yet.");
        return; 
    }

    // Results Tab ki Table pakadna
    const resultsTableBody = document.querySelector('.result-table tbody');
    // Final Marksheet ki Table pakadna
    const finalTableBody = document.querySelector('.final-table tbody');

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