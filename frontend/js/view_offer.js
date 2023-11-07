import { supa } from "./supabase.js";

// document.addEventListener('DOMContentLoaded', function () {

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
    fetchOffer();
    console.log("DOM fully loaded and parsed");
    
// });



const getBase64FromUrl = async (url) => {
    const data = await fetch(url);
    const blob = await data.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob); 
      reader.onloadend = () => {
        const base64data = reader.result;   
        resolve(base64data);
      }
    });
  }

const defaultOfferLogo = await getBase64FromUrl("./img/logo.png");

const offerFrame = document.getElementById('offer-frame');
const offerLogo = document.getElementById('offer-logo');
const offerAddress = document.getElementById('offer-address');
const offerInfoLeft = document.getElementById('offer-left');
const offerInfoRight = document.getElementById('offer-right');
const offerIntro = document.getElementById('offer-intro');
const offerProducts = document.getElementById('offer-products');
const tableContent = document.getElementById('table-content');
const offerSummary = document.getElementById('offer-summary');

const homeBtn = document.getElementById('home');
const exportBtn = document.getElementById('export');

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const offer_id = urlParams.get('id');

homeBtn.addEventListener('click', (event) => {
    event.preventDefault();
    window.location.href = "./dashboard.html";
});

exportBtn.addEventListener('click', (event) => {
    event.preventDefault();
    exportPDF(offer_id);
});


