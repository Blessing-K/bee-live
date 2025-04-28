import '../styles/globals.css';
import { CoursesProvider } from "../context/CoursesContext";

function MyApp({ Component, pageProps }) {
  return (
    <CoursesProvider>
      <Component {...pageProps} />
    </CoursesProvider>
  );
}

export default MyApp;
