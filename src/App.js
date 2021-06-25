import {useRef, useEffect} from 'react';
import Host from './components/host';

function App() {
  const videoRef = useRef(null)

  useEffect(()=>{
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: {width: 640, height: 480} })
        .then(function (stream) {
          videoRef.current.srcObject = stream;
          videoRef.current.play()
        })
        .catch(function (err0r) {
          console.log("Something went wrong!");
        });
    }
  },[])

  return (
    <div style={{width:'100%', flexDirection:'column', display:'flex', alignItems:'center', justifyContent:'center'}}>
      <video ref={videoRef} style={{width:'500px', margin:'16px'}}></video>
      <Host video={videoRef}/>
    </div>
  );
}

export default App;