async function fetchOffer() {

    const sessionUser = await retrieveUser();

    const { data: offer, error } = await supa
        .from('offers')
        .select('*')
        .eq('id', offer_id)
        .single();

    if (error) {
        console.log(error);
        return;
    }

    offerInfoRight.innerHTML = `
        <p>${offer.offer_number}</p>
        <p>${offer.offer_date}</p>
        <p>${offer.validity} Tage</p>
        `;



    const { data: company, error: companyError } = await supa
        .from('companys')
        .select('*')
        .eq('id', offer.company_id)
        .single();

    if (companyError) {
        console.log(companyError);
        return;
    }

    let anrede = "";

    if(company.last_name == null || company.last_name == "") {
        anrede = "Sehr geehrte Damen und Herren,";
    } else if (company.gender == "m") {
        anrede = "Sehr geehrter Herr " + company.last_name + ",";
    } else if (company.gender == "f") {
        anrede = "Sehr geehrte Frau " + company.last_name + ",";
    } else {
        anrede = "Sehr geehrte Damen und Herren,";
    }

    offerIntro.innerHTML = `
    <h2>${offer.title}</h1>
    <p>${anrede}</p>
    <p>${offer.message}</p>
    `;

    const { data: user, error: userError } = await supa
        .from('profiles')
        .select('*')
        .eq('id', offer.user_id)
        .single();

    if (userError) {
        console.log(userError);
        return;
    }

    if(company.first_name == null || company.last_name == null || company.first_name == "" || company.last_name == "") {
        offerAddress.innerHTML = `
        <p style="font-size: 10px;">${user.firstname} ${user.lastname} | ${user.address} | ${user.plz} ${user.city}</p>
        <p>${company.company_name}<br>${company.address}<br>${company.plz} ${company.city}</p>`;    
    } else {
        offerAddress.innerHTML = `
        <p style="font-size: 10px;">${user.firstname} ${user.lastname} | ${user.address} | ${user.plz} ${user.city}</p>
        <p>${company.company_name}<br>${company.first_name} ${company.last_name}<br>${company.address}<br>${company.plz} ${company.city}</p>`;
    
    }

    const { data: logodata, error: logoerror } = await supa
    .from('logos')
    .select('*')
    .eq('user_id', sessionUser.id);

    if(logoerror) {
        console.log("Error");
        offerLogo.src = defaultOfferLogo;
        // loadDefaultLogo();
    } else if (logodata == null || logodata.length == 0){
        offerLogo.src = defaultOfferLogo;
        // loadDefaultLogo();
    } else {
        console.log(logodata);
        const signedURL = await createSignedUrl();
        offerLogo.src = await getBase64FromUrl(signedURL);

    }

    if(user.email == null && user.phone == null) {
        offerSummary.innerHTML = `
        <p>Freundliche Grüsse</p>
        <br>
        <p>${user.firstname} ${user.lastname}</p>
        `;
    } else if (user.phone == null) {
        offerSummary.innerHTML = `
        <p>Bei Rückfragen gerne an: ${user.email}</p>
        <p>Freundliche Grüsse</p>
        <br>
        <p>${user.firstname} ${user.lastname}</p>
        `;
    } else {
        offerSummary.innerHTML = `
        <p>Bei Rückfragen gerne an: ${user.phone}</p>
        <p>Freundliche Grüsse</p>
        <br>
        <p>${user.firstname} ${user.lastname}</p>
        `;
    }

    const { data: offer_has_product, error: offer_has_productError } = await supa
    .from('offer_has_products')
    .select('*')
    .eq('offer_id', offer.id);

    if (offer_has_productError) {
        console.log(offer_has_productError);
        return;
    }

    console.log(offer_has_product);

    tableContent.innerHTML = "";

    let nettoPrice = 0;

    let pos = 1;

    for (const product of offer_has_product) {

        const { data: products, error: productsError } = await supa
        .from('products')
        .select('*')
        .eq('id', product.product_id)
        .single();

        if (productsError) {
            console.log(productsError);
            return;
        }

        const tableRow = document.createElement('tr');
        tableRow.innerHTML = `
        <td>${pos}</td>
        <td>${products.product_name}</td>
        <td>${product.amount}</td>
        <td>${products.price}.— / ${products.unit}</td>
        <td>${products.price * product.amount}.—</td>
        `;

        tableContent.appendChild(tableRow);

        nettoPrice += products.price * product.amount;
        pos++;

        if((pos-1) == offer_has_product.length) {
            
            const vat = (Math.round((nettoPrice * offer.vat / 100) / 0.05) * 0.05).toFixed(2);


            if(offer.vat == 0) {
                tableContent.innerHTML += `
                <tr>
                    <td> </td>
                    <td> </td>
                    <td> </td>
                    <td> </td>
                    <td> </td>
                </tr>
                <tr>
                    <td></td>
                    <td><b>Total</b></td>
                    <td></td>
                    <td></td>
                    <td><b>CHF ${(Number(nettoPrice) + Number(vat)).toFixed(2)}</b></td>
                </tr>
                `;
            } else {
                tableContent.innerHTML += `
                <tr>
                <td> </td>
                <td> </td>
                <td> </td>
                <td> </td>
                <td> </td>
                </tr>
                <tr>
                    <td></td>
                    <td>Zwischensumme</td>
                    <td></td>
                    <td></td>
                    <td>${(nettoPrice).toFixed(2)}</td>
                </tr>
                <tr>
                    <td></td>
                    <td>MwSt.</td>
                    <td></td>
                    <td>${offer.vat}</td>
                    <td>${vat}</td>
                </tr>
                <tr>
                    <td></td>
                    <td><b>Total inkl. MwSt.</b></td>
                    <td></td>
                    <td></td>
                    <td><b>CHF ${(Number(nettoPrice) + Number(vat)).toFixed(2)}</b></td>
                </tr>
                `;
            }


        }

    }

    offerFrame.style.display = "block";

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


function exportPDF(offername){
    // html2pdf().from(offerFrame).save();

    var opt = {
        margin:       [-0.5, -0.5, 0, 0],
        filename:     offername+'.pdf',
        image:        { type: 'png'},
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'cm', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(offerFrame).save();

}

async function loadDefaultLogo() {
    try {
      const base64Data = await getBase64FromUrl("./img/logo.png");
      offerLogo.src = base64Data;
    } catch (error) {
      console.error("Error loading the logo:", error);
    }
  }

async function retrieveUser() {
    const { data: { user } } = await supa.auth.getUser();
    return user;
}

