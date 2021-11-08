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

function toggleClass(className, ...cards) {
  for (card of cards) {
    card.classList.toggle(className);
  }
}

function validateInput(velocity, angle) {
  if (velocity <= 0) {
    alert("Invalid velocity. Please enter a value higher than 0");
    return false;
  }

  if (angle <= 0 || angle > 90) {
    alert("Invalid angle. Please enter a valid value between 0 and 90");
    return false;
  }
  return true;
}

function calculateCoordinatesAtFrameTime(velocity, angle, time) {
  const x = velocity * time * Math.cos(angle);
  const y = velocity * time * Math.sin(angle) - 0.5 * g * Math.pow(time, 2);
  return { x, y };
}

function convertCoordinatesToPixels(
  IsHeightBiggerValue,
  maxHeight,
  maxDistance,
  x,
  y
) {
  let scaledX, scaledY;
  if (IsHeightBiggerValue) {
    scaledX = (x * canvasHeight) / maxHeight;
    scaledY = (y * canvasHeight) / maxHeight;
  } else {
    scaledX = (x * canvasWidth) / maxDistance;
    scaledY = (y * canvasWidth) / maxDistance;
  }
  return { scaledX, scaledY };
}

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

function drawOnCanvas(x, y) {
  const repositionedY = canvasHeight - y;
  ctx.beginPath();
  ctx.arc(x, repositionedY, 1, 0, Math.PI * 2);
  ctx.fillStyle = "white";
  ctx.fill();
}

function drawMaxValues(maxH, maxW, actualMaxH, actualMaxW) {
  ctx.beginPath();
  ctx.arc(maxW / 2, canvasHeight, 5, 0, Math.PI * 2);
  ctx.fillStyle = "magenta";
  ctx.fill();

  ctx.beginPath();
  ctx.setLineDash([15, 5]);
  ctx.moveTo(maxW / 2, canvasHeight);
  ctx.lineTo(maxW / 2, canvasHeight - maxH);
  ctx.strokeStyle = "magenta";
  ctx.stroke();
  ctx.lineWidth = 3;

  ctx.beginPath();
  ctx.arc(maxW / 2, canvasHeight - maxH, 5, 0, Math.PI * 2);
  ctx.fillStyle = "magenta";
  ctx.fill();

  ctx.fillText(
    `Max Height = ${Math.round(actualMaxH)}`,
    maxW / 2 + 10,
    canvasHeight - maxH + 30
  );

  ctx.beginPath();
  ctx.arc(0, canvasHeight, 5, 0, Math.PI * 2);
  ctx.fillStyle = "cyan";
  ctx.fill();

  ctx.beginPath();
  ctx.setLineDash([15, 5]);
  ctx.moveTo(0, canvasHeight);
  ctx.lineTo(maxW, canvasHeight);
  ctx.strokeStyle = "cyan";
  ctx.stroke();
  ctx.lineWidth = 3;

  ctx.beginPath();
  ctx.arc(maxW, canvasHeight, 5, 0, Math.PI * 2);
  ctx.fillStyle = "cyan";
  ctx.fill();

  ctx.fillText(
    `Max Distance = ${Math.round(actualMaxW)}`,
    maxW - 140,
    canvasHeight - 10
  );
}

const inputsCard = document.getElementById("inputs-card");
const canvasCard = document.getElementById("canvas-card");
let renderFrames;

function launchHandler() {
  const initialVelocity = +velocityInput.value;
  if (!validateInput(initialVelocity, angleInput.value)) {
    return;
  }
  const initialangle = (+angleInput.value * Math.PI) / 180;
  const maximumHeight = calculateMaximumHeight(initialVelocity, initialangle);
  const maximumDistance = calculateMaximumDistance(
    initialVelocity,
    initialangle
  );
  const IsHeightBiggerValue = maximumHeight > maximumDistance ? true : false;

  let passedTime = 0;
  let counter = 0;
  toggleClass("hidden", inputsCard, canvasCard);
  const finalTime = calculateTime(initialVelocity, initialangle);
  const frameTime = finalTime / 180;
  const finalDistance = calculateMaximumDistance(initialVelocity, initialangle);
  renderFrames = setInterval(() => {
    let coordinates = calculateCoordinatesAtFrameTime(
      initialVelocity,
      initialangle,
      passedTime
    );
    let scaledCoordinates = convertCoordinatesToPixels(
      IsHeightBiggerValue,
      maximumHeight,
      maximumDistance,
      coordinates.x,
      coordinates.y
    );
    passedTime += frameTime;
    if (coordinates.x > finalDistance || coordinates.y < 0) {
      clearInterval(renderFrames);
      let peakCoordinates = convertCoordinatesToPixels(
        IsHeightBiggerValue,
        maximumHeight,
        maximumDistance,
        maximumDistance,
        maximumHeight
      );
      scaledCoordinates.scaledX = peakCoordinates.scaledX;
      scaledCoordinates.scaledY = 0;
      drawMaxValues(
        peakCoordinates.scaledY,
        peakCoordinates.scaledX,
        maximumHeight,
        maximumDistance
      );
    }
    counter++;
    console.log(scaledCoordinates.scaledX, scaledCoordinates.scaledY, counter);
    drawOnCanvas(scaledCoordinates.scaledX, scaledCoordinates.scaledY);
  }, 3000 / 180);
}

function restartHandler() {
  velocityInput.value = null;
  angleInput.value = null;
  clearInterval(renderFrames);
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  toggleClass("hidden", inputsCard, canvasCard);
}

const launchBtn = document.getElementById("launch");
launchBtn.addEventListener("click", launchHandler);

const restarthBtn = document.getElementById("restart");
restarthBtn.addEventListener("click", restartHandler);
