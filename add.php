<?php
$name = $_POST['name'];
$score = $_POST['score'];

$f = fopen('results.txt', 'a+');
// fwrite($f, $name . ":" . $score . "\n");
fwrite($f, $name . ":" . $score . "\n");
fclose($f);