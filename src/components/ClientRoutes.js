import {useRef, useState, useEffect, useCallback} from 'react';
import './Client.css';

const ClientRoute=({peer})=>{
    const [id, setId] = useState('');
    const [connection, setConnection] = useState(false);
    const [trackStatus, setTrackStatus] = useState(true);
    const [stream, setStream] = useState(null);
    const videoRef = useRef(null);
    var conn, tmp;

    const makeCall=(id) => {
        
        var call = peer.call(id, stream)
        console.log(videoRef);
        call.on('stream', (streamRec)=>{
            console.log('hello', streamRec);
            // videoRef.current.pause();
            videoRef.current.srcObject = streamRec;
            videoRef.current.play();
        }, err=>{
            console.log(err);
        });
        sendRecieveData(id);
        setConnection(true);
    }

    const sendRecieveData=(id, message=false)=>{
        conn = peer.connect(id);
        
        conn.on('open', ()=>{
            conn.on('data', (data) => {
                console.log(data);
              });
            if(message==false)
                {conn.send('New Connection'); setTrackStatus(true);}
            else
                conn.send(message);
        },err=>{
            console.log(err)
        })   
    }

    useEffect(()=>{
        navigator.mediaDevices.getUserMedia({video: true, audio: true}).then(stream=> {
            setStream(stream);
            // videoRef.current.srcObject = stream;
            // videoRef.current.play();
        }).catch(err=>{
            console.log(err);
        }); 
    }, []);

    const handleID =(e)=>{
        setId(e.target.value);   
    }

    const onSubmit=()=>{
        makeCall(id);
    }

    const handleStatus=(e)=>{
        sendRecieveData(id, {'shouldTrack': !trackStatus})
        setTrackStatus(!trackStatus);
    }


    return(
        <div style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
            <input placeholder="Enter Host ID" style={{marginTop:'20px', marginBottom:'10px'}} value={id} onChange={handleID}/>
            <button onClick={onSubmit}>Connect</button>
            <video ref={videoRef} style={{width:'500px', margin:'16px'}}></video>
            {
                connection?
                    <label className="switch" >
                        <input type="checkbox" checked={trackStatus} onClick={handleStatus}/>
                        <span className="slider round"></span>
                    </label>
                :
                    null
            }
        </div>
    );
}

export default ClientRoute; 