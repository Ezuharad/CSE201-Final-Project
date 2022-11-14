const timeCount = document.querySelector('h2');
let timeSec = 1200;

displayTime(timeSec);

const countDown = setInterval(()=>{
    timeSec --;
    displayTime(timeSec);
    if(timeSec<=0 || timeSec < 1) {
        endTime();
        clearInterval(countDown);
    }
}, 1)

function displayTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const second = Math.floor(seconds % 60);
    timeCount.innerHTML =`${minutes<10 ? '0' : ''}${minutes}:${second<10?'0':''}${second}`;
}

function endTime(){
    timeCount.innerHTML = 'TIME OUT';
}