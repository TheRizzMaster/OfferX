import { supa } from "./supabase.js";

document.addEventListener('DOMContentLoaded', function () {

    async function getSession() {
        const { data, error } = await supa.auth.getSession();
        if (data.session == null) {
            window.location.href = "./index.html";
            console.log("No session");
        } else {

            const w = window.innerWidth;
            if(w < 900) {
                alert("Diese Seite ist auf mobilen Geräten nicht verfügbar. Bitte öffnen Sie die Seite auf einem Computer.")
                window.location.href = "./dashboard.html";
            }

            const user = await retrieveUser();
            console.log(user);
        }
    }
    getSession();
    fetchClientData();
    fetchProductData();

    localStorage.setItem("offer_id", null);
    localStorage.setItem("totalAmount", "0");


    
});

const clientSelection = document.getElementById('client_select');

const productSelection = document.getElementById('product_select');

const offerDate = document.getElementById('date');
const offerTitle = document.getElementById('title');
const offerMessage = document.getElementById('message');

const quantity = document.getElementById('quantity');
const addError = document.getElementById('add-error');

const addProductButton = document.getElementById('add-product-btn');
const saveProductButton = document.getElementById('save-product-btn');

const closeBtn = document.getElementsByClassName("close")[0];

const popUp = document.getElementById("select-popup");

const productsTable = document.getElementById('product-table');
const productsTableBody = document.getElementById('product-table-content');

const vatInput = document.getElementById("vat");

const validityInput = document.getElementById("validity");

const generateOfferButton = document.getElementById("generateOfferBtn");

const clientAddress = document.getElementById("client-address");

const offerData = document.getElementById("offer-data");
const offerDataTable = document.getElementById("offer-data-table");

