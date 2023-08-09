const Post = require('../models/post');
const User = require("../models/user");


// module.exports.home = async function (req, res) {
//   try {
//     const posts = await Post.find({});

//     return res.render("home", {
//       title: "Codeial | Home",
//       posts: posts,
//     });
//   } catch (err) {
//     console.log("error in finding posts", err);
//     // Handle the error appropriately, such as sending an error response
//     return res.redirect('back');
//   }
// };

// to populate the user

module.exports.home = async function (req, res) {
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

    const users = await User.find({});

    return res.render("home", {
      title: "Geeta Gyan | Home",
      posts: posts,
      all_users: users,
    });
  } catch (err) {
    // Handle any errors that occurred during the process
    console.error(err);
    return res.redirect("back");
  }
};

