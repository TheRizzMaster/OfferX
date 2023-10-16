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
    fetchProducts();
    
});


const productsTable = document.getElementById('products');
const productsTableBody = document.getElementById('table-content');

const addProductButton = document.getElementById('add-product-btn');
const saveProductButton = document.getElementById('save-product-btn');

const popUp = document.getElementById("create-popup");

const closeBtn = document.getElementsByClassName("close")[0];

const error = document.getElementById("create-error");

const product_name = document.getElementById('product');
const additional_text = document.getElementById('additional_text');
const unit = document.getElementById('unit');
const price = document.getElementById('price');

document.getElementById('logout-btn').addEventListener('click', async (event) => {
    event.preventDefault();
    const { error } = await supa.auth.signOut();
    window.location.href = "./index.html";
});


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
    createProduct();
});


async function fetchProducts() {

    const user = await retrieveUser();

    const { data: products, error } = await supa
        .from('products')
        .select('*')
        .eq('user_id', user.id)
        .eq('active', 'TRUE')
        .order('product_name', { descending: true });

    if (error) {
        console.log(error.message);
        return;
    }

    productsTableBody.innerHTML = "";

    if(products.length == 0) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td colspan="5">Sie haben noch keine Produkte erfasst.</td>
            `;
        productsTableBody.appendChild(row);
        return;
    }

    products.forEach(product => {

        let product_name = product.product_name;
        let additional_text = product.additional_text;
        let unit = product.unit;
        let price = product.price;

        if(product_name == null) {
            product_name = "";
        } else if(additional_text == null) {
            additional_text = "";
        } else if(unit == null) {
            unit = "";
        } else if(price == null) {
            price = "";
        }

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product_name}</td>
            <td>${additional_text}</td>
            <td>${unit}</td>
            <td style="text-align: right;">${price}</td>
            <td width="3%"><a href="javascript:void(0);" class="delete-btn" data-product-id='${product.id}'><svg fill="#000000" width="18" height="18" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 482.428 482.429" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M381.163,57.799h-75.094C302.323,25.316,274.686,0,241.214,0c-33.471,0-61.104,25.315-64.85,57.799h-75.098 c-30.39,0-55.111,24.728-55.111,55.117v2.828c0,23.223,14.46,43.1,34.83,51.199v260.369c0,30.39,24.724,55.117,55.112,55.117 h210.236c30.389,0,55.111-24.729,55.111-55.117V166.944c20.369-8.1,34.83-27.977,34.83-51.199v-2.828 C436.274,82.527,411.551,57.799,381.163,57.799z M241.214,26.139c19.037,0,34.927,13.645,38.443,31.66h-76.879 C206.293,39.783,222.184,26.139,241.214,26.139z M375.305,427.312c0,15.978-13,28.979-28.973,28.979H136.096 c-15.973,0-28.973-13.002-28.973-28.979V170.861h268.182V427.312z M410.135,115.744c0,15.978-13,28.979-28.973,28.979H101.266 c-15.973,0-28.973-13.001-28.973-28.979v-2.828c0-15.978,13-28.979,28.973-28.979h279.897c15.973,0,28.973,13.001,28.973,28.979 V115.744z"></path> <path d="M171.144,422.863c7.218,0,13.069-5.853,13.069-13.068V262.641c0-7.216-5.852-13.07-13.069-13.07 c-7.217,0-13.069,5.854-13.069,13.07v147.154C158.074,417.012,163.926,422.863,171.144,422.863z"></path> <path d="M241.214,422.863c7.218,0,13.07-5.853,13.07-13.068V262.641c0-7.216-5.854-13.07-13.07-13.07 c-7.217,0-13.069,5.854-13.069,13.07v147.154C228.145,417.012,233.996,422.863,241.214,422.863z"></path> <path d="M311.284,422.863c7.217,0,13.068-5.853,13.068-13.068V262.641c0-7.216-5.852-13.07-13.068-13.07 c-7.219,0-13.07,5.854-13.07,13.07v147.154C298.213,417.012,304.067,422.863,311.284,422.863z"></path> </g> </g> </g></svg></a></td>
            `;

        productsTableBody.appendChild(row);

});


    const deleteProductButtons = document.querySelectorAll('.delete-btn');

    deleteProductButtons.forEach(button => {
        button.addEventListener('click', (event) => {
        deleteProduct(button.dataset.productId);
    });
    
});

    console.log(products);
}


async function deleteProduct(id) {

    const { error } = await supa
    .from('products')
    .update({ active: 'FALSE' })
    .eq('id', id);

    if (error) {
        console.log(error.message);
        return;
    }

    fetchProducts();

}

async function createProduct() {

    error.classList.add('hidden');

    const user = await retrieveUser();

    if(product_name.value == "" || price.value == "") {
        error.textContent = "Bitte alle Pflichtfelder ausfüllen!";
        error.classList.remove('hidden');
        return;
    }

    if(product_name.value.length > 50) {
        error.textContent = "Bitte wähle einen kürzeren Produktname!";
        error.classList.remove('hidden');
        return;
    }


    const { error: create_error } = await supa
        .from('products')
        .insert(
            {
                user_id: user.id,
                product_name: product_name.value,
                additional_text: additional_text.value,
                unit: unit.value,
                price: price.value,
                active: 'TRUE'
            });

    if (create_error) {
        console.log(create_error.message);
        error.textContent = "Error: " + create_error.message;
        error.classList.remove('hidden');
        return;
    }

    product_name.value = "";
    additional_text.value = "";
    unit.value = "";
    price.value = "";

    fetchProducts();

    console.log("created");
    popUp.style.display = "none";
}



async function retrieveUser() {
    const { data: { user } } = await supa.auth.getUser();
    return user;
}