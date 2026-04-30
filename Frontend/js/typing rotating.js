const words = ["time", "number of transfers"];
const typedElement = document.querySelector(".typed-word");

let wordIndex = 0;
let charIndex = 0;
let typingSpeed = 120;
let pauseBetweenWords = 1500;

function typeWord() {
  const currentWord = words[wordIndex];
  if (charIndex < currentWord.length) {
    typedElement.textContent += currentWord.charAt(charIndex);
    charIndex++;
    setTimeout(typeWord, typingSpeed);
  } else {
    setTimeout(deleteWord, pauseBetweenWords);
  }
}

function deleteWord() {
  const currentWord = words[wordIndex];
  if (charIndex > 0) {
    typedElement.textContent = currentWord.substring(0, charIndex - 1);
    charIndex--;
    setTimeout(deleteWord, typingSpeed / 2);
  } else {
    wordIndex = (wordIndex + 1) % words.length;
    setTimeout(typeWord, typingSpeed);
  }
}

// Start the typing effect
typeWord();