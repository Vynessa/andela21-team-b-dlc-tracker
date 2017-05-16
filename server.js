import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import router from './route/route';
import auth from './controllers/auth';

dotenv.config();
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/', router);

app.listen(process.env.PORT_TEST, () => {
    console.log('server now running at ' + process.env.PORT_TEST);
});

app.post('/register', auth.register);
app.post('/login', auth.login);
app.get('/signOut', auth.signOut);
app.get('/module', modules.getModule);
app.post('/module', modules.submitAssesment);


// load the routess
export default app;
