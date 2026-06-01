export const generateStaticParams = async () => {
  return []
}

export default function MessageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>
}
