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
    let navH2 = document.createElement("h2");
    navH2.innerHTML = "Ashley DeMott";
    let navP = document.createElement("p");
    navP.style.marginTop = 0;
    navP.innerHTML = "Software Engineer";

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
    navProfile.appendChild(navH2);
    navProfile.appendChild(navP);
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