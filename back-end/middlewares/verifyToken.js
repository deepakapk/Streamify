import jwt from "jsonwebtoken"

export const verifyToken = async(req ,res , next) =>{
    const token = req.cookies.access_token;
    
    if(!token)
        return res.status(401).json({message : "No Token Provided Invalid Access", success: false})
    
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) =>{
        if(err)
            return res.status(403).json({message : "Invalid Access Token Invalid!", success: false, error: err.message})
        req.user = user;
        next();
    })

}