const ranks = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];
const suits = ['♠','♥','♦','♣'];

let cards = [];
let score = 0;
let rounds = 0;
let startTime = 0;

function randomCard() {
  return ranks[Math.floor(Math.random()*ranks.length)] +
         suits[Math.floor(Math.random()*suits.length)];
}

function value(r) {
  return ranks.indexOf(r) + 2;
}

function evaluate(c) {
  let vals = c.map(x => value(x.slice(0,-1))).sort((a,b)=>a-b);
  let suitsOnly = c.map(x => x.slice(-1));

  let counts = {};
  vals.forEach(v => counts[v] = (counts[v] || 0) + 1);

  let isThreeKind = Object.values(counts).includes(3);
  let isPair = Object.values(counts).includes(2);
  let isFlush = new Set(suitsOnly).size === 1;

  let isStraight =
    (vals[2]-vals[0]===2 && new Set(vals).size===3) ||
    (vals.includes(14)&&vals.includes(2)&&vals.includes(3));

  if (isStraight && isFlush) return "Straight Flush";
  if (isThreeKind) return "Three of a Kind";
  if (isFlush) return "Flush";
  if (isStraight) return "Straight";
  if (isPair) return "Pair";
  return "No Bonus";
}

function hideTopCards() {
  document.getElementById("top1").innerText = "";
  document.getElementById("top2").innerText = "";
}

function showTopCards() {
  document.getElementById("top1").innerText = cards[1];
  document.getElementById("top2").innerText = cards[2];
}

function setBack() {
  document.getElementById("top1").className = "card back";
  document.getElementById("top2").className = "card back";
}

function setFace() {
  document.getElementById("top1").className = "card face";
  document.getElementById("top2").className = "card face";
}

function newRound() {
  cards = [randomCard(), randomCard(), randomCard()];

  document.getElementById("bottomCard").innerText = cards[0];

  setBack();
  hideTopCards();

  document.getElementById("result").innerText = "";

  // 🔥 RANDOM PRE-DELAY (2–5 seconds)
  let preDelay = 2000 + Math.random() * 3000;

  setTimeout(() => {
    setFace();
    showTopCards();

    startTime = Date.now();

    // 🔥 RANDOM FLASH DURATION (200–900ms)
    let flashTime = 200 + Math.random() * 700;

    setTimeout(() => {
      setBack();
      hideTopCards();
    }, flashTime);

  }, preDelay);
}

function guess(g) {
  let correct = evaluate(cards);
  let time = ((Date.now() - startTime)/1000).toFixed(2);

  rounds++;
  if (g === correct) score++;

  document.getElementById("score").innerText =
    `Score: ${score} / ${rounds}`;

  document.getElementById("result").innerText =
    `Answer: ${correct} | Time: ${time}s`;

  setTimeout(newRound, 1200);
}

newRound();
