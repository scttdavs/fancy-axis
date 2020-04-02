import fs from "fs";
import path from "path";
import { rugPlot } from "../src/index";
import { JSDOM } from "jsdom";
import { select } from "d3-selection";
import { scaleLinear } from "d3-scale";
import { axisLeft } from "d3-axis";

const file = (name: string) => fs.readFileSync(path.join(__dirname, name), "utf8").replace(/\n\s*/mg, "")

describe("rugPlot", () => {
    afterEach(() => {
        document.body.innerHTML = "";
    });

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

    it("produces the correct output", () => {
        var bodyExpected = (new JSDOM(file("rug-plot-axis.html"))).window.document.body;
        document.body.innerHTML = "<!DOCTYPE html><svg><g></g></svg>"
        // @ts-ignore
        select(document.body).select("g").call(rugPlot.axisLeft(scaleLinear().range([0, 500])));
        expect(document.body.outerHTML).toEqual(bodyExpected.outerHTML);
    });
});
