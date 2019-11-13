const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Users = require("../User/user");
const restricted = require("./restricted");

router.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.json("Hey, you can't leave");
      } else {
        res.json("sorry to see you leave");
      }
    });
  } else {
    res.end();
  }
});

router.post("/register", (req, res) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 11);
  const newUser = {
    username: req.body.username,
    password: hash,
    department: req.body.department
  };

  Users.add(newUser)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.post("/login", (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      // check if the provided password is correct
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user);

        res
          .status(200)
          .json({ message: `Welcome ${user.username}!`, token: token });
      } else {
        res.status(401).json({ message: "Invalid Credentials" });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.get("/users", restricted, (req, res) => {
  Users.find()
    .then(users => {
      res.json(users.filter(dept => req.user.subject === dept.department));
    })
    .catch(err => res.send(err));
});

function generateToken(user) {
  const result = jwt.sign(
    { subject: user.department, username: user.username },
    "D4RE!EFGF",
    {
      expiresIn: "48h"
    }
  );

  return result;
}
module.exports = router;
