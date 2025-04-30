import '@/styles/globals.css';
import { Amplify } from 'aws-amplify';
import awsExports from '../aws-exports';
import { CoursesProvider } from '../context/CoursesContext';

Amplify.configure(awsExports); 

export default function App({ Component, pageProps }) {
  return (
    <CoursesProvider>
      <Component {...pageProps} />
    </CoursesProvider>
  );
}
