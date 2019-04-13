let classifier;
let imageObject;
let imagePath = 'images/camel.jpg';

function setup() {
  noCanvas();
  imageObject = createImg(imagePath, imageReady);
}

function imageReady(){
  classifier = ml5.imageClassifier('MobileNet', modelReady);
}

function modelReady(){
  select('#status').html('MobileNetのロード完了');
  classifier.predict(imageObject ,gotResult);
}

function gotResult(err, results) {
  if (err) {
    console.error(err);
  }
  select('#label').html(results[0].label);
  select('#confidence').html(nf(results[0].confidence, 1, 2));
}