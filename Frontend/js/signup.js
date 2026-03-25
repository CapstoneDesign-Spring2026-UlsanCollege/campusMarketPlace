const form = document.getElementById("signupForm");

form.addEventListener("submit", function(e) {
   e.preventDefault();

   const firstName = document.getElementById("firstName").value.trim();
   const lastName = document.getElementById("lastName").value.trim();
   const email = document.getElementById("email").value.trim();
   const password = document.getElementById("password").value;
   const confirmPassword = document.getElementById("confirmPassword").value;

   validateInput("firstName", "First name is required");
   validateInput("lastName", "Last name is required");
   validateEmail(email);
   validatePassword(password);
   validateConfirmPassword(password, confirmPassword);

   if (
       firstName !== "" &&
       lastName !== "" &&
       /^[a-zA-Z0-9._%+-]+@office\.uc\.ac\.kr$/.test(email) &&
       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password) &&
       password === confirmPassword
   ) {
       alert("Signup successful! Ready to connect to backend.");
   }
});

function validateInput(id, message) {
   const input = document.getElementById(id);
   const group = input.parentElement;
   const hint = group.querySelector(".hint");

   if (input.value.trim() === "") {
       group.classList.add("error");
       group.classList.remove("success");
       hint.textContent = message;
   } else {
       group.classList.remove("error");
       group.classList.add("success");
   }
}

function validateEmail(email) {
   const input = document.getElementById("email");
   const group = input.parentElement;
   const hint = group.querySelector(".hint");

   const pattern = /^[a-zA-Z0-9._%+-]+@office\.uc\.ac\.kr$/;

   if (!pattern.test(email)) {
       group.classList.add("error");
       group.classList.remove("success");
       hint.textContent = "Invalid campus email";
   } else {
       group.classList.remove("error");
       group.classList.add("success");
   }
}

function validatePassword(password) {
   const input = document.getElementById("password");
   const group = input.parentElement;
   const hint = group.querySelector(".hint");

   const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

   if (!pattern.test(password)) {
       group.classList.add("error");
       group.classList.remove("success");
       hint.textContent = "Weak password";
   } else {
       group.classList.remove("error");
       group.classList.add("success");
   }
}

function validateConfirmPassword(password, confirmPassword) {
   const input = document.getElementById("confirmPassword");
   const group = input.parentElement;
   const hint = group.querySelector(".hint");

   if (password !== confirmPassword || confirmPassword === "") {
       group.classList.add("error");
       group.classList.remove("success");
       hint.textContent = "Passwords do not match";
   } else {
       group.classList.remove("error");
       group.classList.add("success");
   }
}