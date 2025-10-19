<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204); // No Content
    exit();
}

require_once __DIR__ . '/vendor/autoload.php';

use Dotenv\Dotenv;

// .envの読み込み
$dotenv = Dotenv::createImmutable(__DIR__ . '/../../env/');
$dotenv->load();

$rawData = file_get_contents("php://input");
$data = json_decode($rawData, true);

$base64 = $data['base64'];
$mimeType = $data['mime'];
$prompt = $data['prompt'];
if(empty($base64) || empty($mimeType) || empty($prompt)){
  die("リクエストが不正です。");
}

// 環境変数を取得
$apiKey = $_ENV['GEMINI_API'];
$model = $_ENV['GEMINI_MODEL'];

$apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent";

$requestBody = [
  'contents' => [
    'parts' => [
      [
        'inlineData' => [
          'mimeType' => $mimeType,
          'data' => $base64,
        ]
      ],
      [
        'text' => $prompt
      ]
    ]
  ]
];

$jsonPayLoad = json_encode($requestBody);
if($jsonPayLoad === false){
  die("リクエストできませんでした");
}

$ch = curl_init($apiUrl);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch, CURLOPT_HTTPHEADER, [
  "x-goog-api-key: {$apiKey}",
  "Content-Type: application/json",
  'Content-Length: ' . strlen($jsonPayLoad)
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonPayLoad);
curl_setopt($ch, CURLOPT_HEADER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$res = curl_exec($ch);

if(curl_errno($ch)){
  $errorMsg = curl_error($ch);
  curl_close($ch);
  die("cURLエラー: " . $errorMsg . "\n");
}
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if($httpCode === 200){
  $responseData = json_decode($res, true);
  if (json_last_error() !== JSON_ERROR_NONE) {
    die("エラー: JSONデコードに失敗しました。\n");
  }

  // モデルの生成したテキストの抽出
  $caption = $responseData['candidates'][0]['content']['parts'][0]['text'] ?? 'キャプションを抽出できませんでした。';
  echo $caption;
}else{
  echo "APIリクエストが失敗しました。HTTPコード: {$httpCode}\n";
  echo "応答ボディ:\n" . $response . "\n";
}
