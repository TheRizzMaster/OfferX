
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
        }
    }
    getSession();
    fetchClients();
    
});

const clientsTableBody = document.getElementById('table-content');

const addClientButton = document.getElementById('add-client-btn');
const saveClientButton = document.getElementById('save-client-btn');

const popUp = document.getElementById("create-popup");

const closeBtn = document.getElementsByClassName("close")[0];

const error = document.getElementById("create-error");

const company_name = document.getElementById('company_name');
const company_additional_text = document.getElementById('company_additional_name');
const address = document.getElementById('address');
const plz = document.getElementById('plz');
const city = document.getElementById('city');
const gender = document.getElementById('gender');
const first_name = document.getElementById('firstname');
const last_name = document.getElementById('lastname');
const email = document.getElementById('email');
const phone = document.getElementById('phone');


const showPopUp = document.getElementById("show-popup");
const showCloseBtn = document.getElementsByClassName("show-close")[0];

const showHeader = document.getElementById("show-header");
const showName = document.getElementById("show-name");
const showAdditionalName = document.getElementById("show-additional");
const showAddress = document.getElementById("show-address");
const showCity = document.getElementById("show-city");
const showEmail = document.getElementById("show-email");
const showPhone = document.getElementById("show-phone");
const showOffers = document.getElementById("show-offers");

document.getElementById('logout-btn').addEventListener('click', async (event) => {
    event.preventDefault();
    const { error } = await supa.auth.signOut();
    window.location.href = "./index.html";
});

addClientButton.addEventListener('click', (event) => {
    event.preventDefault();
    popUp.style.display = "flex";
});

closeBtn.addEventListener('click', (event) => {
    event.preventDefault();
    popUp.style.display = "none";
});

window.onclick = function (event) {
 if (event.target == popUp) {
     popUp.style.display = "none";
 }
}

showCloseBtn.addEventListener('click', (event) => {
    event.preventDefault();
    showPopUp.style.display = "none";
    document.body.style.overflow = "auto";
});

window.onclick = function (event) {
 if (event.target == showPopUp) {
     showPopUp.style.display = "none";
     document.body.style.overflow = "auto";
 }
}

saveClientButton.addEventListener('click', (event) => {
event.preventDefault();
createClient();
});




async function fetchClients() {

    const user = await retrieveUser();

    const { data: companys, error } = await supa
        .from('companys')
        .select('*')
        .eq('user_id', user.id)
        .eq('active', 'TRUE')
        .order('created_at', { ascending: false });

    if (error) {
        console.log(error.message);
        alert(error.message);
        return;
    }

    clientsTableBody.innerHTML = "";

    if(companys.length == 0) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td colspan="5">Sie haben noch keine Kunden erfasst.</td>
            `;
        clientsTableBody.appendChild(row);
        return;
    }

    companys.forEach(companys => {

        let company_name = companys.company_name;
        let city = companys.city;
        let contact_person;

        if(companys.company_name == null) {
            company_name = "";
        }

        if(companys.city == null) {
            city = "";
        }

        if(companys.first_name == null && companys.last_name == null || companys.first_name == "" && companys.last_name == "") {
            contact_person = "-";
        } else if(companys.first_name == null) {
            contact_person = companys.last_name;
        } else if(companys.last_name == null) {
            contact_person = companys.first_name;
        } else {
            contact_person = companys.first_name + " " + companys.last_name;
        }


        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${company_name}</td>
            <td>${contact_person}</td>
            <td>${city}</td>
            <td><a href="javascript:void(0);" class="view-btn" data-product-id='${companys.id}')"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M12.015 7c4.751 0 8.063 3.012 9.504 4.636-1.401 1.837-4.713 5.364-9.504 5.364-4.42 0-7.93-3.536-9.478-5.407 1.493-1.647 4.817-4.593 9.478-4.593zm0-2c-7.569 0-12.015 6.551-12.015 6.551s4.835 7.449 12.015 7.449c7.733 0 11.985-7.449 11.985-7.449s-4.291-6.551-11.985-6.551zm-.015 3c-2.21 0-4 1.791-4 4s1.79 4 4 4c2.209 0 4-1.791 4-4s-1.791-4-4-4zm-.004 3.999c-.564.564-1.479.564-2.044 0s-.565-1.48 0-2.044c.564-.564 1.479-.564 2.044 0s.565 1.479 0 2.044z" /></svg></a></td>
            <td width="3%"><a href="javascript:void(0);" class="delete-btn" data-product-id='${companys.id}'><svg fill="#000000" width="18" height="18" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 482.428 482.429" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M381.163,57.799h-75.094C302.323,25.316,274.686,0,241.214,0c-33.471,0-61.104,25.315-64.85,57.799h-75.098 c-30.39,0-55.111,24.728-55.111,55.117v2.828c0,23.223,14.46,43.1,34.83,51.199v260.369c0,30.39,24.724,55.117,55.112,55.117 h210.236c30.389,0,55.111-24.729,55.111-55.117V166.944c20.369-8.1,34.83-27.977,34.83-51.199v-2.828 C436.274,82.527,411.551,57.799,381.163,57.799z M241.214,26.139c19.037,0,34.927,13.645,38.443,31.66h-76.879 C206.293,39.783,222.184,26.139,241.214,26.139z M375.305,427.312c0,15.978-13,28.979-28.973,28.979H136.096 c-15.973,0-28.973-13.002-28.973-28.979V170.861h268.182V427.312z M410.135,115.744c0,15.978-13,28.979-28.973,28.979H101.266 c-15.973,0-28.973-13.001-28.973-28.979v-2.828c0-15.978,13-28.979,28.973-28.979h279.897c15.973,0,28.973,13.001,28.973,28.979 V115.744z"></path> <path d="M171.144,422.863c7.218,0,13.069-5.853,13.069-13.068V262.641c0-7.216-5.852-13.07-13.069-13.07 c-7.217,0-13.069,5.854-13.069,13.07v147.154C158.074,417.012,163.926,422.863,171.144,422.863z"></path> <path d="M241.214,422.863c7.218,0,13.07-5.853,13.07-13.068V262.641c0-7.216-5.854-13.07-13.07-13.07 c-7.217,0-13.069,5.854-13.069,13.07v147.154C228.145,417.012,233.996,422.863,241.214,422.863z"></path> <path d="M311.284,422.863c7.217,0,13.068-5.853,13.068-13.068V262.641c0-7.216-5.852-13.07-13.068-13.07 c-7.219,0-13.07,5.854-13.07,13.07v147.154C298.213,417.012,304.067,422.863,311.284,422.863z"></path> </g> </g> </g></svg></a></td>
            `;

        clientsTableBody.appendChild(row);

});


    const deleteClientButtons = document.querySelectorAll('.delete-btn');
    const viewClientButtons = document.querySelectorAll('.view-btn');

    deleteClientButtons.forEach(button => {
        button.addEventListener('click', (event) => {
        deleteClient(button.dataset.productId);
    });
});

    viewClientButtons.forEach(button => {
        button.addEventListener('click', (event) => {
        viewClient(button.dataset.productId);
    });
});
    


    console.log(companys);
}


