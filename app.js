// You are asked to design an interactive visualization/simulation that represents the "Projectile Motion" as an educational experiment.

// The user should be able to set the initial velocity and the projection angle and should be able to press a launch button, after that he should see the projectile motion with the path and the covered distance in X and Y directions displayed on the screen.
// There should be, also, a reset-button that enables the user to re-adjust the angle and the speed and to try to launch again!

// We are expecting a single HTML file that includes the necessary styles and scripts.

// Feel free to use any appropriate style that suits the visualization.

const velocityInput = document.getElementById("velocity");
const angleInput = document.getElementById("angle");

const g = 9.8;

function calculateMaximumHeight(velocity, angle) {
  return (Math.pow(velocity, 2) * Math.pow(Math.sin(angle), 2)) / (2 * g);
}

function calculateMaximumDistance(velocity, angle) {
  return (Math.pow(velocity, 2) * Math.sin(2 * angle)) / g;
}

function calculateTime(velocity, angle) {
  return (2 * velocity * Math.sin(angle)) / g;
}

function calculatePositionAtFrameTime(velocity, angle, time) {
  const x = velocity * time * Math.cos(angle);
  const y = velocity * time * Math.sin(angle) - 0.5 * g * Math.pow(time, 2);
  return { x, y };
}

const inputsCard = document.getElementById("inputs-card");
const canvasCard = document.getElementById("canvas-card");

function toggleClass(className, ...cards) {
  for (card of cards) {
    card.classList.toggle(className);
  }
}

function launchHandler() {
  const initialVelocity = +velocityInput.value;
  const initialangle = (+angleInput.value * Math.PI) / 180;
  // validate()
  let passedTime = 0;
  let counter = 0;
  toggleClass("hidden", inputsCard, canvasCard);
  const finalTime = calculateTime(initialVelocity, initialangle);
  const frameTime = finalTime / 180;
  const finalDistance = calculateMaximumDistance(initialVelocity, initialangle);
  const renderFrames = setInterval(() => {
    let coordinates = calculatePositionAtFrameTime(
      initialVelocity,
      initialangle,
      passedTime
    );
    passedTime += frameTime;
    if (coordinates.x > finalDistance || coordinates.y < 0) {
      clearInterval(renderFrames);
      coordinates.x = finalDistance;
      coordinates.y = 0;
    }
    counter++;
    console.log(coordinates.x, coordinates.y, counter);
  }, frameTime);
}

function restartHandler() {
  velocityInput.value = null;
  angleInput.value = null;
  toggleClass("hidden", inputsCard, canvasCard);
}

const launchBtn = document.getElementById("launch");
launchBtn.addEventListener("click", launchHandler);

const restarthBtn = document.getElementById("restart");
restarthBtn.addEventListener("click", restartHandler);
