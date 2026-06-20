import { Bell, Menu, LogOut } from 'lucide-react'

interface TopNavbarProps {
  onMenuToggle: () => void
}

export function TopNavbar({ onMenuToggle }: TopNavbarProps) {
  return (
    <header className="h-16 bg-navbar border-b border-border flex items-center gap-4 px-6 sticky top-0 z-30">
      {/* Mobile menu toggle */}
      <button
        onClick={onMenuToggle}
        className="lg:hidden p-2 rounded-radius-button text-text-muted hover:text-text-heading hover:bg-card-hover cursor-pointer"
      >
        <Menu size={20} />
      </button>

      {/* Spacer to push right content */}
      <div className="flex-1" />

      {/* Right side */}
      <div className="flex items-center gap-2 ml-auto">
        {/* Notifications */}
        <button className="relative p-2 rounded-radius-button text-text-muted hover:text-text-heading hover:bg-card-hover transition-colors cursor-pointer">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full" />
        </button>

        {/* Logout */}
        <button className="flex items-center gap-2 p-2 rounded-radius-button text-text-muted hover:text-danger hover:bg-danger/10 transition-colors cursor-pointer ml-2 border border-transparent hover:border-danger/20">
          <LogOut size={18} />
          <span className="text-sm font-medium hidden sm:inline-block">Logout</span>
        </button>
      </div>
    </header>
  )
}
