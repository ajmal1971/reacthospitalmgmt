import {Header, Footer} from './components/index';
import {Outlet} from 'react-router-dom';
import {Toaster} from 'react-hot-toast';

export default function App() {
  return (
    <div>
      <Header/>
      <main>
        <Outlet/>
      </main>
      <Footer/>
      <Toaster position='bottom-right' reverseOrder={false}/>
    </div>
  )
}