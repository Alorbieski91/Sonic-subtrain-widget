class Countdown {
    constructor() {
    this.duration = 0;
    this.elapsed = 0;
    this.isActive = false;
    this.lastFrameTime = Date.now();
    
    this.onTick = () => {};
    this.onCompleted = () => {};
    
    this.tick();
    }
  
    getTimeLeft() {
        const t = this.duration - this.elapsed;

        return Math.max(0, t);
    }
    
    pause() {
        this.isActive = false;
        
        return this;
    }
    
    reset() {
        this.elapsed = 0;
    }
    
    setDuration(seconds) {
        this.lastFrameTime = Date.now();
        this.duration = seconds;
        
        return this;
    }
    
    start() {
        this.isActive = true;
        
        return this;
    }
    
    tick() {
        const currentFrameTime = Date.now();
        const deltaTime = currentFrameTime - this.lastFrameTime;
        this.lastFrameTime = currentFrameTime;

        if (this.isActive) {
        this.elapsed += deltaTime / 1000;
        this.onTick(this.getTimeLeft());
        
        if(this.getTimeLeft() <= 0) {
            this.pause();
            this.onCompleted();
        }
        }
        
        window.requestAnimationFrame(this.tick.bind(this));
    }
}

let vid = document.querySelector(".sonic");
let normS = "animations/sonicidle.webm";
let transform = "animations/transform.webm";
let superS = "animations/superidle.webm";
let powerDown = "animations/powerdown/webm";

const mainTimer = new Countdown().setDuration(10);
const transformTimer = new Countdown().setDuration(5.1);
const powerDownTimer = new Countdown().setDuration(3);


window.addEventListener('onEventReceived', function (obj) {
    if (!obj.detail.event) {
        return;
    }    
    const listener = obj.detail.listener.split("-")[0];
    const event = obj.detail.event;


    if (listener === 'subscriber'){
        mainTimer.reset();
        mainTimer.start();
        powerDownTimer.pause();
        mainTimer.onCompleted = () => {
            vid.src = powerDown;
            powerDownTimer.reset();
            powerDownTimer.start();
            powerDownTimer.onCompleted = () => {        
                vid.src = normS;
            }
        }
        
        if (vid.src != superS && vid.src != transform) {
            vid.src = transform;
            transformTimer.reset();
            transformTimer.start();
            transformTimer.onCompleted = () => {
                vid.src = superS;
            }
        } else if (vid.src === powerDown) {
            vid.src = transform;
            transformTimer.reset();
            transformTimer.start();
            transformTimer.onCompleted = () => {
                vid.src = superS;
            }
        }
    }
});