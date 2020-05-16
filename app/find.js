'use strict';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const AVAILABLE_CODE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ*'.split('');

let results = [];
let breakCurrentSearch = false;
let onResultPush = () => {};

/* Format : replace all unknown code pieces by "*" */
/* Prevents unexpected code formats */
function checkCode (code) {
  if (typeof code !== 'string') {
    return false;
  }
  code = code.toUpperCase();
  if (code.length !== 4 || !code.split('').every((char) => AVAILABLE_CODE_CHARS.includes(char))) {
    return false;
  }
  return true;
}

/* If there's more than one missing letter, this function might take a while to call resolve. */
async function searchForRooms (code) {
  let everythingSymbolPos = code.indexOf('*');
  if (everythingSymbolPos >= 0) {
    for (let letter of ALPHABET) {
      if (breakCurrentSearch) {
        return;
      }
      searchForRooms(code.replace('*', letter));
    }
  } else {
    let res = await fetch('https://ecast.jackboxgames.com/room/'+code).then((blob) => {
      if (blob.ok) {
        return blob.text();
      }
    }).then((data) => {
      if (data !== undefined) {
        return JSON.parse(data);
      }
    });
    if (res !== undefined || (Array.isArray(res) && res.length > 0)) {
      results.push(res);
      onResultPush(res);
    }
  }
}

// OBSOLETE
// async function searchForRooms (code) {
//   let everythingSymbolPos = code.indexOf('*');
//   if (everythingSymbolPos >= 0) {
//     for (let letter of ALPHABET) {
//       let rooms = await searchForRooms(code.replace('*', letter));
//       if (!breakCurrentSearch) {
//         return;
//       }
//       if (rooms !== undefined || (Array.isArray(rooms) && rooms.length > 0)) {
//         results.push(rooms);
//       }
//     }
//     results = results.flat();
//   } else {
//     let res = await fetch('https://ecast.jackboxgames.com/room/'+code).then((blob) => {
//       if (blob.ok) {
//         return blob.text();
//       }
//     }).then((data) => {
//       if (data !== undefined) {
//         return JSON.parse(data);
//       }
//     });
//     return res;
//   }
// }

function stopSearch () {
  breakCurrentSearch = true;
}

function clearResults () {
  results = [];
}
