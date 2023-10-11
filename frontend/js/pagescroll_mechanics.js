//Definiert die erste Session im local Storage und setzt die erste Section auf active
localStorage.setItem("currentSection", 1);
setActiveSection(1);

//Scrollt zur nächsten Section
function nextSection() {

    const pages = document.getElementsByClassName("content-page");

    let pagesCount = pages.length;

    var currentSection = parseInt(localStorage.getItem("currentSection"));

    if (currentSection == pagesCount) {
        return;
    }

    var nextSectionId = currentSection + 1;
    var nextSection = document.getElementById(nextSectionId);
    nextSection.scrollIntoView({behavior: "smooth"});

    setInactiveSection(currentSection);
    setActiveSection(nextSectionId);

    localStorage.setItem("currentSection", nextSectionId);
}

//Scrollt zur vorherigen Section
function previousSection() {

    const pages = document.getElementsByClassName("content-page");

    let pagesCount = pages.length;

    var currentSection = parseInt(localStorage.getItem("currentSection"));

    if (currentSection == 1) {
        return;
    }

    var previousSectionId = currentSection - 1;
    var previousSection = document.getElementById(previousSectionId);
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

