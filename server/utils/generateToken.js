import jwt from "jsonwebtoken";

export const generateToken = (res, user) => {
  const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
    expiresIn: "1d",
  });

  // Only set the cookie here, do not send the response
//   res.cookie("token", token, {
//     httpOnly: true,
//     sameSite: "strict",
//     maxAge: 24 * 60 * 60 * 1000, // 1 day
//   });
// };

//changes
res.cookie("token", token, {
  httpOnly: true,
  sameSite: "lax",  // or "none" if using https and cross-domain
  secure: false,    // true if HTTPS
  maxAge: 24 * 60 * 60 * 1000,
});
};
