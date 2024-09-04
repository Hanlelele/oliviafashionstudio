const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
require('dotenv').config();
const User = require('./models/User');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:8000/api/auth/google/callback"
},
  async function (accessToken, refreshToken, profile, cb) {
    const id = profile.id;
    const email = profile.emails[0]?.value;

    try {
      let user = await User.findOne({ idGoogle: id });
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        if (existingUser.loginMethod === 'AUTHENTICATION') {
          // Nếu email đã tồn tại và đăng nhập qua AUTHENTICATION, cập nhật idGoogle và loginMethod
          user = await User.findByIdAndUpdate(existingUser._id, {
            fullname: profile.displayName,
            username: profile.displayName, 
            idGoogle: profile.id,
            loginMethod: 'GOOGLE'
          }, { new: true });
        } else {
          user = existingUser;
        }
      } else if (!user) {
        // Nếu người dùng chưa tồn tại, tạo người dùng mới
        user = new User({
          fullname: profile.displayName,
          username: profile.displayName,
          email: profile.emails[0]?.value,
          password: '0000000',  
          idGoogle: profile.id,
          loginMethod: 'GOOGLE'
        });
        await user.save();
      }

      return cb(null, profile);
    } catch (err) {
      return cb(err);
    }
  }
));
