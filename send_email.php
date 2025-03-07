<?php
$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data['name'], $data['phone'])) {
    http_response_code(400);
    echo json_encode(["message" => "Некорректные данные"]);
    exit;
}

$to = "info@stroigazservis.ru";
$subject = "Новая заявка";
$message = "Имя: " . htmlspecialchars($data['name']) . "\n";
$message .= "Телефон: " . htmlspecialchars($data['phone']) . "\n";
$message .= "Комментарий: " . htmlspecialchars($data['comment'] ?? 'нет комментария') . "\n";
$headers = "From: no-reply@stroigazservis.ru\r\nContent-Type: text/plain; charset=UTF-8";

if (mail($to, $subject, $message, $headers)) {
    echo json_encode(["message" => "Письмо отправлено"]);
} else {
    http_response_code(500);
    echo json_encode(["message" => "Ошибка при отправке"]);
}
?>