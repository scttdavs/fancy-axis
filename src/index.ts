// import { selectAll } from "d3-selection";
import { Axis } from "d3-axis";
import { Selection } from 'd3-selection';
import { ScaleContinuousNumeric } from "d3-scale";

enum AxisType {
    LEFT,
    BOTTOM
}

type AxisContent = Selection<SVGSVGElement, any, any, any> | Selection<SVGGElement, any, any, any>

type RugPlotOptions = {
    width: number
}

const defaultRugPlotOptions: RugPlotOptions = {
    width: 10
}

const axisRugPlot = (axis: Axis<any>, type: AxisType, data: any[], options: RugPlotOptions) => {
    const scale = axis.scale() as ScaleContinuousNumeric<any, any>;
    const [currMinRange, currMaxRange] = scale.range();

    const { width } = (<any>Object).assign({}, defaultRugPlotOptions, options);

    // add padding between the axis and data for our rug plot to exist
    let newRange: [number, number];
    if (type === AxisType.LEFT) {
        newRange = [currMinRange - width * 2, currMaxRange + width * 2];
    } else {
        newRange = [currMinRange + width * 2, currMaxRange - width * 2];
    }
    scale.range(newRange);

    return (context: AxisContent) => {
        let rugValue: number;
        if (type === AxisType.LEFT) {
            rugValue = newRange[1];
        } else {
            rugValue = newRange[0];
        }
        const rug = context
            .append("g")
            .attr("opacity", 1)
            .attr("class", "fancy-axis-rug-plot")

        data.forEach((d) => {
            rug
                .append("line")
                .attr("y1", scale(d))
                .attr("x2", rugValue - width)
                .attr("y2", scale(d))
                .attr("class", "rug")
                .style('stroke', 'currentColor')
        });

        // proxy through the content to the original axis;
        axis(context);
    }
};

export default {
    AxisType,
    axisRugPlot,
    // axisBarPlot,
};
