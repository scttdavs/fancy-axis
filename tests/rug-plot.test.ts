import { rugPlot } from "../src/index";
import { scaleLinear } from "d3-scale";

describe("rugPlot", () => {
    it("proxies through to the underlying d3 axis instnace", () => {
        // sets the tick arguments
        const axis = rugPlot.axisLeft(scaleLinear()).ticks(20);
        expect(axis.tickArguments()).toEqual([20]);
        // ignore this, as the Axis types are wrong. Calling ticks with no args
        // clears it out, and is intended
        // @ts-ignore
        axis.ticks();
        expect(axis.tickArguments()).toEqual([]);
    });
});
