import { supa } from "./supabase.js";

const signupform = document.getElementById('signup-form');
const loginform = document.getElementById('login-form');
const forgetform = document.getElementById('reset-password-form');

const signUpButton = document.getElementById('signup-btn');
const loginButton = document.getElementById('login-btn');
const resetButton = document.getElementById('reset-btn');

const signInEmail = document.getElementById('email');
const signInPassword = document.getElementById('password');

const firstname = document.getElementById('firstname');
const lastname = document.getElementById('lastname');
const signUpEmail = document.getElementById('signup-email');
const signUpPassword = document.getElementById('signup-password');

const resetEmail = document.getElementById('reset-email');

const loginError = document.getElementById('login-error');
const signupError = document.getElementById('signup-error');
const resetError = document.getElementById('reset-error');

const toggleLoginButton = document.getElementById('toggleToLogin');
const toggleSignUpButton = document.getElementById('toggleToSignUp');
const resetPasswordButton = document.getElementById('forget');
const backToLoginButton = document.getElementById('backToLogin');

toggleLoginButton.addEventListener('click', (event) => {
    event.preventDefault();
    toggleLoginSignUp();
});

toggleSignUpButton.addEventListener('click', (event) => {
    event.preventDefault();
    toggleLoginSignUp();
});

loginButton.addEventListener('click', (event) => {
    event.preventDefault();
    userLogin(signInEmail.value, signInPassword.value);
});

signUpButton.addEventListener('click', (event) => {
    event.preventDefault();
    userSignUp(signUpEmail.value, signUpPassword.value, firstname.value, lastname.value);
});

resetButton.addEventListener('click', (event) => {
    event.preventDefault();
    resetPassword(resetEmail.value);
});

resetPasswordButton.addEventListener('click', (event) => {
    event.preventDefault();

    if (signupform.classList.contains('hidden')) {
        loginform.classList.add('hidden');
        forgetform.classList.remove('hidden');
    } else {
        signupform.classList.add('hidden');
        forgetform.classList.remove('hidden');
    }
});

backToLoginButton.addEventListener('click', (event) => {
    event.preventDefault();
    forgetform.classList.add('hidden');
    loginform.classList.remove('hidden');
});

function toggleLoginSignUp() {
    let loginform = document.getElementById('login-form');
    let signupform = document.getElementById('signup-form');

    if (signupform.classList.contains('hidden')) {
        signupform.classList.remove('hidden');
        loginform.classList.add('hidden');
    } else {
        signupform.classList.add('hidden');
        loginform.classList.remove('hidden');
    }
}

async function userLogin(email, password) {

    if(email == "" || password == "") {
        loginError.innerHTML = "Error: Bitte alle Felder ausfüllen";
        loginError.classList.remove('hidden');
        return;
    }

    loginError.classList.add('hidden');

    const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (!email.match(validRegex)) {
        loginError.innerHTML = "Error: E-Mail ungültig";
        loginError.classList.remove('hidden');
        return;
    }

    lockInput();
    const { user, error } = await supa.auth.signInWithPassword({
        email: email,
        password: password
    })
    if (error) {
        unlockInput();
        console.log(error.message)
        loginError.innerHTML = "Error: " + error.message;
        loginError.classList.remove('hidden');
    } else {
        console.log("Login erfolgreich");
        window.location.href = "dashboard.html";
    }
}


async function userSignUp(email_val, password_val, firstname_val, lastname_val) {

    if(email_val == "" || password_val == "" || firstname_val == "" || lastname_val == "") {
        signupError.innerHTML = "Error: Bitte alle Felder ausfüllen";
        signupError.classList.remove('hidden');
        return;
    }

    if(password_val.length < 8) {
        signupError.innerHTML = "Error: Passwort muss mindestens 8 Zeichen lang sein";
        signupError.classList.remove('hidden');
        return;
    }

    signupError.classList.add('hidden');

    const validRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    if (!email_val.match(validRegex)) {
        signupError.innerHTML = "Error: E-Mail ungültig";
        signupError.classList.remove('hidden');
        return;
    }

    lockInput();
    const { data, error } = await supa.auth.signUp(
        {
            email: email_val,
            password: password_val,
            options: {
                data: {
                    emailRedirectTo: 'http://127.0.0.1:5500/frontend/profile.html',
                    first_name: firstname_val,
                    last_name: lastname_val
                }
            }
        
    });

    if (error) {
        unlockInput();
        console.log(error.message)
        signupError.innerHTML = "Error:" + error.message;
        signupError.classList.remove('hidden');
    } else {
        console.log("Registrierung erfolgreich")
        signupError.innerHTML = "Wir haben dir eine Mail gesendet, bitte bestätige deine E-Mail Adresse";
        signupError.style.color = "green";
        signupError.classList.remove('hidden');
        return;
    }
}

async function resetPassword(email_val) {

    resetError.classList.add('hidden');

    if(email_val == "") {
        resetError.innerHTML = "Error: Bitte Mail ausfüllen";
        resetError.classList.remove('hidden');
        return;
    }

    const validRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    if (!email_val.match(validRegex)) {
        signupError.innerHTML = "Error: E-Mail ungültig";
        signupError.classList.remove('hidden');
        return;
    }

    lockInput();
    const { data, error } = await supa.auth.resetPasswordForEmail(
        email_val,
        {
        redirectTo: 'http://127.0.0.1:5500/frontend/forgot.html',
      });

      if (error) {
        console.log(error.message)
        resetError.innerHTML = "Error:" + error.message;
        resetError.classList.remove('hidden');
        unlockInput();
      } else {
        console.log("Reset erfolgreich")
        resetError.innerHTML = "Wir haben dir eine Mail gesendet, bitte setze dein Passwort zurück!";
        resetError.style.color = "green";
        resetError.classList.remove('hidden');
        return;
      }
}

function lockInput() {
    document.querySelectorAll('input').forEach(input => input.disabled = true);
}

function unlockInput() {
    document.querySelectorAll('input').forEach(input => input.disabled = false);
}