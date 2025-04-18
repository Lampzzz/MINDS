export function DashboardFormContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 max-w-7xl mx-auto space-y-4 p-8">{children}</div>
  );
}
