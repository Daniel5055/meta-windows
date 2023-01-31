const windows = {};
const myself = { state: {} };

const server = io();
    myself.state = { x: window.screenX, y: window.screenY, w: window.innerWidth, h: window.innerHeight };

function updateSelf() {
    myself.state = { x: window.screenX, y: window.screenY, w: window.innerWidth, h: window.innerHeight };
    server.emit('state', myself.state);
    update();
}

updateSelf();

server.on('state', (msg) => {
    if (!(msg.id in windows)) {
        windows[msg.id] = {
            state: msg.state,
            el: document.createElement('div'),
        }
        document.body.append(windows[msg.id].el)
    } else {
        windows[msg.id].state = msg.state;
    }

    console.log(windows);
    const other = windows[msg.id];

    const target = other.el;

    const left = Math.max(other.state.x - myself.state.x, 0);
    const top = Math.max(other.state.y - myself.state.y, 0);
    const right = Math.max(myself.state.x + myself.state.w - other.state.x - other.state.w, 0);
    const bottom = Math.max(myself.state.y + myself.state.h - other.state.y - other.state.h, 0);

    target.style.left = `${left}px`;
    target.style.top = `${top}px`;
    target.style.width = `${myself.state.w - left - right}px`;
    target.style.height = `${myself.state.h - top - bottom}px`;
})

function update() {
    const other = Object.values(windows)[0];
    if (!other) return;

    const target = other.el;

    const left = Math.max(other.state.x - myself.state.x, 0);
    const top = Math.max(other.state.y - myself.state.y, 0);
    const right = Math.max(myself.state.x + myself.state.w - other.state.x - other.state.w, 0);
    const bottom = Math.max(myself.state.y + myself.state.h - other.state.y - other.state.h, 0);

    target.style.left = `${left}px`;
    target.style.top = `${top}px`;
    target.style.width = `${myself.state.w - left - right}px`;
    target.style.height = `${myself.state.h - top - bottom}px`;
}

// Movement detection
let oldX = window.screenX;
let oldY = window.screenY;

let interval = setInterval(() => {
    if (window.screenX !== oldX || window.screenY !== oldY) {
        updateSelf();
        oldX = window.screenX;
        oldY = window.screenY;
    }
}, 0)

// Size detection
window.addEventListener('resize', (e) => {
    updateSelf();
})
