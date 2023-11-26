const base = 200;
let cards = [];
function initializeArray(qty, dir = "row") {
  let height = 0,
    width = 0;
  if (dir == "row") {
    height = base;
    width = random();
  } else {
    height = random();
    width = base;
  }
  return [...Array(qty)].map(() => {
    if (dir == "row") {
      height = base;
      width = random();
    } else {
      height = random();
      width = base;
    }
    return {
      height: height,
      width: width,
      src: "littlecolorado.jpg",
      title: "Another card"
    };
  });
}

function random() {
  const number = Math.floor(Math.random() * 6) * (base / 5) + base;
  // if (number < 100) return 100;
  // if (number > 350) return 350;
  return number;
}

function createCards(list, selector) {
  const container = document.querySelector(selector);
  list.forEach((card) => {
    container.appendChild(createCard(card));
  });
}

function createCard(card) {
  const cardElement = document.createElement("div");
  cardElement.style.width = card.width + "px";
  cardElement.style.height = card.height + "px";
  cardElement.classList.add("card");
  const img = new Image();
  img.src = card.src;
  cardElement.appendChild(img);
  const title = document.createElement("h2");
  title.innerText = card.title;
  cardElement.appendChild(title);
  return cardElement;
}

createCards(initializeArray(20, "row"), ".row-grid");
createCards(initializeArray(20, "col"), ".col-grid");
