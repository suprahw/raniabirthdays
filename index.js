const birthday = new Date('2026-07-15T00:00:00');
const ssap = '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08';

let state = 'COUNTING'; // COUNTING, GATE, REVEAL

function setState (next){
    state = next;

    document.getElementById('countdown').style.display = 'none';
    document.getElementById('loginPassword').style.display = 'none';
    document.getElementById('birthdayReveal').style.display = 'none';

    if (next === 'COUNTING') {
        document.getElementById('countdown').style.display = 'flex';
    } else  if (next === 'GATE') {
        document.getElementById('loginPassword').style.display = 'flex';
        document.getElementById('loginScreen').style.filter = 'brightness(85%)';
        document.querySelector('.theBackground').classList.add('soreTime');
        document.querySelector('.theCloud').classList.add('soreTime');
        document.getElementById('cakeSlot').classList.add('swapped');
        document.title = '🎉25!🎉25!🎉25!🎉25!🎉25!🎉25!🎉25!🎉25!🎉25!🎉25!🎉'
    } else  if (next === 'REVEAL') {
        document.getElementById('birthdayReveal').style.display = 'flex';
        document.getElementById('loginScreen').style.filter = 'brightness(100%)';
        document.querySelector('.theBackground').classList.remove('soreTime');
        document.querySelector('.theBackground').classList.add('morningTime');
        document.querySelector('.theCloud').classList.remove('soreTime');
        document.querySelector('.theCloud').classList.add('morningTime');
        revealVideosandEnvelope();
    }
}

setInterval(() => {
    const diff = birthday - new Date();

    if (diff <= 0 && state === 'COUNTING') {
        setState('GATE');
        return;
    }

    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    document.getElementById('days').textContent = pad(d);
    document.getElementById('hours').textContent = pad(h);
    document.getElementById('mins').textContent = pad(m);
    document.getElementById('secs').textContent = pad(s);

}, 1000);

const pad = n => String(n).padStart(2, '0');

document.getElementById('passSubmit').addEventListener('click', async () => {
    const input = document.getElementById('passInput').value;
    const hash = await sha256(input);

    if (hash === ssap) {
        setState('REVEAL');
    } else {
        alert('Hayo inget passwordnya ndak?');
    }
});

