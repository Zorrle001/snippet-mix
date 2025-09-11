import "@/styles/globals.scss";
import { Noto_Sans_JP } from "next/font/google";

const noto_sans = Noto_Sans_JP({ subsets: ["latin"] });

export const FontClassName = noto_sans.className;

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    console.log("LAYOUT");

    return (
        <html lang="en">
            <head>
                <link
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
                />
            </head>

            <body className={noto_sans.className}>{children}</body>
        </html>
    );
}
