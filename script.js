// ---------- SOUNDS ----------
const sounds = {
  s1: document.getElementById("Sound1"),
  s2: document.getElementById("Sound2"),
  s3: document.getElementById("Sound3"),
  s4: document.getElementById("Sound4"),
  s5: document.getElementById("Sound5"),
  s6: document.getElementById("Sound6"),
  s7: document.getElementById("Sound7"),
  s8: document.getElementById("Sound8"),
};

// Set volumes and loop flags
if (sounds.s2) {
  sounds.s2.volume = 0.3;
  sounds.s2.loop = true;
}
if (sounds.s3) {
  sounds.s3.loop = true;
}
if (sounds.s4) {
  sounds.s4.volume = 0.1;
  sounds.s4.loop = true;
}
if (sounds.s5) sounds.s5.volume = 1;
if (sounds.s6) sounds.s6.volume = 1;
if (sounds.s7) sounds.s7.volume = 1;
if (sounds.s8) sounds.s8.volume = 1;

// Play sound utility
function playSound(sound, pauseList = []) {
  if (!sound) return;
  pauseList.forEach((s) => s?.pause());
  sound.currentTime = 0;
  sound.play().catch(() => {});
  sound.onended = () => {
    pauseList.forEach((s) => s?.play().catch(() => {}));
  };
}

// ---------- START SOUNDS AFTER FIRST CLICK ----------
let soundsStarted = false;
function startSoundsOnInteraction() {
  if (soundsStarted) return;
  soundsStarted = true;

  // Play looping background sounds
  [sounds.s1, sounds.s2, sounds.s3, sounds.s4].forEach((s) =>
    s?.play().catch(() => {})
  );

  // Start interval sounds
  setInterval(() => playSound(sounds.s5, [sounds.s4]), 12000);
  setInterval(() => playSound(sounds.s6, [sounds.s4, sounds.s5]), 15000);
}

// Trigger sounds after first click anywhere
document.addEventListener("click", startSoundsOnInteraction, { once: true });

let arrowShown = false;
let currentNote = 1;
let modalOpenFlag = false;
let currentModal = null;
let batteryTotal = 0;
let batteriesUnlocked = false;
let batteryModalTimer = 60;
let batteryModalInterval = null;
let batteryFlashInterval = null;
let offImageTimer = null;
let flashlightLocked = false;

const n1 = document.getElementById("Note1");
const light = document.createElement("div");
const dark = document.createElement("div");
const cursorDot = document.createElement("div");
light.classList.add("flashlight", "flash-on");
dark.id = "darkness";
dark.classList.add("flash-on");
cursorDot.id = "cursorDot";
document.body.appendChild(light);
document.body.appendChild(dark);
document.body.appendChild(cursorDot);

const batteryValues = {
  BATTERY1: 3,
  BATTERY2: 5,
  BATTERY3: 2,
  BATTERY4: 1,
  BATTERY5: 2,
};
const allBatteries = [
  "BATTERY1",
  "BATTERY2",
  "BATTERY3",
  "BATTERY4",
  "BATTERY5",
];
allBatteries.forEach((id) => {
  const b = document.getElementById(id);
  if (!b) return;
  b.style.pointerEvents = "none";
  b.style.opacity = "0";
  b.addEventListener("click", () => {
    if (!batteriesUnlocked) return;
    batteryTotal += batteryValues[id] || 0;
    const bc = document.getElementById("batteryCount");
    if (bc) bc.textContent = batteryTotal;
    b.style.display = "none";
  });
});

function updateArrowVisibility() {
  const arrow = document.querySelector(".downarrow");
  if (!arrow) return;
  if (!arrowShown || modalOpenFlag) arrow.style.display = "none";
  else arrow.style.display = "block";
}

function showOffImageNow() {
  const offImg = document.querySelector(".offsymbol");
  if (offImg) offImg.classList.remove("hidden");
}
function hideOffImageNow() {
  const offImg = document.querySelector(".offsymbol");
  if (offImg) offImg.classList.add("hidden");
}
function handleFlashOnChange(isOn) {
  if (offImageTimer) {
    clearTimeout(offImageTimer);
    offImageTimer = null;
  }
  if (isOn) hideOffImageNow();
  else offImageTimer = setTimeout(showOffImageNow, 1000);
}

function stopFlashlightButKeepDot() {
  light.style.display = "none";
  dark.style.display = "block";
  cursorDot.style.display = "block";
  handleFlashOnChange(false);
}
function startFlashlight() {
  if (flashlightLocked) return;
  light.style.display = "block";
  dark.style.display = "block";
  cursorDot.style.display = "block";
  handleFlashOnChange(true);
}

