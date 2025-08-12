'use client'

import { useState, useEffect } from 'react'
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className={`relative cartoon-card p-8 m-4 w-full ${sizeClasses[size]} max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold oggy-gradient">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {children}
      </div>
    </div>
  )
}

interface NotificationProps {
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  isVisible: boolean
  onClose: () => void
  autoClose?: boolean
  duration?: number
}

export function Notification({ 
  type, 
  title, 
  message, 
  isVisible, 
  onClose, 
  autoClose = true, 
  duration = 5000 
}: NotificationProps) {
  useEffect(() => {
    if (isVisible && autoClose) {
      const timer = setTimeout(onClose, duration)
      return () => clearTimeout(timer)
    }
  }, [isVisible, autoClose, duration, onClose])

  if (!isVisible) return null

  const typeConfig = {
    success: {
      icon: <CheckCircle className="w-6 h-6" />,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      iconColor: 'text-green-600',
      titleColor: 'text-green-800'
    },
    error: {
      icon: <AlertCircle className="w-6 h-6" />,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      iconColor: 'text-red-600',
      titleColor: 'text-red-800'
    },
    warning: {
      icon: <AlertTriangle className="w-6 h-6" />,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      iconColor: 'text-yellow-600',
      titleColor: 'text-yellow-800'
    },
    info: {
      icon: <Info className="w-6 h-6" />,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      iconColor: 'text-blue-600',
      titleColor: 'text-blue-800'
    }
  }

  const config = typeConfig[type]

  return (
    <div className={`fixed top-4 right-4 z-50 notification-toast ${config.bgColor} ${config.borderColor} slide-in-bounce`}>
      <div className="flex items-start space-x-3">
        <div className={config.iconColor}>
          {config.icon}
        </div>
        
        <div className="flex-1">
          <h3 className={`font-semibold ${config.titleColor}`}>{title}</h3>
          <p className="text-sm text-gray-600 mt-1">{message}</p>
        </div>
        
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'default' | 'danger'
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'default'
}: ConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="text-6xl">
            {type === 'danger' ? '⚠️' : '🤔'}
          </div>
          <p className="text-gray-700">{message}</p>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${
              type === 'danger'
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'cartoon-btn'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  )
}

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
}

export function LoadingSpinner({ size = 'md', text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-3">
      <div className="relative">
        <div className={`${sizeClasses[size]} border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin`}></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs">🐱</span>
        </div>
      </div>
      {text && (
        <p className="text-sm text-gray-600 font-medium">{text}</p>
      )}
    </div>
  )
}

interface TooltipProps {
  content: string
  children: React.ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
}

export function Tooltip({ content, children, position = 'top' }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)

  const positionClasses = {
    top: '-top-2 left-1/2 transform -translate-x-1/2 -translate-y-full',
    bottom: '-bottom-2 left-1/2 transform -translate-x-1/2 translate-y-full',
    left: 'top-1/2 -left-2 transform -translate-x-full -translate-y-1/2',
    right: 'top-1/2 -right-2 transform translate-x-full -translate-y-1/2'
  }

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      
      {isVisible && (
        <div className={`absolute z-10 px-3 py-1 bg-gray-800 text-white text-sm rounded-lg whitespace-nowrap ${positionClasses[position]}`}>
          {content}
          <div className={`absolute w-2 h-2 bg-gray-800 transform rotate-45 ${
            position === 'top' ? 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1' :
            position === 'bottom' ? 'top-0 left-1/2 -translate-x-1/2 -translate-y-1' :
            position === 'left' ? 'right-0 top-1/2 translate-x-1 -translate-y-1/2' :
            'left-0 top-1/2 -translate-x-1 -translate-y-1/2'
          }`} />
        </div>
      )}
    </div>
  )
}
