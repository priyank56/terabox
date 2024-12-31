// document.addEventListener("DOMContentLoaded", () => {
//   const video = document.getElementById("video");
//   const streamUrlInput = document.getElementById("stream-url");
//   const playButton = document.getElementById("play-button");
//   const controlsContainer = document.getElementById("controls-container");
//   let hls;

//   // Function to setup HLS.js and load the video
//   function setupHLS(url) {
//     if (hls) {
//       hls.destroy(); // Clean up previous instance
//     }

//     if (Hls.isSupported()) {
//       hls = new Hls();
//       hls.loadSource(url);
//       hls.attachMedia(video);

//       hls.on(Hls.Events.MANIFEST_PARSED, () => {
//         setupQualitySelector(hls.levels);
//         startAutoplay(); // Attempt autoplay after the manifest is parsed
//       });

//       hls.on(Hls.Events.AUDIO_TRACKS_UPDATED, (event, data) => {
//         setupAudioTracks(data.audioTracks);
//       });

//       hls.on(Hls.Events.SUBTITLE_TRACKS_UPDATED, (event, data) => {
//         setupSubtitleTracks(data.subtitleTracks);
//       });
//     } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
//       video.src = url;
//       startAutoplay(); // Attempt autoplay directly
//     } else {
//       showErrorMessage("HLS is not supported in this browser.");
//     }
//   }

//   // Function to attempt autoplay
//   function startAutoplay() {
//     video.play().catch((error) => {
//       console.warn("Autoplay failed:", error);
//       showErrorMessage(
//         "Autoplay is blocked by your browser. Please click 'Play' to start."
//       );
//     });
//   }

//   // Parse URL for 'hls' parameter and auto-play
//   const urlParams = new URLSearchParams(window.location.search);
//   const hlsParam = urlParams.get("hls");
//   if (hlsParam) {
//     streamUrlInput.value = hlsParam; // Prefill input
//     controlsContainer.innerHTML = ""; // Clear controls for new video
//     setupHLS(hlsParam);
//     // setupPlaybackSpeedControl();
//     // setupVolumeControl();
//   }

//   playButton?.addEventListener("click", () => {
//     const url = streamUrlInput.value.trim();
//     if (!url) {
//       showErrorMessage("Please enter a valid M3U8 URL.");
//       return;
//     }

//     controlsContainer.innerHTML = ""; // Clear controls for new video
//     setupHLS(url);
//     setupPlaybackSpeedControl();
//     // setupVolumeControl();
//   });

//   // Function to display error messages
//   function showErrorMessage(message) {
//     const errorContainer = document.createElement("div");
//     errorContainer.className = "alert alert-danger mt-3";
//     errorContainer.textContent = message;

//     document.body.insertBefore(errorContainer, document.body.firstChild);

//     setTimeout(() => errorContainer.remove(), 5000);
//   }

//   // Quality Selector
//   function setupQualitySelector(levels) {
//     const qualityGroup = document.createElement("div");
//     qualityGroup.className = "control-group";

//     const qualityLabel = document.createElement("label");
//     qualityLabel.textContent = "Quality:";
//     qualityGroup.appendChild(qualityLabel);

//     const qualitySelector = document.createElement("select");
//     qualitySelector.innerHTML = levels
//       .map(
//         (level, index) => `<option value="${index}">${level.height}p</option>`
//       )
//       .join("");
//     qualitySelector?.addEventListener("change", (e) => {
//       hls.currentLevel = parseInt(e.target.value);
//     });

//     qualityGroup.appendChild(qualitySelector);
//     controlsContainer.appendChild(qualityGroup);
//     setupPlaybackSpeedControl();
//     // setupVolumeControl();
//   }

//   // Audio Track Selector
//   function setupAudioTracks(audioTracks) {
//     const audioGroup = document.createElement("div");
//     audioGroup.className = "control-group";

//     const audioLabel = document.createElement("label");
//     audioLabel.textContent = "Audio Language:";
//     audioGroup.appendChild(audioLabel);

//     const audioSelector = document.createElement("select");
//     audioSelector.innerHTML = audioTracks
//       .map(
//         (track, index) =>
//           `<option value="${index}">${
//             track.name || `Track ${index + 1}`
//           }</option>`
//       )
//       .join("");
//     audioSelector.addEventListener("change", (e) => {
//       hls.audioTrack = parseInt(e.target.value);
//     });

//     audioGroup.appendChild(audioSelector);
//     controlsContainer.appendChild(audioGroup);
//     setupVolumeControl();
//   }

//   // Subtitle Track Selector
//   function setupSubtitleTracks(subtitleTracks) {
//     const subtitleGroup = document.createElement("div");
//     subtitleGroup.className = "control-group";

//     const subtitleLabel = document.createElement("label");
//     subtitleLabel.textContent = "Subtitles:";
//     subtitleGroup.appendChild(subtitleLabel);

//     const subtitleSelector = document.createElement("select");
//     subtitleSelector.innerHTML =
//       `<option value="-1">None</option>` +
//       subtitleTracks
//         .map(
//           (track, index) => `<option value="${index}">${track.name}</option>`
//         )
//         .join("");
//     subtitleSelector.addEventListener("change", (e) => {
//       hls.subtitleTrack = parseInt(e.target.value);
//     });

//     subtitleGroup.appendChild(subtitleSelector);
//     controlsContainer.appendChild(subtitleGroup);
//   }

//   // Playback Speed Control
//   // Playback Speed Control
// function setupPlaybackSpeedControl() {
//     const speedGroup = document.createElement("div");
//     speedGroup.className = "control-group";

//     const speedLabel = document.createElement("label");
//     speedLabel.textContent = "Playback Speed:";
//     speedGroup.appendChild(speedLabel);

//     const speedControl = document.createElement("select");
//     const speeds = [0.5, 1, 1.5, 2];
//     speeds.forEach((speed) => {
//         const option = document.createElement("option");
//         option.value = speed;
//         option.textContent = `${speed}x`;
//         if (speed === 1) option.selected = true; // Set 1x as default
//         speedControl.appendChild(option);
//     });

//     speedControl.addEventListener("change", (e) => {
//         video.playbackRate = parseFloat(e.target.value);
//     });

//     speedGroup.appendChild(speedControl);
//     controlsContainer.appendChild(speedGroup);
// }

//   // Volume Control
//   function setupVolumeControl() {
//     const volumeControl = document.createElement("input");
//     volumeControl.type = "range";
//     volumeControl.min = "0";
//     volumeControl.max = "1";
//     volumeControl.step = "0.1";
//     volumeControl.value = "1";
//     volumeControl.className = "form-range mb-2";
//     volumeControl.addEventListener("input", (e) => {
//       video.volume = parseFloat(e.target.value);
//     });

//     controlsContainer.appendChild(volumeControl);
//   }

//   // Event Listeners
//   playButton?.addEventListener("click", () => {
//     const url = streamUrlInput.value.trim();
//     if (!url) {
//         showErrorMessage("Please enter a valid M3U8 URL.");
//         return;
//     }
//     controlsContainer.innerHTML = ""; // Clear controls for new video
//     setupHLS(url);
//     // setupPlaybackSpeedControl();
//     // setupVolumeControl();
//   });
// });
