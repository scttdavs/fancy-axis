# FancyAxis

This is a package to draw fancier axis' in D3 for your graphs, based on the visual style of Edward Tufte, and on this previous work done in R:
- docs: https://www.cl.cam.ac.uk/~sjm217/projects/graphics/
- code: https://www.cl.cam.ac.uk/~sjm217/projects/graphics/fancyaxis.R

## Features

### Rug Plot

Use in place of `d3.axisBottom` and `d3.axisLeft`:

```ts
import { rugPlot } from "fancy-axis";

// create your scale..

// dataset is like [{y: ... }, ...]

let leftAxis = rugPlot.axisLeft(yScale).datum(dataset).y(d => d.y);

svg.append("g")
    .attr("class", "y axis")
    .call(leftAxis); // Create an axis component with d3.axisLeft
```

You will need to do both axes for it to display correctly. If you do not want the rug plot on the other axis, you can do the following:

```js
let bottomAxis = rugPlot.axisBottom(xScale);
```

And it will not render the data, but the padding will be correct.
