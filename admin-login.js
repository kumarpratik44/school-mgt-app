 document.getElementById('adminForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const user = document.getElementById('adminUser').value;
            const pass = document.getElementById('adminPass').value;

            // Secure simple check
            if(user === "admin" && pass === "admin123") {
                localStorage.setItem("adminActive", "true");
                window.location.href = "admin-dashboard.html";
            } else {
                alert("Unauthorized Access Attempt: Credentials Mismatch.");
            }
        });