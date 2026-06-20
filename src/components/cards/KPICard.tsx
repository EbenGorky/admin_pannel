

interface KPICardProps {
  label: string
  value: string
}

export function KPICard({ label, value }: KPICardProps) {
  return (
    <div className="relative overflow-hidden bg-card border border-border-light rounded-xl p-3.5 hover:border-primary/40 transition-all duration-300 group hover:shadow-md flex flex-col justify-center">
      {/* Animated bottom border */}
      <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-gradient-to-r from-primary to-primary-light transition-all duration-500 group-hover:w-full" />
      
      {/* Subtle background glow on hover */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -translate-y-1/2 translate-x-1/4" />
      
      <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider truncate mb-1 relative z-10">
        {label}
      </p>
      <h3 className="text-xl font-extrabold text-text-heading leading-none tracking-tight relative z-10">
        {value}
      </h3>
    </div>
  )
}

