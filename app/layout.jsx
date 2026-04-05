export const metadata = {
  title: "Auto-Generated Local Business Site",
  description: "Template for Broward County SMB websites"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
