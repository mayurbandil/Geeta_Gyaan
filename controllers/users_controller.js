const User = require("../models/user");
const Post = require("../models/post");
const fs = require("fs");
const path = require("path");

module.exports.profile = async function (req, res) {
  try {
    const posts = await Post.find({})
      .populate("user")
      .populate({
        path: "comments",
        populate: {
          path: "user",
        },
      })
      .exec();
    const user = await User.findById(req.params.id).exec();
    return res.render("user_profile", {
      title: "User Profile",
      profile_user: user,
      posts: posts
    });
  } catch (err) {
    // Handle any errors that occurred during the process
    console.error(err);
    return res.redirect("back");
  }
};

// module.exports.update = async function (req, res) {
//   try {
//     if (req.user.id == req.params.id) {
//       let user = await User.findById(req.params.id);
//       // return res.redirect('back');
//       User.uploadedAvatar(req, res, function (err) {
//         if (err) {
//           console.log("multerError: ", err);
//         }
//         user.name = req.body.name;
//         user.email = req.body.email;

//         if (req.file) {
//           if (user.avatar) {
//             fs.unlinkSync(path.join(__dirname, "..", user.avatar));
//           }
//           user.avatar = User.avatarPath + "/" + req.file.filename;
//         }
//         user.save();
//         return res.redirect("back");
//       });

//       return res.redirect("back");
//     } else {
//            req.flash("error", "Unauthorised!");
//            return res.status(401).send("Unauthorized");
//     }
//   } catch (err) {
//     // Handle any errors that occurred during the process
//     console.error(err);
//     return res.redirect("back");
//   }
// };

module.exports.update = async function (req, res) {
  if (req.user.id == req.params.id) {
    try {
      let user = await User.findById(req.params.id);
      // return res.redirect('back');
      User.uploadedAvatar(req, res, function (err) {
        if (err) {
          console.log("multerError: ", err);
        }
        user.name = req.body.name;
        user.email = req.body.email;

        if (req.file) {
          if (user.avatar) {
            fs.unlinkSync(path.join(__dirname, "..", user.avatar));
          }
          user.avatar = User.avatarPath + "/" + req.file.filename;
        }
        user.save();
        return res.redirect("back");
      });
    } catch (err) {
      req.flash("error", err);
      return res.redirect("back");
    }
  } else {
    req.flash("error", "Unauthorised!");
    return res.status(401).send("Unauthorized");
  }
};
module.exports.signUp = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/profile");
  }
  return res.render("user_sign_up", {
    title: "Codeial | Sign Up",
  });
};

module.exports.signIn = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/profile");
  }

  return res.render("user_sign_in", {
    title: "Codeial | Sign In",
  });
};

module.exports.destroySession = function (req, res) {
  // Log out the user using req.logout(callback)
  req.logout(function (err) {
    if (err) {
      console.log("Error in logging out user:", err);
      return;
    }
    req.flash("success", "you are logged out successfully");
    return res.redirect("/");
  });
};

module.exports.createSession = function (req, res) {
  req.flash("success", "you are logged in successfully");
  return res.redirect("/");
};

module.exports.create = async function (req, res) {
  try {
    if (req.body.password != req.body.confirm_password) {
      return res.redirect("back");
    }

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      await User.create(req.body);
      return res.redirect("/users/sign-in");
    } else {
      return res.redirect("back");
    }
  } catch (err) {
    console.log("Error in user creation:", err);
    return res.redirect("back");
  }
};
