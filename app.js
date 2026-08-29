let port, reader, writer;
let currentRound = 1;
let currentPuzzle = {};
let currentAnswerBuffer = "";

let distHoldStart = null;
let lastDistValue = null;
let shakeCount = 0;

const ADVICE_DATABASE = [
  "Never settle for someone who treats you like an option when you make them a priority. If they consistently leave you questioning where you stand, that ambiguity is your answer.",
  "Heartbreak is proof that you were courageous enough to care deeply. Let the grief run its natural course, but don't turn a temporary painful chapter into your permanent residence.",
  "Communication without clarity is just noise, and effort without consistency is just manipulation. Look for the person whose words and daily actions align without requiring you to decipher mixed signals.",
  "Going no-contact isn't a petty game to make an ex miss you; it's a boundary to protect your own healing. You cannot clean an emotional wound while you keep re-opening it by checking their social media.",
  "A relationship should complement your existing life, not become your entire identity. Maintain your passions, your friendships, and your personal space so you never lose yourself in someone else.",
  "Don't fall in love with someone's potential or the romanticized version of them that lives only in your head. Love the reality of who they show you they are right now, or have the bravery to walk away.",
  "Closure isn't a final conversation or an apology you'll likely never receive. True closure happens internally the day you accept that what happened was reason enough to move forward.",
  "Love isn't supposed to feel like an endless anxiety test or a constant uphill battle. While real relationships require effort, basic respect and emotional safety should come effortlessly.",
  "It is far better to be single and lonely for a season than in a relationship and feeling lonely every single day. Solitude offers peace, whereas the wrong connection slowly drains your spirit.",
  "The right partner won't require you to shrink your personality, compromise your values, or beg for basic affection. Never lower your standards just to fit inside someone else's comfortable limits.",
  "Apologies without changed behavior are just scripts designed to buy time. Pay attention to patterns over promises, because people always reveal their true priorities through action.",
  "Missing someone doesn't mean you made a mistake by walking away. It simply means you shared a meaningful bond, and it's normal to grieve what was while honoring why it ended.",
  "Don't rush into a rebound just to fill a quiet room or silence a temporary ache. Take time to heal your heart first so you don't end up bleeding on someone who didn't cut you.",
  "Boundaries are not walls to keep people out; they are clear roadmaps showing people how to love you safely. Anyone who resents your boundaries was benefiting from your lack of them.",
  "Compatibility matters just as much as chemistry. You can share undeniable sparks with someone, but if your core values, life visions, and timing don't align, the fire will eventually burn you.",
  "Stop re-reading old text messages searching for hidden clues on where things went sideways. You are fully allowed to close the book on a story that no longer brings you peace.",
  "Growth in a relationship requires two willing participants who hold up a mirror. You cannot single-handedly fix or carry a bond when the other person refuses to grab their side.",
  "Jealousy and control are not expressions of deep love; they are symptoms of unaddressed insecurity. Healthy love expands your freedom and trust rather than boxing you into constant suspicion.",
  "Forgiving an ex doesn't mean condoning how they hurt you or letting them back into your life. Forgiveness is simply relinquishing the heavy weight of resentment so you can walk light again.",
  "Pay close attention to how someone handles conflict and disagreement early on. A partner who uses your vulnerabilities as weapons during an argument is showing you their true character.",
  "Love isn't about finding your missing half, but meeting another complete individual. You bring two whole lives together to build something greater, not to complete your own soul.",
  "If you find yourself holding on simply because of the time you've already invested, remember the sunk cost fallacy. Don't spend the rest of your future suffering just because you spent years getting here.",
  "You cannot negotiate someone into caring about you or wanting the same future. If you have to plead for baseline emotional investment, you are already fighting a losing battle.",
  "Unpack your own emotional baggage before expecting a new partner to help you carry it. Unhealed wounds lead us to project past traumas onto people who had nothing to do with creating them.",
  "A quiet, peaceful relationship isn't boring—it's standard emotional stability. Don't mistake constant emotional chaos and intense highs and lows for true passion or romantic depth.",
  "Block them if that's what it takes to protect your mental health and break the habit of checking in. Out of sight helps bring peace to mind, giving your brain the space it needs to reset.",
  "Never apologize for having high standards or wanting a deep, meaningful connection. The right person will gladly step up to meet your energy rather than complain that you ask for too much.",
  "Rejection is often just redirection away from a scenario that would have compromised your long-term happiness. Being let go by the wrong person creates room for the right one to enter.",
  "Love is a daily choice, not just a warm feeling that floats in and out when conditions are easy. It requires choosing each other on the mundane, frustrating, and exhausting days too.",
  "You are allowed to outgrow people you once loved deeply. Changing your path and prioritizing your personal evolution isn't a betrayal; it's a natural part of growing up.",
  "Don't let a bad chapter convince you that the whole story is ruined. One failed relationship or painful breakup does not define your worth or your capacity to find love again.",
  "Listen closely to your gut instinct when something feels subtly off or unsafe. Your intuition often picks up on red flags and micro-inconsistencies long before your rational mind accepts them.",
  "Romantic grand gestures mean very little if they aren't backed up by quiet, everyday kindness. The small, routine moments of thoughtfulness are what keep a bond resilient over time.",
  "Treat yourself with the same gentle grace and compassion you would offer a best friend going through heartbreak. You are doing the best you can with the emotional tools you currently have.",
  "The most important relationship you will ever cultivate is the one you build with yourself. When you genuinely respect and cherish who you are, you set an unshakeable standard for how others treat you."
];

