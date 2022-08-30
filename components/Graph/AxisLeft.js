function AxisLeft({ yScale, innerWidth, tickOffset = 3 }) {

  return (
    yScale.ticks().map((tickValue) => (
      <g key={tickValue} className="tick" transform={`translate(0,${yScale(tickValue)})`}>
        <line x2={innerWidth} />
        <text
          style={{ textAnchor: 'end' }}
          x={-tickOffset}
          dy=".32em"
        >
          {tickValue}
        </text>
      </g>
    ))
  );
}

export { AxisLeft };