export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <p className="text-xs font-medium uppercase tracking-wide text-brand">
            Boston Skilling Center
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-brand">
            Sistema Operativo
          </h1>
        </div>
        {children}
      </div>
    </div>
  );
}