const ARIA_SCRIPT = {
  mockery: [
    "Is your processor running on 8-bit math? Try again!",
    "Calculations offline. Did you skip physics class?",
    "My neural circuits are cringing at that attempt.",
    "Timing missed! A tortoise has better hold precision.",
    "Hand out of range! Are you measuring with your eyes closed?",
    "Incorrect! Even a simple 555 timer chip gets this right."
  ],
  shakeMockery: [
    "Are you trying to conduct an orchestra? Stop shaking your hand!",
    "Is that hand tremor or system panic? Keep it steady for 7 seconds!",
    "Your hands are trembling more than a dial-up modem! Freeze!",
    "Steady those fingers! Trembling won't pass my ultrasonic test."
  ],
  clueMockery: [
    "Requesting assistance already? How predictably human.",
    "Need a hint? I thought your carbon brain could handle basic math!",
    "Consulting my database because formulas are too hard?",
    "A hint? Fine, but my neural network is judging your incompetence."
  ],
  praise: [
    "Acceptable... for a biological unit.",
    "Precision verified! Moving to next security layer.",
    "Calculated with surprising efficiency!",
    "Decryption successful. Don't celebrate too early."
  ]
};

function getRandomMockery() { return ARIA_SCRIPT.mockery[Math.floor(Math.random() * ARIA_SCRIPT.mockery.length)]; }
function getRandomShakeMockery() { return ARIA_SCRIPT.shakeMockery[Math.floor(Math.random() * ARIA_SCRIPT.shakeMockery.length)]; }
function getRandomClueMockery() { return ARIA_SCRIPT.clueMockery[Math.floor(Math.random() * ARIA_SCRIPT.clueMockery.length)]; }
function getRandomPraise() { return ARIA_SCRIPT.praise[Math.floor(Math.random() * ARIA_SCRIPT.praise.length)]; }
function getRandomAdvice() { return ADVICE_DATABASE[Math.floor(Math.random() * ADVICE_DATABASE.length)]; }

function generateRound1Puzzle() {
  const complexPairs = [
    { i: 2.5, r: 48, v: 120 },
    { i: 3.5, r: 44, v: 154 },
    { i: 1.5, r: 86, v: 129 },
    { i: 12.5, r: 16, v: 200 },
    { i: 14.8, r: 25, v: 370 },
    { i: 4.25, r: 80, v: 340 },
    { i: 6.4, r: 35, v: 224 },
    { i: 15.5, r: 18, v: 279 }
  ];
  
  const selected = complexPairs[Math.floor(Math.random() * complexPairs.length)];
  return {
    title: "STAGE 1: KEYPAD ENTRY (OHM'S LAW)",
    question: `Calculate Voltage (V) for Current I = ${selected.i}A and Resistance R = ${selected.r} Ohms.`,
    dialogue: `Stage 1 active! Calculate V = I * R for I = ${selected.i}A and R = ${selected.r}Ω. Enter target voltage on keypad!`,
    answer: selected.v,
    clue: "Formula: Voltage (V) = Current (I) × Resistance (R)",
    fragment: "VOLT"
  };
}

function generateRound2Puzzle() {
  const mult = Math.floor(Math.random() * 3) + 2;
  const base = Math.floor(Math.random() * 3) + 1;
  const targetSec = mult + base;
  
  return {
    title: "STAGE 2: TOUCH TIMING EQUATION",
    question: `Solve for X (seconds): X = (${mult * 2} / 2) + ${base}. Hold or tap sensor for exactly X seconds (Strict Tolerance: ±0.3s)!`,
    dialogue: `Solve the equation to find hold duration X in seconds. Press and hold the touch sensor for exactly X seconds!`,
    targetHoldMs: targetSec * 1000,
    targetSec: targetSec,
    clue: "Formula: X = (A / 2) + B. Evaluate division inside parentheses first, then add constant B.",
    fragment: "TIME"
  };
}

