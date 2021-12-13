const canvasSketch = require("canvas-sketch");
const math = require("canvas-sketch-util/math");
const crc32 = require("crc-32");
const ConfigPanel = require('./ConfigPanel')


const settings = {
  dimensions: [1080, 1080],
  animate: true
};

interface Props {
  context: CanvasRenderingContext2D;
  width: number;
  height: number;
  time?: number;
  playhead?: number;
}

let params = {
  branches: 6,
  _branchLength: 400,
  inputStartCore: 0,
  inputLengthCore: 15,
  inputAngleCore: 15,
  inputInternalCoreSpikes: 2,
  constructLines: false,
  prenom: '',
  _minStartCore: 100,
  _maxStartCore: 200,
  _maxLengthCore: 150,
  coreAngle: 0,
  coreDistance: 0,
  _maxStartIntermediate: 0,
  inputIntermediateSpikes: 15,
  inputStartLengthIntermediate: 0,
  inputStopLengthIntermediate: 15,
  _maxDistanceIntermediate: 300,
  inputAngleRatioEnding: 2,
  inputSizeEnding: 15
}

const configPanel = new ConfigPanel(params);

const sketch = () => {
  let globalRotation = 0;
  let rotationSpeed = 0.000;
  return ({ context, width, height, time }: Props) => {
    setParams();
    // context.fillStyle = "#9ED8F0";
    context.fillStyle = "black"
    context.fillRect(0, 0, width, height);

    context.save()
    context.translate(width * .5, height * .5);
    context.rotate(globalRotation);
    globalRotation += rotationSpeed;


    drawSnowflake(context);

    if (params.constructLines) {
      drawConstructLines(context);
    }


    context.restore();


  };
};

function drawSnowflake(context: CanvasRenderingContext2D) {
  for (let i = 0; i < params.branches; i++) {
    context.save();
    context.rotate(Math.PI * 2 / params.branches * i)
    drawBranch(context);
    context.restore();
  }
}

function drawConstructLines(context: CanvasRenderingContext2D) {
  context.save();
  context.strokeStyle = "red";
  context.lineWidth = 1;
  // context.translate(width * .5, height * .5);
  for (let i = 0; i < params.branches * 2; i++) {
    context.save();
    context.rotate(Math.PI * 2 * i / (params.branches * 2))
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(0, 700);
    context.stroke();
    context.restore();
  }
  context.restore();
}

function drawBranch(context: CanvasRenderingContext2D) {

  context.strokeStyle = 'white';
  context.lineWidth = 10;
  context.lineCap = 'round'
  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(0, params._branchLength);
  context.stroke();

  drawCore(context);
  drawIntermediate(context);
  drawEnding(context);

}

function _maxLength(angle: number, c: number): number {
  const angleA = angle;
  const angleB = Math.PI / (params.branches);
  const angleC = Math.PI - angleA - angleB;

  return Math.sin(angleB) * c / Math.sin(angleC)
}

function drawEnding(context: CanvasRenderingContext2D) {
  const ratioAngle = math.mapRange(params.inputAngleRatioEnding, 0x0, 0xF, 0.5, 0.8);
  const angle = params.coreAngle * ratioAngle
  const distance = (params._branchLength + params._maxDistanceIntermediate) / 2;
  const size = math.mapRange(params.inputSizeEnding, 0x0, 0xF, 50, 200);

  drawSpike(context, distance, angle, size);

  if (size < 100) {
    return;
  }

  context.save();
  context.translate(0, distance);
  context.rotate(angle);
  drawSpike(context, size * 0.7, params.coreAngle * 0.7, size * 0.3);
  drawPlaque(context, size * 0.7, params.coreAngle * 0.7, size * 0.3);
  context.rotate(-2 * angle);
  drawSpike(context, size * 0.7, params.coreAngle * 0.7, size * 0.3);
  drawPlaque(context, size * 0.7, params.coreAngle * 0.7, size * 0.3);
  context.restore();

}

function drawIntermediate(context: CanvasRenderingContext2D) {
  const spikes = Math.ceil(math.mapRange(params.inputIntermediateSpikes, 0x0, 0xF, 1, 4));
  const stepDistance = (params._maxDistanceIntermediate - params.coreDistance) / (spikes + 1);
  const startRatio = math.mapRange(params.inputStartLengthIntermediate, 0x0, 0xF, 0.2, 0.8);
  const stopRatio = math.mapRange(params.inputStopLengthIntermediate, 0x0, 0xF, 0.2, 0.8);

  for (let i = 1; i <= spikes; i++) {
    const spikeDistance = params.coreDistance + stepDistance * i;
    const maxSpikeLength = math.clamp(_maxLength(Math.PI - params.coreAngle, spikeDistance), 0, 200);
    const spikeLength = maxSpikeLength * math.mapRange(i, 1, spikes, startRatio, stopRatio)
    drawSpike(context, spikeDistance, params.coreAngle, spikeLength)
    if (i % 2 !== 1) {
      drawPlaque(context, spikeDistance, params.coreAngle, spikeLength)
    }
  }

}

