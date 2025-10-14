interface SimpleLineChartProps {
  data: number[]
  width?: number
  height?: number
  stroke?: string
  fill?: string
}

import { memo } from 'react'

function BaseSimpleLineChart({
  data,
  width = 280,
  height = 100,
  stroke = '#3b82f6',
  fill = 'rgba(59,130,246,0.1)',
}: SimpleLineChartProps) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const dx = width / (data.length - 1)

  const points = data
    .map((d, i) => {
      const x = i * dx
      const y = height - ((d - min) / (max - min || 1)) * height
      return `${x},${y}`
    })
    .join(' ')

  const path = `M 0,${height} L ${points} L ${width},${height} Z`

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <path d={path} fill={fill} />
      <polyline
        points={points}
        fill="none"
        stroke={stroke}
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default memo(BaseSimpleLineChart)
