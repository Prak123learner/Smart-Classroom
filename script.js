const video = document.getElementById('video');
const startRecognitionButton = document.getElementById('startRecognition');
const statusElement = document.getElementById('status');
const attendanceForm = document.getElementById('attendanceForm');

// Load models for face detection and recognition
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(startVideo);

// Start video streaming from the webcam
function startVideo() {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      video.srcObject = stream;
      video.onloadedmetadata = () => {
        video.play();
      };
    })
    .catch(err => {
      console.error("Error accessing webcam: ", err);
      statusElement.textContent = "Error accessing webcam. Please check permissions.";
    });
}

// Recognize face and mark attendance
startRecognitionButton.addEventListener('click', async () => {
  const labeledDescriptors = await loadLabeledImages();
  const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.6);

  video.addEventListener('play', () => {
    const canvas = faceapi.createCanvasFromMedia(video);
    document.body.append(canvas);
    const displaySize = { width: video.width, height: video.height };
    faceapi.matchDimensions(canvas, displaySize);

    setInterval(async () => {
      const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptors();
      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
      faceapi.draw.drawDetections(canvas, resizedDetections);

      const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor));
      results.forEach((result, i) => {
        const box = resizedDetections[i].detection.box;
        const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() });
        drawBox.draw(canvas);

        // If a known face is recognized, mark attendance
        if (result.label !== 'unknown') {
          const name = result.label;
          const date = new Date().toLocaleDateString();
          const time = new Date().toLocaleTimeString();
          document.getElementById('name').value = name;
          document.getElementById('date').value = date;
          document.getElementById('time').value = time;
          attendanceForm.submit();
          statusElement.textContent = 'Attendance marked for ' + name;
        }
      });
    }, 100);
  });
});

// Load labeled images for face recognition
function loadLabeledImages() {
  const labels = ['Rishabh', 'Alex', 'OtherStudent'];  // Add more student names
  return Promise.all(
    labels.map(async label => {
      const descriptions = [];
      for (let i = 1; i <= 2; i++) {
        const img = await faceapi.fetchImage(`/labeled_images/${label}/${i}.jpg`);
        const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
        descriptions.push(detections.descriptor);
      }
      return new faceapi.LabeledFaceDescriptors(label, descriptions);
    })
  );
}
