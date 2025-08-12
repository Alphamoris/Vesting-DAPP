'use client'

import { forwardRef, useState } from 'react'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helper?: string
  icon?: React.ReactNode
  variant?: 'default' | 'cartoon'
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helper, icon, variant = 'cartoon', className = '', ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-semibold text-gray-700">
            {label}
          </label>
        )}
        
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}
          
          <input
            ref={ref}
            className={`
              w-full px-4 py-3 border-2 rounded-xl transition-all duration-200
              ${icon ? 'pl-10' : ''}
              ${variant === 'cartoon' 
                ? 'border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 bg-white cartoon-shadow'
                : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
              }
              ${error ? 'border-red-500' : ''}
              ${className}
            `}
            {...props}
          />
          
          {error && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500">
              <AlertCircle className="w-5 h-5" />
            </div>
          )}
        </div>
        
        {error && (
          <p className="text-sm text-red-600 flex items-center space-x-1">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </p>
        )}
        
        {helper && !error && (
          <p className="text-sm text-gray-500">{helper}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

interface PasswordInputProps extends Omit<InputProps, 'type'> {}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className = '', ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)

    return (
      <div className="relative">
        <Input
          ref={ref}
          type={showPassword ? 'text' : 'password'}
          className={`pr-12 ${className}`}
          {...props}
        />
        
        <button
          type="button"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
    )
  }
)

PasswordInput.displayName = 'PasswordInput'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helper?: string
  variant?: 'default' | 'cartoon'
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helper, variant = 'cartoon', className = '', ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-semibold text-gray-700">
            {label}
          </label>
        )}
        
        <textarea
          ref={ref}
          className={`
            w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 resize-none
            ${variant === 'cartoon' 
              ? 'border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 bg-white cartoon-shadow'
              : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
            }
            ${error ? 'border-red-500' : ''}
            ${className}
          `}
          {...props}
        />
        
        {error && (
          <p className="text-sm text-red-600 flex items-center space-x-1">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </p>
        )}
        
        {helper && !error && (
          <p className="text-sm text-gray-500">{helper}</p>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  helper?: string
  options: Array<{ value: string; label: string }>
  placeholder?: string
  variant?: 'default' | 'cartoon'
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helper, options, placeholder, variant = 'cartoon', className = '', ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-semibold text-gray-700">
            {label}
          </label>
        )}
        
        <select
          ref={ref}
          className={`
            w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 bg-white
            ${variant === 'cartoon' 
              ? 'border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 cartoon-shadow'
              : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
            }
            ${error ? 'border-red-500' : ''}
            ${className}
          `}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        {error && (
          <p className="text-sm text-red-600 flex items-center space-x-1">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </p>
        )}
        
        {helper && !error && (
          <p className="text-sm text-gray-500">{helper}</p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  description?: string
  variant?: 'default' | 'cartoon'
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, variant = 'cartoon', className = '', ...props }, ref) => {
    return (
      <div className="flex items-start space-x-3">
        <input
          ref={ref}
          type="checkbox"
          className={`
            mt-0.5 w-5 h-5 rounded border-2 transition-all duration-200
            ${variant === 'cartoon'
              ? 'border-gray-300 text-blue-500 focus:ring-4 focus:ring-blue-100 focus:border-blue-500'
              : 'border-gray-300 text-blue-500 focus:ring-2 focus:ring-blue-100'
            }
            ${className}
          `}
          {...props}
        />
        
        <div className="flex-1">
          <label className="text-sm font-medium text-gray-700 cursor-pointer">
            {label}
          </label>
          {description && (
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          )}
        </div>
      </div>
    )
  }
)

Checkbox.displayName = 'Checkbox'

interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  variant?: 'default' | 'cartoon'
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ label, variant = 'cartoon', className = '', ...props }, ref) => {
    return (
      <div className="flex items-center space-x-3">
        <input
          ref={ref}
          type="radio"
          className={`
            w-5 h-5 border-2 transition-all duration-200
            ${variant === 'cartoon'
              ? 'border-gray-300 text-blue-500 focus:ring-4 focus:ring-blue-100 focus:border-blue-500'
              : 'border-gray-300 text-blue-500 focus:ring-2 focus:ring-blue-100'
            }
            ${className}
          `}
          {...props}
        />
        
        <label className="text-sm font-medium text-gray-700 cursor-pointer">
          {label}
        </label>
      </div>
    )
  }
)

Radio.displayName = 'Radio'

interface FormGroupProps {
  children: React.ReactNode
  className?: string
}

export function FormGroup({ children, className = '' }: FormGroupProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {children}
    </div>
  )
}

interface FormSectionProps {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
}

export function FormSection({ title, description, children, className = '' }: FormSectionProps) {
  return (
    <div className={`cartoon-card p-6 ${className}`}>
      <div className="mb-6">
        <h3 className="text-lg font-semibold oggy-gradient">{title}</h3>
        {description && (
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        )}
      </div>
      
      <FormGroup>
        {children}
      </FormGroup>
    </div>
  )
}
