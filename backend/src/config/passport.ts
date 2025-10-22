import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import authService from '../services/auth.service';
import userRepository from '../repositories/user.repository';
import { JWTPayload } from '../types';

// Local Strategy for Login (email/password)
passport.use(
    'local',
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
        },
        async (email, password, done) => {
            try {
                // Use service layer for authentication
                const user = await authService.authenticateUser(email, password);
                return done(null, user);
            } catch (error: any) {
                if (error.message === 'INVALID_CREDENTIALS') {
                    return done(null, false, { message: 'Invalid email or password' });
                }
                return done(error);
            }
        }
    )
);

// JWT Strategy for Protected Routes
const jwtSecret = process.env.JWT_SECRET || 'default-secret-key';

const jwtOptions: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtSecret,
};

passport.use(
    'jwt',
    new JwtStrategy(jwtOptions, async (payload: JWTPayload, done) => {
        try {
            // Use repository to fetch user
            const user = await userRepository.findByIdWithoutPassword(payload.userId);

            if (!user) {
                return done(null, false);
            }

            return done(null, user);
        } catch (error) {
            return done(error, false);
        }
    })
);

export default passport;