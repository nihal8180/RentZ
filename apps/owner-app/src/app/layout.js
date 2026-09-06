import './globals.css';
import Topbar from '@/components/Topbar';

export const metadata = {
  title: 'RentZ Owner Dashboard',
  robots: { index: false, follow: false }, // owner dashboard should never be indexed
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Topbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
