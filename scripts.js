const init = () => {
  canvas = document.querySelector('#profileCanvas');
  ctx = canvas.getContext('2d');
  nameInput = document.querySelector('#name');
  nameInput.addEventListener('input', draw);
  fontInput = document.querySelector('#font');
  backgroundInput = document.querySelector('#backgroundColor');
  randomButton = document.querySelector('#randomButton');
  downloadButton = document.querySelector('#downloadButton');
  randomButton.addEventListener('click', setRandomValues);
  downloadButton.addEventListener('click', downloadImage);

  fontNames = [
    'Arial', 'Verdana', 'Calibri', 
    'Garamond', 'Georgia', 'Times New Roman', 'Courier New',
    'Comic Sans MS', 'Audiowide','Impact', 'Lobster', 
    'ImperialScript', 'Papyrus', 'PressStart2P', 'Smokum'
  ];

  colorNames = [
    'Maroon', 'Tomato', 'Coral', 'Gold', 'Butter',
    'Dark Fern', 'Fern', 'Sea Green', 'Lime', 'Pale Green',
    'Midnight Blue', 'Navy', 'Bracing Blue', 'Denim', 'Dark Plum',
    'Grape', 'Violet', 'Pastel Purple', 'Fuchsia', 'Pink'
  ];

  colorValues = [
    '#800000', '#FF4C3C', '#FF8040', '#F1C40F', '#FFFF80', 
    '#004000', '#008000', '#008040', '#2FE72F', '#80FF80', 
    '#000040', '#000080', '#004080', '#0080C0', '#400040', 
    '#6F2DA8', '#9B26B6', '#9b59b6', '#FF00FF', '#FF80C0'
  ];

  canvas.width = 1000;
  canvas.height = 1000;

  popFontSelect();
  popBackgroundSelect();

  setRandomValues();

};

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function createTestElement(fontFamily) {
  const element = document.createElement('div');
  // Hide the element but keep it measurable
  element.style.cssText = `
    position: absolute;
    visibility: hidden;
    height: auto;
    width: auto;
    white-space: nowrap;
    font-size: 100px; /* Larger font size = more measurable width difference */
    font-family: ${fontFamily};
  `;
  element.textContent = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'; // Long text for accuracy
  document.body.appendChild(element);
  return element;
}

function isFontNotInstalled(targetFont) {
  // Fallback font
  let fallbackFont = 'Times New Roman';
  if (fallbackFont === targetFont) fallbackFont = 'Arial';
  
  // Create test elements
  const targetElement = createTestElement(`'${targetFont}', ${fallbackFont}`);
  const fallbackElement = createTestElement(fallbackFont);
  
  // Measure widths
  const targetWidth = targetElement.offsetWidth;
  const fallbackWidth = fallbackElement.offsetWidth;
  
  // Clean up: remove elements from DOM
  document.body.removeChild(fallbackElement);
  
  // If widths differ, target font is installed
  return targetWidth === fallbackWidth;
}

function popFontSelect() {
  fontNames.forEach(name => {
    if (isFontNotInstalled(name)) return; // Skip if font is not installed
    const option = document.createElement('option');
    option.value = name;
    option.textContent = name;
    fontInput.appendChild(option);
  });
  // Add event listener to redraw canvas on change
  fontInput.addEventListener('change', draw);
}

function popBackgroundSelect() {
  colorNames.forEach((name, index) => {
    const option = document.createElement('option');
    option.value = colorValues[index];
    option.textContent = name;
    backgroundInput.appendChild(option);
  });
  // Add event listener to redraw canvas on change
  backgroundInput.addEventListener('change', draw);
}

function setRandomValues() {
  // Set Random Font
  const randomIndex = getRandomInt(fontNames.length);
  fontInput.value = fontNames[randomIndex];

  // Set Random Background Color
  const randomColorIndex = getRandomInt(colorValues.length);
  backgroundInput.value = colorValues[randomColorIndex];

  draw();
}

function draw() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw background
  ctx.fillStyle = backgroundInput.value;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw Name
  const name = nameInput.value.trim() || "Your Name Here";
  drawWrapText(name, fontInput.value);
}

function drawWrapText(text, fontFamily) {
  const maxWidth = canvas.width * 0.7;
  const maxHeight = canvas.height * 0.5;
  let fontSize = maxHeight;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'white';

  // Shrink font until the longest word fits
  while (true) {
    ctx.font = `bold ${fontSize}px ${fontFamily}`;
    const words = text.split(" ");
    const longest = words.reduce((a, b) => (a.length > b.length ? a : b));

    if (ctx.measureText(longest).width <= maxWidth || fontSize < 10) break;
    fontSize -= 5;
  }

  // Now wrap text
  const lines = [];
  let line = "";
  const words = text.split(" ");

  words.forEach(word => {
    const testLine = line + word + " ";
    if (ctx.measureText(testLine).width > maxWidth && line !== "") {
      lines.push(line);
      line = word + " ";
    } else {
      line = testLine;
    }
  });
  lines.push(line);

  // draw lines centered vertically
  const lineHeight = fontSize * 1.2;
  const totalHeight = lines.length * lineHeight;
  let y = canvas.height / 2 - totalHeight / 2 + lineHeight / 2;

  for (let l of lines) {
    ctx.fillText(l.trim(), canvas.width / 2, y);
    y += lineHeight;
  }
}

function downloadImage() {
  const rawName = nameInput.value.trim();
  const safeName = rawName.toLowerCase().replace(/\s+/g, '') || "profile";

  const link = document.createElement('a');
  link.download = safeName + ".png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}

window.onload = init;