function modalOpen() {
  if (currentModal === "battery") hideModaltwo();
  stopFlashlightButKeepDot();
  modalOpenFlag = true;
  currentModal = "note";
  updateArrowVisibility();

  const modal = document.getElementById("myModalnote");
  const closeBtn = document.getElementById("closeNote");
  const minimap = document.getElementById("MiniMap");

  if (modal) modal.style.display = "flex";
  if (closeBtn) closeBtn.style.display = "block";
  if (minimap) minimap.style.display = "none";

  if (!batteriesUnlocked) {
    batteriesUnlocked = true;
    allBatteries.forEach((id) => {
      const b = document.getElementById(id);
      if (b) {
        b.style.pointerEvents = "auto";
        b.style.opacity = "1";
      }
    });
  }

  light.style.display = "block";
  dark.style.display = "block";
  cursorDot.style.display = "block";
  handleFlashOnChange(true);
}

function hideModal() {
  const modal = document.getElementById("myModalnote");
  const closeBtn = document.getElementById("closeNote");
  const minimap = document.getElementById("MiniMap");

  if (modal) modal.style.display = "none";
  if (closeBtn) closeBtn.style.display = "none";
  if (minimap) minimap.style.display = "block";

  modalOpenFlag = false;
  currentModal = null;
  startFlashlight();
  updateArrowVisibility();
}

function modalOpentwo() {
  // Hide flashlight completely
  light.style.display = "none";
  dark.style.display = "none";
  cursorDot.style.display = "block"; // cursor still visible

  modalOpenFlag = true;
  currentModal = "battery";
  updateArrowVisibility();

  // Play animatronic sound
  const s8 = sounds.s8;
  if (s8) {
    s8.currentTime = 0;
    s8.play().catch(() => {});
  }

  // Hide note modal if open
  const noteModal = document.getElementById("myModalnote");
  if (noteModal) noteModal.style.display = "none";
  const closeNote = document.getElementById("closeNote");
  if (closeNote) closeNote.style.display = "none";

  const minimap = document.getElementById("MiniMap");
  if (minimap) minimap.style.display = "none";

  // Random rotation for battery image
  const batteryEl = document.getElementById("BatteryImage");
  if (batteryEl)
    batteryEl.style.transform = `rotate(${Math.random() * 240 - 120}deg)`;

  // Show battery modal and make background black
  const modal = document.getElementById("myModalbat");
  if (!modal) return;
  modal.style.display = "flex";
  modal.style.background = "black";

  const closeBat = document.getElementById("closeBat");
  if (closeBat) closeBat.style.display = "block";

  // Flash overlay setup
  let flashBg = document.getElementById("flashBackground");
  if (!flashBg) {
    flashBg = document.createElement("div");
    flashBg.id = "flashBackground";
    flashBg.style.position = "absolute";
    flashBg.style.top = "0";
    flashBg.style.left = "0";
    flashBg.style.width = "100%";
    flashBg.style.height = "100%";
    flashBg.style.background =
      "url('Images/Modal-background.webp') center/cover no-repeat";
    flashBg.style.zIndex = "5000";
    flashBg.style.opacity = "0";
    flashBg.style.pointerEvents = "none";
    flashBg.style.transition = "opacity 0.1s";
    modal.appendChild(flashBg);
  }

  // Start flash interval
  if (batteryFlashInterval) clearInterval(batteryFlashInterval);
  batteryFlashInterval = setInterval(() => {
    flashBg.style.opacity = "1";

    // Play Sound7
    const s7 = sounds.s7;
    if (s7) {
      s7.currentTime = 0;
      s7.play().catch(() => {});
    }

    setTimeout(() => (flashBg.style.opacity = "0"), 350);
  }, 10000);

  // Start timer countdown
  if (batteryModalInterval) clearInterval(batteryModalInterval);
  batteryModalTimer = 60; // reset timer
  const timerDisplay = document.getElementById("timerDisplay");
  if (timerDisplay) {
    timerDisplay.textContent = batteryModalTimer;
    timerDisplay.style.display = "block";
    timerDisplay.style.color = "red";
    timerDisplay.style.zIndex = 8000;
  }

  batteryModalInterval = setInterval(() => {
    batteryModalTimer--;
    if (timerDisplay) timerDisplay.textContent = batteryModalTimer;
    if (batteryModalTimer <= 0) clearInterval(batteryModalInterval);
  }, 1000);
}

function hideModaltwo() {
  const modal = document.getElementById("myModalbat");
  const closeBtn = document.getElementById("closeBat");
  const minimap = document.getElementById("MiniMap");

  if (modal) modal.style.display = "none";
  if (closeBtn) closeBtn.style.display = "none";
  if (minimap) minimap.style.display = "block";

  modalOpenFlag = false;
  currentModal = null;
  flashlightLocked = false;

  // restore flashlight mask for normal operation
  dark.style.mask =
    "radial-gradient(circle var(--size, 200px) at var(--x) var(--y), transparent 0%, transparent 40%, rgba(0,0,0,0.8) 70%, black 100%)";

  startFlashlight();
  if (batteryFlashInterval) clearInterval(batteryFlashInterval);
  batteryFlashInterval = null;
  if (!arrowShown) arrowShown = true;
  updateArrowVisibility();
  hideTimer();
}

