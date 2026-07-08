<?php
/**
 * Universal Engineering & Solution — Contact Form SMTP Mailer
 * Configure your SMTP settings below to enable email delivery.
 */

// 1. SMTP Credentials & Configuration
define('SMTP_HOST', 'mail.example.com');      // e.g., mail.yourdomain.com or smtp.gmail.com
define('SMTP_PORT', 587);                     // e.g., 587 (TLS), 465 (SSL), or 25
define('SMTP_USER', 'your-email@example.com'); // SMTP Username / Email Address
define('SMTP_PASS', 'your-email-password');     // SMTP Password
define('SMTP_SECURE', 'tls');                 // Connection secure protocol: 'tls', 'ssl', or ''

// 2. Email Routing Settings
define('TO_EMAIL', 'ut@universaltrad.com');   // The destination email address where inquiries should go
define('FROM_EMAIL', 'your-email@example.com'); // Must match SMTP user or be allowed by SMTP provider
define('FROM_NAME', 'Universal Engineering Website');

// Set JSON header for modern AJAX response
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Sanitize input data
    $name = isset($_POST['name']) ? strip_tags(trim($_POST['name'])) : '';
    $phone = isset($_POST['phone']) ? strip_tags(trim($_POST['phone'])) : '';
    $email = isset($_POST['email']) ? filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL) : '';
    $company = isset($_POST['company']) ? strip_tags(trim($_POST['company'])) : '';
    $service = isset($_POST['service']) ? strip_tags(trim($_POST['service'])) : '';
    $message = isset($_POST['message']) ? strip_tags(trim($_POST['message'])) : '';

    // Validate required fields
    if (empty($name) || empty($phone)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Please fill in your Name and Phone Number."]);
        exit;
    }

    // Build Email Content (HTML format)
    $subject = "New Inquiry from " . $name;
    $body = "<h2>New Website Inquiry</h2>";
    $body .= "<p><strong>Name:</strong> " . htmlspecialchars($name) . "</p>";
    $body .= "<p><strong>Phone:</strong> " . htmlspecialchars($phone) . "</p>";
    $body .= "<p><strong>Email:</strong> " . htmlspecialchars($email) . "</p>";
    if (!empty($company)) {
        $body .= "<p><strong>Company/Plant:</strong> " . htmlspecialchars($company) . "</p>";
    }
    if (!empty($service)) {
        $body .= "<p><strong>Service Interest:</strong> " . htmlspecialchars($service) . "</p>";
    }
    $body .= "<p><strong>Requirement / Message:</strong><br>" . nl2br(htmlspecialchars($message)) . "</p>";

    // Send the email
    $mailSent = false;

    // Use SMTP if configured, otherwise fallback to PHP's standard mail()
    if (SMTP_HOST !== 'mail.example.com' && SMTP_USER !== 'your-email@example.com') {
        $mailSent = send_smtp_email($subject, $body);
    } else {
        // Fallback standard PHP mail()
        $headers = "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
        $headers .= "From: " . FROM_NAME . " <" . FROM_EMAIL . ">\r\n";
        $headers .= "Reply-To: " . ($email ? $email : FROM_EMAIL) . "\r\n";
        
        $mailSent = mail(TO_EMAIL, $subject, $body, $headers);
    }

    if ($mailSent) {
        http_response_code(200);
        echo json_encode(["status" => "success", "message" => "Thank you! Your message has been sent successfully."]);
    } else {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Sorry, we encountered an error trying to send your message. Please check the server mail configurations."]);
    }
    exit;
} else {
    http_response_code(403);
    echo json_encode(["status" => "error", "message" => "Access denied. Only POST requests are allowed."]);
    exit;
}

/**
 * Socket-based SMTP mail delivery function.
 * Sends mail directly to an SMTP server using raw sockets.
 */
function send_smtp_email($subject, $body) {
    $host = SMTP_HOST;
    $port = SMTP_PORT;
    $user = SMTP_USER;
    $pass = SMTP_PASS;
    $secure = strtolower(SMTP_SECURE);
    
    $to = TO_EMAIL;
    $from = FROM_EMAIL;
    $from_name = FROM_NAME;

    $context = stream_context_create();
    
    // SSL Connection prefix
    if ($secure === 'ssl') {
        $host = 'ssl://' . $host;
    }
    
    $socket = @stream_socket_client("$host:$port", $errno, $errstr, 15, STREAM_CLIENT_CONNECT, $context);
    if (!$socket) {
        error_log("SMTP connection failed: $errstr ($errno)");
        return false;
    }
    
    // Read greeting response
    $res = get_smtp_response($socket);

    // HELO/EHLO
    fwrite($socket, "EHLO " . ($_SERVER['SERVER_NAME'] ? $_SERVER['SERVER_NAME'] : 'localhost') . "\r\n");
    get_smtp_response($socket);

    // TLS Encryption handshake
    if ($secure === 'tls') {
        fwrite($socket, "STARTTLS\r\n");
        $res = get_smtp_response($socket);
        if (strpos($res, '220') === false) {
            fclose($socket);
            return false;
        }
        
        if (!stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
            fclose($socket);
            return false;
        }
        
        fwrite($socket, "EHLO " . ($_SERVER['SERVER_NAME'] ? $_SERVER['SERVER_NAME'] : 'localhost') . "\r\n");
        get_smtp_response($socket);
    }

    // SMTP Authentication Login
    fwrite($socket, "AUTH LOGIN\r\n");
    get_smtp_response($socket);
    
    fwrite($socket, base64_encode($user) . "\r\n");
    get_smtp_response($socket);
    
    fwrite($socket, base64_encode($pass) . "\r\n");
    $auth_res = get_smtp_response($socket);
    if (strpos($auth_res, '235') === false) {
        fclose($socket);
        error_log("SMTP Authentication failed: " . $auth_res);
        return false;
    }

    // Envelope MAIL FROM
    fwrite($socket, "MAIL FROM:<$from>\r\n");
    get_smtp_response($socket);

    // Envelope RCPT TO
    fwrite($socket, "RCPT TO:<$to>\r\n");
    get_smtp_response($socket);

    // DATA command
    fwrite($socket, "DATA\r\n");
    get_smtp_response($socket);

    // Format headers and HTML body message
    $headers = "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    $headers .= "To: <$to>\r\n";
    $headers .= "From: \"$from_name\" <$from>\r\n";
    $headers .= "Subject: =?UTF-8?B?" . base64_encode($subject) . "?=\r\n";
    $headers .= "Date: " . date('r') . "\r\n";
    
    $message = $headers . "\r\n" . $body . "\r\n.\r\n";
    fwrite($socket, $message);
    $data_res = get_smtp_response($socket);

    // QUIT command
    fwrite($socket, "QUIT\r\n");
    fclose($socket);

    return strpos($data_res, '250') !== false;
}

/**
 * Reads lines from SMTP stream socket connection.
 */
function get_smtp_response($socket) {
    $response = "";
    while (($line = fgets($socket, 512)) !== false) {
        $response .= $line;
        if (substr($line, 3, 1) === " ") {
            break;
        }
    }
    return $response;
}
