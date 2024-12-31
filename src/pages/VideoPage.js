import React, { useEffect, useState, useRef } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { fireStore } from "../firebase";
import Navbar from "../components/navbar/Navbar";
import { Box, Button, Container } from "@mui/material";
import Hls from "hls.js";

function checkFileType(url) {
  if (url.endsWith(".mp3")) {
    return "MP3";
  } else if (url.endsWith(".mp4")) {
    return "MP4";
  } else if (url.includes(".m3u8")) {
    return "M3U8";
  } else {
    return "Other";
  }
}

function VideoPage() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [levels, setLevels] = useState([]);
  const [audioTracks, setAudioTracks] = useState([]);
  const [subtitleTracks, setSubtitleTracks] = useState([]);
  const videoRef = useRef(null);
  let hls;

  async function getEvents() {
    const q = query(
      collection(fireStore, "products"),
      where("uniqueId", "==", id)
    );
    const querySnapshot = await getDocs(q);
    let event = null;

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      
      event = { ...data, id: doc.id, format: checkFileType(data?.url) };
    });

    setVideo(event);
  }

  useEffect(() => {
    getEvents();
  }, [id]);

  useEffect(() => {
    if (video?.format === "M3U8" && videoRef.current) {
      if (hls) {
        hls.destroy(); // Cleanup previous instance
      }
      if (Hls.isSupported()) {
        console.log("video.url ===",video.url)
        hls = new Hls();
        hls.loadSource(video.url);
        hls.attachMedia(videoRef.current);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          console.log("hls.audioTracks ====== ",hls.audioTracks);
          
          setLevels(hls.levels);
          setAudioTracks(hls.audioTracks);
          setSubtitleTracks(hls.subtitleTracks);
          videoRef.current.play().catch(() => {
            setErrorMessage("Autoplay blocked. Click 'Play' to start.");
          });
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error("HLS error:", data);
          setErrorMessage("An error occurred while loading the stream.");
        });
      } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
        console.log("video.url 11111===",video.url)

        videoRef.current.src = video.url;
        videoRef.current.play().catch(() => {
          setErrorMessage("Autoplay blocked. Click 'Play' to start.");
        });
      } else {
        setErrorMessage("HLS is not supported in this browser.");
      }
    }
  }, [video]);

  const handlePlaybackSpeedChange = (e) => {
    videoRef.current.playbackRate = parseFloat(e.target.value);
  };

  const handleVolumeChange = (e) => {
    videoRef.current.volume = parseFloat(e.target.value);
  };

  const handleQualityChange = (e) => {
    if (hls) hls.currentLevel = parseInt(e.target.value);
  };

  const handleAudioTrackChange = (e) => {
    if (hls) hls.audioTrack = parseInt(e.target.value);
  };  

  const handleSubtitleTrackChange = (e) => {
    if (hls) hls.subtitleTrack = parseInt(e.target.value);
  };

  const recommendedVideos = [
    {
      img: "https://data.terabox.app/thumbnail/e3a600653ad6f4e57ad08455333cf6cc?fid=4398410163636-250528-394705659887225&time=1713862800&rt=pr&sign=FDTAER-DCb740ccc5511e5e8fedcff06b081203-8N6jgdjoJyBX4wJTCiEMrQCJz6w%3D&expires=10y&chkv=0&chkbd=0&chkpc=&dp-logid=331732789902036039&dp-callid=0&size=c850_u580&quality=100&vuk=4398410163636&ft=image",
      name: "Riverdance The Animated Adventure",
    },
    {
      img: "https://data.terabox.app/thumbnail/bd43ee53c32293e2cf121da6d434007a?fid=4398410110388-250528-1004086543231107&time=1713862800&rt=pr&sign=FDTAER-DCb740ccc5511e5e8fedcff06b081203-VmVGHrAWc8uZZneI3%2FotVf%2B5LAc%3D&expires=10y&chkv=0&chkbd=0&chkpc=&dp-logid=331732789902036039&dp-callid=0&size=c850_u580&quality=100&vuk=4398410110388&ft=image",
      name: "Don't Look Up",
    },
    {
      img: "https://data.terabox.app/thumbnail/1d4e71dbc6b3871360fa642a306d1d62?fid=4398410117556-250528-1118662345826114&time=1713862800&rt=pr&sign=FDTAER-DCb740ccc5511e5e8fedcff06b081203-v3ls4aCXSHjLEq179d3EnmYfDTU%3D&expires=10y&chkv=0&chkbd=0&chkpc=&dp-logid=331732789902036039&dp-callid=0&size=c850_u580&quality=100&vuk=4398410117556&ft=image",
      name: "Spider-Man No Way Home",
    },
    {
      img: "https://data.terabox.app/thumbnail/f51fde3c172ed90c62d8957b27c3be60?fid=4398410165172-250528-82854619755098&time=1713862800&rt=pr&sign=FDTAER-DCb740ccc5511e5e8fedcff06b081203-AU0cRKKF4HawiyMyowSTcM3iAxM%3D&expires=10y&chkv=0&chkbd=0&chkpc=&dp-logid=331732789902036039&dp-callid=0&size=c850_u580&quality=100&vuk=4398410165172&ft=image",
      name: "Mother Android",
    },
    {
      img: "https://data.terabox.app/thumbnail/1972aff93e098fef36bd883e6934c5e3?fid=4398410141108-250528-288598513543588&time=1713862800&rt=pr&sign=FDTAER-DCb740ccc5511e5e8fedcff06b081203-kVRUAl9wbsPEC5mpft0tS4ZUnJE%3D&expires=10y&chkv=0&chkbd=0&chkpc=&dp-logid=331732789902036039&dp-callid=0&size=c850_u580&quality=100&vuk=4398410141108&ft=image",
      name: "Risen",
    },
    {
      img: "https://data.terabox.app/thumbnail/b25265f7f34d6ee4a940df369782a535?fid=4398410149812-250528-645378127746942&time=1713862800&rt=pr&sign=FDTAER-DCb740ccc5511e5e8fedcff06b081203-2%2B%2BMo0bVeARRi9K8zpmJ6x3wX%2B8%3D&expires=10y&chkv=0&chkbd=0&chkpc=&dp-logid=331732789902036039&dp-callid=0&size=c850_u580&quality=100&vuk=4398410149812&ft=image",
      name: "The Matrix Resurrections ",
    },
    {
      img: "https://data.terabox.app/thumbnail/36eae2fbc2823c3aca62225954a6e4fb?fid=4398410152116-250528-767304822526108&time=1713862800&rt=pr&sign=FDTAER-DCb740ccc5511e5e8fedcff06b081203-5rbGas6gDSwdB9D6mDP3ZfH%2BLGA%3D&expires=10y&chkv=0&chkbd=0&chkpc=&dp-logid=331732789902036039&dp-callid=0&size=c850_u580&quality=100&vuk=4398410152116&ft=image",
      name: "Antlers",
    },
    {
      img: "https://data.terabox.app/thumbnail/12e1898bd4ab14b9c0c0b9a632d5018d?fid=4398410162100-250528-448648770066084&time=1713862800&rt=pr&sign=FDTAER-DCb740ccc5511e5e8fedcff06b081203-DPKfUMDLJvOk%2F7dQf%2BGirXcOe2M%3D&expires=10y&chkv=0&chkbd=0&chkpc=&dp-logid=331732789902036039&dp-callid=0&size=c850_u580&quality=100&vuk=4398410162100&ft=image",
      name: "Red Notice",
    },
    {
      img: "https://data.terabox.app/thumbnail/c3e1d6a739a99f01e5e69d0a7dff13d0?fid=4398410121140-250528-310493153837878&time=1713862800&rt=pr&sign=FDTAER-DCb740ccc5511e5e8fedcff06b081203-yFMdFbefpDV8BkuDj8yjKIKlBzM%3D&expires=10y&chkv=0&chkbd=0&chkpc=&dp-logid=331732789902036039&dp-callid=0&size=c850_u580&quality=100&vuk=4398410121140&ft=image",
      name: "Venom Let There Be Carnage ",
    }
  ];

  return (
    <div>
      <Navbar />
      <Container maxWidth="lg">
        <Box mt={4} mb={2}>
          <h2>{video?.name || "Loading Video..."}</h2>
        </Box>
        {video && (
          <Box sx={{ position: "relative" }} className="videoStreamDiv">
            {video?.format === "MP4" ? (
              <video width={"80%"} controls className="streamVideo">
                <source src={video?.url} type="video/mp4" />
                Your browser does not support HTML video.
              </video>
            ) : video?.format === "M3U8" ? (
              <>
                <video ref={videoRef} width={"80%"} controls className="streamVideo"></video>
                <section className="controls-section">
                  <div>
                    <label>Playback Speed:</label>
                    <select onChange={handlePlaybackSpeedChange}>
                      {[0.5, 1, 1.5, 2].map((speed) => (
                        <option key={speed} value={speed}>
                          {speed}x
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label>Volume:</label>
                    <input type="range" min="0" max="1" step="0.1" defaultValue="1" onChange={handleVolumeChange} />
                  </div>
                  {levels.length > 0 && (
                    <div>
                      <label>Quality:</label>
                      <select onChange={handleQualityChange}>
                        {levels.map((level, index) => (
                          <option key={index} value={index}>
                            {level.height}p
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {audioTracks.length > 0 && (
                    <div className="control-group">
                      <label>Audio Language:</label>
                      <select onChange={handleAudioTrackChange} className="form-select">
                        {audioTracks.map((track, index) => (
                          <option key={index} value={index}>
                            {track.name || `Track ${index + 1}`}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {subtitleTracks.length > 0 && (
                    <div>
                      <label>Subtitles:</label>
                      <select onChange={handleSubtitleTrackChange}>
                        <option value="-1">None</option>
                        {subtitleTracks.map((track, index) => (
                          <option key={index} value={index}>
                            {track.name || `Subtitle ${index + 1}`}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </section>
              </>
            ) : (
              <h1>No Valid URL</h1>
            )}
          </Box>
        )}
        <Box mt={5} mb={5}>
          <h2>Recommend</h2>
          <Box display="flex" gap="25px" flexWrap="wrap">
            {recommendedVideos.map((item, key) => (
              <Box key={key} className="recommend">
                <img
                  src={item.img}
                  alt={item.name}
                  style={{ width: "100%", borderRadius: 10 }}
                />
                <h4 style={{ marginTop: 10 }}>{item.name}</h4>
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </div>
  );
}

export default VideoPage;

// import React, { useEffect } from "react";
// import { ref, deleteObject } from "firebase/storage";
// import { fireStore, fireStorage } from "../firebase";
// import {
//   collection,
//   addDoc,
//   getDocs,
//   where,
//   query,
//   doc,
//   deleteDoc,
// } from "firebase/firestore";
// import { useParams } from "react-router-dom";
// import Navbar from "../components/navbar/Navbar";
// import { Box, Button, Container, Grid } from "@mui/material";

// function checkFileType(url) {
//   if (url.endsWith(".mp3")) {
//     return "MP3";
//   } else if (url.endsWith(".mp4")) {
//     return "MP4";
//   } else if (url.includes(".m3u8")) {
//     return "M3U8";
//   } else {
//     return "Other";
//   }
// }

// function VideoPage() {
//   const { id } = useParams();
//   const [video, setVideo] = React.useState(null);
//   async function getEvents() {
//     const q = query(
//       collection(fireStore, "products"),
//       where("uniqueId", "==", id)
//     );
//     const querySnapshot = await getDocs(q);
//     //   console.log(querySnapshot);
//     let event = null;

//     if (querySnapshot) {
//       querySnapshot.forEach((doc) => {
//         const data = doc.data();
//         event = { ...data, id: doc.id, format: checkFileType(data?.url) };
//       });
//     }
//     setVideo(event);
//   }

//   useEffect(() => {
//     getEvents();
//   }, [id]);

//   console.log("video", video);

//   const data_ = [
//     {
//       img: "https://data.terabox.app/thumbnail/e3a600653ad6f4e57ad08455333cf6cc?fid=4398410163636-250528-394705659887225&time=1713862800&rt=pr&sign=FDTAER-DCb740ccc5511e5e8fedcff06b081203-8N6jgdjoJyBX4wJTCiEMrQCJz6w%3D&expires=10y&chkv=0&chkbd=0&chkpc=&dp-logid=331732789902036039&dp-callid=0&size=c850_u580&quality=100&vuk=4398410163636&ft=image",
//       name: "Riverdance The Animated Adventure",
//     },
//     {
//       img: "https://data.terabox.app/thumbnail/bd43ee53c32293e2cf121da6d434007a?fid=4398410110388-250528-1004086543231107&time=1713862800&rt=pr&sign=FDTAER-DCb740ccc5511e5e8fedcff06b081203-VmVGHrAWc8uZZneI3%2FotVf%2B5LAc%3D&expires=10y&chkv=0&chkbd=0&chkpc=&dp-logid=331732789902036039&dp-callid=0&size=c850_u580&quality=100&vuk=4398410110388&ft=image",
//       name: "Don't Look Up",
//     },
//     {
//       img: "https://data.terabox.app/thumbnail/1d4e71dbc6b3871360fa642a306d1d62?fid=4398410117556-250528-1118662345826114&time=1713862800&rt=pr&sign=FDTAER-DCb740ccc5511e5e8fedcff06b081203-v3ls4aCXSHjLEq179d3EnmYfDTU%3D&expires=10y&chkv=0&chkbd=0&chkpc=&dp-logid=331732789902036039&dp-callid=0&size=c850_u580&quality=100&vuk=4398410117556&ft=image",
//       name: "Spider-Man No Way Home",
//     },
//     {
//       img: "https://data.terabox.app/thumbnail/f51fde3c172ed90c62d8957b27c3be60?fid=4398410165172-250528-82854619755098&time=1713862800&rt=pr&sign=FDTAER-DCb740ccc5511e5e8fedcff06b081203-AU0cRKKF4HawiyMyowSTcM3iAxM%3D&expires=10y&chkv=0&chkbd=0&chkpc=&dp-logid=331732789902036039&dp-callid=0&size=c850_u580&quality=100&vuk=4398410165172&ft=image",
//       name: "Mother Android",
//     },
//     {
//       img: "https://data.terabox.app/thumbnail/1972aff93e098fef36bd883e6934c5e3?fid=4398410141108-250528-288598513543588&time=1713862800&rt=pr&sign=FDTAER-DCb740ccc5511e5e8fedcff06b081203-kVRUAl9wbsPEC5mpft0tS4ZUnJE%3D&expires=10y&chkv=0&chkbd=0&chkpc=&dp-logid=331732789902036039&dp-callid=0&size=c850_u580&quality=100&vuk=4398410141108&ft=image",
//       name: "Risen",
//     },
//     {
//       img: "https://data.terabox.app/thumbnail/b25265f7f34d6ee4a940df369782a535?fid=4398410149812-250528-645378127746942&time=1713862800&rt=pr&sign=FDTAER-DCb740ccc5511e5e8fedcff06b081203-2%2B%2BMo0bVeARRi9K8zpmJ6x3wX%2B8%3D&expires=10y&chkv=0&chkbd=0&chkpc=&dp-logid=331732789902036039&dp-callid=0&size=c850_u580&quality=100&vuk=4398410149812&ft=image",
//       name: "The Matrix Resurrections ",
//     },
//     {
//       img: "https://data.terabox.app/thumbnail/36eae2fbc2823c3aca62225954a6e4fb?fid=4398410152116-250528-767304822526108&time=1713862800&rt=pr&sign=FDTAER-DCb740ccc5511e5e8fedcff06b081203-5rbGas6gDSwdB9D6mDP3ZfH%2BLGA%3D&expires=10y&chkv=0&chkbd=0&chkpc=&dp-logid=331732789902036039&dp-callid=0&size=c850_u580&quality=100&vuk=4398410152116&ft=image",
//       name: "Antlers",
//     },
//     {
//       img: "https://data.terabox.app/thumbnail/12e1898bd4ab14b9c0c0b9a632d5018d?fid=4398410162100-250528-448648770066084&time=1713862800&rt=pr&sign=FDTAER-DCb740ccc5511e5e8fedcff06b081203-DPKfUMDLJvOk%2F7dQf%2BGirXcOe2M%3D&expires=10y&chkv=0&chkbd=0&chkpc=&dp-logid=331732789902036039&dp-callid=0&size=c850_u580&quality=100&vuk=4398410162100&ft=image",
//       name: "Red Notice",
//     },
//     {
//       img: "https://data.terabox.app/thumbnail/c3e1d6a739a99f01e5e69d0a7dff13d0?fid=4398410121140-250528-310493153837878&time=1713862800&rt=pr&sign=FDTAER-DCb740ccc5511e5e8fedcff06b081203-yFMdFbefpDV8BkuDj8yjKIKlBzM%3D&expires=10y&chkv=0&chkbd=0&chkpc=&dp-logid=331732789902036039&dp-callid=0&size=c850_u580&quality=100&vuk=4398410121140&ft=image",
//       name: "Venom Let There Be Carnage ",
//     },
//   ];
//   console.log("video?.type ===== ", video?.format, video);
//   return (
//     <div>
//       <Navbar />

//       <Container maxWidth="lg">
//         <Box>
//           <h2>{video?.name}</h2>
//         </Box>
//         {video && (
//           <Box sx={{ position: "relative" }} className="videoStreamDiv">
//             {video?.format == "MP4" ? (
//               <video
//                 // height="320"
//                 width={"80%"}
//                 controls
//                 // poster={video?.imgUrl}
//                 className="streamVideo"
//               >
//                 <source src={video?.url} type="video/mp4" />
//                 Your browser does not support HTML video.
//               </video>
//             ) : video.format == "M3U8" ? (
//                 <>
//                   <video 
//                     id="video"
//                     width={"80%"}
//                     controls
//                     poster={video?.imgUrl}
//                     className="w-100 streamVideo"
//                     src={video?.url}
//                   ></video>
//                   <section className="container">
//                     <div id="controls-container" className="custom-video-controls"></div>
//                   </section>
//                 </>
//             ) : (
//               <h1>No Valid URL</h1>
//             )}
//             <div className="overlay">
//               <Button
//                 variant="contained"
//                 sx={{ backgroundColor: "#000", borderRadius: "8px" }}
//               >
//                 View in App
//               </Button>
//             </div>
//           </Box>
//         )}
//         <Box mt={5} mb={5}>
//           <h2>Recommend</h2>

//           <Box>
//             <div
//               style={{
//                 display: "flex",
//                 gap: "25px",
//                 flexWrap: "wrap",
//               }}
//               className="recommendations"
//             >
//               {data_.map((item, key) => {
//                 return (
//                   <Box className="recommend" key={key}>
//                     <div className="recommendiv">
//                       <img
//                         src={item?.img}
//                         style={{
//                           width: "100%",
//                           height: "100%",
//                           borderRadius: 10,
//                         }}
//                       />
//                     </div>
//                     <div>
//                       <h4
//                         style={{ margin: 0, marginTop: 10, fontWeight: "500" }}
//                       >
//                         {item?.name}
//                       </h4>
//                     </div>
//                   </Box>
//                 );
//               })}
//             </div>
//           </Box>
//         </Box>
//       </Container>
//     </div>
//   );
// }

// export default VideoPage;
