if (require.main === module) {
    console.log('Running at top level');
} else {
    console.log('Running as required from ' + module.parent.filename);
}
