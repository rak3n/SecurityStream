import {useState, useEffect} from 'react';
import HostRoute from './components/HostRouter';
import ClientRoute from './components/ClientRoutes';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Peer from 'peerjs';
import "./App.css";

function App() {
  const [peer, setPeer] = useState(null)


  useEffect(()=>{
    var peer = new Peer()
    setPeer(peer);
  }, [])
  return(
    <>
      {
        peer!==null?
        <Router>
        <Switch>
          <Route exact path="/host">
            <HostRoute peer={peer}/>
          </Route>

          <Route exact path="/client/:id">
            <ClientRoute peer={peer}/>
          </Route>

          <Route exact path="/client">
            <ClientRoute peer={peer}/>
          </Route>

          <Route path="*">
              <div style={{width:'100vw', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center'}}>
                <a href="/host" className="appRoutes">HOST</a>
                <a href="/client" className="appRoutes">CLIENT</a>
              </div>
          </Route>
        </Switch>
      </Router>
      :
        "Loading...."
      }
    </>
  )
}

export default App;
