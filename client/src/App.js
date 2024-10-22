import './App.css';
import Source from './components/Source'
import Nav from './components/Nav'
import FiltersMenu from './components/FiltersMenu'
import {useState,useEffect} from 'react';

let data = [];
function App() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);
  const [isOpen,setIsOpen] = useState(false);
  const [filters,setFilters] = useState({});
  const toggleFiltersMenu = (e) => {
    setIsOpen(true); 
  }
  const hideFiltersMenu = (e) => {
    setIsOpen(false); 
  }
  useEffect(() => {
    console.time("fetching data takes: ");
    fetch("/api/data")
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          console.log("%cNote: Filters are on the top right end.There is a reset button in the filters menu to reset filters.\nThe chart shows more data on hovering.",
          "color: blue; font-family:serif; font-size: 20px");
          console.log('data received');
          setItems(result);
          data = result;
          console.timeEnd("fetching data takes: ");
        }
      )
      .catch(err => {console.error(err);console.timeEnd("fetching data takes: ");setError(err)})
    
  }, [])
  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return (
      <div className="loadingWrap">
        <div className="loadingBoxes loadingBoxColour1"></div>
        <div className="loadingBoxes loadingBoxColour2"></div>
        <div className="loadingBoxes loadingBoxColour3"></div>
        <div className="loadingBoxes loadingBoxColour4"></div>
        <div className="loadingBoxes loadingBoxColour5"></div>
      </div>
    );
  } else {
    return (
      <div className="App" >
        <Nav toggleFiltersMenu={toggleFiltersMenu}  />
        <Source filters={filters} items={items} />
        <FiltersMenu showOrHide = {isOpen} addFilters={setFilters} data={data} hideFiltersMenu={hideFiltersMenu} />
      </div>
    );
  }
}

export default App;
