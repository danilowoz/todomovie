import type { Metadata } from "next";
import { Koulen } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";

const koulen = Koulen({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: "TODOMovie - Don't skip one",
  // description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <meta name="theme-color" content="#181818" />
      <body className={koulen.className}>
        <Header />
        <div className="app">
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}

{
  /* <script>
  import './styles.css';
  import './vars.css';
  import Header from '../components/Header.svelte';
  import Analytics from '../components/Analytics.svelte';
</script>

<Analytics />
<div class="app">
  <Header />
  <main>
    <slot />
  </main>
</div> */
}
