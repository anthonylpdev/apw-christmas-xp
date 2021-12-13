import crc32 from 'crc-32'
import type { SnowflakeInputProps } from './Snowflake';

export function encode(params: SnowflakeInputProps) {
    if (!params.name || params.name.length === 0) return;
    const encodedName = Math.abs(crc32.str(params.name)).toString(16);
    const size = encodedName.length;

    params.core.start = parseInt(encodedName[0 % size], 16)
    params.core.angle = parseInt(encodedName[1 % size], 16)
    params.core.length = parseInt(encodedName[2 % size], 16)
    params.core.spikes = parseInt(encodedName[3 % size], 16)
    params.intermediate.spikes = parseInt(encodedName[4 % size], 16)
    params.intermediate.startLength = parseInt(encodedName[5 % size], 16)
    params.intermediate.stopLength = parseInt(encodedName[6 % size], 16)
    params.ending.angleRatio = parseInt(encodedName[7 % size], 16)
    params.ending.length = parseInt(encodedName[8 % size], 16)
}