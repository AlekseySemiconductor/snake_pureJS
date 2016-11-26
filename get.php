<?php
$results = file('results.txt');

foreach($results as $result) {
	$arr = explode(':', $result);
	// echo '<div><div class="results__cell">' . $arr[0] . '</div><div class="results__cell">' . $arr[1] . '</div></div>';
	// echo $arr[0].' '.$arr[1].'-';
	echo $arr[0].' '.$arr[1].'-';
}
