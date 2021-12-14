import math from 'canvas-sketch-util/math';
const BRANCH_LENGTH = 400;
const MIN_START_CORE = BRANCH_LENGTH / 4;
const MAX_START_CORE = BRANCH_LENGTH / 2;
const MAX_LENGTH_CORE = 0.375 * BRANCH_LENGTH;
const MAX_INTERMEDIATE_DISTANCE = BRANCH_LENGTH * 3 / 4;

export class Snowflake {
    private branches = 6;

    private coreDistance: number;
    private coreAngle: number;
    private coreLengthRatio: number;
    private coreInternalSpikes: number;

    private intermediateSpikes: number;
    private intermediateStartRatio: number;
    private intermediateStopRatio: number;

    private endingAngleRatio: number;
    private endingSize: number;

    constructor(input: SnowflakeInputProps) {
        this.branches = input.branches;
        this.coreDistance = math.mapRange(input.core.start, 0x0, 0xF, MIN_START_CORE, MAX_START_CORE);
        this.coreAngle = math.mapRange(input.core.angle, 0x0, 0xF, Math.PI * 0.2, Math.PI * 0.4);
        this.coreLengthRatio = math.mapRange(input.core.length, 0x0, 0xF, 0.5, 1.5);
        this.coreInternalSpikes = Math.floor(math.mapRange(input.core.spikes, 0, 15, 0, 3))
        this.intermediateSpikes = Math.ceil(math.mapRange(input.intermediate.spikes, 0x0, 0xF, 1, 4));
        this.intermediateStartRatio = math.mapRange(input.intermediate.startLength, 0x0, 0xF, 0.2, 0.8);
        this.intermediateStopRatio = math.mapRange(input.intermediate.stopLength, 0x0, 0xF, 0.2, 0.8);
        this.endingAngleRatio = math.mapRange(input.ending.angleRatio, 0x0, 0xF, 0.8, 1.2);
        this.endingSize = math.mapRange(input.ending.length, 0x0, 0xF, 0.5, 0.9);
    }

    draw(context: CanvasRenderingContext2D) {
        for (let i = 0; i < this.branches; i++) {
            context.save();
            context.rotate(Math.PI * 2 / this.branches * i)
            this.drawBranch(context);
            context.restore();
        }
    }

    private drawBranch(context: CanvasRenderingContext2D) {
        context.strokeStyle = 'white';
        context.lineWidth = 10;
        context.lineCap = 'round'
        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(0, BRANCH_LENGTH);
        context.stroke();

        this.drawCore(context);
        this.drawIntermediate(context);
        this.drawEnding(context);
    }

    private drawCore(context: CanvasRenderingContext2D) {
        const maxSpikeLength = this.maxLength(Math.PI - this.coreAngle, this.coreDistance);
        const mainCoreSpikeLength =
            math.clamp(
                this.coreLengthRatio * maxSpikeLength,
                0,
                Math.min(MAX_LENGTH_CORE, maxSpikeLength)
            );
        this.drawSpike(context, this.coreDistance, this.coreAngle, mainCoreSpikeLength);
        this.drawPlaque(context, this.coreDistance, this.coreAngle, mainCoreSpikeLength);

        if (this.coreInternalSpikes > 0) {
            const step = this.coreDistance / (this.coreInternalSpikes + 1);
            for (let i = 0; i <= this.coreInternalSpikes; i++) {
                this.drawPlaque(context, step * (i + 1), this.coreAngle, 0.35 * mainCoreSpikeLength / (this.coreInternalSpikes - i))
                this.drawSpike(context, step * (i + 1), this.coreAngle, 0.35 * mainCoreSpikeLength / (this.coreInternalSpikes - i))
            }
        }
    }

    private drawIntermediate(context: CanvasRenderingContext2D) {
        const stepDistance = (MAX_INTERMEDIATE_DISTANCE - this.coreDistance) / (this.intermediateSpikes + 1);
        for (let i = 1; i <= this.intermediateSpikes; i++) {
            const spikeDistance = this.coreDistance + stepDistance * i;
            const maxSpikeLength = math.clamp(this.maxLength(Math.PI - this.coreAngle, spikeDistance), 0, 200);
            const spikeLength = maxSpikeLength * math.mapRange(i, 1, this.intermediateSpikes, this.intermediateStartRatio, this.intermediateStopRatio)
            this.drawSpike(context, spikeDistance, this.coreAngle, spikeLength)
            if (i % 2 !== 1) {
                this.drawPlaque(context, spikeDistance, this.coreAngle, spikeLength)
            }
        }
    }

    private drawEnding(context: CanvasRenderingContext2D) {
        const angle = this.coreAngle * this.endingAngleRatio;
        const zone = BRANCH_LENGTH - MAX_INTERMEDIATE_DISTANCE;
        const distance = (BRANCH_LENGTH + MAX_INTERMEDIATE_DISTANCE) / 2
        const size = zone * this.endingSize;


        this.drawSpike(context, distance - size / 3, angle, size);

        // if (size < 100) {
        //     return;
        // }

        // context.save();
        // context.translate(0, distance);
        // context.rotate(angle);
        // drawSpike(context, size * 0.7, params.coreAngle * 0.7, size * 0.3);
        // drawPlaque(context, size * 0.7, params.coreAngle * 0.7, size * 0.3);
        // context.rotate(-2 * angle);
        // drawSpike(context, size * 0.7, params.coreAngle * 0.7, size * 0.3);
        // drawPlaque(context, size * 0.7, params.coreAngle * 0.7, size * 0.3);
        // context.restore();

    }



    private drawSpike(context: CanvasRenderingContext2D, spikeDistance: number, spikeAngle: number, spikeLength: number) {
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

    private drawPlaque(context: CanvasRenderingContext2D, spikeDistance: number, spikeAngle: number, spikeLength: number) {
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

    private maxLength(angle: number, c: number): number {
        const angleA = angle;
        const angleB = Math.PI / (this.branches);
        const angleC = Math.PI - angleA - angleB;

        return Math.sin(angleB) * c / Math.sin(angleC)
    }
}

export interface SnowflakeInputProps {
    branches: number;
    core: {
        start: number;
        length: number;
        angle: number;
        spikes: number;
    };
    intermediate: {
        spikes: number;
        startLength: number;
        stopLength: number;
    };
    ending: {
        angleRatio: number;
        length: number;
    };
    name?: string;
}