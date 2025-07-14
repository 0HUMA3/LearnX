import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;
       
        //changes
        // console.log("Auth token from cookies:", token);

        if (!token) {
            return res.status(401).json({
                message: "User not authenticated",
                success: false
            });
        }

        const decode =jwt.verify(token, process.env.SECRET_KEY);

        // //changes
        // console.log("Decoded JWT:", decode);


        
        if (!decode) {
            return res.status(401).json({
                message: "Invalid token",
                success: false
            });
        }



        //changed req.userId=decode.userId;
        req.id = decode.userId;
        next();
    } catch (error) {
        console.log("Auth error:", error);
        return res.status(401).json({
          message: "Authentication failed",
          success: false,
        });
    }
};
export default isAuthenticated;