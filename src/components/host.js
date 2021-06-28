import {useRef, useEffect, useState} from 'react';
import useSound from 'use-sound';
import sound from '../assets/alert.mp3';

const Host=({video})=>{
    const canvasRef = useRef(null);
    const nextCanvasref = useRef(null);
    // const [stopTracksetStopTrack] = useState(false);
    var stopTrack = false;
    // const resCanvasRef = useRef(null);
    const [move, setMove] = useState(false);
    const [play, {stop}]  = useSound(sound,{
        interrupt:true
    });
    const IMAGE_SCORE_THRESHOLD = 0.55;
    var ctx , ctx2;

    const capture=(ctx, enableDetect = false)=>{
        if(stopTrack===false){
        ctx.drawImage(video.current, 0, 0, 640, 480);
        if(enableDetect){
            detectMotion()
        }
        }
    }

    const detectMotion=()=>{

        var imageData1 = canvasRef.current.getContext('2d').getImageData(0,0,canvasRef.current.width, canvasRef.current.height);
        var imageData2 = ctx2.getImageData(0,0,nextCanvasref.current.width, nextCanvasref.current.height);
        
        var imageScore = imageData1;

        var movement=0;

        for (var i = 0; i < imageData1.data.length; i += 4) {
          var r = imageData1.data[i];
          var g = imageData1.data[i + 1];
          var b = imageData1.data[i + 2];
          var pr = imageData2.data[i];
          var pg = imageData2.data[i + 1];
          var pb = imageData2.data[i + 2];
          
          imageScore.data[i] = Math.abs((r-pr)*1.25);
          imageScore.data[i+1] = Math.abs((g-pg)*1.25);
          imageScore.data[i+2] = Math.abs((b-pb)*1.25);

          var resR = Math.abs((r-pr)*1.25);
          var resG = Math.abs((g-pg)*1.25);
          var resB = Math.abs((r-pr)*1.25);
          movement+=(resR + resG + resB);
        }
        // console.log(imageScore.data);
        movement = movement/10000000;
        if(movement>IMAGE_SCORE_THRESHOLD)
            actionOnMotion();
        else    
            setMove(false)
        //resCanvasRef.current.width=640;
        //resCanvasRef.current.height=480;
        // resCanvasRef.current.getContext('2d').putImageData(imageScore,0,0);
    }

    const actionOnMotion = ()=>{
        console.log("MOVEMENT");
        stopTrack=true;
        setMove(true);
        // setStopTrack(true);
        setTimeout(()=>{
            // setMove(false);
            // setStopTrack(false);
            stopTrack=false;
            setMove(false);
        }, 90000);
    } 

    useEffect(()=>{
        ctx = canvasRef.current.getContext('2d'); 
        ctx2 = nextCanvasref.current.getContext('2d'); 
        canvasRef.current.width=640;
        canvasRef.current.height=480;
        nextCanvasref.current.width=640;
        nextCanvasref.current.height=480;
        var int = setInterval(()=>capture(ctx), 100);
        var int2 = setInterval(()=>capture(ctx2, true), 198);
        return()=>{
            clearInterval(int);
            clearInterval(int2);
            stop();
        }
    },[]);

    return(
        <div style={{display:'flex', alignItems:'center', flexWrap:'wrap'}}>
            <div style={{fontSize:'18px'}}>
                Is Movement:
                <span style={{fontSize:'22px', color:move?"green":"red", fontWeight:'bold'}}>
                    {
                        move?
                            " True"
                        :
                            " False"
                    }
                </span>
            </div>

            {
                move?
                    <><span>( Tracking Paused ){play()}</span></>
                :
                    stop()
            }
            <canvas ref={canvasRef} style={{display:'none'}} ></canvas>
            <canvas ref={nextCanvasref} style={{display:'none'}} />            
        </div>
    )
}

export default Host;