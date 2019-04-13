let classifier; // MobileNetの学習済みモデル
let imageObject; // img要素を指すp5.Element
let imagePath = 'images/camel.jpg'; //読み込む画像ファイルへのパス

function setup() {
  // デフォルトで作成されるcanvas要素を削除する
  noCanvas();
  // img要素をBodyに追加
  imageObject = createImg(imagePath, imageReady);
}

// 画像の読み込みが完了したら呼び出される関数
function imageReady(){
  // MobileNetの読み込み
  classifier = ml5.imageClassifier('MobileNet', modelReady);
}

// モデルの読み込みが完了したら呼び出される関数
function modelReady(){
  // id='status'の要素の中身を書き換える
  select('#status').html('MobileNetのロード完了');
  // MobileNetを読み込む
  classifier.predict(imageObject ,gotResult);
}

// 画像分類の結果が得られたら呼び出される関数
function gotResult(err, results) {
  // 推定中にエラーが発生したらコンソールにエラー内容を出力する
  if (err) {
    console.error(err);
  }
  // 推定結果をHTMLに反映させる
  select('#label').html(results[0].label);
  select('#confidence').html(nf(results[0].confidence, 1, 2));
}