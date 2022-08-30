import { line, curveBumpX } from 'd3';

function Marks({
  data,
  xScale,
  yScale,
  xValue,
  yValue,
  circleRadius
}) {

  return (
    <g className="marks">
      <path
        fill="none"
        stroke="#2f5ec4"
        d={line()
          .x(d => xScale(xValue(d)))
          .y(d => yScale(yValue(d)))
          .curve(curveBumpX)(data)}
      />

      {
        data.map((d, index) => (
          <circle key={index} cx={xScale(xValue(d))} cy={yScale(yValue(d))} r={circleRadius}>
            <title>{`${yValue(d)}, ${xValue(d)}`}</title>
          </circle>
        ))
      }

    </g>
  );

}

export { Marks };