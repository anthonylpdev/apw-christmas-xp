import { ConfigPanel } from './ConfigPanel';
import canvasSketch from 'canvas-sketch';
import { encode } from './Encoder';
import { Snowflake, SnowflakeInputProps } from './Snowflake';

const canvasDOM = document.querySelector('#scene');

const settings = {
    dimensions: [1080, 1080],
    animate: true,
    canvas: canvasDOM,
    scaleToFit: true
};

interface Props {
    context: CanvasRenderingContext2D;
    width: number;
    height: number;
    time?: number;
    playhead?: number;
}


let inputParams: SnowflakeInputProps = {
    branches: 6,
    core: {
        angle: 0,
        length: 0,
        spikes: 0,
        start: 0
    },
    intermediate: {
        spikes: 0,
        startLength: 0,
        stopLength: 0
    },
    ending: {
        angleRatio: 0,
        length: 0
    },
    name: ''
}

const configPanel = new ConfigPanel(inputParams);

const sketch = () => {
    // let globalRotation = 0;
    // let rotationSpeed = 0.000;
    return ({ context, width, height, time }: Props) => {
        let snowflake = new Snowflake(inputParams);
        setParams();
        // // context.fillStyle = "#9ED8F0";
        let gradient = context.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, "#aedbf0");
        gradient.addColorStop(1, "#3f7eb3");

        context.fillStyle = gradient
        context.fillRect(0, 0, width, height);

        context.save()
        context.translate(width * .5, height * .5);
        // const scale = Math.min(800 / width, 800 / height);
        // context.scale((1 - scale), 1 - scale)
        // context.rotate(globalRotation);
        // globalRotation += rotationSpeed;

        snowflake.draw(context);


    };
};



function drawConstructLines(context: CanvasRenderingContext2D) {
    context.save();
    context.strokeStyle = "red";
    context.lineWidth = 1;
    for (let i = 0; i < inputParams.branches * 2; i++) {
        context.save();
        context.rotate(Math.PI * 2 * i / (inputParams.branches * 2))
        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(0, 700);
        context.stroke();
        context.restore();
    }
    context.restore();
}

let inputPrenom = document.querySelector('#inputPrenom');
inputPrenom?.addEventListener('keyup', (event) => {
    inputParams.name = inputPrenom?.value;
    let newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?name=' + inputParams.name;
    window.history.pushState({ path: newurl }, '', newurl);
})

function setParams() {
    encode(inputParams);
    configPanel.refresh();
}





const urlParams = new URLSearchParams(window.location.search);
const debugParam = urlParams.has('debug');
if (debugParam) {
    configPanel.show();
    document.querySelector('#start').classList.add('hide');
}

const nameParam = urlParams.get('name');
if (nameParam) {
    inputParams.name = nameParam;
    inputPrenom!.value = nameParam;
}






canvasSketch(sketch, settings);