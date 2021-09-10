export default function getMixedColor(ratio) {
  let color1 = "1DB954";
  let color2 = "EE6C4D";
  if (ratio > 0.6 && ratio < 1) ratio -= 0.3;
  var hex = function (x) {
    x = x.toString(16);
    return x.length === 1 ? "0" + x : x;
  };

  var r = Math.ceil(
    parseInt(color1.substring(0, 2), 16) * ratio +
      parseInt(color2.substring(0, 2), 16) * (1 - ratio)
  );
  var g = Math.ceil(
    parseInt(color1.substring(2, 4), 16) * ratio +
      parseInt(color2.substring(2, 4), 16) * (1 - ratio)
  );
  var b = Math.ceil(
    parseInt(color1.substring(4, 6), 16) * ratio +
      parseInt(color2.substring(4, 6), 16) * (1 - ratio)
  );

  return hex(r) + hex(g) + hex(b);
}
