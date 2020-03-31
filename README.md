# FancyAxis

This is a package to draw fancier axis' in D3 for your graphs, based on the visual style of Edward Tufte, and on this previous work done in R:
- docs: https://www.cl.cam.ac.uk/~sjm217/projects/graphics/
- code: https://www.cl.cam.ac.uk/~sjm217/projects/graphics/fancyaxis.R

## Features

### Rug Plot

```ts
import * as d3 from "d3";
import { axisRugPlot, AxisType } from "fancy-axis";

// create your scale..

// dataset is like [{y: ... }, ...]

let leftAxis = d3.axisLeft(yScale);
leftAxis = axisRugPlot(leftAxis, AxisType.LEFT, dataset.map(d => d.y));

svg.append("g")
    .attr("class", "y axis")
    .call(leftAxis); // Create an axis component with d3.axisLeft
```
