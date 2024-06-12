import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputLabel,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import uploadImg from "../../assets/images/cloud-upload-regular-240.png";
import {
  collection,
  addDoc,
  getDocs,
  where,
  query,
  updateDoc,
  doc,
} from "firebase/firestore";
import { fireStore, fireStorage } from "../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import "./modal.css";
import CloseIcon from "@mui/icons-material/Close";

const FormModal = (props) => {
  const {
    open,
    setOpen,
    events,
    setEvents,
    updateEvent,
    updateEventData,
    setUpdateEvent,
  } = props;
  const [clickSave, setClickSave] = React.useState(false);
  const [percent, setPercent] = React.useState(0);
  const [file, setFile] = React.useState("");
  const [error, setError] = React.useState({
    img: false,
    title: false,
  });
  const [state, setstate] = useState("");
  const [eventData, setEventData] = useState({
    fileName: "",
    imgUrl: "",
    url: "",
    name: "",
    tags: [],
  });
  const handleClose = () => {
    setOpen(false);
    !updateEvent
      ? setstate("")
      : setstate(updateEventData?.imgUrl ? updateEventData?.imgUrl : "");
    !updateEvent &&
      setEventData({
        fileName: "",
        imgUrl: "",
        url: "",
        name: "",
        tags: [],
      });
    setError({
      img: false,
      title: false,
    });
    setFile("");
    setClickSave(false);
    setUpdateEvent(false);
  };

  const loadFile = (event) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
      setstate(URL.createObjectURL(event.target.files[0]));
      console.log(URL.createObjectURL(event.target.files[0]));
    }
  };

  const generateUniqueId = () => {
    let id = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < 10; i++) {
      id += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return id;
  };

  const handleSave = async (value) => {
    const uniqueId = generateUniqueId();
    if (updateEvent) {
      setClickSave(true);
      if (eventData.title === "") {
        setError({
          title: eventData.title === "" ? true : false,
        });
        return;
      }
      if (file !== "") {
        const miliSeconds =
          new Date().getMilliseconds() + new Date().getMinutes();
        const storageRef = ref(
          fireStorage,
          `/images/${file?.name}${miliSeconds}`
        );
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const percent = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            // update progress
            setPercent(percent);
          },
          (err) => console.log(err),
          () => {
            // download url
            getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
              let docRef;
              if (url) {
                docRef = await updateDoc(
                  doc(fireStore, "products", eventData?.id),
                  eventData
                );

                const indexOfEvent = events?.findIndex(
                  (data) => data?.id === eventData?.id
                );
                events[indexOfEvent] = eventData;
                events[indexOfEvent].imgUrl = url;
                setEvents([...events]);
              }
              setOpen(false);
              setClickSave(false);
              setError({
                img: false,
                title: false,
              });
              setstate("");
              setFile("");
            });
          }
        );
        setUpdateEvent(false);
      } else {
        const docRef = await updateDoc(
          doc(fireStore, "products", eventData?.id),
          eventData
        );
        const indexOfEvent = events?.findIndex(
          (data) => data?.id === eventData?.id
        );
        events[indexOfEvent] = eventData;

        setEvents([...events]);
        setOpen(false);
        setClickSave(false);
        setError({
          img: false,
          title: false,
        });
        setstate("");
        setFile("");
      }
    } else {
      if (file === "" && eventData.url === "") {
        setError({
          img: file === "" ? true : false,
          title: eventData.title === "" ? true : false,
        });
        return;
      }
      setClickSave(true);
      const miliSeconds =
        new Date().getMilliseconds() + new Date().getMinutes();
      const storageRef = ref(
        fireStorage,
        `/images/${file?.name}${miliSeconds}`
      );
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const percent = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );

          // update progress
          setPercent(percent);
        },
        (err) => console.log(err),
        () => {
          // download url
          getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
            let docRef;
            if (url) {
              docRef = await addDoc(collection(fireStore, "products"), {
                uniqueId: uniqueId,
                fileName: file?.name ? file?.name + miliSeconds : "",
                imgUrl: url ? url : "",
                url: eventData?.url ? eventData?.url : "",
                name: eventData?.name ? eventData?.name : "",
                tags: eventData?.tags ? eventData?.tags : [],
                createdAt: new Date(),
              });
              setEvents([
                {
                  id: docRef?.id,
                  fileName: file?.name ? file?.name + miliSeconds : "",
                  imgUrl: url ? url : "",
                  url: eventData?.url ? eventData?.url : "",
                  name: eventData?.name ? eventData?.name : "",
                  uniqueId: uniqueId,
                  tags: eventData?.tags ? eventData?.tags : [],
                },
                ...events,
              ]);
              setEventData({
                fileName: "",
                imgUrl: "",
                url: "",
                name: "",
                tags: [],
              });
            }
            setOpen(false);
            setClickSave(false);
            setError({
              img: false,
              title: false,
            });
            setstate("");
            setFile("");
          });
        }
      );
    }
  };

  //   const onFileDrop = (e) => {
  //     const newFile = e.target.files[0];
  //     if (newFile) {
  //         const updatedList = [newFile];
  //         setFileList(updatedList);
  //         props.onFileChange(updatedList);
  //     }
  // }

  useEffect(() => {
    if (updateEvent) {
      setEventData({
        id: updateEventData?.id ? updateEventData?.id : "",
        fileName: updateEventData?.fileName ? updateEventData?.fileName : "",
        imgUrl: updateEventData?.imgUrl ? updateEventData?.imgUrl : "",
        url: updateEventData?.url ? updateEventData?.url : "",
        name: updateEventData?.name ? updateEventData?.name : "",
        tags: updateEventData?.tags ? updateEventData?.tags : [],
      });
      setstate(updateEventData?.imgUrl ? updateEventData?.imgUrl : "");
    }
  }, [updateEventData]);

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  const addTags = (event) => {
    if (event.key === "Enter" && event.target.value !== "") {
      setEventData({
        ...eventData,
        tags: [...eventData.tags, event.target.value],
      });
      event.target.value = "";
    }
  };

  const removeTags = (index) => {
    setEventData({
      ...eventData,
      tags: [
        ...eventData.tags.filter(
          (tag) => eventData.tags.indexOf(tag) !== index
        ),
      ],
    });
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle sx={{ textAlign: "center" }}>
          {updateEvent ? "Update Product" : "Add Product"}
        </DialogTitle>
        <DialogContent>
          <InputLabel
            sx={{
              display: "flex",
              alignContent: "start",
              fontWeight: 700,
              marginLeft: "21px",
            }}>
            Upload Image
          </InputLabel>
          {/* <Typography variant="body2" textAlign={"center"} mt={2}>
            {" "}
            468 x 280 is the perfect size for an event image.{" "}
          </Typography> */}
          {!state ? (
            <>
              <Box
                sx={{
                  // margin: "20px",
                  mt: 1,
                  display: "flex",
                  justifyContent: "center",
                }}>
                <div className="drop-file-input">
                  <div className="drop-file-input__label">
                    <img src={uploadImg} alt="" />
                    <p>Upload your files here</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    value=""
                    onChange={loadFile}
                  />
                </div>
              </Box>
              {error?.img && (
                <Typography
                  sx={{ ml: 2, mt: 1, color: "#d32f2f" }}
                  variant="body2">
                  Please upload image file
                </Typography>
              )}
            </>
          ) : (
            <>
              <Box
                sx={{
                  // margin: "20px",
                  mt: 2,
                  display: "flex",
                  justifyContent: "center",
                }}>
                <img
                  src={state ? state : ""}
                  id="output"
                  alt="test"
                  className="uploadImg"
                  style={{
                    height: "196px",
                    width: "396px",
                    borderRadius: "10px",
                  }}
                />
              </Box>
              {updateEvent && (
                <Box sx={{ ml: "auto", width: "100%", textAlign: "end" }}>
                  <Button
                    variant="outlined"
                    sx={{ mt: 2, ml: "auto" }}
                    size="small"
                    component="label">
                    Edit Image
                    <VisuallyHiddenInput type="file" onChange={loadFile} />
                  </Button>
                </Box>
              )}
            </>
          )}

          <Box sx={{ mt: 3 }}>
            <Box sx={{ margin: "10px" }}>
              {/* <InputLabel
                  sx={{
                    display: "flex",
                    alignContent: "start",
                    fontWeight: 700,
                  }}
                >
                  Title
                </InputLabel> */}
            </Box>
            <Box>
              <TextField
                required
                id="title"
                name="title"
                label="Url"
                fullWidth
                size="small"
                autoComplete="off"
                variant="outlined"
                error={error.title}
                helperText={error.title ? "Please Enter Url" : ""}
                onChange={(e) => {
                  setEventData({ ...eventData, url: e.target.value });
                }}
                value={eventData?.url}
              />
            </Box>

            {/* <Box sx={{ margin: "10px" }}>
              <InputLabel
                sx={{
                  display: "flex",
                  alignContent: "start",
                  fontWeight: 700,
                }}
              >
                Name
              </InputLabel>
            </Box> */}
            <Box sx={{ mt: 3 }}>
              <TextField
                id="outlined-multiline-static"
                label="Enter Name"
                multiline
                fullWidth
                size="small"
                // rows={4}
                onChange={(e) => {
                  setEventData({ ...eventData, name: e.target.value });
                }}
                value={eventData?.name}
              />
            </Box>

            <Box sx={{ mt: 3 }}>
              <div className="tags-input">
                <ul id="tags">
                  {eventData?.tags?.length > 0 &&
                    eventData?.tags?.map((tag, index) => (
                      <li key={index} className="tag">
                        <span>{tag}</span>
                        <CloseIcon
                          className="tag-close-icon"
                          onClick={() => removeTags(index)}
                        />
                      </li>
                    ))}
                </ul>
                <input
                  type="text"
                  placeholder="Press Enter to Add Tags"
                  onKeyUp={(event) => addTags(event)}
                />
              </div>
            </Box>
          </Box>

          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              onClick={handleSave}
              autoFocus
              disabled={clickSave ? true : false}>
              Save
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FormModal;
