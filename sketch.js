let video;
let bodyPose;

let poses = [];

let shahrukh;
let glasses;
let cigar;


// ======================================
// PRELOAD
// ======================================

function preload() {

  // Load BodyPose
  bodyPose = ml5.bodyPose();

  // Load images
  shahrukh = loadImage("images/shahrukh.png");

  glasses = loadImage("images/spects.png");

  cigar = loadImage("images/cigar.png");
}


// ======================================
// SETUP
// ======================================

function setup() {

  createCanvas(640, 480);

  // Create webcam
  video = createCapture(VIDEO);

  video.size(640, 480);

  // Hide original video
  video.hide();

  // Start BodyPose
  bodyPose.detectStart(video, gotPoses);

  console.log("BodyPose started");
}


// ======================================
// RECEIVE POSES
// ======================================

function gotPoses(results) {

  poses = results;

}


// ======================================
// DRAW
// ======================================

function draw() {

  background(0);


  // ==================================
  // MIRRORED WEBCAM
  // ==================================

  push();

  translate(width, 0);

  scale(-1, 1);

  image(video, 0, 0, width, height);

  pop();


  // ==================================
  // PERSON DETECTED
  // ==================================

  if (poses.length > 0) {

    let pose = poses[0];

    // Draw skeleton
    drawSkeleton(pose);

    // Draw keypoints
    drawKeypoints(pose);

    // Shahrukh face
    drawShahrukh(pose);

    // Sunglasses
    drawGlasses(pose);

    // Cigar
    drawCigar(pose);

  }

}


// ======================================
// DRAW KEYPOINTS
// ======================================

function drawKeypoints(pose) {

  fill(255, 0, 0);

  noStroke();


  for (let kp of pose.keypoints) {

    if (kp.confidence > 0.5) {

      let x = width - kp.x;

      let y = kp.y;

      circle(x, y, 8);

    }

  }

}


// ======================================
// DRAW SKELETON
// ======================================

function drawSkeleton(pose) {

  stroke(0, 255, 0);

  strokeWeight(3);


  let nose = getPoint(pose, "nose");

  let leftShoulder =
    getPoint(pose, "left_shoulder");

  let rightShoulder =
    getPoint(pose, "right_shoulder");

  let leftElbow =
    getPoint(pose, "left_elbow");

  let rightElbow =
    getPoint(pose, "right_elbow");

  let leftWrist =
    getPoint(pose, "left_wrist");

  let rightWrist =
    getPoint(pose, "right_wrist");

  let leftHip =
    getPoint(pose, "left_hip");

  let rightHip =
    getPoint(pose, "right_hip");

  let leftKnee =
    getPoint(pose, "left_knee");

  let rightKnee =
    getPoint(pose, "right_knee");

  let leftAnkle =
    getPoint(pose, "left_ankle");

  let rightAnkle =
    getPoint(pose, "right_ankle");


  // Head

  drawLine(nose, leftShoulder);

  drawLine(nose, rightShoulder);


  // Shoulders

  drawLine(
    leftShoulder,
    rightShoulder
  );


  // Left arm

  drawLine(
    leftShoulder,
    leftElbow
  );

  drawLine(
    leftElbow,
    leftWrist
  );


  // Right arm

  drawLine(
    rightShoulder,
    rightElbow
  );

  drawLine(
    rightElbow,
    rightWrist
  );


  // Body

  drawLine(
    leftShoulder,
    leftHip
  );

  drawLine(
    rightShoulder,
    rightHip
  );

  drawLine(
    leftHip,
    rightHip
  );


  // Left leg

  drawLine(
    leftHip,
    leftKnee
  );

  drawLine(
    leftKnee,
    leftAnkle
  );


  // Right leg

  drawLine(
    rightHip,
    rightKnee
  );

  drawLine(
    rightKnee,
    rightAnkle
  );

}


// ======================================
// GET BODY KEYPOINT
// ======================================

function getPoint(pose, name) {

  for (let kp of pose.keypoints) {

    if (
      kp.name === name &&
      kp.confidence > 0.5
    ) {

      return kp;

    }

  }

  return null;

}


// ======================================
// DRAW BODY LINE
// ======================================

