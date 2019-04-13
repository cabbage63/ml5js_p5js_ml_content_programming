let poseNet; // PoseNetの学習済みモデル
let videoObject; // video要素を指すp5.Element
let videoPath = 'videos/action.mp4'; // 読み込む動画ファイルへのパス
let poses = []; // 姿勢情報を格納する変数

// input要素に紐づく変数
let isOverlaid; // キーポイントとスケルトンを元画像に重畳して表示するかどうか
let enableSkeleton; // スケルトンを描画するかどうか
let enableKeypoints; // キーポイントを描画するかどうか
let skeletonColor; // スケルトンの色
let keypointsColor; // キーポイントの色
let skeletonStrokeWeight; // スケルトンの太さ
let keyponitsRadius; // キーポイントとして描画する円の半径

function setup() {
  // video要素をBodyに追加
  videoObject = createVideo(videoPath, videoReady);

  // 各input要素に対してイベントハンドラを設定
  select('#overlaid').input(inputChanged);
  select('#skeleton').input(inputChanged);
  select('#keypoints').input(inputChanged);
  select('#skeletonColor').input(inputChanged);
  select('#keypointsColor').input(inputChanged);
  select('#skeletonStrokeWeight').input(inputChanged);
  select('#keypointsRadius').input(inputChanged);

  // input要素の初期状態を変数に反映
  updateInputValue();
}

// 動画の読み込みが完了したら呼び出される関数
function videoReady(){
  // <video>にコントロールを表示
  videoObject.showControls();
  // <video>と同じサイズの<canvas>を作成
  createCanvas(videoObject.width, videoObject.height);
  // PoseNetのインスタンスを生成
  poseNet = ml5.poseNet(videoObject, modelReady);
}

// PoseNetのモデルの読み込みが完了したら呼び出される関数
function modelReady(){
  select('#status').html('poseNetのロード完了');
  // 姿勢情報が得られたときの処理を定義
  poseNet.on('pose', function (results){
    poses=results;
  });
  // 動画を再生する
  videoObject.play();
}

function draw(){
  // canvas全体を半透明の白で塗りつぶす
  background(255,255,255,10)
  // canvasに動画のキャプチャを貼り付ける
  if(isOverlaid){
    image(videoObject, 0, 0, width, height);
  }
  // スケルトンを描画する
  if(enableSkeleton){
    drawSkeleton();
  }
  // キーポイントを描画する
  if(enableKeypoints){
    drawKeypoints();
  }
}

// スケルトンを描画する関数
function drawSkeleton() {
// 複数人のデータが入ったposesに対してループ処理し、一人分ずつ処理を捌いていく
  for (let i = 0; i < poses.length; i++) {
    // 一時変数skeletonsに1人分のスケルトン情報を格納
    let skeletons = poses[i].skeleton;
    // それぞれのスケルトンに対してループ処理し、1本ずつ描画していく
    for (let j = 0; j < skeletons.length; j++) {
      // 2つの端点の情報を一時変数from, toに格納する
      let from = skeletons[j][0];
      let to = skeletons[j][1];
      // スケルトン両端のキーポイントの推定確信度が0.2以上のものだけ描画する。
      if(from.score > 0.2 && to.score > 0.2){
        // 線の色を設定
        stroke(skeletonColor);
        // 線の太さを設定
        strokeWeight(skeletonStrokeWeight);
        //線を描画
        line(from.position.x, from.position.y,
          to.position.x, to.position.y);
      }
    }
  }
}

// キーポイントを描画する関数
function drawKeypoints()  {
  // 複数人のデータが入ったposesに対してループ処理し、一人分ずつ処理を捌いていく
  for (let i = 0; i < poses.length; i++) {
    // 一時変数poseに1人分の姿勢情報を格納
    let pose = poses[i].pose;
    // それぞれのキーポイントに対してループ処理し、1部位ずつ描画していく
    for (let j = 0; j < pose.keypoints.length; j++) {
      // 一時変数keypointに1部位のキーポイント情報を格納
      let keypoint = pose.keypoints[j];
      // 確信度が0.2以上のものだけ描画する。
      if (keypoint.score > 0.2) {
        // 塗り色を設定
        fill(keypointsColor);
        // 線は表示しない
        noStroke();
        // 円を描画
        ellipse(keypoint.position.x, keypoint.position.y, keyponitsRadius);
      }
    }
  }
}

// input要素に変更があるとき呼び出される関数
function inputChanged(){
  updateInputValue();
}

// input要素の現在の値と変数の同期を取る
function updateInputValue(){
  isOverlaid = select('#overlaid').checked();
  enableSkeleton = select('#skeleton').checked();
  enableKeypoints = select('#keypoints').checked();
  skeletonColor = select('#skeletonColor').value();
  keypointsColor = select('#keypointsColor').value();
  skeletonStrokeWeight = select('#skeletonStrokeWeight').value();
  keyponitsRadius = select('#keypointsRadius').value();
}