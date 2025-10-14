import SimpleLineChart from './SimpleLineChart'
import { memo } from 'react'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  colorClass?: string
  icon?: React.ReactNode
  trendData?: number[]
}

function BaseStatCard({
  title,
  value,
  subtitle,
  colorClass = 'bg-sky-500',
  icon,
  trendData,
}: StatCardProps) {
  const data = trendData ?? [12, 15, 14, 22, 18, 24, 21, 26, 28, 23, 25]

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-lg ${colorClass} text-white flex items-center justify-center`}
          >
            {icon}
          </div>
          <div>
            <p className="text-xs text-gray-500">{title}</p>
            <p className="text-lg font-semibold text-gray-900">{value}</p>
          </div>
        </div>
        {subtitle && <span className="text-xs text-gray-500">{subtitle}</span>}
      </div>
      <div className="px-2 py-2">
        <SimpleLineChart data={data} height={80} />
      </div>
    </div>
  )
}
export default memo(BaseStatCard)
