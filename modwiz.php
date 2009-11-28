<?php
header('Content-Type: text/xml');

require 'files.php';

if (is_array($exclude)) {
    $exclude = '('.join('|', $exclude).'|^\s+$)';
}
# echo '<!-- Excluding: '.$exclude." -->\n";

$farray = array_unique( preg_split("/[\n\r\s]+/", $files) );
$farray = preg_grep("/{$exclude}/i", $farray, PREG_GREP_INVERT);

# get rid of the last, empty string ??
array_pop($farray);

# by default we expect the files to come from the folder above ours
function dotdot($f) { return preg_replace('/^/', '../', $f); }
$farray = array_map(dotdot, $farray);

# build the Rhino file list to go through
$files = join(" ", $farray);
# echo $files."\n";

# collect the YUI.add() calls and construct the YUI loader configuration
$depmod = 'java -cp ./lib/js.jar org.mozilla.javascript.tools.shell.Main ./modwiz.js '.$files;
echo shell_exec($depmod)."\n";
?>
