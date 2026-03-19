document.getElementById("signupForm").addEventListener("submit", function(e) {
   e.preventDefault();

   const email = document.getElementById("email").value.trim();
const emailPattern = /^[a-zA-Z0-9._%+-]+@office\.uc\.ac\.kr$/;
const password = document.getElementById("password").value;

const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

if (!strongPassword.test(password)) {
   alert("Password must be strong");
   return;
}

if (!emailPattern.test(email)) {
   alert("Email must be @office.uc.ac.kr");
   return;
}
   const firstName = document.getElementById("firstName").value.trim();
const lastName = document.getElementById("lastName").value.trim();

if (firstName === "") {
   alert("First name is required");
   return;
}

if (lastName === "") {
   alert("Last name is required");
   return;
}

 alert("Signup successful!");

});
