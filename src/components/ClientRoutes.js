import {useRef, useState, useEffect, useCallback} from 'react';
import './Client.css';
import {useParams} from 'react-router-dom';

const ClientRoute=({peer})=>{
    const [id, setId] = useState('');
    const [connection, setConnection] = useState(false);
    const [trackStatus, setTrackStatus] = useState(false);
    const [stream, setStream] = useState(null);
    const videoRef = useRef(null);

    // useWindowUnloadEffect(()=>{
        
    // })

    const hostId= useParams();
    var conn

    const makeCall=(id, strm=false) => {
        var call;
        if(strm!==false){
            call = peer.call(id, strm)   
            console.log(strm)
        }else{
            call = peer.call(id, stream)
            console.log(stream)
        }
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
        console.log(peer.id);
        conn.on('open', ()=>{
            conn.on('data', (data) => {
                console.log(data);
              });
            if(message==false)
                {conn.send('New Connection'); setTrackStatus(false);}
            else
                conn.send(message);
        },err=>{
            console.log(err)
        })   
    }

    useEffect(()=>{
        navigator.mediaDevices.getUserMedia({video: true}).then(stream=> {
            setStream(stream);
            // videoRef.current.srcObject = stream;
            // videoRef.current.play();
            if(hostId.id){
                    setId(hostId.id);
                    setTimeout(()=>{
                        makeCall(hostId.id, stream);
                    }, 2000)    
            }
        }).catch(err=>{
            console.log(err);
        }); 
        window.onbeforeunload =()=>{
            conn.send('disconnected');
            peer.disconnect();
            peer.destroy();
            console.log('unload');
        }

        return ()=>{
            window.onbeforeunload =()=>{
                conn.send('disconnected');
                peer.disconnect();
                peer.destroy();
                console.log('unload');
            }
        }
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
                <>
                    <span>Track Movement:</span>
                    <label className="switch" >
                        <input type="checkbox" checked={trackStatus} onClick={handleStatus}/>
                        <span className="slider round"></span>
                    </label>
                </>
                :
                    null
            }
        </div>
    );
}

export default ClientRoute; 