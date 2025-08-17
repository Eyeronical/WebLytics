import { motion } from 'framer-motion'
import { BarChart3, Calendar, TrendingUp } from 'lucide-react'

export default function StatsCards({ stats }) {
  const cards = [
    {
      title: 'Total Websites',
      value: stats.totalWebsites || 0,
      icon: BarChart3,
      color: 'indigo'
    },
    {
      title: 'Today\'s Analysis',
      value: stats.todayCount || 0,
      icon: Calendar,
      color: 'green'
    },
    {
      title: 'Growth Rate',
      value: stats.totalWebsites > 0 ? '+12%' : '0%',
      icon: TrendingUp,
      color: 'purple'
    }
  ]

  return (
    <div className="stats-grid">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="stat-card"
        >
          <div className={`inline-flex items-center justify-center w-12 h-12 bg-${card.color}-100 rounded-lg mb-4`}>
            <card.icon className={`w-6 h-6 text-${card.color}-600`} />
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-1">
            {card.value}
          </div>
          <div className="text-gray-600 text-sm">
            {card.title}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
