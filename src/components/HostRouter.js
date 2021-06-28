import {useRef, useState, useEffect} from 'react';
import PeerConnecter from './peerListeners';
import Host from './host';

const HostRoute=({peer})=>{
  const videoRef = useRef(null)
  const [shouldTrack, setShouldTrack] = useState(true);
  const [cameras, setCameras] = useState([])
  const [isCopied, setIsCopied] = useState(false);
  var counter=new Set();
  
  const OnlyListenCall=(stream)=>{
        // console.log(peer.id);

        peer.on('call', call=>{
          console.log('connect Req');
          console.log(call, stream);
          call.answer(stream);
        })

        peer.on('connection', conn=>{
            counter.add(conn.peer);
            console.log(conn);
            console.log(counter.size+' online')
            conn.on('data', data=>{
                console.log('new message', data);
                if(data.shouldTrack!==undefined)
                    {setShouldTrack(data.shouldTrack);}
                if(data.shouldTrack===undefined && data!=='disconnected'){
                    setShouldTrack(false);
                }
                if(data==='disconnected'){
                  counter.delete(conn.peer);
                  console.log(counter.size+' online')
                  if(counter.size<1){
                      counter=new Set();
                      setShouldTrack(true);
                  }
                }
                conn.send('Ok')
            })
        })

        // peer.on('disconnected', ()=>{
        //   counter.1
        //   console.log(counter.values()+' online')
        //   if(counter.size<1){
        //     setShouldTrack(true);
        //   }
        // })
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

  const copyToClipboard = str => {
    const el = document.createElement('textarea');
    el.value = str;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  };

  const handleCopyLink=()=>{
    setIsCopied(true);
    copyToClipboard(window.origin+"/client/"+peer.id);
    setTimeout(()=>{
      setIsCopied(false);
    }, 1000);
  }

  return (
    <div style={{width:'100%', flexDirection:'column', display:'flex', alignItems:'center', justifyContent:'center'}}>
        {
          peer.id?
            <span style={{padding:'10px 5px', marginTop:'10px', marginBottom:'10px', background:'black', color:'white', fontSize:'13px', cursor:'pointer'}} onClick={handleCopyLink}>Share a direct Link</span>
          :
            null
        }
      {
          shouldTrack?
            <Host video={videoRef}/>
          :
            null  
      }
      <video ref={videoRef} style={{width:'500px', margin:'16px'}}></video>

      {
        cameras.length>1?
          <select onChange={selectCamera}>
            {generateOptions}
          </select>
        :
          null
      }
      
      <span style={{margin:'16px', fontWeight:'bold'}}>Host Id: {peer.id}</span>

      {
        isCopied?
          <div style={{position:'fixed', top:50, right:'10%'}}>
            <span style={{background:'rgba(0,0,0,0.6)', padding:'5px 5px', color:'white', borderRadius:'5px', textAlign:'center', whiteSpace:'nowrap'}}>
              Link Copied, Share it to join.
            </span>
            
          </div>
        :
          null
      }
    </div>
  );
}

export default HostRoute;