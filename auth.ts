import passport from 'passport';
import {Strategy as LocalStrategy} from 'passport-local';
import {prisma} from './lib/prisma';
import bcrypt from 'bcrypt';


passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    async (email: string, password: string, done) => {
        try {
            const user = await prisma.user.findUnique({where: {email}});
            if (!user) {
                return done(null, false, {message: 'invalid email'})
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return done(null, false, {message: 'invalid email or password'})

            }

            return done(null, user)
        } catch (err) {
            return done(err)
        }
    }
))

passport.serializeUser((user: any, done) => {
    done(null, user.id)
});

passport.deserializeUser(async (id: number, done) => {
    try {
        console.log("Deserializing user ID:", id); // <--- Add this Log
        const user = await prisma.user.findUnique({where: {id}})
        done(null, user);
    } catch (err) {
        done(err, null)
    }
});