async function sha256(text) {
    const buf  = await crypto.subtle.digest('SHA-256',
    new TextEncoder().encode(text));
    return [...new Uint8Array(buf)]
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

let letterState = 'CLOSED';

function revealVideosandEnvelope(){
    document.getElementById('slotVideo1').classList.add('swapped');
    document.getElementById('slotVideo2').classList.add('swapped');
    document.getElementById('envelopeTrigger').classList.add('swapped');
};

var i = 0;
var txt = 'HAPPIEST 25TH BIRTHDAY!';
var speed = 90;

function typeWriter(){
    if (i < txt.length) {
        document.getElementById('hbd').innerHTML += txt.charAt(i);
        i++;
        setTimeout(typeWriter, speed);
    }
}

const bgMusic = new Audio('images/BGM.mp3');
const inMusic = new Audio('images/introMusic.mp3');

bgMusic.loop = true;
inMusic.loop = true;

function tryPlay(){
    if (state === 'COUNTING') {
        inMusic.play().catch(() => {});
        document.removeEventListener('click', tryPlay);
        document.removeEventListener('keydown', tryPlay);
        bgMusic.pause();
    } else {
        bgMusic.play().catch(() => {});
        document.removeEventListener('click', tryPlay);
        document.removeEventListener('keydown', tryPlay);
        inMusic.pause();
    }
}

document.addEventListener('click', tryPlay);
document.addEventListener('keydown', tryPlay);

const allVideos = document.querySelectorAll('.theVideo');

function isAnyVideoPlaying(){
    return Array.from(allVideos).some(v => !v.paused && !v.ended);
}

document.querySelectorAll('.mediaSlot').forEach(slot => {
        const video = slot.querySelector('video');
        const btn = slot.querySelector('.playOverlay');

        function togglePlay(){
            if (video.paused){
                video.play();
                btn.style.display = 'none'
            } else {
                video.pause();
                btn.style.display = 'flex'
            }
        }

        btn.addEventListener('click', togglePlay);
        video.addEventListener('click', togglePlay);

        video.addEventListener('play', () => {
            bgMusic.pause();
        });

        video.addEventListener('pause', () => {
            if (!isAnyVideoPlaying()) {
                bgMusic.play().catch(() => {});
            }
        });

        video.addEventListener('ended', () => {
            video.currentTime = 0;
            btn.style.display = 'flex';
        })
    })


function openLetter(){
    if (state !== 'REVEAL') return;
    if (letterState !== 'CLOSED') return;

    letterState = 'OPENED';

    const overlay = document.getElementById('letterOverlay');
    const envelope = document.getElementById('bigEnvelope');

    overlay.classList.add('active');

    envelope.addEventListener('transitionend', function startFlap(e){
        if (e.propertyName !== 'transform') return;
        envelope.removeEventListener('transitionend', startFlap);
        envelope.classList.add('opening');
    })
};

document.getElementById('bigEnvelope').addEventListener('animationend', () => {
    letterState = 'OPENED';
    document.getElementById('letterContent').classList.remove('hidden');
});

document.getElementById('letterClose').addEventListener('click', () => {
    letterState = 'CLOSED';

    document.getElementById('letterOverlay').classList.remove('active');
    document.getElementById('bigEnvelope').classList.remove('opening');
    document.getElementById('letterContent').classList.add('hidden');
});

const theBird = document.getElementById('birdRight');
const theBirdWidth = theBird.clientWidth;
const theSpeed = 2;
let positionX = -theBirdWidth;

theBird.style.left = positionX + 'px';

function moveBird(){

    positionX += theSpeed;

    if (positionX >= window.innerWidth){
        theBird.style.left = window.innerWidth + 'px';

        positionX = -theBirdWidth;
        setTimeout(moveBird, 62500);
        return;
    };

    theBird.style.left = positionX + 'px';
    requestAnimationFrame(moveBird);
};

setTimeout(moveBird, 3000);

const theBird1 = document.getElementById('birdRight1');
const theBird1Width = theBird1.clientWidth;
const birdSpeed1 = 2;
let theBird1Pos = -theBird1Width;

theBird1.style.left = positionX + 'px';

function moveBird1(){

    theBird1Pos += theSpeed;

    if (theBird1Pos >= window.innerWidth){
        theBird1.style.left = window.innerWidth + 'px';

        return;
    };

    theBird1.style.left = theBird1Pos + 'px';
    requestAnimationFrame(moveBird1);
};

setTimeout(moveBird1, 3500);

const theBird2 = document.getElementById('birdRight2');
const theBird2Width = theBird1.clientWidth;
const birdSpeed2 = 2;
let theBird2Pos = -theBird2Width;

theBird2.style.left = positionX + 'px';

function moveBird2(){

    theBird2Pos += theSpeed;

    if (theBird2Pos >= window.innerWidth){
        theBird2.style.left = window.innerWidth + 'px';

        theBird2Pos = -theBirdWidth;
        setTimeout(moveBird2, 62500);
        return;
    };

    theBird2.style.left = theBird2Pos + 'px';
    requestAnimationFrame(moveBird2);
};

setTimeout(moveBird2, 3250);

const thePatrol = document.getElementById('patrolDrone');
const thePatrolWidth = thePatrol.clientWidth;
const patrolSpeed = 3;
let patrolposX = window.innerWidth;

thePatrol.style.left = patrolposX + 'px';

function movePatrol(){
    patrolposX -= patrolSpeed;

    if (patrolposX <= -thePatrolWidth) {
        thePatrol.style.left = '-${thePatrolWidth}px';

        patrolposX = window.innerWidth;
        setTimeout(movePatrol, 62500);
        return;
    }

    thePatrol.style.left = patrolposX + 'px';
    requestAnimationFrame(movePatrol);
}

setTimeout(movePatrol, 17000);

const thePatrol1 = document.getElementById('patrolDrone1');
const thePatrol1Width = thePatrol1.clientWidth;
const patrol1Speed = 3;
let patrol1posX = window.innerWidth;

thePatrol1.style.left = patrol1posX + 'px';

function movePatrol1(){
    patrol1posX -= patrol1Speed;

    if (patrol1posX <= -thePatrol1Width) {
        thePatrol1.style.left = '-${thePatrol1Width}px';

        patrol1posX = window.innerWidth;
        setTimeout(movePatrol1, 62500);
        return;
    }

    thePatrol1.style.left = patrol1posX + 'px';
    requestAnimationFrame(movePatrol1);
}

setTimeout(movePatrol1, 17500);

const theCourier = document.getElementById('courierDrone');
const theCourierWidth = theCourier.clientWidth;
const courierSpeed = 2;
let courierPosX = -theCourierWidth;

theCourier.style.left = courierPosX + 'px';

function moveCourier(){

    courierPosX += courierSpeed;

    if (courierPosX >= window.innerWidth){
        theCourier.style.left = window.innerWidth + 'px';

        courierPosX = -theCourierWidth;
        setTimeout(moveCourier, 62500);
        return;
    };

    theCourier.style.left = courierPosX + 'px';
    requestAnimationFrame(moveCourier);
};

setTimeout(moveCourier, 30000);

const theCourier1 = document.getElementById('courierDrone1');
const theCourier1Width = theCourier1.clientWidth;
const courier1Speed = 2;
let courier1PosX = -theCourier1Width;

theCourier1.style.left = courier1PosX + 'px';

function moveCourier1(){

    courier1PosX += courier1Speed;

    if (courier1PosX >= window.innerWidth){
        theCourier1.style.left = window.innerWidth + 'px';

        courier1PosX = -theCourier1Width;
        setTimeout(moveCourier1, 62500);
        return;
    };

    theCourier1.style.left = courier1PosX + 'px';
    requestAnimationFrame(moveCourier1);
};

setTimeout(moveCourier1, 30500);

const theScanner = document.getElementById('scannerDrone');
const theScannerWidth = theScanner.clientWidth;
const theScannerSpeed = 2;
let ScannerPosX = -theScannerWidth;

theScanner.style.left = ScannerPosX + 'px';

function moveScanner(){

    ScannerPosX += theScannerSpeed;

    if (ScannerPosX >= window.innerWidth){
        theScanner.style.left = window.innerWidth + 'px';

        ScannerPosX = -theScannerWidth;
        setTimeout(moveScanner, 62500);
        return;
    };

    theScanner.style.left = ScannerPosX + 'px';
    requestAnimationFrame(moveScanner);
};

setTimeout(moveScanner, 45000);

const theScanner1 = document.getElementById('scannerDrone1');
const theScanner1Width = theScanner1.clientWidth;
const theScanner1Speed = 2;
let Scanner1PosX = -theScanner1Width;

theScanner1.style.left = Scanner1PosX + 'px';

function moveScanner1(){

    Scanner1PosX += theScanner1Speed;

    if (Scanner1PosX >= window.innerWidth){
        theScanner1.style.left = window.innerWidth + 'px';

        Scanner1PosX = -theScanner1Width;
        setTimeout(moveScanner1, 62500);
        
        return;
    };

    theScanner1.style.left = Scanner1PosX + 'px';
    requestAnimationFrame(moveScanner1);
};

setTimeout(moveScanner1, 45500);

const theBirdLeft = document.getElementById('birdLeft');
const birdLeftWidth = theBirdLeft.clientWidth;
const birdLeftSpeed = 2;
let birdLeftPosX = window.innerWidth;

theBirdLeft.style.left = birdLeftPosX + 'px';

function moveBirdLeft(){
    birdLeftPosX -= birdLeftSpeed;

    if (birdLeftPosX <= -birdLeftWidth) {
        theBirdLeft.style.left = '-${birdLeftWidth}px';

        birdLeftPosX = window.innerWidth;
        setTimeout(moveBirdLeft, 62500);
        return;
    }

    theBirdLeft.style.left = birdLeftPosX + 'px';
    requestAnimationFrame(moveBirdLeft);
}

setTimeout(moveBirdLeft, 61000);

const theBirdLeft1 = document.getElementById('birdLeft1');
const birdLeft1Width = theBirdLeft1.clientWidth;
const birdLeft1Speed = 2;
let birdLeft1PosX = window.innerWidth;

theBirdLeft1.style.left = birdLeft1PosX + 'px';

function moveBirdLeft1(){
    birdLeft1PosX -= birdLeft1Speed;

    if (birdLeft1PosX <= -birdLeft1Width) {
        birdLeft1.style.left = '-${birdLeft1Width}px';

        birdLeft1PosX = window.innerWidth;
        setTimeout(moveBirdLeft1, 62500);
        return;
    }

    theBirdLeft1.style.left = birdLeft1PosX + 'px';
    requestAnimationFrame(moveBirdLeft1);
}

setTimeout(moveBirdLeft1, 61500);

var is = 0;
var chat = 'Make some wishes before you blow out the candle!';
var speedChat = 90;

document.getElementById('letterClose').addEventListener('click', function chatting(){

    document.getElementById('chatBubble').classList.remove('invisible');
    document.getElementById('bubbles').classList.remove('invisible');

    if (is < chat.length) {
        document.getElementById('chatter').innerHTML += chat.charAt(is);
        is++;
        setTimeout(chatting, speedChat);
    } else {
       isFinished();
    };
});
   
function isFinished(){
    document.getElementById('chatBubble1').classList.remove('invisible');
    document.getElementById('bubbles1').classList.remove('invisible');
};


const blowThreshold = 30;
const blowFrames = 4;

async function blowDetection() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 512;
        source.connect(analyser);

        const data = new Uint16Array(analyser.frequencyBinCount);
        let loudFrames = 0;

        function checkVolume(){
            
            analyser.getByteFrequencyData(data);
            const avg = data.reduce((sum, v) => sum + v, 0) / data.length;

            if (avg > blowThreshold) {
                loudFrames++;
            } else {
                loudFrames = 0;
            };

            if (loudFrames > blowFrames) {
                extinguishCandle();
                stream.getTracks().forEach(track => track.stop());
                return;
            };
            console.log(avg);
            requestAnimationFrame(checkVolume);
        };

        checkVolume();
        document.getElementById('chatBubble1').classList.add('invisible');
    } catch (err) {
        document.getElementById('enableMic').style.display = 'none';
        document.getElementById('manualBlow').classList.remove('hidden');
    };
};

