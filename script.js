/* =========================================================
   1. COUNTDOWN
   ✏️ EDIT THIS: set your real kickoff date and time.
   Format: "YYYY-MM-DDTHH:MM:SS" (24-hour time)
   ========================================================= */
const KICKOFF = new Date("2026-12-20T18:00:00");

const daysEl  = document.getElementById("cd-days");
const hoursEl = document.getElementById("cd-hours");
const minsEl  = document.getElementById("cd-mins");
const secsEl  = document.getElementById("cd-secs");
const board   = document.getElementById("scoreboard");

// Adds a leading zero: 5 becomes "05"
function pad(n) {
    return String(n).padStart(2, "0");
}

function updateCountdown() {
    const diff = KICKOFF - new Date(); // time left in milliseconds

    // Kickoff has passed: swap the clock for a message
    if (diff <= 0) {
        board.classList.add("live");
        board.innerHTML = '<p class="sb-live">The league is live!</p>';
        clearInterval(timer);
        return;
    }

    const totalSeconds = Math.floor(diff / 1000);
    daysEl.textContent  = pad(Math.floor(totalSeconds / 86400));
    hoursEl.textContent = pad(Math.floor((totalSeconds % 86400) / 3600));
    minsEl.textContent  = pad(Math.floor((totalSeconds % 3600) / 60));
    secsEl.textContent  = pad(totalSeconds % 60);
}

updateCountdown();                           // run once straight away
const timer = setInterval(updateCountdown, 1000); // then every second


/* =========================================================
   2. MUSIC BUTTON
   ========================================================= */
const song = document.getElementById("chlSong");
const musicButton = document.getElementById("musicButton");

musicButton.addEventListener("click", function () {
    if (song.paused) {
        song.play();
        musicButton.textContent = "⏸ Stop CHL music";
    } else {
        song.pause();
        song.currentTime = 0; // back to the start
        musicButton.textContent = "▶ Play CHL music";
    }
});


/* =========================================================
   3. FALLING SNOW
   Tweak these two numbers to change the look:
   ========================================================= */
const SNOWFLAKES = 70;   // more = heavier snow (try 40 to 120)
const SNOW_SPEED = 1;    // higher = faster fall

const canvas = document.getElementById("snow");
const ctx = canvas.getContext("2d");

// Respect people who turned off animations in their device settings
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Make the canvas match the window size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Create each snowflake with a random position, size and drift
const flakes = [];
for (let i = 0; i < SNOWFLAKES; i++) {
    flakes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2.5 + 1,       // 1 to 3.5 pixels
        speed: Math.random() * 0.8 + 0.4,    // fall speed
        drift: Math.random() * 0.6 - 0.3,    // sideways sway
        sway: Math.random() * Math.PI * 2    // starting point in the sway
    });
}

function drawSnow() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";

    for (const f of flakes) {
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2);
        ctx.fill();

        // Move the flake down and gently side to side
        f.y += f.speed * SNOW_SPEED;
        f.sway += 0.01;
        f.x += f.drift + Math.sin(f.sway) * 0.3;

        // When it leaves the screen, send it back to the top
        if (f.y > canvas.height) {
            f.y = -5;
            f.x = Math.random() * canvas.width;
        }
        if (f.x > canvas.width) f.x = 0;
        if (f.x < 0) f.x = canvas.width;
    }

    requestAnimationFrame(drawSnow);
}

if (reduceMotion) {
    canvas.style.display = "none"; // no snow for those users
} else {
    drawSnow();
}
