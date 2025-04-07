const { createHmac, randomBytes } = require('crypto');
const { Schema, model } = require('mongoose');
const {CreateTokenForUser} = require("../services/authentication")
const userSchema = new Schema({
    Fullname: {
        type: String,
        required: true,
    },
    Email: {
        type: String,
        required: true,
        unique: true,
    },
    salt: {
        type: String,
    },
    Password: {
        type: String,
        required: true,
    },
    ProfileImage: {
        type: String,
        default: '/images/profile.jpeg',
    },
    role: {
        type: String,
        enum: ['USER', 'ADMIN'],
        default: 'USER',
    },
}, { timestamps: true });

userSchema.pre('save', function (next) {
    const user = this;
    try {
        if (!user.isModified('Password')) return next();

        const salt = randomBytes(16).toString();
        const hashedPassword = createHmac('sha256', salt).update(user.Password).digest('hex');

        user.salt = salt;
        user.Password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.static("matchPasswordAndGenerateToken" ,async function (email,password){
    const user =await this.findOne({Email:email});
    if(!user) throw new Error("User Not Found!");
    const salt = user.salt; 
    const Hashpassword= user.Password;
    const userProvidedPassword = createHmac('sha256', salt).update(password).digest('hex');  
    
    if (Hashpassword !== userProvidedPassword) throw new Error("Wrong Password!");
     const Token = CreateTokenForUser(user);
    return Token;
})

module.exports = model('User', userSchema);