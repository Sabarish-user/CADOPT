<?php
$servername = "localhost";
$username = "sabarish"; // Change if needed
$password = "Sabari@123"; // Change if your MySQL has a password
$dbname = "pdf_db";

// Connect to MySQL
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get the PDF file path from database
$sql = "SELECT file_path FROM pdf_documents WHERE id = 1"; // Adjust ID if needed
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $file_path = $row["file_path"];

    // Redirect to open the PDF
    header("Content-Type: application/pdf");
    header("Content-Disposition: inline; filename='document.pdf'");
    readfile($file_path);
} else {
    echo "PDF not found!";
}

$conn->close();
?>
