import { supa } from "./supabase.js";

const forgetform = document.getElementById('reset-password-form');

const resetButton = document.getElementById('reset-btn');

const newPassword = document.getElementById('new-password');
const repeatPassword = document.getElementById('repeat-password');

const resetError = document.getElementById('reset-error');

resetButton.addEventListener('click', (event) => {
    event.preventDefault();
    resetPassword(newPassword.value, repeatPassword.value);
});

async function resetPassword(newPassword_val, repeatPassword_val) {

    resetError.classList.add('hidden');

    if(newPassword_val === "" || repeatPassword_val === "") {
        resetError.innerHTML = "Bitte fülle alle Felder aus!";
        resetError.classList.remove('hidden');
        return;
    }

    if(newPassword_val.length < 8) {
        resetError.innerHTML = "Das Passwort muss mindestens 8 Zeichen lang sein!";
        resetError.classList.remove('hidden');
        return;
    }

    if (newPassword_val === repeatPassword_val) {

        lockInput();
        const { data, error } = await supa.auth.updateUser({
            password: newPassword_val,
          });

        if (error) {
            resetError.textContent = error.message;
            resetError.classList.remove('hidden');
            unlockInput();
        } else {
            resetError.textContent = "Passwort erfolgreich geändert! Du wirst in 5 Sekunden weitergeleitet.";
            resetError.style.color = "green";
            resetError.classList.remove('hidden');
            setTimeout(function () {
                window.location.href = "./index.html";
            }, 5000);
        }
    } else {
        resetError.textContent = "Die Passwörter müssen übereinstimmen!";
        resetError.classList.remove('hidden');
    }
}

function lockInput() {
    document.querySelectorAll('input').forEach(input => input.disabled = true);
}

function unlockInput() {
    document.querySelectorAll('input').forEach(input => input.disabled = false);
}