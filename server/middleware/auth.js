import jwt from "jsonwebtoken";



const auth = async (req, res, next) => {
    try {
        // obtaining the token from the frontend 
        const token = req.headers.authorization.split(" ")[1];
        const isCustomAuth = token.length < 500;
        let decodedData;

        if (token && isCustomAuth) {
            decodedData = jwt.verify(token, "secretkey");
            req.userId = decodedData?.id;
        }else {
            decodedData = jwt.decode(token);
            req.userId = decodedData?.sub;
        }
        

        next()
    } catch (error) {
        res.status(500).json({message: "Something went wrong."})
    }
}

export default auth;