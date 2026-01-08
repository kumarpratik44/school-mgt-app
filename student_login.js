document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const studentIdInput = document.getElementById('studentId');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('errorMessage');

    const sId = studentIdInput.value.trim(); // Trim zaroori hai space hatane ke liye
    const sPass = passwordInput.value.trim();

    if (sId === "101" && sPass === "pass123") {
        
        const studentData = {
            id: "101",
            name: "Riya Kumari",
            class: "10th",
            section: "B",
            fatherName: "Mr. Sharma",
            bloodGroup: "B+"
        };

        localStorage.setItem("studentActive", "true");
        localStorage.setItem("currentStudent", JSON.stringify(studentData));
        localStorage.setItem("studentName", studentData.name);
        localStorage.setItem("rollNo", studentData.id);

      
        window.location.href = "student_dashboard.html"; 

    } else {
        if (errorMessage) {
            errorMessage.innerText = "❌ Wrong ID or Password!";
            errorMessage.style.color = "red";
            errorMessage.style.display = "block";
        }
    }
});