document.getElementById("signupForm").addEventListener("submit", function(e) {
   e.preventDefault();

   const email = document.getElementById("email").value.trim();
const emailPattern = /^[a-zA-Z0-9._%+-]+@office\.uc\.ac\.kr$/;

if (!emailPattern.test(email)) {
   alert("Email must be @office.uc.ac.kr");
   return;
}

});