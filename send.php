<?php
/**
 * Lüdi Motos AG – Formularversand
 *
 * Nimmt die Formulare der Webseite (Serviceanmeldung, Winteraktion, Kontakt)
 * entgegen und schickt sie als E-Mail an info@luedimotos.ch.
 * Antwortet mit JSON: {"ok":true} oder {"ok":false,"error":"..."}.
 */

// ---------- Einstellungen ----------
const MAIL_TO   = 'info@luedimotos.ch';
// Absender muss eine Adresse der eigenen Domain sein, sonst landen Mails im Spam
const MAIL_FROM = 'webseite@luedimotos.ch';
const FROM_NAME = 'Webseite Lüdi Motos';

// Erlaubte Formulare und ihr Betreff
const FORMS = [
    'service' => 'Serviceanmeldung',
    'winter'  => 'Anmeldung Winteraktion',
    'kontakt' => 'Kontaktanfrage',
];

const MIN_SECONDS   = 3;    // schneller ausgefüllt = vermutlich ein Bot
const MAX_PER_HOUR  = 10;   // Anfragen pro IP-Adresse und Stunde
const MAX_ROWS      = 60;
const MAX_VALUE_LEN = 5000;

date_default_timezone_set('Europe/Zurich');

// ---------- Hilfsfunktionen ----------
function respond(int $status, array $data): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function fail(int $status, string $error): void
{
    respond($status, ['ok' => false, 'error' => $error]);
}

// Entfernt Zeilenumbrüche, damit niemand zusätzliche Mail-Header einschleusen kann
function oneLine(string $value): string
{
    return trim(preg_replace('/[\r\n\t]+/', ' ', $value));
}

function tooManyRequests(string $ip): bool
{
    $file = sys_get_temp_dir() . '/lm-form-' . hash('sha256', $ip);
    $now = time();
    $hits = [];
    if (is_file($file)) {
        $hits = array_filter(
            array_map('intval', explode(',', (string) file_get_contents($file))),
            fn($t) => $t > $now - 3600
        );
    }
    if (count($hits) >= MAX_PER_HOUR) {
        return true;
    }
    $hits[] = $now;
    file_put_contents($file, implode(',', $hits), LOCK_EX);
    return false;
}

// ---------- Prüfungen ----------
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: POST');
    fail(405, 'Nur POST erlaubt.');
}

$form = $_POST['_form'] ?? '';
if (!isset(FORMS[$form])) {
    fail(400, 'Unbekanntes Formular.');
}

// Unsichtbares Feld: Menschen lassen es leer, Bots füllen es aus.
// Bots bekommen trotzdem "ok", damit sie es nicht weiter versuchen.
if (!empty($_POST['_hp'])) {
    respond(200, ['ok' => true]);
}

$started = (int) ($_POST['_t'] ?? 0);
$elapsed = time() - intdiv($started, 1000);
if ($started <= 0 || $elapsed < MIN_SECONDS || $elapsed > 86400) {
    fail(400, 'Bitte lade die Seite neu und versuche es nochmals.');
}

if (tooManyRequests($_SERVER['REMOTE_ADDR'] ?? 'unbekannt')) {
    fail(429, 'Zu viele Anfragen. Bitte versuche es später nochmals oder ruf uns an.');
}

$email = oneLine((string) ($_POST['email'] ?? ''));
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    fail(400, 'Bitte gib eine gültige E-Mail-Adresse an.');
}

$name = oneLine(trim(($_POST['vorname'] ?? '') . ' ' . ($_POST['nachname'] ?? '')));
if ($name === '' || mb_strlen($name) > 200) {
    fail(400, 'Bitte gib deinen Namen an.');
}

// Die Webseite schickt alle Angaben als Liste [Bezeichnung, Wert] mit
$rows = json_decode((string) ($_POST['_rows'] ?? ''), true);
if (!is_array($rows) || !$rows || count($rows) > MAX_ROWS) {
    fail(400, 'Die Angaben konnten nicht gelesen werden.');
}

// ---------- E-Mail zusammenstellen ----------
$lines = [];
foreach ($rows as $row) {
    if (!is_array($row) || count($row) !== 2) {
        continue;
    }
    $label = mb_substr(oneLine((string) $row[0]), 0, 100);
    $value = mb_substr(trim((string) $row[1]), 0, MAX_VALUE_LEN);
    if ($label === '' || $value === '') {
        continue;
    }
    // Mehrzeilige Werte (z. B. Nachricht) eingerückt unter die Bezeichnung
    $lines[] = str_contains($value, "\n")
        ? $label . ":\n  " . str_replace("\n", "\n  ", str_replace("\r", '', $value))
        : $label . ': ' . $value;
}
if (!$lines) {
    fail(400, 'Die Angaben konnten nicht gelesen werden.');
}

$subject = FORMS[$form] . ' – ' . $name;
$body = FORMS[$form] . " über luedimotos.ch\n"
    . str_repeat('=', 40) . "\n\n"
    . implode("\n", $lines) . "\n\n"
    . str_repeat('-', 40) . "\n"
    . 'Gesendet am ' . date('d.m.Y \u\m H:i') . " Uhr.\n"
    . "Mit «Antworten» geht die Antwort direkt an {$email}.\n";

$headers = [
    'From' => mb_encode_mimeheader(FROM_NAME, 'UTF-8') . ' <' . MAIL_FROM . '>',
    'Reply-To' => mb_encode_mimeheader($name, 'UTF-8') . ' <' . $email . '>',
    'MIME-Version' => '1.0',
    'Content-Type' => 'text/plain; charset=UTF-8',
    'Content-Transfer-Encoding' => '8bit',
    'X-Mailer' => 'luedimotos.ch',
];

$sent = mail(
    MAIL_TO,
    mb_encode_mimeheader($subject, 'UTF-8'),
    $body,
    $headers,
    '-f' . MAIL_FROM
);

if (!$sent) {
    fail(500, 'Die Nachricht konnte nicht gesendet werden.');
}

respond(200, ['ok' => true]);
