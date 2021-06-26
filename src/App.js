import {useRef, useState, useEffect} from 'react';
import Host from './components/host';

function App() {
  const videoRef = useRef(null)
  const [cameras, setCameras] = useState([])

  useEffect(()=>{
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: {width: 640, height: 480} })
        .then(function (stream) {
          videoRef.current.srcObject = stream;
          videoRef.current.play()
          initiateDropDown()
        })
        .catch(function (err0r) {
          console.log("Something went wrong!");
          alert("Browser issue or something went wrong!!!!")
        });
    }
  },[])

  const initiateDropDown=async()=>{
    await navigator.mediaDevices.enumerateDevices()
    .then(res=>{
      var tmp=[];
      for(var i=0;i<res.length;i++){
          if(res[i].kind === "videoinput" && res[i].deviceId){
            tmp.push(res[i]);
          }
      }
      setCameras(tmp);
    })
    .catch(err=>{
      console.log("Error in render");
    })
  }

  const selectCamera=(e)=>{
    if (navigator.mediaDevices.getUserMedia) {

      navigator.mediaDevices.getUserMedia({ video: {width: 640, height: 480, deviceId: e.target.value} })
        .then(function (stream) {
          videoRef.current.pause()
          videoRef.current.srcObject = stream;
          videoRef.current.play()
          initiateDropDown()
        })
        .catch(function (err0r) {
          console.log("Something went wrong!" + err0r);
          alert("Browser issue or something went wrong!!!!")
        });
    }
  }

  const generateOptions = cameras.map(itm=>{
    return(
      <>
      <option value={itm.deviceId}>{itm.label}</option>
      </>
    );
  })

  return (
    <div style={{width:'100%', flexDirection:'column', display:'flex', alignItems:'center', justifyContent:'center'}}>
      <video ref={videoRef} style={{width:'500px', margin:'16px'}}></video>
      {
        cameras.length>0?
          <select onChange={selectCamera}>
            {generateOptions}
          </select>
        :
          null
      }
      <Host video={videoRef}/>
    </div>
  );
}

export default App;
