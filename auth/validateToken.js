let verifyToken = (req, res, next) =>{
    var token; 
    var bearerHeader = req.headers['x-access-token'];
    if (typeof bearerHeader !== 'undefined') {
        var bearer = bearerHeader.split(" ");
        token = bearer[1];
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        jwt.verify(token, jwtSecretKey, (err, authData) => {
            if (err) {
                res.json(err);
            }else{
                console.log(jwt.verify(token, jwtSecretKey));
                return next()
            }
        })
        console.log(3);
    } else {
        console.log(req.header.authorization);
    }
}
module.exports = verifyToken;
