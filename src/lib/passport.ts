// config/passport.js
import { Handler } from "express";
import * as passport from "passport";
import { StrategyOptions, Strategy, ExtractJwt } from "passport-jwt";
import User from "../Model/user";
require("dotenv").config();
class Passport {
	constructor() {
		//JWT Strategy
		passport.use(
			new Strategy(
				{
					jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
					secretOrKey: process.env.JWT_SECRET_KEY,
				},
				async (jwtPayload, done) => {
					try {
						return User.loginAuthentication(jwtPayload)
							.then((user) => {
								if (user) {
									return done(null, user);
								}
								return done(null, false);
							})
							.catch((err) => {
								return done(err);
							});
					} catch (err) {
						return done(err);
					}
				}
			)
		);
	}
	public authenticate(session: boolean = false): Handler {
		return passport.authenticate("jwt", {
			failWithError: true,
			session: session,
		});
	}
	public Init(): Handler {
		return passport.initialize();
	}
}
export default new Passport();
