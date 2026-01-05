import express, {type Application, type NextFunction, type Request, type Response} from 'express';
import session from 'express-session';
import passport from 'passport'
import bcrypt from "bcrypt";
import {prisma} from "./lib/prisma";
import './auth';
import path from 'path'
import {fileURLToPath} from 'url';
import './types/passport';
import {router as projectRouter} from "./routes/project";
import {createServer} from 'http';
import {wss} from "./web_sockets/web_socket_server";
import cookie from 'cookie';
import signature from 'cookie-signature';
import {PrismaSessionStore} from "@quixo3/prisma-session-store";
import {WebSocket} from 'ws';

const app: Application = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Parses requests with Content-Type: application/json and converts JSON into a JavaScript object.
//     Returns a 400 if the JSON is malformed. You can pass options (e.g. limit) to control size.
// express.urlencoded({ extended: false })
// Parses application/x-www-form-urlencoded form submissions (typical HTML form encoding).
// extended: false uses Node's querystring (no nested objects). extended: true uses the qs library and supports rich/nested structures.
//
app.use(express.json());
app.use(express.urlencoded({extended: false}))
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const SESSION_SECRET = process.env.SESSION_SECRET || 'some secret'
// User configuration

const sessionStore = new PrismaSessionStore(
    prisma,
    {
        checkPeriod: 60*60*1000,
        dbRecordIdIsSessionId: true
    }
);
app.use(session({
    // ensures that the session inside the cooking was created by session id
    secret: SESSION_SECRET,
    store: sessionStore,
    // determines if the session should be saved to the back tothe session store
    // even if not modified,
    // Open question: why do we need to would we want to save it?
    resave: false,
    // Determines if a new but empty session should be saved.
    // true: every visitor gets a cooking and session entry in the database even they arent login
    saveUninitialized: false,
    cookie: {
        //
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24
    }
}));

// Initialize passport on the app
app.use(passport.initialize());
app.use(passport.session())



app.post('/login', passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login'
}));

app.post('/signup', async (req: Request, res: Response) => {
        const email = req.body.email;
        const password = req.body.password;

        if (typeof email !== 'string' || typeof password !== 'string') {
            res.sendStatus(401)
            return
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
            }
        })

        res.sendStatus(200)
        return
    });


const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated() && req.user) return next();
    res.status(401).json({ error: "Unauthorized" });
};

app.use('/api/project',isAuthenticated, projectRouter)



// Static files
const clientDistPath = path.join(__dirname, '/client/dist');
console.log('this is the dir', __dirname, path.join(clientDistPath, 'index.html'))

app.use(express.static(clientDistPath));
app.get('/*path', (req: Request, res: Response) => {
    res.sendFile(path.join(clientDistPath, 'index.html'))
});


const server = createServer(app);


server.on('upgrade', (request, socket, head) =>{
    const cookies = cookie.parse(request.headers.cookie ?? '');
    const rawSessionId = cookies['connect.sid'];


    if(!rawSessionId){
        return socket.destroy();
    }

    const unsignedSid = signature.unsign(rawSessionId.slice(2), SESSION_SECRET);

    if(!unsignedSid){
        return socket.destroy();
    }

    sessionStore.get(unsignedSid, (err, session)=> {
        if(err || !session || !session.passport || !session.passport.user){
            return socket.destroy();
        }

        const userId = session.passport.user;
        wss.handleUpgrade(request, socket, head , (ws: WebSocket) => {
            ws.userId = userId
            wss.emit('connection', ws, request)
        })
    })

});


server.listen(port, () => {
    console.log(`Server & WS running at http://localhost:${port}`);
});