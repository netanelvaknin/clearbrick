export function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <p role="alert" className="text-base font-medium text-destructive">
      {message}
    </p>
  )
}
