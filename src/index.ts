// import { selectAll } from "d3-selection";
import { Axis } from "d3-axis";
import { ScaleContinuousNumeric } from "d3-scale";
// import { max } from "d3-array";

// # axis.tickPadding([padding]) <>
// If padding is specified, sets the padding to the specified value in pixels and returns the axis. If padding is not specified, returns the current padding which defaults to 3 pixels.

// 1. update padding on axis with max widths/values
// 2. draw dots (circles)
// 3. config?

// axis: axis you want to make fancy
// data: array of only the data you want to make fancy for that axis
// const axisBarPlot = (axis: Axis<any>, data: any[]) => {
    // const ticks = selectAll(tickSelector);

    // const scale = axis.scale();
    // const maxValue = max(data);
    // ticks
    //     //in the rest of the method calls:
    //     .select('line') //grab the tick line
    //     .attr('class', 'quadrantBorder') //style with a custom class and CSS
    //     .style('stroke-width', 5);

    
// };

enum AxisType {
    LEFT,
    BOTTOM
}

const axisRugPlot = (axis: Axis<any>, type: AxisType, data: any[]) => {
    const scale = axis.scale() as ScaleContinuousNumeric<any, any>;
    const [currMinRange, currMaxRange] = scale.range();

    let newRange: [number, number];
    if (type === AxisType.LEFT) {
        newRange = [currMinRange - 20, currMaxRange + 20];
        // newRange = [currMinRange, currMaxRange];
    } else {
        newRange = [currMinRange + 20, currMaxRange - 20];
        // newRange = [currMinRange, currMaxRange];
    }
    scale.range(newRange); 
};

export default {
    AxisType,
    axisRugPlot,
    // axisBarPlot,
};