function startBatteryModalTimerAndFlash() {
  const timerDisplay = document.getElementById("timerDisplay");
  batteryModalTimer = 60;
  if (timerDisplay) {
    timerDisplay.textContent = batteryModalTimer;
    timerDisplay.style.display = "block";
    timerDisplay.style.color = "red";
    timerDisplay.style.zIndex = 8000;
  }
  if (batteryModalInterval) clearInterval(batteryModalInterval);
  batteryModalInterval = setInterval(() => {
    batteryModalTimer--;
    if (timerDisplay) timerDisplay.textContent = batteryModalTimer;
    if (batteryModalTimer <= 0) clearInterval(batteryModalInterval);
  }, 1000);

  const modal = document.getElementById("myModalbat");
  if (!modal) return;
  let flashBg = document.getElementById("flashBackground");
  if (!flashBg) {
    flashBg = document.createElement("div");
    flashBg.id = "flashBackground";
    flashBg.style.position = "absolute";
    flashBg.style.top = "0";
    flashBg.style.left = "0";
    flashBg.style.width = "100%";
    flashBg.style.height = "100%";
    flashBg.style.background =
      "url('Images/Modal-background.webp') center/cover no-repeat";
    flashBg.style.zIndex = 6500;
    flashBg.style.opacity = "0";
    flashBg.style.pointerEvents = "none";
    flashBg.style.transition = "opacity 0.1s";
    modal.appendChild(flashBg);
  }

  if (batteryFlashInterval) clearInterval(batteryFlashInterval);
  batteryFlashInterval = setInterval(() => {
    const s7 = sounds.s7;
    if (!s7) return;
    for (let key in sounds) {
      if (sounds[key] && key !== "s2" && key !== "s7") sounds[key].pause();
    }
    flashBg.style.opacity = "1";
    s7.currentTime = 0;
    s7.play().catch(() => {});
    setTimeout(() => {
      flashBg.style.opacity = "0";
    }, 450);
    const resume = function () {
      for (let key in sounds) {
        if (sounds[key] && key !== "s2" && key !== "s7")
          sounds[key].play().catch(() => {});
      }
      s7.removeEventListener("ended", resume);
    };
    s7.addEventListener("ended", resume);
  }, 20000);
}

function hideTimer() {
  const timerDisplay = document.getElementById("timerDisplay");
  if (timerDisplay) timerDisplay.style.display = "none";
}

function changeNote(forward = true) {
  if (forward) currentNote = currentNote >= 6 ? 1 : currentNote + 1;
  else currentNote = currentNote <= 1 ? 6 : currentNote - 1;
  if (n1) n1.src = `Images/Notes/NoteP${currentNote}.png`;
}

document
  .getElementById("NoteRarrow")
  ?.addEventListener("click", () => changeNote(true));
document
  .getElementById("NoteLarrow")
  ?.addEventListener("click", () => changeNote(false));
document
  .getElementById("NoteRarrowClone")
  ?.addEventListener("click", () => changeNote(true));
document
  .getElementById("NoteLarrowClone")
  ?.addEventListener("click", () => changeNote(false));
document.getElementById("closeNote")?.addEventListener("click", hideModal);
document.getElementById("closeBat")?.addEventListener("click", hideModaltwo);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    hideModal();
    hideModaltwo();
  }
});

document.addEventListener("mousemove", (e) => {
  light.style.setProperty("--x", e.clientX + "px");
  light.style.setProperty("--y", e.clientY + "px");
  dark.style.setProperty("--x", e.clientX + "px");
  dark.style.setProperty("--y", e.clientY + "px");
  cursorDot.style.left = e.clientX + "px";
  cursorDot.style.top = e.clientY + "px";
});

document
  .querySelectorAll("img")
  .forEach((img) => img.setAttribute("draggable", "false"));

hideOffImageNow();
handleFlashOnChange(light.classList.contains("flash-on"));
// Define the possible battery rotation positions (in degrees)
const batteryPositions = [-120, -60, 0, 60, 120];
let currentBatteryIndex = 0;

// Get battery element
const batteryEl = document.getElementById("BatteryImage");

// Function to rotate battery left
function rotateBatteryLeft() {
  if (!batteryEl) return;
  currentBatteryIndex =
    (currentBatteryIndex - 1 + batteryPositions.length) %
    batteryPositions.length;
  batteryEl.style.transform = `rotate(${batteryPositions[currentBatteryIndex]}deg)`;
}

// Function to rotate battery right
function rotateBatteryRight() {
  if (!batteryEl) return;
  currentBatteryIndex = (currentBatteryIndex + 1) % batteryPositions.length;
  batteryEl.style.transform = `rotate(${batteryPositions[currentBatteryIndex]}deg)`;
}

// Add click event listeners to your buttons
const rotateLeftBtn = document.getElementById("rotateLeft");
const rotateRightBtn = document.getElementById("rotateRight");

if (rotateLeftBtn) rotateLeftBtn.addEventListener("click", rotateBatteryLeft);
if (rotateRightBtn)
  rotateRightBtn.addEventListener("click", rotateBatteryRight);
function goDown() {
  // Open external link when down arrow clicked
  window.location.href = "https://r8nspc-5000.csb.app/";
}
