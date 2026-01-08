document.getElementById('teacherLoginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Aapke HTML ki IDs
    const tId = document.getElementById('tId').value.trim();
    const tPass = document.getElementById('tPass').value.trim();
    const tError = document.getElementById('tError');

    // Teacher Credentials (ID: T101, Pass: teacher123)
    if (tId === "T101" && tPass === "teacher123") {
        
        // 1. Teacher ki info save karna
        localStorage.setItem("role", "teacher");
        localStorage.setItem("teacherActive", "true"); // Dashboard security ke liye zaroori
        localStorage.setItem("teacherName", "Mr. Vinay Kumar");
        localStorage.setItem("teacherSubject", "Mathematics");

        // 2. Teacher ka data object (Security aur Profile ke liye)
        const teacherData = {
            id: tId,
            name: "Mr. Vinay Kumar",
            subject: "Mathematics",
            classTeacher: "10th-B"
        };
        localStorage.setItem("currentTeacher", JSON.stringify(teacherData));

        console.log("Login Successful! Redirecting...");

        // 3. Teacher Dashboard par bhejna
        window.location.href = "teacher_dashboard.html";
        
    } else {
        // Galat ID/Password hone par error dikhana
        if (tError) {
            tError.innerText = "❌ Invalid Teacher ID or Password!";
            tError.style.color = "red";
        } else {
            alert("❌ Invalid Credentials!");
        }
    }
});