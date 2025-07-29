'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, DollarSign, Percent, Calendar, Target } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: string | number
  change?: number
  changeType?: 'increase' | 'decrease' | 'neutral'
  icon?: React.ReactNode
  suffix?: string
  prefix?: string
  className?: string
}

export function MetricCard({ 
  title, 
  value, 
  change, 
  changeType = 'neutral', 
  icon, 
  suffix = '', 
  prefix = '',
  className = '' 
}: MetricCardProps) {
  const getChangeColor = () => {
    switch (changeType) {
      case 'increase': return 'text-green-600'
      case 'decrease': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getChangeIcon = () => {
    switch (changeType) {
      case 'increase': return <TrendingUp className="w-4 h-4" />
      case 'decrease': return <TrendingDown className="w-4 h-4" />
      default: return null
    }
  }

  return (
    <div className={`cartoon-card p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
      
      <div className="flex items-baseline justify-between">
        <div className="flex items-baseline">
          {prefix && <span className="text-lg text-gray-600">{prefix}</span>}
          <span className="text-3xl font-bold oggy-gradient">{value}</span>
          {suffix && <span className="text-lg text-gray-600 ml-1">{suffix}</span>}
        </div>
        
        {change !== undefined && (
          <div className={`flex items-center space-x-1 ${getChangeColor()}`}>
            {getChangeIcon()}
            <span className="text-sm font-medium">
              {change > 0 ? '+' : ''}{change.toFixed(1)}%
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

interface ProgressBarProps {
  label: string
  value: number
  max: number
  showPercentage?: boolean
  color?: 'primary' | 'success' | 'warning' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
}

export function ProgressBar({ 
  label, 
  value, 
  max, 
  showPercentage = true, 
  color = 'primary',
  size = 'md',
  animated = true
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100)
  
  const colorClasses = {
    primary: 'bg-blue-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500'
  }
  
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        {showPercentage && (
          <span className="text-sm text-gray-600">
            {percentage.toFixed(1)}%
          </span>
        )}
      </div>
      
      <div className={`cartoon-progress ${sizeClasses[size]}`}>
        <div 
          className={`cartoon-progress-fill ${colorClasses[color]} ${animated ? 'transition-all duration-1000 ease-out' : ''}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      <div className="flex justify-between text-xs text-gray-500">
        <span>{value.toLocaleString()}</span>
        <span>{max.toLocaleString()}</span>
      </div>
    </div>
  )
}

interface SimpleChartProps {
  data: Array<{ label: string; value: number; color?: string }>
  title?: string
  type?: 'bar' | 'line' | 'pie'
  height?: number
}

export function SimpleChart({ data, title, type = 'bar', height = 200 }: SimpleChartProps) {
  const maxValue = Math.max(...data.map(item => item.value))
  
  if (type === 'bar') {
    return (
      <div className="cartoon-card p-6">
        {title && <h3 className="text-lg font-semibold mb-4 oggy-gradient">{title}</h3>}
        
        <div className="space-y-4" style={{ height }}>
          {data.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">{item.label}</span>
                <span className="text-sm text-gray-600">{item.value.toLocaleString()}</span>
              </div>
              
              <div className="cartoon-progress">
                <div 
                  className="cartoon-progress-fill transition-all duration-1000 delay-300"
                  style={{ 
                    width: `${(item.value / maxValue) * 100}%`,
                    background: item.color || 'linear-gradient(90deg, var(--cockroach-green), var(--oggy-orange))'
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
  
  if (type === 'pie') {
    const total = data.reduce((sum, item) => sum + item.value, 0)
    let cumulativePercentage = 0
    
    return (
      <div className="cartoon-card p-6">
        {title && <h3 className="text-lg font-semibold mb-4 oggy-gradient">{title}</h3>}
        
        <div className="flex items-center space-x-6">
          <div className="relative">
            <svg width="120" height="120" className="transform -rotate-90">
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="10"
              />
              {data.map((item, index) => {
                const percentage = (item.value / total) * 100
                const strokeDasharray = `${percentage * 3.14} 314`
                const strokeDashoffset = -cumulativePercentage * 3.14
                cumulativePercentage += percentage
                
                return (
                  <circle
                    key={index}
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke={item.color || `hsl(${index * 60}, 70%, 50%)`}
                    strokeWidth="10"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-1000"
                  />
                )
              })}
            </svg>
          </div>
          
          <div className="space-y-2 flex-1">
            {data.map((item, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ 
                    background: item.color || `hsl(${index * 60}, 70%, 50%)` 
                  }}
                />
                <span className="text-sm text-gray-700 flex-1">{item.label}</span>
                <span className="text-sm font-medium">
                  {((item.value / total) * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
  
  return null
}

interface StatsGridProps {
  stats: Array<{
    title: string
    value: string | number
    icon?: React.ReactNode
    change?: number
    changeType?: 'increase' | 'decrease' | 'neutral'
    suffix?: string
    prefix?: string
  }>
  columns?: 1 | 2 | 3 | 4
}

export function StatsGrid({ stats, columns = 3 }: StatsGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  }

  return (
    <div className={`grid gap-6 ${gridCols[columns]}`}>
      {stats.map((stat, index) => (
        <MetricCard key={index} {...stat} />
      ))}
    </div>
  )
}

interface TimelineItem {
  date: string
  title: string
  description: string
  status: 'completed' | 'current' | 'upcoming'
  amount?: number
}

interface TimelineProps {
  items: TimelineItem[]
  title?: string
}

export function Timeline({ items, title }: TimelineProps) {
  return (
    <div className="cartoon-card p-6">
      {title && <h3 className="text-lg font-semibold mb-6 oggy-gradient">{title}</h3>}
      
      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
        
        <div className="space-y-6">
          {items.map((item, index) => {
            const statusColors = {
              completed: 'bg-green-500 border-green-200',
              current: 'bg-blue-500 border-blue-200',
              upcoming: 'bg-gray-300 border-gray-200'
            }
            
            return (
              <div key={index} className="relative flex items-start space-x-4">
                <div className={`w-8 h-8 rounded-full border-4 ${statusColors[item.status]} flex items-center justify-center relative z-10`}>
                  {item.status === 'completed' && <span className="text-white text-sm">✓</span>}
                  {item.status === 'current' && <span className="text-white text-sm">🕒</span>}
                  {item.status === 'upcoming' && <span className="text-gray-600 text-sm">○</span>}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-gray-900">{item.title}</h4>
                    <span className="text-xs text-gray-500">{item.date}</span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                  
                  {item.amount && (
                    <div className="mt-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        💰 {item.amount.toLocaleString()} SOL
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

interface QuickStatsProps {
  totalValue: number
  totalStaked: number
  totalRewards: number
  apy: number
}

export function QuickStats({ totalValue, totalStaked, totalRewards, apy }: QuickStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        title="Total Value"
        value={totalValue.toFixed(2)}
        prefix="$"
        icon={<DollarSign className="w-5 h-5" />}
        changeType="increase"
        change={5.2}
      />
      
      <MetricCard
        title="Staked Amount"
        value={totalStaked.toFixed(2)}
        suffix=" SOL"
        icon={<Target className="w-5 h-5" />}
        changeType="increase"
        change={2.1}
      />
      
      <MetricCard
        title="Total Rewards"
        value={totalRewards.toFixed(4)}
        suffix=" SOL"
        icon={<TrendingUp className="w-5 h-5" />}
        changeType="increase"
        change={12.5}
      />
      
      <MetricCard
        title="Current APY"
        value={apy.toFixed(1)}
        suffix="%"
        icon={<Percent className="w-5 h-5" />}
        changeType="neutral"
      />
    </div>
  )
}
