/* eslint-disable @typescript-eslint/no-explicit-any */
import { Axis } from "d3-axis";
import { Selection } from 'd3-selection';
import { ScaleContinuousNumeric } from "d3-scale";

enum AxisType {
    LEFT,
    BOTTOM
}

type AxisContent = Selection<SVGSVGElement, any, any, any> | Selection<SVGGElement, any, any, any>

type RugPlotOptions = {
    width?: number;
    color?: string;
}

const defaultRugPlotOptions: RugPlotOptions = {
    width: 10,
    color: 'currentColor',
}

/*

TODOS:
- generate random data that looks nice
- create bl.ocks.org gist?

*/

const axisRugPlot = (
        type: AxisType,
        axis: Axis<any>,
        data: any[] = [],
        options: RugPlotOptions = {}
    ): (context: AxisContent) => void => {
    const scale = axis.scale() as ScaleContinuousNumeric<any, any>;
    const [currMinRange, currMaxRange] = scale.range();

    const { width, color } = (Object as any).assign({}, defaultRugPlotOptions, options);

    // add padding between the axis and data for our rug plot to exist
    let newRange: [number, number];
    if (type === AxisType.LEFT) {
        newRange = [currMinRange - width * 2, currMaxRange + width * 2];
    } else {
        newRange = [currMinRange + width * 2, currMaxRange - width * 2];
    }
    scale.range(newRange);

    return (context: AxisContent): void => {
        let y1: (d: any) => number;
        let y2: (d: any) => number;
        let x1: (d: any) => number;
        let x2: (d: any) => number;
        const passThrough: (d: any) => number = (d: any) => scale(d);

        if (type === AxisType.LEFT) {
            x1 = (): number => newRange[1] - width * 2;
            x2 = (): number => newRange[1] - width;
            y1 = y2 = passThrough;
        } else {
            x1 = x2 = passThrough;
            y1 = (): number => newRange[0] - width * 3;
            y2 = (): number => newRange[0] - width * 2;
        }

        const rug = context
            .append("g")
            .attr("opacity", 1)
            .attr("class", "fancy-axis-rug-plot")

        data.forEach((d) => {
            rug
                .append("line")
                .attr("y1", y1(d))
                .attr("x1", x1(d))
                .attr("y2", y2(d))
                .attr("x2", x2(d))
                .attr("class", "rug")
                .style('stroke', color)
        });

        // proxy through the content to the original axis;
        axis(context);
    }
};

const leftAxisRugPlot = (
    axis: Axis<any>,
    data: any[] = [],
    options: RugPlotOptions = {}
) => axisRugPlot(AxisType.LEFT, axis, data, options);

const bottomAxisRugPlot = (
    axis: Axis<any>,
    data: any[] = [],
    options: RugPlotOptions = {}
) => axisRugPlot(AxisType.BOTTOM, axis, data, options);

export default {
    AxisType,
    leftAxisRugPlot,
    bottomAxisRugPlot
    // axisBarPlot,
};