function drawCore(context: CanvasRenderingContext2D) {
  params.coreDistance = math.mapRange(params.inputStartCore, 0x0, 0xF, params._minStartCore, params._maxStartCore);
  params.coreAngle = math.mapRange(params.inputAngleCore, 0x0, 0xF, Math.PI * 0.2, Math.PI * 0.4);
  const maxSpikeLength = _maxLength(Math.PI - params.coreAngle, params.coreDistance);
  const mainCoreSpikeLength =
    math.clamp(
      math.mapRange(params.inputLengthCore, 0x0, 0xF, 0.5, 1.5) * maxSpikeLength,
      0,
      Math.min(params._maxLengthCore, maxSpikeLength)
    );

  drawSpike(context, params.coreDistance, params.coreAngle, mainCoreSpikeLength)
  drawPlaque(context, params.coreDistance, params.coreAngle, mainCoreSpikeLength)

  const internalSpikes = Math.floor(math.mapRange(params.inputInternalCoreSpikes, 0, 15, 0, 3))
  if (internalSpikes > 0) {
    const step = params.coreDistance / (internalSpikes + 1);
    for (let i = 0; i <= internalSpikes; i++) {
      drawPlaque(context, step * (i + 1), params.coreAngle, 0.35 * mainCoreSpikeLength / (internalSpikes - i))
      drawSpike(context, step * (i + 1), params.coreAngle, 0.35 * mainCoreSpikeLength / (internalSpikes - i))
    }
  }
}

function drawSpikeOrPlaque(context: CanvasRenderingContext2D, spikeDistance: number, spikeAngle: number, spikeLength: number, maxSpikeLength: number) {
  drawSpike(context, spikeDistance, spikeAngle, spikeLength);
  if (spikeLength === maxSpikeLength) {
    drawPlaque(context, spikeDistance, spikeAngle, spikeLength);
  }
}

function drawSpike(context: CanvasRenderingContext2D, spikeDistance: number, spikeAngle: number, spikeLength: number) {
  context.save();
  context.translate(0, spikeDistance);
  context.rotate(spikeAngle)
  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(0, spikeLength);
  context.stroke();
  context.restore();

  context.save();
  context.translate(0, spikeDistance);
  context.rotate(-spikeAngle)
  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(0, spikeLength);
  context.stroke();
  context.restore();
}

function drawPlaque(context: CanvasRenderingContext2D, spikeDistance: number, spikeAngle: number, spikeLength: number) {
  context.save();
  context.fillStyle = "rgba(255,255,255,0.2)"
  context.beginPath();
  context.moveTo(0, 0);
  context.translate(0, spikeDistance);
  context.rotate(spikeAngle)
  context.lineTo(0, 0);
  context.lineTo(0, spikeLength);
  context.fill();
  context.restore();

  context.save();
  context.fillStyle = "rgba(255,255,255,0.15)"
  context.beginPath();
  context.moveTo(0, 0);
  context.translate(0, spikeDistance);
  context.rotate(-spikeAngle)
  context.lineTo(0, 0);
  context.lineTo(0, spikeLength);
  context.fill();
  context.restore();
}


function setParams() {
  if (params.prenom.length === 0) return;
  const encodedName = Math.abs(crc32.str(params.prenom)).toString(16);
  const size = encodedName.length;
  params.inputStartCore = parseInt(encodedName[0 % size], 16)
  params.inputAngleCore = parseInt(encodedName[1 % size], 16)
  params.inputLengthCore = parseInt(encodedName[2 % size], 16)
  params.inputInternalCoreSpikes = parseInt(encodedName[3 % size], 16)
  params.inputIntermediateSpikes = parseInt(encodedName[4 % size], 16)
  params.inputStartLengthIntermediate = parseInt(encodedName[5 % size], 16)
  params.inputStopLengthIntermediate = parseInt(encodedName[6 % size], 16)
  params.inputAngleRatioEnding = parseInt(encodedName[7 % size], 16)
  params.inputSizeEnding = parseInt(encodedName[8 % size], 16)

  configPanel.refresh();
}

canvasSketch(sketch, settings);