function generateRound3Puzzle() {
  const puzzles = [
    { question: "Evaluate: (1 XOR 0) AND (1 NAND 0)", answer: 1, clue: "Logic Rules: XOR = 1 if inputs differ. NAND = 0 only if both inputs are 1." },
    { question: "Evaluate: (1 NOR 0) XOR (0 NAND 1)", answer: 1, clue: "Logic Rules: NOR = 1 only if both inputs are 0. NAND = 1 if at least one input is 0." },
    { question: "Evaluate: (1 XOR 1) OR (1 NAND 1)", answer: 0, clue: "Logic Rules: (1 XOR 1) = 0. (1 NAND 1) = 0. (0 OR 0) = 0." },
    { question: "Evaluate: (0 XOR 1) AND (1 NOR 0)", answer: 0, clue: "Logic Rules: (0 XOR 1) = 1. (1 NOR 0) = 0. (1 AND 0) = 0." },
    { question: "Evaluate: (1 NAND 0) XOR (0 NOR 0)", answer: 0, clue: "Logic Rules: (1 NAND 0) = 1. (0 NOR 0) = 1. (1 XOR 1) = 0." }
  ];
  
  const selected = puzzles[Math.floor(Math.random() * puzzles.length)];
  return {
    title: "STAGE 3: ADVANCED LOGIC CIRCUITS (XOR / NAND / NOR)",
    question: selected.question,
    dialogue: "Advanced logic gates engaged! Evaluate the expression and enter 1 for True or 0 for False.",
    answer: selected.answer,
    clue: selected.clue,
    fragment: "GATE"
  };
}

function generateRound4Puzzle() {
  const useInches = Math.random() > 0.5;
  let targetCm, questionText, clueText;

  if (useInches) {
    const inches = Math.floor(Math.random() * 5) + 4;
    targetCm = Math.round(inches * 2.54);
    questionText = `Convert ${inches} inches directly into cm. Hold hand steady at the converted distance within ±1 cm tolerance for 7s!`;
    clueText = "Formula: Distance (cm) = Distance (Inches) × 2.54. Do the conversion yourself! Tolerance: ±1 cm.";
  } else {
    const dm = (Math.floor(Math.random() * 8) + 10) / 10;
    targetCm = Math.round(dm * 10);
    questionText = `Convert ${dm} decimeters (dm) directly into cm. Hold hand steady at the converted distance within ±1 cm tolerance for 7s!`;
    clueText = "Formula: Distance (cm) = Distance (dm) × 10. Do the conversion yourself! Tolerance: ±1 cm.";
  }

  return {
    title: "STAGE 4: ULTRASONIC CONVERSION (7s STABLE HOLD)",
    question: questionText,
    dialogue: "Convert measurement to cm in your head! Position your hand at that exact distance (±1 cm) and hold steady for 7s.",
    targetCm: targetCm,
    minDist: targetCm - 1,
    maxDist: targetCm + 1,
    clue: clueText,
    fragment: "WAVE"
  };
}

function sendLCDText(line1, line2) {
  if (writer) {
    let safeL1 = line1.replace(/[^\x20-\x7E]/g, "").substring(0, 16);
    let safeL2 = line2.replace(/[^\x20-\x7E]/g, "").substring(0, 16);
    writer.write(`LCD:${safeL1}|${safeL2}\n`);
  }
}

function sendStageToHardware(stageNum) {
  if (writer) {
    writer.write(`STAGE:${stageNum}\n`);
  }
}

function updateInputUI(value) {
  currentAnswerBuffer = value;
  const inputEl = document.getElementById("answer-input");
  if (inputEl) inputEl.value = currentAnswerBuffer;

  if (currentRound === 1 || currentRound === 3) {
    sendLCDText(`STAGE ${currentRound}: ENTRY`, `> ${currentAnswerBuffer || "_____"}`);
  }
}

function clearInput() {
  updateInputUI("");
  document.getElementById("dialogue-box").innerText = "Input cleared! Re-calculate your formula.";
  sendStageToHardware(currentRound);
}

