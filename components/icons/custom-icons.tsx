import React from 'react'

interface IconProps {
  className?: string
  size?: number
}

// Banking Icon - Modern bank building with Solana colors
export const BankingIcon: React.FC<IconProps> = ({ className = "w-5 h-5", size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="banking-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#9945FF" />
        <stop offset="50%" stopColor="#14F195" />
        <stop offset="100%" stopColor="#FF6B6B" />
      </linearGradient>
    </defs>
    <rect x="2" y="8" width="20" height="12" rx="1" fill="url(#banking-gradient)" fillOpacity="0.9" />
    <rect x="4" y="10" width="2" height="8" fill="white" fillOpacity="0.95" />
    <rect x="7" y="10" width="2" height="8" fill="white" fillOpacity="0.95" />
    <rect x="10" y="10" width="2" height="8" fill="white" fillOpacity="0.95" />
    <rect x="13" y="10" width="2" height="8" fill="white" fillOpacity="0.95" />
    <rect x="16" y="10" width="2" height="8" fill="white" fillOpacity="0.95" />
    <polygon points="2,8 12,3 22,8" fill="url(#banking-gradient)" />
    <circle cx="12" cy="6" r="1" fill="white" />
  </svg>
)

// Vesting Icon - Hourglass with flowing tokens
export const VestingIcon: React.FC<IconProps> = ({ className = "w-5 h-5", size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="vesting-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#14F195" />
        <stop offset="50%" stopColor="#9945FF" />
        <stop offset="100%" stopColor="#FF6B6B" />
      </linearGradient>
    </defs>
    <path d="M6 2h12v4l-6 6 6 6v4H6v-4l6-6-6-6V2z" fill="url(#vesting-gradient)" fillOpacity="0.9" />
    <rect x="6" y="2" width="12" height="2" fill="white" fillOpacity="0.95" />
    <rect x="6" y="20" width="12" height="2" fill="white" fillOpacity="0.95" />
    <circle cx="12" cy="12" r="2" fill="white" fillOpacity="0.8" />
    <circle cx="10" cy="8" r="0.8" fill="white" fillOpacity="0.7" />
    <circle cx="14" cy="8" r="0.8" fill="white" fillOpacity="0.7" />
    <circle cx="9" cy="16" r="0.8" fill="white" fillOpacity="0.7" />
    <circle cx="15" cy="16" r="0.8" fill="white" fillOpacity="0.7" />
  </svg>
)

// Dashboard Icon - Modern analytics chart
export const DashboardIcon: React.FC<IconProps> = ({ className = "w-5 h-5", size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="dashboardGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF6B6B" />
        <stop offset="50%" stopColor="#9945FF" />
        <stop offset="100%" stopColor="#14F195" />
      </linearGradient>
    </defs>
    <rect x="3" y="3" width="18" height="18" rx="2" fill="url(#dashboardGradient)" fillOpacity="0.8" />
    <rect x="5" y="14" width="3" height="5" fill="white" fillOpacity="0.9" />
    <rect x="9" y="10" width="3" height="9" fill="white" fillOpacity="0.9" />
    <rect x="13" y="7" width="3" height="12" fill="white" fillOpacity="0.9" />
    <rect x="17" y="12" width="2" height="7" fill="white" fillOpacity="0.9" />
    <circle cx="7" cy="8" r="1" fill="#14F195" />
    <circle cx="11" cy="7" r="1" fill="#9945FF" />
    <circle cx="15" cy="6" r="1" fill="#FF6B6B" />
    <path d="M6,8 L10,7 L14,6 L18,9" stroke="white" strokeWidth="1.5" fill="none" strokeOpacity="0.8" />
  </svg>
)

// Staking Icon - Stack of coins with growth arrow
export const StakingIcon: React.FC<IconProps> = ({ className = "w-5 h-5", size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="stakingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#14F195" />
        <stop offset="50%" stopColor="#FF6B6B" />
        <stop offset="100%" stopColor="#9945FF" />
      </linearGradient>
    </defs>
    <ellipse cx="8" cy="18" rx="4" ry="1.5" fill="url(#stakingGradient)" fillOpacity="0.8" />
    <ellipse cx="8" cy="15" rx="4" ry="1.5" fill="url(#stakingGradient)" fillOpacity="0.7" />
    <ellipse cx="8" cy="12" rx="4" ry="1.5" fill="url(#stakingGradient)" fillOpacity="0.6" />
    <circle cx="8" cy="12" r="2" fill="white" fillOpacity="0.9" />
    <circle cx="8" cy="15" r="2" fill="white" fillOpacity="0.8" />
    <circle cx="8" cy="18" r="2" fill="white" fillOpacity="0.7" />
    <path d="M15 5L19 9L15 13" stroke="url(#stakingGradient)" strokeWidth="2" fill="none" />
    <path d="M19 9L14 9" stroke="url(#stakingGradient)" strokeWidth="2" />
    <text x="8" y="13" textAnchor="middle" className="text-xs font-bold" fill="#9945FF">$</text>
    <text x="8" y="16" textAnchor="middle" className="text-xs font-bold" fill="#9945FF">$</text>
    <text x="8" y="19" textAnchor="middle" className="text-xs font-bold" fill="#9945FF">$</text>
  </svg>
)

// Governance Icon - Voting ballot with checkmarks
export const GovernanceIcon: React.FC<IconProps> = ({ className = "w-5 h-5", size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="governanceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#9945FF" />
        <stop offset="50%" stopColor="#FF6B6B" />
        <stop offset="100%" stopColor="#14F195" />
      </linearGradient>
    </defs>
    <rect x="4" y="3" width="16" height="18" rx="2" fill="url(#governanceGradient)" fillOpacity="0.8" />
    <rect x="6" y="5" width="12" height="14" fill="white" fillOpacity="0.9" />
    <circle cx="9" cy="9" r="1.5" fill="#14F195" />
    <path d="M8 9L8.5 9.5L10 8" stroke="white" strokeWidth="1.5" fill="none" />
    <circle cx="9" cy="13" r="1.5" fill="#FF6B6B" />
    <path d="M8 13L8.5 13.5L10 12" stroke="white" strokeWidth="1.5" fill="none" />
    <circle cx="9" cy="17" r="1.5" fill="#9945FF" />
    <path d="M8 17L8.5 17.5L10 16" stroke="white" strokeWidth="1.5" fill="none" />
    <rect x="12" y="8" width="4" height="1" fill="#14F195" fillOpacity="0.7" />
    <rect x="12" y="12" width="4" height="1" fill="#FF6B6B" fillOpacity="0.7" />
    <rect x="12" y="16" width="4" height="1" fill="#9945FF" fillOpacity="0.7" />
  </svg>
)

// Account Icon - User profile with security shield
export const AccountIcon: React.FC<IconProps> = ({ className = "w-5 h-5", size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="accountGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF6B6B" />
        <stop offset="50%" stopColor="#14F195" />
        <stop offset="100%" stopColor="#9945FF" />
      </linearGradient>
    </defs>
    <circle cx="12" cy="8" r="4" fill="url(#accountGradient)" fillOpacity="0.8" />
    <circle cx="12" cy="8" r="2.5" fill="white" fillOpacity="0.9" />
    <path d="M4 20c0-4 4-6 8-6s8 2 8 6" fill="url(#accountGradient)" fillOpacity="0.8" />
    <path d="M6 20c0-2.5 3-4 6-4s6 1.5 6 4" fill="white" fillOpacity="0.9" />
    <circle cx="18" cy="6" r="3" fill="#14F195" fillOpacity="0.9" />
    <path d="M16.5 6L17.5 7L19.5 5" stroke="white" strokeWidth="1.5" fill="none" />
  </svg>
)

// Network Icon - Connected nodes representing blockchain network
export const NetworkIcon: React.FC<IconProps> = ({ className = "w-4 h-4", size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="networkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#9945FF" />
        <stop offset="50%" stopColor="#14F195" />
        <stop offset="100%" stopColor="#FF6B6B" />
      </linearGradient>
    </defs>
    <circle cx="12" cy="6" r="2" fill="url(#networkGradient)" />
    <circle cx="6" cy="12" r="2" fill="url(#networkGradient)" />
    <circle cx="18" cy="12" r="2" fill="url(#networkGradient)" />
    <circle cx="12" cy="18" r="2" fill="url(#networkGradient)" />
    <path d="M10.5 7.5L7.5 10.5" stroke="url(#networkGradient)" strokeWidth="1.5" />
    <path d="M13.5 7.5L16.5 10.5" stroke="url(#networkGradient)" strokeWidth="1.5" />
    <path d="M7.5 13.5L10.5 16.5" stroke="url(#networkGradient)" strokeWidth="1.5" />
    <path d="M16.5 13.5L13.5 16.5" stroke="url(#networkGradient)" strokeWidth="1.5" />
    <path d="M8 12L16 12" stroke="url(#networkGradient)" strokeWidth="1.5" />
  </svg>
)

// Menu Icon - Hamburger with style
export const MenuIcon: React.FC<IconProps> = ({ className = "w-5 h-5", size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="menuGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#FF6B6B" />
        <stop offset="50%" stopColor="#9945FF" />
        <stop offset="100%" stopColor="#14F195" />
      </linearGradient>
    </defs>
    <rect x="3" y="6" width="18" height="2" rx="1" fill="url(#menuGradient)" />
    <rect x="3" y="11" width="18" height="2" rx="1" fill="url(#menuGradient)" />
    <rect x="3" y="16" width="18" height="2" rx="1" fill="url(#menuGradient)" />
  </svg>
)

// Close Icon - X with style
export const CloseIcon: React.FC<IconProps> = ({ className = "w-5 h-5", size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="closeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF6B6B" />
        <stop offset="100%" stopColor="#9945FF" />
      </linearGradient>
    </defs>
    <path d="M18 6L6 18" stroke="url(#closeGradient)" strokeWidth="2" strokeLinecap="round" />
    <path d="M6 6L18 18" stroke="url(#closeGradient)" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

// Notification Bell Icon
export const NotificationIcon: React.FC<IconProps> = ({ className = "w-4 h-4", size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="notificationGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF6B6B" />
        <stop offset="50%" stopColor="#9945FF" />
        <stop offset="100%" stopColor="#14F195" />
      </linearGradient>
    </defs>
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" fill="url(#notificationGradient)" fillOpacity="0.8" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="url(#notificationGradient)" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="18" cy="6" r="3" fill="#FF6B6B" />
    <text x="18" y="8" textAnchor="middle" className="text-xs font-bold" fill="white">!</text>
  </svg>
)

export const icons = {
  Banking: BankingIcon,
  Vesting: VestingIcon,
  Dashboard: DashboardIcon,
  Staking: StakingIcon,
  Governance: GovernanceIcon,
  Account: AccountIcon,
  Network: NetworkIcon,
  Menu: MenuIcon,
  Close: CloseIcon,
  Notification: NotificationIcon,
}

export default icons
