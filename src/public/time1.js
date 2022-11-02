const startingMinute = 5;
let times = startingMinute * 60;

const countdown = document.getElementById('secondtimer');
setInterval(upCountdown, 1000);

function upCountdown() {
    const minute = Math.floor(times / 60);
    let second = times % 60;

    second = second < 10 ? '0' + second : second;
    countdown.innerHTML = `${minute}:${second}`;
    times--;
}