addProductButton.addEventListener('click', (event) => {
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

saveProductButton.addEventListener('click', (event) => {
event.preventDefault();
addProduct();
});

generateOfferButton.addEventListener('click', (event) => {
    event.preventDefault();
    showOffer();
});

// const availableProducts = await fetchProductData();

async function fetchClientData(){

    const user = await retrieveUser();

    const { data: clients, error } = await supa
        .from('companys')
        .select('*')
        .eq('user_id', user.id);

    if (error) {
        console.log(error);
        return;
    }

    console.log(clients);

    clients.forEach(client => {
        
        const option = document.createElement('option');
        option.value = client.id;
        option.innerText = client.company_name + " | " + client.address + " | " + client.plz + " " + client.city;
        clientSelection.appendChild(option);

    });


}

async function fetchProductData() {
    
        const user = await retrieveUser();
    
        const { data: products, error } = await supa
            .from('products')
            .select('*')
            .eq('user_id', user.id);
    
        if (error) {
            console.log(error);
            return;
        }
    
        console.log(products);
    

        products.forEach(product => {
            
            const option = document.createElement('option');
            option.value = product.id;
            if(product.additional_text == "" && product.unit == "" || product.additional_text == null && product.unit == null) {
                option.innerText = product.product_name + " | " + product.price + ".—";
            } else if(product.additional_text == "" || product.additional_text == null) {
                option.innerText = product.product_name + " | " + product.unit + " | " + product.price + ".—";
            } else {
                option.innerText = product.product_name + " | " + product.additional_text + " | " + product.unit + " | " + product.price + ".—";
            }
            productSelection.appendChild(option);
    
        });

}

async function createOffer() {
    
    if (localStorage.getItem("offer_id") != "null") {
        console.log("offerte bereits erstellt")
        return;
    }

    const user = await retrieveUser();

    console.log(user);

    const client_id = clientSelection.value;
    const offer_date = offerDate.value;
    const offer_title = offerTitle.value;
    const offer_message = offerMessage.value;
    const validity = validityInput.value;

    let offerNr = "";

    const date = new Date(offer_date);

    offerNr = date.getFullYear() + date.getMonth() + date.getDay() + "-" + Math.floor(Math.random() * 10000) + 1;

    const { data, error } = await supa
    .from('offers')
    .insert([
        { 
            user_id: user.id,
            company_id: client_id,
            offer_number: offerNr,
            offer_date: offer_date,
            title: offer_title,
            message: offer_message,
            validity: validity,
            status: "open"
        }
    ]);

    if (error) {
        console.log(error);
        return;
    }

    const { data: offers, error2 } = await supa
    .from('offers')
    .select('*')
    .eq('user_id', user.id)
    .eq('company_id', client_id)
    .eq('offer_date', offer_date)
    .eq('title', offer_title)
    .eq('message', offer_message)
    .single();

    if (error2) {
        console.log(error2);
        return;
    }

    localStorage.setItem("offer_id", await offers.id);

    console.log(offers);

    const { data: clients, error3 } = await supa
    .from('companys')
    .select('*')
    .eq('id', client_id)
    .single();

    if (error3) {
        console.log(error3);
        return;
    }

    if(clients.first_name == "" || clients.first_name == null) {
        clientAddress.innerHTML = `
        <h3>Empfänger</h3>
        <p>${clients.company_name}</p>
        <p>${clients.address}</p>
        <p>${clients.plz} ${clients.city}</p>
    `;
    } else {
        clientAddress.innerHTML = `
        <h3>Empfänger</h3>
        <p>${clients.company_name}</p>
        <p>${clients.first_name} ${clients.last_name}</p>
        <p>${clients.address}</p>
        <p>${clients.plz} ${clients.city}</p>
    `;
    }

    offerData.innerHTML = `
        <h3>Inhalt</h3>
        <p>Datum: ${offer_date}</p>
        <p>Betreff: ${offer_title}</p>
        <p>Gültigkeit: ${validity} Tage</p>
        <p>Nachricht: ${offer_message}</p>
    `;


}

async function addProduct() {

    addError.classList.add('hidden');

    if (quantity.value == "") {
        addError.innerText = "Bitte geben Sie eine Menge ein.";
        addError.classList.remove('hidden');
        return;
    }

    if (quantity.value <= 0) {
        addError.innerText = "Bitte geben Sie eine Menge grösser als 0 ein.";
        addError.classList.remove('hidden');
        return;
    }

    if (quantity.value > 10000) {
        addError.innerText = "Bitte geben Sie eine Menge kleiner als 10'000 ein.";
        addError.classList.remove('hidden');
        return;
    }

    if (quantity.value % 1 != 0) {
        addError.innerText = "Bitte geben Sie eine ganze Zahl ein.";
        addError.classList.remove('hidden');
        return;
    }

    if (quantity.value.includes(".")) {
        addError.innerText = "Bitte geben Sie eine ganze Zahl ein.";
        addError.classList.remove('hidden');
        return;
    }

    if (productSelection.value == "") {
        addError.innerText = "Bitte wählen Sie ein Produkt aus.";
        addError.classList.remove('hidden');
        return;
    }

    const product_id = productSelection.value;
    
    console.log(product_id);

    const { data: products, error } = await supa
    .from('products')
    .select('*')
    .eq('id', product_id)
    .single();

    if (error) {
        console.log(error);
        return;
    }

    console.log(products);

    const quantityValue = quantity.value;
    const product_name = products.product_name;
    const unit = products.unit;
    const price = products.price;

    const totalPrice = quantityValue * price;


    const { data, error: error2 } = await supa
    .from('offer_has_products')
    .insert(
        {
            offer_id: localStorage.getItem("offer_id"),
            product_id: product_id,
            amount: quantityValue
        }
    );

    if (error2) {
        console.log(error2);
        return;
    }

    const totalAmount = parseInt(localStorage.getItem("totalAmount"));

    localStorage.setItem("totalAmount", totalAmount + parseInt(totalPrice));


    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${product_name}</td>
        <td>${unit}</td>
        <td>${quantityValue}</td>
        <td>${totalPrice}.—</td>
        <td><button class="delete-btn" >Löschen</button></td>
        `;
    productsTableBody.appendChild(row);

    popUp.style.display = "none";

    const checkrow = document.createElement('tr');

    checkrow.innerHTML = `
    <td>${product_name}</td>
    <td>${quantityValue}</td>
    <td>${price} / ${unit}</td>
    <td>${totalPrice}.—</td>
    `;

    offerDataTable.appendChild(checkrow);

    if(productsTable.classList.contains('hidden')) {
        productsTable.classList.remove('hidden');
    }

    const deleteBtn = row.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => {
        row.remove();
        deleteProduct(product_id, totalPrice);
    });
    

}


async function deleteProduct(product_id, totalPrice) {
    
        const { data, error } = await supa
        .from('offer_has_products')
        .delete()
        .eq('product_id', product_id);
    
        if (error) {
            console.log(error);
            return;
        }
    
        console.log(data + " deleted");
        localStorage.setItem("totalAmount", parseInt(localStorage.getItem("totalAmount")) - parseInt(totalPrice));

}


async function setVAT() {

    const vat = vatInput.value;

    const { data, error } = await supa
    .from('offers')
    .update({ vat: vat })
    .eq('id', localStorage.getItem("offer_id"));

    if (error) {
        console.log(error);
        return;
    }

    console.log(data + " updated");

}

async function updateTotalPrice() {

    const totalAmount = localStorage.getItem("totalAmount");

    const { data, error } = await supa
    .from('offers')
    .update({ total_amount : totalAmount })
    .eq('id', localStorage.getItem("offer_id"));

    if (error) {
        console.log(error);
        return;
    }

}


async function showOffer() {

    const offerID = localStorage.getItem("offer_id");

    const { data, error } = await supa
    .from('offers')
    .update({ status : "finished" })
    .eq('id', localStorage.getItem("offer_id"));

    if (error) {
        console.log(error);
        return;
    }

    window.location.href = "./view_offer.html?id=" + offerID;


}







async function retrieveUser() {
    const { data: { user } } = await supa.auth.getUser();
    return user;
}












// // Get all input fields on the page
// const inputFields = document.querySelectorAll('input');

// // Add an event listener to each input field

// inputFields.forEach(input => {
//     input.addEventListener('input', () => {
//         // Check if the input field has a value
//         if (input.value.trim() !== '') {
//             console.log('Something is typed in this field');
//         }
//     });
// });

export { createOffer, setVAT, updateTotalPrice };
