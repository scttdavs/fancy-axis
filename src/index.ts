/* eslint-disable @typescript-eslint/no-explicit-any */
import { Selection } from 'd3-selection';

import { rugPlotAxisBottom, rugPlotAxisLeft } from './rug-plot';

export enum AxisType {
    LEFT,
    BOTTOM
}

export type AxisContent = Selection<SVGSVGElement, any, any, any> | Selection<SVGGElement, any, any, any>

export const rugPlot = {
    axisLeft: rugPlotAxisLeft,
    axisBottom: rugPlotAxisBottom,
};
