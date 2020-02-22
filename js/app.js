import populateStorage from "./storage.js";

const options = {
  suits: ["spades", "clubs", "diamonds", "hearts"],
  values: ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"],
  rowsCount: "5",
  colsCount: "5",
  stockCount: "25"
};

document.addEventListener("DOMContentLoaded", () => {
  populateStorage();
  setTimeout(() => {
    solitaireInit(options);
  }, 2000);
});

function solitaireInit(options) {
  const blankGrid = document.querySelector("#blankGrid");
  const scoreOverlay = document.querySelector("#scoreOverlay");
  const stockBtn = document.querySelector("#backCard");
  const pack = [];
  let placeholderNumber = 0;

  // Generate empty blank-grid
  for (let rows = 0; rows < options.rowsCount; rows++) {
    const row = document.createElement("div");
    row.id = `row - ${rows + 1}`;
    row.className = "row";
    row.style.cssText = blankGrid.appendChild(row);

    for (let col = 0; col < options.colsCount; col++) {
      const placeholder = document.createElement("div");
      placeholder.id = `placeholder-${placeholderNumber}`;
      placeholder.className = "placeholder card";
      // placeholder.setAttribute('tabindex', '0'); за игра с enter и tab
      placeholder.style.cssText = row.appendChild(placeholder);
      placeholderNumber++;
    }
  }

  // Generate and shuffle the pack
  for (let i = 0; i < options.suits.length; i++) {
    for (let x = 0; x < options.values.length; x++) {
      const singleCard = {
        Suit: options.suits[i],
        Value: options.values[x]
      };
      pack.push(singleCard);
    }
  }

  function shuffle(pack) {
    for (let i = pack.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pack[i], pack[j]] = [pack[j], pack[i]];
    }
    return pack;
  }

  // Making the stock
  const packLength = pack.length;
  const stockLength = packLength - options.stockCount;
  const stock = shuffle(pack);
  stock.splice(0, stockLength);

  // Main logic

  setTimeout(() => {
    appendPresentedCard();
  }, 1500);

  stockBtn.addEventListener("click", appendPresentedCard);

  function appendPresentedCard() {
    // Get random card from Array
    const randomCard = stock[Math.floor(Math.random() * stock.length)];

    // Get index of the random card
    const randomCardIndex = stock.indexOf(randomCard);

    // Splice this card from Array
    stock.splice(randomCardIndex, 1);

    // Append presented card to the DOM
    const randomCardSuit = randomCard.Suit;
    const randomCardValue = randomCard.Value;
    const presentedCard = document.createElement("div");
    presentedCard.className = `${randomCardSuit} new-card card`;
    presentedCard.id = `${randomCardSuit}-${randomCardValue}`;
    presentedCard.innerHTML = `<span>${randomCardValue}</span>`;
    const newpresentedCard = document
      .getElementById("presentedCard")
      .appendChild(presentedCard);
    stockBtn.disabled = true;
    blankGrid.style.pointerEvents = "auto";
  }

  blankGrid.addEventListener("click", play);
  blankGrid.style.pointerEvents = "none";

  function play(e) {
    const newCard = document.querySelector(".new-card");
    const {
      target
    } = e;

    if (target.classList.contains("placeholder")) {
      target.innerHTML = newCard.innerHTML;
      target.className = `placeholder card ${newCard.className.split(" ")[0]}`;
      newCard.remove();
      stockBtn.disabled = false;
      blankGrid.style.pointerEvents = "none";
      target.style.pointerEvents = "none";
      target.style.backgroundImage = "none";
      stockBtn.focus();

      if (!stock.length) {
        stockBtn.disabled = true;
        stockBtn.style.cursor = "not-allowed";
        blankGrid.style.pointerEvents = "none";
        worthScore();
        appendPoints();
      }
    }
  }

  function worthScore() {
    const placeholders = [].slice.call(
      document.querySelectorAll(".placeholder")
    );
    const worthScoreArray = placeholders.map(
      (placeholders) => placeholders.firstChild.innerHTML
    );
    const getFromIndex = (array, indexes, i = 0) =>
      indexes.map((index) => array[index + i]);

    const indexArrCol = [0, 5, 10, 15, 20];
    const indexArrDiagR = [0, 6, 12, 18, 24];
    const indexArrDiagL = [4, 8, 12, 16, 20];

    const firstRow = worthScoreArray.slice(0, 5);
    const secondRow = worthScoreArray.slice(5, 10);
    const thirdRow = worthScoreArray.slice(10, 15);
    const fourthRow = worthScoreArray.slice(15, 20);
    const fifthRow = worthScoreArray.slice(20);
    const firstCol = getFromIndex(worthScoreArray, indexArrCol, 0);
    const secondCol = getFromIndex(worthScoreArray, indexArrCol, 1);
    const thirdCol = getFromIndex(worthScoreArray, indexArrCol, 2);
    const fourthCol = getFromIndex(worthScoreArray, indexArrCol, 3);
    const fifthCol = getFromIndex(worthScoreArray, indexArrCol, 4);
    const diagR = getFromIndex(worthScoreArray, indexArrDiagR);
    const diagL = getFromIndex(worthScoreArray, indexArrDiagL);

    return [
      firstRow,
      secondRow,
      thirdRow,
      fourthRow,
      fifthRow,
      firstCol,
      secondCol,
      thirdCol,
      fourthCol,
      fifthCol,
      diagR,
      diagL
    ];
  }

  function appendPoints() {
    const points = worthScore();
    const totalPoints = points.map((el, index) => {
      const pointContainer = document.createElement("div");
      let result = setRating(el);
      if (index >= 10) {
        result = setRating(el, true);
      }
      pointContainer.innerHTML = result;
      pointContainer.className = "points";
      pointContainer.setAttribute("id", `result-${index + 1}`);
      scoreOverlay.appendChild(pointContainer);
      scoreOverlay.classList.add("active");
      return result;
    });

    const pointsSum = (arr) => arr.reduce((a, b) => a + b, 0);
    const pointSumContainer = document.querySelector("#pointsSum");
    pointSumContainer.innerHTML += `
      <p>Game Score</p> 
      <p>${pointsSum(totalPoints)}</p>
    `;
    populateStorage(`${pointsSum(totalPoints)}`);
    scoreOverlay.appendChild(pointSumContainer);
    pointSumContainer.style.display = "flex";
  }

  function isSequence(arr) {
    let faceCardSequence = false;
    let aceHighSequence = false;
    let fourTwos = false;

    // Checking For Unordered Straight That Contains Color Card (or cards)
    arr.sort();
    const arrToString = arr.toString();
    const regexToA = /10,A,J,K,Q/;
    const regexToK = /10,9,J,K,Q/;
    const regexToQ = /10,8,9,J,Q/;
    const regexToJ = /10,7,8,9,J/;
    const regexFourTwos = /2,2,2,2,./; // 4 of a kind of Twos Game Bonus

    if (regexToA.test(arrToString)) {
      aceHighSequence = true;
    }

    if (
      regexToK.test(arrToString) ||
      regexToQ.test(arrToString) ||
      regexToJ.test(arrToString)
    ) {
      faceCardSequence = true;
    }

    if (regexFourTwos.test(arrToString)) {
      fourTwos = true;
    }

    // Checking For Unordered Straight Without Color Card (or cards)
    arr.sort((a, b) => a - b);

    const numberSequenceArray = arr.map(Number);
    let sequence = false;
    let count = 0;

    for (let i = 0; i < numberSequenceArray.length; i++) {
      if (numberSequenceArray[i] + 1 === numberSequenceArray[i + 1]) {
        count++;
      } else {
        count = 0;
      }
      if (count === 4 || faceCardSequence || aceHighSequence) {
        sequence = true;
      }
    }

    return [sequence, faceCardSequence, aceHighSequence, fourTwos];
  }

  function setRating(arr, diag = false) {
    const consecutive = isSequence(arr);
    const sequence = consecutive[0];
    const faceCardSequence = consecutive[1];
    const aceHighSequence = consecutive[2];
    const fourTwosTest = consecutive[3];
    const tempArray = [];
    let prev;
    let result;

    arr.sort();

    // the result of this loop is a new array with length depending on that
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] !== prev) {
        tempArray.push(1);
      } else {
        tempArray[tempArray.length - 1]++;
      }
      prev = arr[i];
    }

    if (Array.isArray(tempArray)) {
      switch (tempArray.length) {
        // full house or 4 of a kind or special game bonus
        case 2:
          if (tempArray.includes(2)) {
            result = 80; // full house
            if (diag) {
              result = 90;
            } // full house diagonal
          } else {
            result = 100; // 4 of a kind
            if (diag) {
              result = 170;
            } // 4 of a kind  diagonal
            if (fourTwosTest) {
              result = 200;
            } // 4 of a kind of Twos
          }
          break;

          // 2 pair or 3 of a kind
        case 3:
          if (tempArray.includes(2)) {
            result = 20; //2 pair
            if (diag) {
              result = 30;
            } //2 pair diagonal
          } else {
            result = 40; // 3 of a kind
            if (diag) {
              result = 50;
            } // 3 of a kind diagonal
          }
          break;

          // 2 of a kind
        case 4:
          if (diag) {
            result = 20; // 2 of a kind diagonal
          } else {
            result = 10; // 2 of a kind
          }
          break;

          // Cards in sequence or Cards in sequence to A
        case 5:
          if (sequence || faceCardSequence) {
            result = 50; // Cards in sequence
            if (diag) {
              result = 60;
            } // Cards in sequence diagonal
            if (aceHighSequence) {
              result = 150;
            } // Cards in sequence to A
            if (aceHighSequence && diag) {
              result = 160;
            } // Cards in sequence to A diagonal
          } else {
            result = 0; // Does Not Win
          }
          break;
          // no default
      }
    }
    return result;
  }
}