import {useRef, useState, useEffect} from 'react';
import PeerConnecter from './peerListeners';
import Host from './host';

const HostRoute=({peer})=>{
  const videoRef = useRef(null)
  const [shouldTrack, setShouldTrack] = useState(true);
  const [cameras, setCameras] = useState([])
  
  const OnlyListenCall=(stream)=>{
      console.log(peer.id);

      peer.on('call', call=>{
          console.log('connect Req');
            console.log(call, stream);
            call.answer(stream);
        })

        peer.on('connection', conn=>{
            conn.on('data', data=>{
                console.log('new message', data);
                if(data.shouldTrack!==undefined)
                    {setShouldTrack(data.shouldTrack);}
                if(data.shouldTrack===undefined){
                    setShouldTrack(true);
                }
                conn.send('Ok')
            })
        })
  }

  useEffect(()=>{
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: {width: 640, height: 480}})
        .then(function (stream) {
          videoRef.current.srcObject = stream;
          videoRef.current.play()
          initiateDropDown()
          OnlyListenCall(stream)
        })
        .catch(function (err0r) {
          console.log("Something went wrong!",err0r);
          alert("Browser issue or something went wrong!!!!")
        });
    }
  },[])

  const initiateDropDown=async()=>{
    await navigator.mediaDevices.enumerateDevices()
    .then(res=>{
      var tmp=[];
      for(var i=0;i<res.length;i++){
          if(res[i].kind === "videoinput"){
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
        <span style={{margin:'16px', fontWeight:'bold'}}>Host Id: {peer.id}</span>
      <video ref={videoRef} style={{width:'500px', margin:'16px'}}></video>
      {
        cameras.length>0?
          <select onChange={selectCamera}>
            {generateOptions}
          </select>
        :
          null
      }
      {
          shouldTrack?
            <Host video={videoRef}/>
          :
            null  
      }
    </div>
  );
}

export default HostRoute;