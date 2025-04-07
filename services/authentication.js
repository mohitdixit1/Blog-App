const jwt = require("jsonwebtoken");

const key = "IamBetMen$$";

function CreateTokenForUser(user) {
    const payload = {
        _id : user._id,
        Fullname:user.Fullname,
        Email:user.Email,
        ProfileImage:user.ProfileImage,
        role:user.role,
    }
    const Token = jwt.sign(payload, key);
    return Token;
}

function ValidateToken(Token) {
    const payload = jwt.verify(Token,key)
    
    return payload;
}
module.exports ={
    CreateTokenForUser,
    ValidateToken,
}