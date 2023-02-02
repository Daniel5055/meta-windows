const windows = {};
const myself = { state: {} };

const server = io();
updateSelf();

myself.state = {
  x: window.screenX,
  y: window.screenY,
  w: window.innerWidth,
  h: window.innerHeight,
};

const colors = [
  'rgba(255, 0, 0, 0.5)',
  'rgba(0, 255, 0, 0.5)',
  'rgba(0, 0, 255, 0.5)',
];

function updateSelf() {
  myself.state = {
    x: window.screenX,
    y: window.screenY,
    w: window.innerWidth,
    h: window.innerHeight,
  };
  server.emit('state', myself.state);
  Object.values(windows).forEach((w) => update(w));
}

server.on('state', (msg) => {
  if (!(msg.id in windows)) {
    windows[msg.id] = {
      state: msg.state,
      el: document.createElement('div'),
    };
    document.body.append(windows[msg.id].el);
    windows[msg.id].el.style.backgroundColor =
      colors[Object.values(windows).length - 1];
    console.log(Object.values(windows).length, colors[0]);
  } else {
    windows[msg.id].state = msg.state;
  }

  update(windows[msg.id]);
});

function update(other) {
  if (!other) return;

  const target = other.el;

  const left = Math.max(other.state.x - myself.state.x, 0);
  const top = Math.max(other.state.y - myself.state.y, 0);
  const right = Math.max(
    myself.state.x + myself.state.w - other.state.x - other.state.w,
    0
  );
  const bottom = Math.max(
    myself.state.y + myself.state.h - other.state.y - other.state.h,
    0
  );

  target.style.left = `${left}px`;
  target.style.top = `${top}px`;
  target.style.width = `${Math.max(myself.state.w - left - right + 1, 0)}px`;
  target.style.height = `${Math.max(myself.state.h - top - bottom + 1, 0)}px`;
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
}, 0);

// Size detection
window.addEventListener('resize', (e) => {
  updateSelf();
});