function showTreasureClearance() {
  const modal = document.getElementById("treasure-modal");
  const chest = document.getElementById("treasure-chest");
  const prompt = document.getElementById("chest-prompt");
  const restartBtn = document.getElementById("restart-btn");
  const wisdomQuote = document.querySelector(".wisdom-quote");

  if (!modal || !chest) return;

  modal.classList.remove("hidden");
  chest.classList.remove("open");
  prompt.innerText = "TAP THE CHEST TO UNLOCK THE ANCIENT WISDOM";
  prompt.style.display = "block";
  restartBtn.classList.add("hidden");

  sendLCDText("VAULT UNLOCKED!", "WISDOM GRANTED");

  chest.onclick = () => {
    if (!chest.classList.contains("open")) {
      if (wisdomQuote) {
        wisdomQuote.innerText = `"${getRandomAdvice()}"`;
      }
      chest.classList.add("open");
      prompt.style.display = "none";
      setTimeout(() => {
        restartBtn.classList.remove("hidden");
      }, 1200);
    }
  };

  restartBtn.onclick = () => {
    modal.classList.add("hidden");
    loadStage(1);
  };
}

function triggerBubbleDropTransition(nextStage) {
  let bubbleOverlay = document.getElementById("bubble-drop-overlay");
  
  if (!bubbleOverlay) {
    bubbleOverlay = document.createElement("div");
    bubbleOverlay.id = "bubble-drop-overlay";
    bubbleOverlay.className = "bubble-drop-overlay";
    document.body.appendChild(bubbleOverlay);
  }

  bubbleOverlay.innerHTML = "";
  for (let i = 0; i < 25; i++) {
    const bubble = document.createElement("div");
    bubble.className = "bubble-drop";
    bubble.style.left = `${Math.random() * 95}%`;
    bubble.style.animationDelay = `${Math.random() * 0.35}s`;
    bubble.style.animationDuration = `${0.65 + Math.random() * 0.45}s`;
    bubbleOverlay.appendChild(bubble);
  }

  bubbleOverlay.classList.add("active");

  setTimeout(() => {
    if (nextStage > 4) {
      document.getElementById("dialogue-box").innerText = "🎉 " + getRandomPraise() + " All security locks cleared!";
      showTreasureClearance();
    } else {
      document.getElementById("dialogue-box").innerText = "✨ " + getRandomPraise();
      loadStage(nextStage);
    }
  }, 500);

  setTimeout(() => {
    bubbleOverlay.classList.remove("active");
  }, 1100);
}

function loadStage(stageNum) {
  currentRound = stageNum;
  distHoldStart = null;
  lastDistValue = null;
  shakeCount = 0;

  if (stageNum === 1) currentPuzzle = generateRound1Puzzle();
  if (stageNum === 2) currentPuzzle = generateRound2Puzzle();
  if (stageNum === 3) currentPuzzle = generateRound3Puzzle();
  if (stageNum === 4) currentPuzzle = generateRound4Puzzle();

  document.body.setAttribute("data-theme", `round${stageNum}`);
  document.getElementById("stage-indicator").innerText = `STAGE: ROUND ${stageNum} / 4`;
  document.getElementById("stage-title").innerText = currentPuzzle.title;
  document.getElementById("puzzle-question").innerText = currentPuzzle.question;
  document.getElementById("dialogue-box").innerText = currentPuzzle.dialogue;
  document.getElementById("clue-text").innerText = "Stuck on this stage? Click Request Clue to see formula guidance!";

  if (stageNum !== 4) {
    document.getElementById("live-input").innerText = "_";
  }

  sendStageToHardware(stageNum);
  updateInputUI("");
}

function checkAnswer() {
  const userVal = currentAnswerBuffer.trim();

  if (!userVal) {
    document.getElementById("dialogue-box").innerText = "⚠️ Please enter a value before checking!";
    return;
  }

  if (currentRound === 1 || currentRound === 3) {
    if (userVal === String(currentPuzzle.answer)) {
      document.getElementById(`frag-${currentRound}`).innerText = currentPuzzle.fragment;
      updateInputUI("");
      triggerBubbleDropTransition(currentRound + 1);
    } else {
      const mockery = getRandomMockery();
      document.getElementById("dialogue-box").innerText = `❌ ${mockery}`;
      sendLCDText("WRONG ENTRY!", "TRY AGAIN...");

      setTimeout(() => {
        clearInput();
      }, 1600);
    }
  }
}

