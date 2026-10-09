import { Montserrat, Poppins } from "next/font/google";

/** Headings: bold, strong, works well in uppercase. */
export const fontHeading = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

/** Body text. Poppins is static, so list only the weights we use. */
export const fontSans = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});