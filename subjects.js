document.addEventListener("DOMContentLoaded", () => {
    // 1. Header Update Karein
    const sName = localStorage.getItem("studentName");
    const sClass = localStorage.getItem("studentClass");

    if (sName) {
        document.getElementById('dispName').innerText = `Namaste, ${sName}! 👋`;
        document.getElementById('dispClass').innerText = `Class: ${sClass}`;
    }

    // 2. View Notes Button ki Click Handling
    const viewButtons = document.querySelectorAll('.view-btn');
    
    viewButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Pata lagao ki kis subject par click hua hai
            const subjectName = e.target.parentElement.querySelector('h4').innerText;
            
            // Abhi ke liye sirf alert dikhayenge, baad mein naya page khulega
            alert(`${subjectName} ke notes abhi load ho rahe hain...`);
            
            // Aap aise bhi kar sakte hain:
            // window.location.href = `notes.html?subject=${subjectName}`;
        });
    });
});

// 3. Bottom Navigation Function
function goToPage(pageName) {
    window.location.href = pageName + ".html";
}