function evaluateHardwareData(telemetry) {
  let cleanData = telemetry.replace(/[^\x20-\x7E]/g, '').trim();

  if (currentRound === 1 || currentRound === 3) {
    if (cleanData.includes("KEY:")) {
      let val = cleanData.substring(cleanData.indexOf("KEY:") + 4).trim();
      document.getElementById("live-input").innerText = val;
      updateInputUI(val);
      checkAnswer();
    }
  } 
  else if (currentRound === 2) {
    if (cleanData.includes("TOUCH_DURATION:")) {
      let dur = parseInt(cleanData.substring(cleanData.indexOf("TOUCH_DURATION:") + 15).trim());
      document.getElementById("live-input").innerText = `${(dur/1000).toFixed(2)}s`;
      
      if (Math.abs(dur - currentPuzzle.targetHoldMs) <= 300) {
        document.getElementById("frag-2").innerText = currentPuzzle.fragment;
        triggerBubbleDropTransition(3);
      } else {
        const mockery = getRandomMockery();
        document.getElementById("dialogue-box").innerText = `❌ Held for ${(dur/1000).toFixed(2)}s. Target: ${currentPuzzle.targetSec}s (±0.3s tolerance). ${mockery}`;
        sendLCDText("TIMING FAILED!", "RETRY HOLD...");
        setTimeout(() => { sendStageToHardware(2); }, 1500);
      }
    }
  } 
  else if (currentRound === 4) {
    if (cleanData.includes("DIST:")) {
      let dist = parseInt(cleanData.substring(cleanData.indexOf("DIST:") + 5).trim());
      document.getElementById("live-input").innerText = `${dist} cm`;

      if (lastDistValue !== null && Math.abs(dist - lastDistValue) >= 3) {
        shakeCount++;
      }
      lastDistValue = dist;

      if (dist >= currentPuzzle.minDist && dist <= currentPuzzle.maxDist) {
        if (!distHoldStart) {
          distHoldStart = Date.now();
          shakeCount = 0;
        }
        
        let heldSec = Math.floor((Date.now() - distHoldStart) / 1000);

        if (shakeCount >= 3) {
          document.getElementById("dialogue-box").innerText = `👋 ${getRandomShakeMockery()}`;
          shakeCount = 0;
        } else {
          document.getElementById("dialogue-box").innerText = `🎯 Correct distance target locked! Hold steady: ${heldSec} / 7 seconds...`;
        }

        sendLCDText("TARGET ACQUIRED", `HOLD: ${heldSec}/7 SEC`);

        if (Date.now() - distHoldStart >= 7000) {
          document.getElementById("frag-4").innerText = currentPuzzle.fragment;
          triggerBubbleDropTransition(5);
        }
      } else {
        if (distHoldStart !== null) {
          document.getElementById("dialogue-box").innerText = `❌ Hand drifted away! ${getRandomShakeMockery()}`;
        } else {
          document.getElementById("dialogue-box").innerText = `⚠️ Sensor reading: ${dist} cm. Convert the unit from question and hold steady!`;
        }
        distHoldStart = null;
        sendLCDText("INCORRECT DIST", "CONVERT & HOLD!");
      }
    }
  }
}

async function connectSerial() {
  try {
    port = await navigator.serial.requestPort();
    await port.open({ baudRate: 9600 });

    const encoder = new TextEncoderStream();
    encoder.readable.pipeTo(port.writable);
    writer = encoder.writable.getWriter();

    document.getElementById("connection-status").innerText = "• ONLINE";
    document.getElementById("connection-status").className = "status-indicator online";

    loadStage(1);

    const decoder = new TextDecoderStream();
    port.readable.pipeTo(decoder.writable);
    reader = decoder.readable.getReader();

    let buffer = "";
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += value;
      let lines = buffer.split("\n");
      buffer = lines.pop();
      for (let line of lines) {
        evaluateHardwareData(line);
      }
    }
  } catch (err) {
    console.error("Serial connection failed:", err);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const introModal = document.getElementById("intro-modal");
  const startVaultBtn = document.getElementById("start-vault-btn");
  if (startVaultBtn && introModal) {
    startVaultBtn.addEventListener("click", () => {
      introModal.classList.add("hidden");
    });
  }

  document.getElementById("connect-btn").addEventListener("click", connectSerial);
  document.getElementById("check-btn").addEventListener("click", checkAnswer);
  document.getElementById("clear-btn").addEventListener("click", clearInput);
  
  document.getElementById("clue-btn").addEventListener("click", () => {
    if (currentPuzzle.clue) {
      document.getElementById("dialogue-box").innerText = `😏 ${getRandomClueMockery()}`;
      document.getElementById("clue-text").innerText = currentPuzzle.clue;
    }
  });

  const answerInput = document.getElementById("answer-input");
  if (answerInput) {
    answerInput.addEventListener("input", (e) => {
      updateInputUI(e.target.value);
    });
    answerInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") checkAnswer();
    });
  }

  loadStage(1);
});
