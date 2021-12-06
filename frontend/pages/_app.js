import 'semantic-ui-css/semantic.min.css'
import Footer from '../src/component/footer'
import Top from '../src/component/top'

function MyApp({ Component, pageProps }) {
  return (
    <div>
        <Top />
        <Component {...pageProps} />
        <Footer />
    </div>


  )}

export default MyApp