async function createClient() {

    error.classList.add('hidden');

    const user = await retrieveUser();

    if(company_name.value == "" || address.value == "" || plz.value == "" || city.value == "") {
        error.textContent = "Bitte alle Pflichtfelder ausfüllen!";
        error.classList.remove('hidden');
        return;
    }

    const { error: create_error } = await supa
        .from('companys')
        .insert(
            {
                user_id: user.id,
                company_name: company_name.value,
                company_additional_name: company_additional_text.value,
                address: address.value,
                plz: plz.value,
                city: city.value,
                gender: gender.value,
                first_name: first_name.value,
                last_name: last_name.value,
                email: email.value,
                phone: phone.value,
                active: 'TRUE'
            });

    if (create_error) {
        console.log(create_error.message);
        error.textContent = "Error: " + create_error.message;
        error.classList.remove('hidden');
        return;
    }

    company_name.value = "";
    company_additional_text.value = "";
    address.value = "";
    plz.value = "";
    city.value = "";
    gender.value = "";
    first_name.value = "";
    last_name.value = "";
    email.value = "";
    phone.value = "";

    fetchClients();

    console.log("created");
    popUp.style.display = "none";
}

async function deleteClient(id) {

    const { error } = await supa
    .from('companys')
    .update({ active: 'FALSE' })
    .eq('id', id);

    if (error) {
        console.log(error.message);
        return;
    }

    fetchClients();

}

async function viewClient(id) {

    showOffers.innerHTML = "";

    const user = await retrieveUser();

    const { data: company, error } = await supa
        .from('companys')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.log(error.message);
        alert(error.message);
        return;
    }

    showHeader.textContent = company.company_name;
    showName.textContent = company.first_name + " " + company.last_name;
    showAdditionalName.textContent = company.company_additional_name;
    showAddress.textContent = company.address;
    showCity.textContent = company.plz + " " + company.city;
    showEmail.textContent = company.email;
    showPhone.textContent = company.phone;

    const { data: offers, error: error2 } = await supa
        .from('offers')
        .select('*')
        .eq('company_id', id);

    if (error2) {
        console.log(error2.message);
        alert(error2.message);
        return;
    }

    for (const offer of offers) {

        const date = new Date(offer.offer_date).toLocaleDateString('de-CH');


        showOffers.innerHTML += `
        <tr>
            <td>${date}</td>
            <td>${offer.offer_number}</td>
            <td>${offer.title}</td>
            <td><a href="javascript:void(0);" class="offer-view-btn" data-offer-id='${offer.id}')"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M12.015 7c4.751 0 8.063 3.012 9.504 4.636-1.401 1.837-4.713 5.364-9.504 5.364-4.42 0-7.93-3.536-9.478-5.407 1.493-1.647 4.817-4.593 9.478-4.593zm0-2c-7.569 0-12.015 6.551-12.015 6.551s4.835 7.449 12.015 7.449c7.733 0 11.985-7.449 11.985-7.449s-4.291-6.551-11.985-6.551zm-.015 3c-2.21 0-4 1.791-4 4s1.79 4 4 4c2.209 0 4-1.791 4-4s-1.791-4-4-4zm-.004 3.999c-.564.564-1.479.564-2.044 0s-.565-1.48 0-2.044c.564-.564 1.479-.564 2.044 0s.565 1.479 0 2.044z" /></svg></a></td>
        </tr>`;

    }

    const viewOfferButtons = document.querySelectorAll('.offer-view-btn');

    viewOfferButtons.forEach(button => {
        button.addEventListener('click', (event) => {
        viewOffer(button.dataset.offerId);
    });
});

    showPopUp.style.display = "flex";
    document.body.style.overflow = "hidden";



    console.log(id);
}

async function viewOffer(offerID) {
    window.location.href = "./view_offer.html?id=" + offerID;
}

async function retrieveUser() {
    const { data: { user } } = await supa.auth.getUser();
    return user;
}