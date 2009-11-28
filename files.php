<?php

$cd = 'cd ..;';

# collect the .js files to go through
$files = '';
# $files = $files.'yui/yui.js ';
$files = $files.shell_exec($cd.'find . -type f -name \*.js | grep "\-debug"');


# add regexp patters of what files to exclude
$exclude = array(
#    'jsunit',
);

?>
