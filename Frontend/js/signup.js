document.getElementById("signupForm").addEventListener("submit", function(e) {
   e.preventDefault();


   const firstName = document.getElementById("firstName").value.trim();
   const lastName = document.getElementById("lastName").value.trim();
   const email = document.getElementById("email").value.trim();
   const password = document.getElementById("password").value;
   const confirmPassword = document.getElementById("confirmPassword").value;


   // ✅ Name validation
   if (firstName === "" || lastName === "") {
       alert("First Name and Last Name are required.");
       return;
   }


   // ✅ Email domain validation
   const emailPattern = /^[a-zA-Z0-9._%+-]+@office\.uc\.ac\.kr$/;
   if (!emailPattern.test(email)) {
       alert("Email must be in the format: example@office.uc.ac.kr");
       return;
   }


   // ✅ Strong password validation
   // At least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
   const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;


   if (!strongPassword.test(password)) {
       alert("Password must be at least 8 characters and include uppercase, lowercase, number, and special character.");
       return;
   }


   // ✅ Confirm password
   if (password !== confirmPassword) {
       alert("Passwords do not match.");
       return;
   }


   alert("Signup successful! Ready to connect to backend.");
});
