document.addEventListener("DOMContentLoaded", () => {
    // 1. Header & Data Sync
    const student = JSON.parse(localStorage.getItem('currentStudent'));
    if (student) {
        if(document.getElementById('dispName')) 
            document.getElementById('dispName').innerText = `Namaste, ${student.name}! 👋`;
        if(document.getElementById('dispClass')) 
            document.getElementById('dispClass').innerText = `Class: ${student.class}-${student.section}`;
    }

    // 2. Navigation Highlight
    const subNavItem = document.getElementById('nav-subjects');
    if(subNavItem) {
        document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
        subNavItem.classList.add('active');
    }

    // 3. View Notes Click Handling (Connecting to Teacher Data)
    const viewButtons = document.querySelectorAll('.view-btn');
    viewButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Card se subject ka naam uthao
            const subjectName = e.target.parentElement.querySelector('h4').innerText;
            
            // Function call karo (Jo niche define kiya gaya hai)
            viewSubjectNotes(subjectName);
        });
    });
});

// 4. IMPORTANT: Ise DOMContentLoaded ke BAHAR rakhein taaki HTML ise access kar sake
function viewSubjectNotes(subjectName) {
    const student = JSON.parse(localStorage.getItem('currentStudent'));
    const allNotes = JSON.parse(localStorage.getItem('schoolNotes')) || [];

    if(!student) {
        alert("Session expired. Please login again.");
        return;
    }

    // FILTER LOGIC: Sirf wahi jo is bache ki class, section aur clicked subject ka ho
    const relevantNotes = allNotes.filter(n => 
        n.class === student.class && 
        n.section === student.section && 
        n.subject.toLowerCase() === subjectName.toLowerCase() // Case insensitive match
    ).reverse(); // Taaki naya homework sabse upar dikhe

    if(relevantNotes.length > 0) {
        let displayList = relevantNotes.map(n => `📅 ${n.date}\n📝 ${n.content}`).join('\n\n------------------\n\n');
        alert(`--- ${subjectName.toUpperCase()} HOMEWORK ---\n\n` + displayList);
    } else {
        alert(`Abhi ${subjectName} ka koi homework ya notes upload nahi hue hain.`);
    }
}
