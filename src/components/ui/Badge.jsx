const colors = {
  primary: 'bg-primary/20 text-primary',
  accent:  'bg-accent/20 text-accent',
  sand:    'bg-sand/40 text-dark',
  error:   'bg-error-bg text-error',
}

export default function Badge({ children, color = 'primary' }) {
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${colors[color]}`}>
      {children}
    </span>
  )
}
