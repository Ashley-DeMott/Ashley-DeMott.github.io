/* JS that is used throughout the entire site */

/***** Navigation *****/
let header = document.getElementById("header");
let main = document.getElementById("main");
let footer = document.getElementById("footer");
let navBar = document.getElementById("nav__sidebar");

/* Add Navigation elements to the DOM under the navBar */
const navItems = [
    { text: "Home", link: "index.html"},
    { text: "About Me", link: "aboutMe.html"},
    { text: "Projects", link: "projectsList.html"},
]

// Create all elements for the navBar
createNav();
function createNav() {
    // Create openNav button
    let navShow = document.createElement("button");
    navShow.id = "nav__show";
    navShow.innerHTML = "Menu";
    navShow.onclick = function() { toggleNav(true) };
    header.prepend(navShow);

    // Create navProfile section
    let navProfile = document.createElement("section");
    navProfile.id = "nav__profile";

    // Create button to hide the navBar
    let navHide = document.createElement("button");
    navHide.id = "nav__hide";
    navHide.innerHTML = "close";
    navHide.onclick = function() { toggleNav(false) };
    navProfile.appendChild(navHide);

    // Create items within the profile section
    let navH1 = document.createElement("h1");
    navH1.id = "nav__h1";
    navH1.innerHTML = "Ashley DeMott";
    let navH2 = document.createElement("h2");
    navH2.id = "nav__h2";
    navH2.innerHTML = "Software Engineer";

    // Create the list of navigation pages
    let navPages = document.createElement("ul");
    navPages.id = "nav__pages";

    // Add each item to the list of navigation pages
    navItems.forEach(item => {
        let pageNav = document.createElement("li");
        
        // pageNav.classList.add("nav__page");
        let pageLink = document.createElement("a");
        pageLink.innerHTML = item.text;
        pageLink.href = item.link;

        pageNav.appendChild(pageLink);
        navPages.appendChild(pageNav);
});

    // Attach all elements
    navProfile.appendChild(navH1);
    navProfile.appendChild(navH2);
    navBar.appendChild(navProfile);
    navBar.appendChild(navPages);
}

let navShow = document.getElementById("nav__show");
let navHide = document.getElementById("nav__hide");

function toggleNav(show) {
console.log("toggle: " + show);

    // Hide the navBar and reset main's styling
    if(!show) {
        navBar.style.display = "none";
        main.classList.remove("navShowing");
        footer.classList.remove("navShowing");
    }
    else {
        navBar.style.display = "block";      
        main.classList.add("navShowing");
        footer.classList.add("navShowing");
    }
}

/***** Header *****/
// Create a header for the page given its name
function createHeader(pageName) {
    let pageTite = document.createElement("h1");
    pageTitle.id = "pageTitle";
    pageTite.innerHTML = pageName;

    header.appendChild(pageTite);
}

/***** Footer *****/
// Create all elements within the footer
createFooter();
function createFooter() {
    let location = "Phoenix, Arizona";
    footer.innerHTML = `&nbsp| ${location} |&nbsp`;

    let linkedInLink = document.createElement("a");
    linkedInLink.href = "https://www.linkedin.com/in/ashley-demott/";
    linkedInLink.innerHTML = "Ashley DeMott";

    let gitHubLink = document.createElement("a");
    gitHubLink.href = "https://github.com/Ashley-DeMott";
    gitHubLink.innerHTML = "GitHub";

    footer.prepend(linkedInLink);
    footer.appendChild(gitHubLink);
}