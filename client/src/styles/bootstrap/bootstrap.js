// Main import file
// https://www.artembutusov.com/webpack-customizable-bootstrap-4-x-scss/

// If you don't have ES6 transpiler or have TypeScript then you could use distributed version but will loose module customization
// Tether (required for Bootstrap 4.x)
// import 'tether/src/css/tether-theme-basic.sass'; // optional
import 'tether';
import 'bootstrap/dist/js/bootstrap';

// If you have ES6 transpiler then you could code below and will be able to customize what modules will be included in the build.
/*
import 'bootstrap/js/src/alert';
import 'bootstrap/js/src/button';
import 'bootstrap/js/src/carousel';
import 'bootstrap/js/src/collapse';
import 'bootstrap/js/src/dropdown';
import 'bootstrap/js/src/modal';
import 'bootstrap/js/src/popover';
import 'bootstrap/js/src/scrollspy';
import 'bootstrap/js/src/tab';
import 'bootstrap/js/src/tooltip';
*/
