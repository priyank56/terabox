import React, { useEffect } from "react";
import { ref, deleteObject } from "firebase/storage";
import { fireStore, fireStorage } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  where,
  query,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { useParams } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import { Box, Button, Container, Grid } from "@mui/material";

function VideoPage() {
  const { id } = useParams();
  const [video, setVideo] = React.useState(null);
  async function getEvents() {
    const q = query(
      collection(fireStore, "products"),
      where("uniqueId", "==", id)
    );
    const querySnapshot = await getDocs(q);
    //   console.log(querySnapshot);
    let event = null;

    if (querySnapshot) {
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        event = { ...data, id: doc.id };
      });
    }
    setVideo(event);
  }

  useEffect(() => {
    getEvents();
  }, [id]);

  console.log("video", video);

  const data_ = [
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
    },
  ];

  return (
    <div>
      <Navbar />

      <Container maxWidth="lg">
        <Box>
          <h2>{video?.name}</h2>
        </Box>
        {video && (
          <Box sx={{ position: "relative" }} className="videoStreamDiv">
            {video && (
              <video
                // height="320"
                width={"80%"}
                controls
                poster={video?.imgUrl}
                className="streamVideo">
                <source src={video?.url} type="video/mp4" />
                Your browser does not support HTML video.
              </video>
            )}
            <div className="overlay">
              <Button
                variant="contained"
                sx={{ backgroundColor: "#000", borderRadius: "8px" }}>
                View in App
              </Button>
            </div>
          </Box>
        )}
        <Box mt={5} mb={5}>
          <h2>Recommend</h2>

          <Box>
            <div
              style={{
                display: "flex",
                gap: "25px",
                flexWrap: "wrap",
              }}
              className="recommendations">
              {data_.map((item) => {
                return (
                  <Box className="recommend">
                    <div className="recommendiv">
                      <img
                        src={item?.img}
                        style={{
                          width: "100%",
                          height: "100%",
                          borderRadius: 10,
                        }}
                      />
                    </div>
                    <div>
                      <h4
                        style={{ margin: 0, marginTop: 10, fontWeight: "500" }}>
                        {item?.name}
                      </h4>
                    </div>
                  </Box>
                );
              })}
            </div>
          </Box>
        </Box>
      </Container>
    </div>
  );
}

export default VideoPage;