function drawLine(a, b) {

  if (a && b) {

    let x1 = width - a.x;

    let y1 = a.y;


    let x2 = width - b.x;

    let y2 = b.y;


    line(
      x1,
      y1,
      x2,
      y2
    );

  }

}


// ======================================
// SHAHRUKH FACE FILTER
// ======================================

function drawShahrukh(pose) {

  let leftEye =
    getPoint(pose, "left_eye");

  let rightEye =
    getPoint(pose, "right_eye");

  let nose =
    getPoint(pose, "nose");


  if (
    !leftEye ||
    !rightEye ||
    !nose
  ) {

    return;

  }


  // Mirror eye positions

  let x1 =
    width - leftEye.x;

  let y1 =
    leftEye.y;


  let x2 =
    width - rightEye.x;

  let y2 =
    rightEye.y;


  // Center of face

  let centerX =
    (x1 + x2) / 2;


  let centerY =
    (y1 + y2) / 2;


  // Distance between eyes

  let eyeDistance =
    dist(
      x1,
      y1,
      x2,
      y2
    );


  // Face size

  let faceWidth =
    eyeDistance * 4.0;


  let faceHeight =
    faceWidth *
    shahrukh.height /
    shahrukh.width;


  // Face rotation

  let angle =
    atan2(
      y2 - y1,
      x2 - x1
    );


  push();

  translate(
    centerX,
    centerY + faceHeight * 0.10
  );

  rotate(angle);

  imageMode(CENTER);

  image(
    shahrukh,
    0,
    0,
    faceWidth,
    faceHeight
  );

  pop();

}


// ======================================
// SUNGLASSES
// ======================================

function drawGlasses(pose) {

  let leftEye =
    getPoint(pose, "left_eye");

  let rightEye =
    getPoint(pose, "right_eye");


  if (
    !leftEye ||
    !rightEye
  ) {

    return;

  }


  // Mirror coordinates

  let x1 =
    width - leftEye.x;

  let y1 =
    leftEye.y;


  let x2 =
    width - rightEye.x;

  let y2 =
    rightEye.y;


  // Center between eyes

  let centerX =
    (x1 + x2) / 2;


  let centerY =
    (y1 + y2) / 2;


  // Eye distance

  let eyeDistance =
    dist(
      x1,
      y1,
      x2,
      y2
    );


  // Glasses size

  let glassesWidth =
    eyeDistance * 3.0;


  let glassesHeight =
    glassesWidth *
    glasses.height /
    glasses.width;


  // Rotation

  let angle =
    atan2(
      y2 - y1,
      x2 - x1
    );


  push();

  translate(
    centerX,
    centerY
  );

  rotate(angle);

  imageMode(CENTER);

  image(
    glasses,
    0,
    0,
    glassesWidth,
    glassesHeight
  );

  pop();

}


// ======================================
// CIGAR
// ======================================

function drawCigar(pose) {

  let nose =
    getPoint(pose, "nose");


  if (!nose) {

    return;

  }


  let leftEye =
    getPoint(pose, "left_eye");

  let rightEye =
    getPoint(pose, "right_eye");


  if (
    !leftEye ||
    !rightEye
  ) {

    return;

  }


  // Mirror coordinates

  let eyeX1 =
    width - leftEye.x;

  let eyeY1 =
    leftEye.y;


  let eyeX2 =
    width - rightEye.x;

  let eyeY2 =
    rightEye.y;


  // Face center

  let centerX =
    (eyeX1 + eyeX2) / 2;


  let centerY =
    (eyeY1 + eyeY2) / 2;


  // Eye distance

  let eyeDistance =
    dist(
      eyeX1,
      eyeY1,
      eyeX2,
      eyeY2
    );


  // Cigar size

  let cigarWidth =
    eyeDistance * 2.2;


  let cigarHeight =
    cigarWidth *
    cigar.height /
    cigar.width;


  // Cigar position
  // Below the nose

  let cigarX =
    width - nose.x +
    eyeDistance * 0.45;


  let cigarY =
    nose.y +
    eyeDistance * 0.65;


  // Face angle

  let angle =
    atan2(
      eyeY2 - eyeY1,
      eyeX2 - eyeX1
    );


  push();

  translate(
    cigarX,
    cigarY
  );

  rotate(angle);

  imageMode(CENTER);

  image(
    cigar,
    0,
    0,
    cigarWidth,
    cigarHeight
  );

  pop();

}