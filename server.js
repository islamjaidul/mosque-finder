let app = require('./bootstrap/bootstrap')
app.use(require('./routes/main'))
app.set('views', __dirname + '/src/Services');
const PORT = process.env.PORT || 8181;
app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});