import {supa} from './supabase.js';

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
    fetchOffers();
    
});

const offerContainer = document.querySelector('.offer-container');

document.getElementById('logout-btn').addEventListener('click', async (event) => {
    event.preventDefault();
    const { error } = await supa.auth.signOut();
    window.location.href = "./index.html";
});

async function fetchOffers() {

    const user = await retrieveUser();

    const { data: offers, error } = await supa
        .from('offers')
        .select('*')
        .eq('user_id', user.id);

    if (error) {
        console.log(error);
        return;
    }

    for (const offer of offers) {
        const { data: companys, error: error2 } = await supa
        .from('companys')
        .select('*')
        .eq('id', offer.company_id)
        .single();

        if (error2) {
            console.log(error2);
            return;
        }

        const date = new Date(offer.offer_date).toLocaleDateString('de-CH');
        let title;
        if(offer.title.length > 20) {
        title = offer.title.slice(0, 20) + "...";
        } else {
        title = offer.title;
        }

        const totalAmount = offer.total_amount.toFixed(0);


        offerContainer.innerHTML += `
        <div class="offer">
            <h5 class="offer-date">${date}</h5>
            <h3 class="offer-name">${title}</h3>
            <p class="offer-company">${companys.company_name}</p>
            <p class="offer-price">${totalAmount}.–</p>
            <span class="action-btn">
            <a href="javascript:void(0)" class="view-btn" data-offer-id='${offer.id}'><img src="./img/view.svg" alt="view" width="30px"></a>
            <a href="javascript:void(0)" class="delete-btn" data-offer-id='${offer.id}'><img src="./img/delete.svg" alt="delete" width="25px"></a>
            </span>
        </div>
        `;

    }

    const deleteOfferButtons = document.querySelectorAll('.delete-btn');
    const viewOfferButtons = document.querySelectorAll('.view-btn');

    deleteOfferButtons.forEach(button => {
        button.addEventListener('click', (event) => {
        deleteOffer(button.dataset.offerId);
    });
});

    viewOfferButtons.forEach(button => {
        button.addEventListener('click', (event) => {
        viewOffer(button.dataset.offerId);
    });
});


}


async function deleteOffer(offerID) {
    
        const { data, error } = await supa
        .from('offers')
        .delete()
        .eq('id', offerID);
    
        if (error) {
            console.log(error);
            return;
        }
    
        location.reload();
    
    }

async function viewOffer(offerID) {
    window.location.href = "./view_offer.html?id=" + offerID;
}




async function retrieveUser() {
    const { data: { user } } = await supa.auth.getUser();
    return user;
}