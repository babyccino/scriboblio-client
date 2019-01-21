export function bline(x1, y1, x2, y2, pixel) {
  let error;
  const dx = Math.abs(x2 - x1),
    dy = Math.abs(y2 - y1);
  const xinc = x1 < x2 ? 1 : -1,
    yinc = y1 < y2 ? 1 : -1;
  let x = x1,
    y = y1;
  pixel(x, y);
  if (dx >= dy) {
    error = (2 * dy) - dx;
    while (x !== x2) {
      if (error < 0) {
        error += (2 * dy);
      }
      else {
        error += (2 * (dy - dx));
        y += yinc;
      }
      x += xinc;
      pixel(x, y);
    }
  }
  else {
    error = (2 * dx) - dy;
    while (y !== y2) {
      if (error < 0) {
        error += (2 * dx);
      }
      else {
        error += (2 * (dx - dy));
        x += xinc;
      }
      y += yinc;
      pixel(x, y);
    }
  }
}

export function line(x1, y1, x2, y2, thickness, pixel) {
  let wy, wx;
  bline(x1, y1, x2, y2, pixel);
  if (Math.abs((y2 - y1) / (x2 - x1)) < 1) {
    wy = (thickness - 1) * Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2)) / (2 * Math.abs(x2 - x1));
    for (let i = 0; i < wy; ++i) {
      bline(x1, y1 - i, x2, y2 - i, pixel);
      bline(x1, y1 + i, x2, y2 + i, pixel);
    }
  }
  else {
    wx = (thickness - 1) * Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2)) / (2 * Math.abs(y2 - y1));
    for (let i = 0; i < wx; ++i) {
      bline(x1 - i, y1, x2 - i, y2, pixel);
      bline(x1 + i, y1, x2 + i, y2, pixel);
    }
  }
}

export function setPixelated(context) {
  context.imageSmoothingEnabled = false;
  context.mozImageSmoothingEnabled = false;
  context.oImageSmoothingEnabled = false;
  context.webkitImageSmoothingEnabled = false;
  context.msImageSmoothingEnabled = false;
}

export function getColorIndexForCoord(x, y, width) {
  return y * (width * 4) + x * 4;
}

export function getColorAt(arr, x, y, width) {
  let coord = getColorIndexForCoord(x, y, width);
  return {
    r: arr[coord],
    g: arr[coord + 1],
    b: arr[coord + 2],
    a: arr[coord + 3]
  };
}

export function compareColorAtHelper(arr, x, y, width, compareTo) {
  let coord = getColorIndexForCoord(x, y, width);
  let dist = Math.abs(arr[coord] - compareTo.r) +
    Math.abs(arr[coord + 1] - compareTo.g) +
    Math.abs(arr[coord + 2] - compareTo.b) +
    Math.abs(arr[coord + 3] - compareTo.a);
  return dist < 89;
}

export function setColorHelper(arr, x, y, width, setColor) {
  let offset = getColorIndexForCoord(x, y, width);
  arr[offset] = setColor.r;
  arr[offset + 1] = setColor.g;
  arr[offset + 2] = setColor.b;
}

export function getColor(color) {
  switch (color) {
    case "green": return { r: 0, g: 128, b: 0 };
    case "blue": return { r: 0, g: 0, b: 255 };
    case "indigo": return { r: 75, g: 0, b: 130 };
    case "red": return { r: 255, g: 0, b: 0 };
    case "yellow": return { r: 255, g: 255, b: 0 };
    case "gold": return { r: 255, g: 215, b: 0 };
    case "orange": return { r: 255, g: 165, b: 0 };
    case "black": return { r: 0, g: 0, b: 0 };
    case "gray": return { r: 128, g: 128, b: 128 };
    case "whiteSmoke": return { r: 245, g: 245, b: 245 };
    case "white":
    default: return { r: 255, g: 255, b: 255 };
  }
}

export function distance2(coord1, coord2) {
  return Math.pow(coord1.x - coord2.x, 2) + Math.pow(coord1.y - coord2.y, 2);
}
