import { Montserrat, Poppins } from "next/font/google";

export const fontHeading = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});


export const fontSans = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});