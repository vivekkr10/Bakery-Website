import {Routes, Route} from 'react-router-dom';
import About from './Pages/About/About';


export default function App() {
  return (
    <>
      <Routes>
        <Route path='/about-us' element={<About />} />
      </Routes>
    </>
  );
}
