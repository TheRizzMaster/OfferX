
localStorage.setItem("currentSection", 1);
setActiveSection(1);


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

function setActiveSection(sectionId) {
    var section = document.getElementById("section"+sectionId);
    section.classList.add("active");
}

function setInactiveSection(sectionId) {
    var section = document.getElementById("section"+sectionId);
    section.classList.remove("active");
}