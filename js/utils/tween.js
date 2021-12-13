// How to:  https://javascript.info/js-animation

const timingFct = new Map();

timingFct.set('linear', timeFraction => timeFraction);

timingFct.set('quad', timeFraction => timeFraction ** 2);

timingFct.set('cubic', timeFraction => timeFraction ** 3);

timingFct.set('circ', timeFraction => 1 - Math.sin(Math.acos(timeFraction)));

timingFct.set('back', timeFraction => {
  return Math.pow(timeFraction, 2) * (2.5 * timeFraction - 1.5);
});

timingFct.set('bounce', timeFraction => {
  for (let a = 0, b = 1; 1; a += b, b /= 2) {
    if (timeFraction >= (7 - 4 * a) / 11) {
      return -Math.pow((11 - 6 * a - 11 * timeFraction) / 4, 2) + Math.pow(b, 2)
    }
  }
});

timingFct.set('elastic', timeFraction => {
  return Math.pow(2, 10 * (timeFraction - 1)) * Math.cos(31.415926535 * timeFraction)
});

const makeEaseOut = (timing) => (timeFraction) => 1 - timing(1 - timeFraction);

const makeEaseInOut = (timing) => (timeFraction) => {
  if (timeFraction < .5) return timing(2 * timeFraction) / 2;
  return (2 - timing(2 * (1 - timeFraction))) / 2;
}

export default function () {
  const tweens = new Set();
  const tweensAfter = new Map();

  function update(dt) {
    for (const tween of tweens) {
      tween.time += dt;
      let timeFraction = tween.time  / tween.duration;
      if (timeFraction > 1) {
        timeFraction = 1;
      }

      // Progress normalized between [from;to] with the easing fct
      let progress = (tween.to - tween.from) * tween.timing(timeFraction) + tween.from;
      if (timeFraction == 1) progress = tween.to;
      tween.animate(progress);

      // When tween is finished
      if (timeFraction == 1) {
        if (tween.loop || tween.yoyo) {
          if (tween.yoyo) [tween.to, tween.from] = [tween.from, tween.to];
          tween.time = tween.time - tween.duration;
          if (tween.yoyo && !tween.loop) tween.yoyo = false;
        } else {
          // Is there some tweens to trigger after this one ?
          if (tweensAfter.has(tween)) {
            tweensAfter.get(tween).forEach(t => tweens.add(t));
          }
          tweens.delete(tween);
        }
      }
    }
  }

  function create({
    animate,
    duration = 1000,
    timing = 'linear',
    easing = 'in',
    from = 0,
    to = 1,
    after = null,
    loop = false,
    yoyo = false
  }) {
    timing = timingFct.get(timing);
    if (easing == 'out') {
      timing = makeEaseOut(timing);
    } else if (easing == 'inOut') {
      timing = makeEaseInOut(timing);
    }
    const tween = {time: 0, duration, timing, animate, from, to, loop, yoyo};
    if (after) {
      let afters = [];
      if (tweensAfter.has(after)) {
        afters = tweensAfter.get(after);
      } else {
        tweensAfter.set(after, afters);
      }
      afters.push(tween);
    } else {
      tweens.add(tween);
    }
    return tween;
  }

  return {update, create};
}