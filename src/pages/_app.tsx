import "@/styles/globals.css";
import { CssBaseline } from "@mui/material";
import type { AppProps } from "next/app";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <CssBaseline />
      <Component {...pageProps} />
    </LocalizationProvider>
  );
}
