/* eslint-disable @typescript-eslint/no-explicit-any */
import { Axis, axisBottom, axisLeft } from "d3-axis";
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

const rugPlotAxis = (
        type: AxisType,
        scale: ScaleContinuousNumeric<any, any>,
        options: RugPlotOptions = {}
    ): (context: AxisContent) => void => {
    let axis: Axis<any>;
    // proxy through the content to the original axis;
    if (type === AxisType.LEFT) {
        axis = axisLeft(scale);
    } else {
        axis = axisBottom(scale);
    }

    let dataset: any[] | null = null;

    // unfortunately, TS is not happy with anything I try to get this to be recognized as an Axis
    // since we define the axis properties next.
    // This is a makeshift Proxy (so we can still target older browsers), so we can get access to what the axis will be rendered to
    // when we need it, but can mimic the behavior of the underlying real Axis until then.
    const axisProxy: any = (context: AxisContent) => {
        // we wait until the axis is being rendered to apply all these changes first.
        // which is at the very last moment we could wait
        const scale = axis.scale() as ScaleContinuousNumeric<any, any>;
        const [currMinRange, currMaxRange] = scale.range();

        const { width, color } = (Object as any).assign({}, defaultRugPlotOptions, options);

        // add padding between the axis and data for our rug plot to exist
        let newRange: [number, number];
        if (type === AxisType.LEFT) {
            newRange = [currMinRange - width * 3, currMaxRange + width * 3];
        } else {
            newRange = [currMinRange + width * 3, currMaxRange - width * 3];
        }
        scale.range(newRange);

        if (!context) {
            throw new Error("You must provide a selection to render the axis to.")
        }

        // everything below here renders the rug plot itself

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
            y1 = (): number => newRange[0] - width * 5;
            y2 = (): number => newRange[0] - width * 4;
        }

        const rug = context
            .append("g")
            .attr("opacity", 1)
            .attr("class", "fancy-axis-rug-plot");

        (dataset || []).forEach((d) => {
            const data = getterFunc(d);
            rug
                .append("line")
                .attr("y1", y1(data))
                .attr("x1", x1(data))
                .attr("y2", y2(data))
                .attr("x2", x2(data))
                .attr("class", "rug")
                .style('stroke', color)
        });

        axis(context);
    }

    // set the props for our fake proxy
    const props = Object.keys(axis) as (keyof Axis<any>)[];
    for (const prop of props) {
        axisProxy[prop] = axis[prop];
    }

    type DataGetter = (d: any) => any
    let getterFunc: DataGetter = (d): any => type === AxisType.LEFT ? d[1] : d[0];
    const dataGetter = function (g: (d: any) => any): Axis<any> | DataGetter {
        if (arguments.length) {
            getterFunc = g;
            return axisProxy;
        } else {
            return getterFunc;
        }
    }

    // provide a helper to extract values from data. Default is either d[0] or d[1]
    if (type === AxisType.LEFT) {
        axisProxy.y = dataGetter;
    } else if (type === AxisType.BOTTOM) {
        axisProxy.x = dataGetter;
    }

    // bind the data to the axis. Without this, nothing will happen
    axisProxy.datum = (...args: any[]): Axis<any> | any[] => {
        if (!args.length) {
            return dataset;
        } else {
            dataset = args[0];
            return axisProxy;
        }
    };

    return axisProxy;
};

// curry our functions that we want to expose
const rugPlotAxisLeft = (
    scale: ScaleContinuousNumeric<any, any>,
    options: RugPlotOptions = {}
) => rugPlotAxis(AxisType.LEFT, scale, options);

const rugPlotAxisBottom = (
    scale: ScaleContinuousNumeric<any, any>,
    options: RugPlotOptions = {}
) => rugPlotAxis(AxisType.BOTTOM, scale, options);

export default {
    AxisType,
    rugPlot: {
        axisLeft: rugPlotAxisLeft,
        axisBottom: rugPlotAxisBottom,
    },
    rugPlotAxisLeft,
    rugPlotAxisBottom
    // axisBarPlot,
};
