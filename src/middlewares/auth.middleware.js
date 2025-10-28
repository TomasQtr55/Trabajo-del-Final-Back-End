

import passportToken from "../configurations/passport.js";

function authMiddleware (req, res, next){
    
    return passportToken.authenticate('jwt', {session:false}, (err, user) =>{
        console.log(err, user);
        
        if(err || !user){
            return res.status(401).json({ message: 'no autorizado', err, user})
        }

        req.user = user
        next()
    })(req, res, next)
}

export default authMiddleware;
