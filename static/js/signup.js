document.addEventListener("DOMContentLoaded", function () {

const form = document.getElementById("signupForm");

if (!form) {
    console.log("Form not found ❌");
    return;
}

const firstNameInput = document.getElementById("firstName");
const lastNameInput = document.getElementById("lastName");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");

firstNameInput.addEventListener("input", () => {
    validateInput("firstName", "First name is required");
});

lastNameInput.addEventListener("input", () => {
    validateInput("lastName", "Last name is required");
});

emailInput.addEventListener("input", () => {
    validateEmail(emailInput.value.trim());
});

passwordInput.addEventListener("input", () => {
    validatePassword(passwordInput.value);
    validateConfirmPassword(passwordInput.value, confirmPasswordInput.value);
});

confirmPasswordInput.addEventListener("input", () => {
    validateConfirmPassword(passwordInput.value, confirmPasswordInput.value);
});

form.addEventListener("submit", async function(e) {
    e.preventDefault();

    console.log("Submit triggered ✅"); // DEBUG LINE

    const firstName = firstNameInput.value.trim();
    const lastName = lastNameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

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
        try {
            const response = await fetch("/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    email,
                    password
                })
            });

            const result = await response.json();

            alert(result.message);

            if (result.success) {
                form.reset();
            }

        } catch (error) {
            console.error("Error:", error);
            alert("Ready to Login! 🎉");
        }
    }
});

function validateInput(id, message) {
    const input = document.getElementById(id);
    const group = input.parentElement;
    const hint = group.querySelector(".hint");

    if (input.value.trim() === "") {
        group.classList.add("error");
        group.classList.remove("success");
        if (hint) hint.textContent = message;
    } else {
        group.classList.remove("error");
        group.classList.add("success");
        if (hint) hint.textContent = "";
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
        if (hint) hint.textContent = "Use your campus email";
    } else {
        group.classList.remove("error");
        group.classList.add("success");
        if (hint) hint.textContent = "";
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
        if (hint) hint.textContent = "Weak password";
    } else {
        group.classList.remove("error");
        group.classList.add("success");
        if (hint) hint.textContent = "";
    }
}

function validateConfirmPassword(password, confirmPassword) {
    const input = document.getElementById("confirmPassword");
    const group = input.parentElement;
    const hint = group.querySelector(".hint");

    if (confirmPassword === "" || password !== confirmPassword) {
        group.classList.add("error");
        group.classList.remove("success");
        if (hint) hint.textContent = "Passwords do not match";
    } else {
        group.classList.remove("error");
        group.classList.add("success");
        if (hint) hint.textContent = "";
    }
}

});