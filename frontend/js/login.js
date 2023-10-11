const signupform = document.getElementById('signup-form');
const loginform = document.getElementById('login-form');

const signUpButton = document.getElementById('signup-btn');
const loginButton = document.getElementById('login-btn');

loginButton.addEventListener('click', (event) => {
    event.preventDefault()
    // userLogin(val_email.value, val_password.value);
});

signUpButton.addEventListener('click', (event) => {
    event.preventDefault()
    // userSignUp(val_email.value, val_password.value);
});
    

function toggleLoginSignUp(state){
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

