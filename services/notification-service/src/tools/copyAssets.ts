import * as shell from 'shelljs';

// Ensure target directory exists
shell.mkdir('-p', 'dist/templates');

// Copy email templates
shell.cp('-R', 'src/templates/emails', 'dist/templates/emails');