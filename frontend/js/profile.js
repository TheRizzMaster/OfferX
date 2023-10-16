import { supa } from "./supabase.js";

document.addEventListener('DOMContentLoaded', function () {

    async function getSession() {
        const { data, error } = await supa.auth.getSession();
        if (data.session == null) {
            window.location.href = "./index.html";
            console.log("No session");
        } else {
            const user = await retrieveUser();
            console.log(user);

            getProfileData(user);
            getUserLogo();
        }
    }
    getSession();

});

document.getElementById('logout-btn').addEventListener('click', async (event) => {
    event.preventDefault();
    const { error } = await supa.auth.signOut();
    window.location.href = "./index.html";
});


const profileform = document.getElementById('profile-form');

const saveButton = document.getElementById('save-btn');

const title = document.getElementById('title');
const firstname = document.getElementById('firstname');
const lastname = document.getElementById('lastname');
const company = document.getElementById('company');
const company_additional = document.getElementById('company_additional');
const address = document.getElementById('address');
const zip = document.getElementById('zip');
const city = document.getElementById('city');

const fileUpload = document.getElementById('file');
const userLogo = document.getElementById('logo');

saveButton.addEventListener('click', (event) => {
    event.preventDefault();
    updateProfileData();
});

fileUpload.addEventListener('change', (event) => {
    console.log(fileUpload.files[0])

    if(fileUpload.files[0] == null) {
        return;
    }

    if(fileUpload.files[0].type !== "image/png") {
        alert("Bitte nur PNG-Dateien hochladen!");
        return;
    }

    const filesize = Math.round((fileUpload.files[0].size / 1024));

    if(filesize > 10240) {
        alert("Bitte eine Datei unter 10MB auswählen");
        return;
    }

    updateUserLogo();
});


async function getProfileData(user){

    const { data, error } = await supa
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

    if (error) {
        console.log(error.message);
    } else {
        title.value = data.title;
        firstname.value = data.firstname;
        lastname.value = data.lastname;
        company.value = data.company_name;
        company_additional.value = data.company_additional_name;
        address.value = data.address;
        zip.value = data.plz;
        city.value = data.city;
    }


}

async function updateProfileData() {

    lockInput();

    const user = await retrieveUser();

    const { error } = await supa
    .from('profiles')
    .update(
        {
            title: title.value,
            firstname: firstname.value,
            lastname: lastname.value,
            company_name: company.value,
            company_additional_name: company_additional.value,
            address: address.value,
            plz: zip.value,
            city: city.value
        }
    )
    .eq('id', user.id);

    if (error) {
        console.log(error.message);
        unlockInput();
    } else {
        console.log("Profile updated");
        unlockInput();
        
    }

}

async function getUserLogo() {

    const user = await retrieveUser();

    const { data, error } = await supa
    .from('logos')
    .select('*')
    .eq('user_id', user.id);

    if(error) {
        console.log("Error " + error.message);
        userLogo.src = "./img/placeholder_logo.png";
    } else if(data.length == 0) {
        console.log(data);
        userLogo.src = "./img/placeholder_logo.png";
    } else {
        console.log(data);
        const signedURL = await createSignedUrl();
        userLogo.src = signedURL;

    }

}

async function updateUserLogo() {

    const user = await retrieveUser();

        const file = fileUpload.files[0];
        const filePath = user.id + '/logo.png';

        const { data: checkdata, error: checkerror } = await supa
        .from('logos')
        .select('*')
        .eq('user_id', user.id);

        if(checkerror) {

        console.log("fehler beim Upload");

        } else if (checkdata.length == 0) {

            const { error: uploadError } = await supa
            .storage
            .from('logo_bucket')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: true
            });
            
            if (uploadError) {
                console.error('Error uploading file:', uploadError);
                return;
            }

        } else {

        const { error: uploadError } = await supa
        .storage
        .from('logo_bucket')
        .update(filePath, file, {
            cacheControl: '3600',
            upsert: true
        });
        
        if (uploadError) {
            console.error('Error uploading file:', uploadError);
            return;
        }
        
        }

        const { data, error } = await supa
        .from('logos')
        .upsert(
            {
                user_id: user.id,
                url: filePath,
                caption: "Custom User Logo"
            }
        )

        if (error) {
            console.error('Error saving to Photos table:', error);
        } else {
            console.log('Uploaded and saved successfully:', data);
            alert('Photo uploaded successfully!');
        }

        getUserLogo();

}

async function retrieveUser() {
    const { data: { user } } = await supa.auth.getUser();
    return user;
}

async function createSignedUrl() {

    const user = await retrieveUser();

    const { data, error } = await supa
    .storage
    .from('logo_bucket')
    .createSignedUrl(user.id + '/logo.png', 600);

    console.log(data);

    return data.signedUrl;

}


function lockInput() {
    document.querySelectorAll('input').forEach(input => input.disabled = true);
}

function unlockInput() {
    document.querySelectorAll('input').forEach(input => input.disabled = false);
}