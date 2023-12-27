export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className="w-4/5 mx-auto">{children}</main>
    </>
  );
}
