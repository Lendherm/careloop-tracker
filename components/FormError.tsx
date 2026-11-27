interface FormErrorProps {
  message?: string | null;
}

export function FormError({ message }: FormErrorProps) {
  if (!message) return null;

  return (
    <p role="alert" className="rounded-md bg-accent/15 px-3 py-2 text-sm text-accent-ink">
      {message}
    </p>
  );
}
