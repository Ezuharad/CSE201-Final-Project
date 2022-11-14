// const timeCount = document.querySelector('h2');
// let timeSec = 1200;

// displayTime(timeSec);

// const countDown = setInterval(()=>{
//     timeSec --;
//     displayTime(timeSec);
//     if(timeSec<=0 || timeSec < 1) {
//         endTime();
//         clearInterval(countDown);
//     }
// },1000)

// function displayTime(seconds) {
//     const minutes = Math.floor(seconds / 60);
//     const second = Math.floor(seconds % 60);
//     timeCount.innerHTML =`${minutes<10 ? '0' : ''}${minutes}:${second<10?'0':''}${second}`;
// }

// function endTime(){
//     timeCount.innerHTML = 'TIME OUT';
// }
const startingMinutes = 5;
let time = startingMinutes * 60;

const countdownEL = document.getElementById('countdown');
let timeState = true;
let setTimeState = false;

function updateCountdown() {
    const minutes = Math.floor(time / 60);
    let seconds = time % 60;

    seconds = seconds < 10 ? '0' + seconds : seconds;
    countdownEL.innerHTML = `${minutes}:${seconds}`;
    time--;
    if(time < 1){
        window.location.href = "loser.html"; // Lose the game if time is zero
        return;
    }
    if(timeState){
        setTimeout(function(){
            updateCountdown();
        }, 1000);
    }
}
