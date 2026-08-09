export default function Spinner({ className = "" }) {
  return (
    <div className={`flex items-center justify-center py-16 ${className}`}>
      <div className="h-6 w-6 border-2 border-line-strong border-t-signal rounded-full animate-spin" />
    </div>
  );
}
