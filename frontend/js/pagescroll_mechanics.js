import {createOffer, setVAT, updateTotalPrice} from "./create_offer.js";

//Definiert die erste Session im local Storage und setzt die erste Section auf active
localStorage.setItem("currentSection", 1);
setActiveSection(1);

const nextButton = document.getElementById("nextSectionBtn");
const previousButton = document.getElementById("previousSectionBtn");
const generateOfferButton = document.getElementById("generateOfferBtn");

const clientSelection = document.getElementById("client_select");
const dateInput = document.getElementById("date");
const titleInput = document.getElementById("title");
const messageInput = document.getElementById("message");
const validityInput = document.getElementById("validity");

const vatInput = document.getElementById("vat");

nextButton.addEventListener('click', (event) => {
    event.preventDefault();
    nextSection();
});

previousButton.addEventListener('click', (event) => {
    event.preventDefault();
    previousSection();
});

//Scrollt zur nächsten Section
function nextSection() {

    const pages = document.getElementsByClassName("content-page");
    let currentSection = parseInt(localStorage.getItem("currentSection"));
    let pagesCount = pages.length;

    if (currentSection == pagesCount) {
        return;
    }

    if (currentSection == 1) {
        if (clientSelection.value == "") {
            alert("Bitte wählen Sie einen Kunden aus.");
            return;
        }
        if (dateInput.value == "") {
            alert("Bitte wählen Sie ein Datum aus.");
            return;
        }
        if (titleInput.value == "") {
            alert("Bitte geben Sie einen Titel ein.");
            return;
        }
        if (messageInput.value == "") {
            alert("Bitte geben Sie eine Nachricht ein.");
            return;
        }
        if (validityInput.value == "") {
            alert("Bitte geben Sie eine Gültigkeitsdauer ein.");
            return;
        }

        createOffer();

    } else if (currentSection == 2) {
        if (document.getElementById("product-table-content").rows.length == 0) {
            alert("Bitte fügen Sie mindestens ein Produkt hinzu.");
            return;
        }

        if (document.getElementById("product-table-content").rows.length > 5) {
            alert("Bitte fügen Sie maximal 5 Produkte hinzu.");
            return;
        }

        if(vatInput.value == "") {
            alert("Bitte geben Sie einen Mehrwertsteuersatz ein.");
            return;
        } else {
            setVAT();
        }

        updateTotalPrice();

        nextButton.classList.add("hidden");
        generateOfferButton.classList.remove("hidden");
    }

    let nextSectionId = currentSection + 1;
    let nextSection = document.getElementById(nextSectionId);
    nextSection.scrollIntoView({behavior: "smooth"});

    setInactiveSection(currentSection);
    setActiveSection(nextSectionId);

    localStorage.setItem("currentSection", nextSectionId);

}

//Scrollt zur vorherigen Section
function previousSection() {

    const pages = document.getElementsByClassName("content-page");
    let pagesCount = pages.length;
    let currentSection = parseInt(localStorage.getItem("currentSection"));

    if (currentSection == 1) {
        return;
    }

    if (currentSection == 3) {
        nextButton.classList.remove("hidden");
        generateOfferButton.classList.add("hidden");
    }

    let previousSectionId = currentSection - 1;
    let previousSection = document.getElementById(previousSectionId);
    previousSection.scrollIntoView({behavior: "smooth"});

    setInactiveSection(currentSection);
    setActiveSection(previousSectionId);

    localStorage.setItem("currentSection", previousSectionId);
}

//Scrollt zur Section mit der übergebenen Id
function scrollToSection(sectionId) {

    if (sectionId == localStorage.getItem("currentSection")) {
        return;
    }

    var section = document.getElementById(sectionId);
    section.scrollIntoView({behavior: "smooth"});

    setInactiveSection(parseInt(localStorage.getItem("currentSection")));
    setActiveSection(sectionId);
    localStorage.setItem("currentSection", sectionId);
}

//Setzt die Section mit der übergebenen Id auf active
function setActiveSection(sectionId) {
    var section = document.getElementById("section"+sectionId);
    section.classList.add("active");
}

//Setzt die Section mit der übergebenen Id auf inactive
function setInactiveSection(sectionId) {
    var section = document.getElementById("section"+sectionId);
    section.classList.remove("active");
}

