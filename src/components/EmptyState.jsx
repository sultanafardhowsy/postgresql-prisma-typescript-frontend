export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-6">
      {Icon && (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brass-soft text-brass">
          <Icon size={22} />
        </div>
      )}
      <h3 className="font-display text-xl text-ink mb-1.5">{title}</h3>
      {description && (
        <p className="text-ink-soft text-sm max-w-sm mb-5">{description}</p>
      )}
      {action}
    </div>
  );
}
