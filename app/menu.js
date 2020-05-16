'use strict';

let resultsContainer = document.querySelector('.results');
let firstLetter = document.getElementById('first_letter');
let scndLetter = document.getElementById('scnd_letter');
let thrdLetter = document.getElementById('thrd_letter');
let frthLetter = document.getElementById('frth_letter');

firstLetter.addEventListener('keydown', (e) => {
  inputAction(1, e.key);
}, false);

scndLetter.addEventListener('keydown', (e) => {
  inputAction(2, e.key);
}, false);

thrdLetter.addEventListener('keydown', (e) => {
  inputAction(3, e.key);
}, false);

frthLetter.addEventListener('keydown', (e) => {
  inputAction(4, e.key);
}, false);

firstLetter.addEventListener('focusout', lostFocus, false);
scndLetter.addEventListener('focusout', lostFocus, false);
thrdLetter.addEventListener('focusout', lostFocus, false);
frthLetter.addEventListener('focusout', lostFocus, false);

document.getElementById('search').addEventListener('click', search, false);
document.getElementById('reset').addEventListener('click', reset, false);
document.getElementById('stop').addEventListener('click', stop, false);

function parseCodeLetter (rawLetter) {
  if (ALPHABET.includes(rawLetter.toUpperCase())) {
    return rawLetter.toUpperCase();
  } else {
    return '*';
  }
}

function inputAction (nLetter, key) {
  let currentInput;
  let isKeyBackspace = key === 'Backspace';
  let isKeyAlpha = ALPHABET.includes(key.toUpperCase());

  switch (nLetter) {
    case 1:
      currentInput = firstLetter;
      break;
    case 2:
      currentInput = scndLetter;
      break;
    case 3:
      currentInput = thrdLetter;
      break;
    case 4:
      currentInput = frthLetter;
      break;
  }

  currentInput.value = parseCodeLetter(key);

  if (isKeyBackspace || isKeyAlpha) {
    switch (nLetter) {
      case 1:
        if (!isKeyBackspace) {
          scndLetter.focus();
        }
        break;
      case 2:
        if (isKeyBackspace) {
          firstLetter.focus();
        } else {
          thrdLetter.focus();
        }
        break;
      case 3:
        if (isKeyBackspace) {
          scndLetter.focus();
        } else {
          frthLetter.focus();
        }
        break;
      case 4:
        if (isKeyBackspace) {
          thrdLetter.focus();
        }
        break;
    }
  }
}

function lostFocus () {
  firstLetter.value = parseCodeLetter(firstLetter.value);
  scndLetter.value = parseCodeLetter(scndLetter.value);
  thrdLetter.value = parseCodeLetter(thrdLetter.value);
  frthLetter.value = parseCodeLetter(frthLetter.value);
}


/*
<div class="result">
  <h2>ABCD</h2>
  <div class="other-infos">
    <p class="game"><b>Game: </b>quiplash</p>
    <p class="join-as"><b>Join as: </b>player</p>
    <p class="requires-passwd"><b>Requires password: </b>false</p>
    <p class="audience-enabled"><b>Audience enabled: </b>true</p>
    <p class="audience"><b>Players in audience: </b>10</p>
  </div>
</div>
*/

function createResultNode (rawObject) {
  let container = document.createElement('div');
  container.className = 'result';
  let roomCode = document.createElement('h2');
  roomCode.innerText = rawObject.roomid;
  container.appendChild(roomCode);
  let otherInfosContainer = document.createElement('div');
  otherInfosContainer.className = 'other-infos';
  let gameType = document.createElement('p');
  gameType.className = 'game';
  gameType.innerHTML = `<b>Game: </b>${rawObject.apptag}`;
  otherInfosContainer.appendChild(gameType);
  let joinAs = document.createElement('p');
  joinAs.className = 'joins-as';
  joinAs.innerHTML = `<b>Join as: </b>${rawObject.joinAs}`;
  otherInfosContainer.appendChild(joinAs);
  let requiresPassword = document.createElement('p');
  requiresPassword.className = 'requires-password';
  requiresPassword.innerHTML = `<b>Requires password: </b>${rawObject.requiresPassword}`;
  otherInfosContainer.appendChild(requiresPassword);
  let audienceEnabled = document.createElement('p');
  audienceEnabled.className = 'audience-enabled';
  audienceEnabled.innerHTML = `<b>Audience enabled: </b>${rawObject.audienceEnabled}`;
  otherInfosContainer.appendChild(audienceEnabled);
  let audience = document.createElement('p');
  audience.className = 'audience';
  audience.innerHTML = `<b>Players in audience: </b>${rawObject.numAudience}`;
  otherInfosContainer.appendChild(audience);
  container.appendChild(otherInfosContainer);
  return container;
}

function addResult (rawObject) {
  console.log(rawObject);
  resultsContainer.appendChild(createResultNode(rawObject));
}
onResultPush = addResult;

function search () {
  breakCurrentSearch = false;
  let code = `${firstLetter.value}${scndLetter.value}${thrdLetter.value}${frthLetter.value}`;
  if (checkCode(code)) {
    clearResults();
    emptyResultsContainer();
    searchForRooms(code);
  }
}

function reset () {
  firstLetter.value = '*';
  scndLetter.value = '*';
  thrdLetter.value = '*';
  frthLetter.value = '*';
  clearResults();
  emptyResultsContainer();
}

function emptyResultsContainer () {
  Array.from(resultsContainer.childNodes).forEach((el) => el.remove());
}
