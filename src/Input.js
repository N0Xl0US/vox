const keys = {};

let mouseX = 0;
let mouseY = 0;

function handleKeyDown(event) {
	keys[event.keyCode] = true;
}

function handleKeyUp(event) {
	keys[event.keyCode] = false;
}

function handleMouseMove(event) {
	mouseX = event.clientX;
	mouseY = event.clientY;
}

function resetMouse(){
	mouseX = 0
	mouseY = 0;
}

document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);
document.addEventListener("mousemove", handleMouseMove);

export { keys, mouseX, mouseY, resetMouse};
