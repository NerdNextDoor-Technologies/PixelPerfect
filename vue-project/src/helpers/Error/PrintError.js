

function printErrorOnConsole(error, fileName) {
    console.error(`Error in ${fileName}:`, error.message);
    console.error(`Stack trace:`, error.stack);
    alert(`An error occurred in ${fileName}: ${error.message}`);
}


export { printErrorOnConsole };