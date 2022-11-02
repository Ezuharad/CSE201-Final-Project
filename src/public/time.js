const startingMinutes = 5;
let time = startingMinutes * 60;

const countdownEL = document.getElementById('countdown');
setInterval(updateCountdown, 1000);

function updateCountdown() {
    const minutes = Math.floor(time / 60);
    let seconds = time % 60;

    seconds = seconds < 10 ? '0' + seconds : seconds;
    countdownEL.innerHTML = `${minutes}:${seconds}`;
    time--;
}