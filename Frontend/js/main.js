// 🔗 NAVIGATION

function goToLogin(){
    window.location.href = "login.html";
}

function goToSignup(){
    window.location.href = "/Frontend/signup.html";
}


// ✨ TYPEWRITER EFFECT

const text = "Welcome to our Ulsan College Community!!!";
let index = 0;

function typeEffect() {
    const element = document.getElementById("welcome-text");
    if (!element) return;

    if (index < text.length) {
        element.innerHTML += text.charAt(index);
        index++;
        setTimeout(typeEffect, 50);
    }
}


// 🔒 FORCE ENGLISH DEFAULT

window.addEventListener("load", function () {

    // Start typewriter
    typeEffect();

    // Google translate fix
    const interval = setInterval(() => {
        const select = document.querySelector(".goog-te-combo");

        if (select) {
            select.value = "en";
            select.dispatchEvent(new Event("change"));

            document.cookie = "googtrans=;path=/";

            clearInterval(interval);
        }
    }, 300);
});