function extinguishCandle(){
    document.getElementById('cakeSlot').classList.remove('swapped');
    document.getElementById('chatBubble1').classList.add('invisible');
    document.getElementById('bubbles1').classList.add('invisible');
    document.getElementById('chatBubble').classList.add('invisible');
    document.getElementById('bubbles').classList.add('invisible');
    document.getElementById('himIdle').classList.add('invisible');
    document.getElementById('himHappy').classList.remove('invisible');
    document.getElementById('herIdle').classList.add('invisible');
    document.getElementById('herHappy').classList.remove('invisible');
};

document.getElementById('enableMic').addEventListener('click', blowDetection);
document.getElementById('manualBlow').addEventListener('click', extinguishCandle);
document.getElementById('manualBlow').addEventListener('click', removeEvents);


function removeEvents(){
      if (document.getElementById('cakeSlot').classList.contains('swapped') === false) {
        document.getElementById('letterClose').removeEventListener('click', removeEvents)
    } 
    
}

/* function chatting(callback){
    document.getElementById('chatBubble').classList.remove('invisible');
    document.getElementById('bubbles').classList.remove('invisible');

    if (is < chat.length) {
        document.getElementById('chatter').innerHTML += chat.charAt(is);
        is++;
        setTimeout(chatting, speedChat);
    } else {
       isFinished();
    };

}; */


/*
const character = document.getElementById('birdRight');
const wrapper = document.querySelectorAll('.birdWrapper');
let positionX = 0;
const speedss = 3;
let directions = 1;
const screenWidth = window.innerWidth;

function moveCharacter(){
    const wrapperWidth = wrapper.clientWidth;
    const characterWidth = character.clientWidth;

    positionX += speedss * directions;

    if(positionX + characterWidth >= wrapperWidth && directions === 1){
        direction = -1;
        character.classList.add('facingLeft');
    } else if (positionX <= 0 && directions === -1){
        directions = 1;
        character.classList.remove('facingLeft');
    };

    if (directions === -1) {
        character.style.transform = 'translateX(${positionX}px) scaleX(-1)';
    } else {
        character.style.transform = 'translateX(${positionX}px) scaleX(1)';
    }

    requestAnimationFrame(moveCharacter);
};

moveCharacter(); 
*/

if (new Date() >= birthday) {
    setState('GATE');
} else {
    setState('COUNTING');
};



