// Override admin layout for login page — no sidebar
export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
