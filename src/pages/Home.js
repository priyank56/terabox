import React, { useEffect, useRef } from "react";
import logo from "../logo.svg";
import "../App.css";
import Navbar from "../components/navbar/Navbar";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Modal,
  Popover,
  Stack,
  Typography,
} from "@mui/material";
import {
  collection,
  addDoc,
  getDocs,
  where,
  query,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { fireStore, fireStorage } from "../firebase";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import FormModal from "../components/modal/Modal";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

function Home() {
  const [events, setEvents] = React.useState([]);
  const [data_, setData] = React.useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [updateEvent, setUpdateEvent] = React.useState(false);
  const handleClick = (event) => {
    setAnchorEl({ id: event?.id, open: true });
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const openEl = Boolean(anchorEl);
  const id = openEl ? "simple-popover" : undefined;

  async function getEvents() {
    const querySnapshot = await getDocs(collection(fireStore, "products"));
    //   console.log(querySnapshot);
    let event = [];

    if (querySnapshot) {
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        event.push({ ...data, id: doc.id });
      });
    }
    setEvents([
      ...event.sort((a, b) => new Date(b?.createdAt) - new Date(a?.createdAt)),
    ]);
  }

  useEffect(() => {
    getEvents();
  }, []);

  const onDelete = async (data, id) => {
    await deleteDoc(doc(fireStore, "products", id));
    const desertRef = ref(fireStorage, `/images/${data?.fileName}`);
    // Delete the file
    deleteObject(desertRef)
      .then(() => {
        // File deleted successfully
        alert("Deleted Successfully!");
      })
      .catch((error) => {
        // Uh-oh, an error occurred!
      });
    getEvents();
  };

  const divRef = useRef(null);

  const handleOutsideClick = (e) => {
    if (divRef.current && !divRef.current.contains(e.target)) {
      // Click is outside the div. Close or toggle the state as needed.
      setAnchorEl(null);
    }
  };

  useEffect(() => {
    // Add a click event listener to the entire document.
    document.addEventListener("click", handleOutsideClick);

    // Clean up the event listener when the component unmounts.
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  return (
    <div>
      <Navbar />
      <Container maxWidth="xl">
        <Box
          sx={{ marginTop: "30px", display: "flex", justifyContent: "center" }}
          data-aos="fade-up">
          <Grid
            container
            spacing={3}
            // direction={!matchesMd ? "column" : "row"}
            alignItems="center">
            <Grid item lg={3} md={6} sm={12}>
              <Box sx={{ mx: "auto", height: "100%" }}>
                <Card
                  sx={{
                    height: "100%",
                    display: "grid",
                    placeItems: "center",
                    cursor: "pointer",
                    padding: "35px",
                  }}
                  onClick={() => {
                    setOpen(true);
                  }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "10px",
                    }}>
                    <AddCircleOutlineOutlinedIcon sx={{ fontSize: "80px" }} />
                    <Typography variant="title">Add Image</Typography>
                  </Box>
                </Card>
              </Box>
            </Grid>

            {events?.map((data, index) => {
              return (
                // <button type="button" onClick={() => console.log(data)}>
                //   submit
                // </button>
                <Grid
                  item
                  lg={3}
                  md={6}
                  sm={12}
                  onClick={async () => {
                    await navigator.clipboard.writeText(
                      "https://tera-fd6c3.web.app/v/" + data?.uniqueId
                    );
                    alert("Copied!");
                  }}>
                  <Box sx={{ mx: "auto" }}>
                    <Card
                      sx={{
                        // mL: 2,
                        // mx: "auto",
                        boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                        position: "relative",
                      }}
                      key={index}>
                      <Box
                        sx={{
                          position: "absolute",
                          right: "10px",
                          top: "5px",
                          cursor: "pointer",
                        }}
                        aria-describedby={data?.id}
                        onClick={() => {
                          handleClick(data);
                        }}>
                        <MoreHorizOutlinedIcon />
                      </Box>
                      {anchorEl?.id === data?.id && anchorEl?.open && (
                        <div
                          id={data?.id}
                          open={openEl}
                          anchorEl={anchorEl}
                          onClose={handleClose}
                          anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right",
                          }}
                          transformOrigin={{
                            horizontal: "right",
                          }}
                          style={{
                            position: "absolute",
                            top: 28,
                            right: 0,
                            background: "#fff",
                            boxShadow:
                              "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                          }}>
                          <Box p={1}>
                            <Stack
                              spacing={1}
                              mb={1}
                              direction="row"
                              sx={{ cursor: "pointer" }}
                              onClick={() => {
                                setOpen(true);
                                // setData({ ...data });
                                setData(data);
                                setUpdateEvent(true);
                                handleClose(data);
                              }}>
                              <EditOutlinedIcon fontSize="small" />
                              <Typography>Edit</Typography>
                            </Stack>
                            <Stack
                              spacing={1}
                              direction="row"
                              sx={{ cursor: "pointer" }}
                              onClick={() => {
                                onDelete(data, data?.id);
                                handleClose();
                              }}>
                              <DeleteOutlineOutlinedIcon fontSize="small" />
                              <Typography>Delete</Typography>
                            </Stack>
                          </Box>
                        </div>
                      )}
                      <CardMedia sx={{ height: 280 }} image={data?.imgUrl}>
                        {/* <video
                  controls
                  width={"100%"}
                  height={"100%"}
                  // style={{ borderRadius: "12px" }}
                >
                  <source src={videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video> */}
                      </CardMedia>

                      <CardContent>
                        <Typography gutterBottom variant="body1">
                          {data?.name ? data?.name : ""}
                        </Typography>
                        {/* <Typography gutterBottom variant="body1" color="text.secondary">
                  {position ? position : ""}
                </Typography> */}
                        <Typography
                          variant="body2"
                          color={"rgb(96, 105, 123)"}
                          sx={{ fontFamily: "'Inter', sans-serif!important" }}>
                          {data?.url ? data?.url : ""}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </Container>

      <FormModal
        open={open}
        setOpen={setOpen}
        events={events}
        setEvents={setEvents}
        updateEvent={updateEvent}
        updateEventData={data_}
        setUpdateEvent={setUpdateEvent}
      />
    </div>
  );
}

export default Home;
