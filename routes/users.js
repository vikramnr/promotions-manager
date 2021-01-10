const express = require('express');
const router = express.Router();
const passport = require('passport')
const User = require('../models/user')
const UserGroup = require('../models/userPerm')

/* GET users listing. */
router.get('/', async (req, res, next) => {
    res.render('users/index', { title: 'User Management' });
});

router.get('/reset', async (req, res, next) => {
    res.render('users/reset', { title: 'User Management' });
});


router.post('/reset', async (req, res, next) => {
    app.post('/forgot', function (req, res, next) {
        async.waterfall([
            function (done) {
                crypto.randomBytes(20, function (err, buf) {
                    var token = buf.toString('hex');
                    done(err, token);
                });
            },
            function (token, done) {
                User.findOne({ email: req.body.email, username: req.body.username }, function (err, user) {
                    if (!user) {
                        // req.flash('error', 'No account with that email address exists.');
                        return res.redirect('/');
                    }

                    user.resetPasswordToken = token;
                    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                    user.save(function (err) {
                        done(err, token, user);
                    });
                });
            },
            function (token, user, done) {
                var smtpTransport = nodemailer.createTransport('SMTP', {
                    service: 'SendGrid',
                    auth: {
                        user: '!!! YOUR SENDGRID USERNAME !!!',
                        pass: '!!! YOUR SENDGRID PASSWORD !!!'
                    }
                });
                var mailOptions = {
                    to: user.email,
                    from: 'passwordreset@demo.com',
                    subject: 'Node.js Password Reset',
                    text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                        'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                        'If you did not request this, please ignore this email and your password will remain unchanged.\n'
                };
                smtpTransport.sendMail(mailOptions, function (err) {
                    req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
                    done(err, 'done');
                });
            }
        ], function (err) {
            if (err) return next(err);
            res.redirect('/forgot');
        });
    });
})



router.get('/reset/:token', function (req, res) {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
        if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('/forgot');
        }
        res.render('reset', {
            user: req.user
        });
    });
});


router.post('/reset/:token', function(req, res) {
    async.waterfall([
      function(done) {
        User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
          if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('back');
          }
  
          user.password = req.body.password;
          user.resetPasswordToken = undefined;
          user.resetPasswordExpires = undefined;
  
          user.save(function(err) {
            req.logIn(user, function(err) {
              done(err, user);
            });
          });
        });
      },
      function(user, done) {
        var smtpTransport = nodemailer.createTransport('SMTP', {
          service: 'SendGrid',
          auth: {
            user: '!!! YOUR SENDGRID USERNAME !!!',
            pass: '!!! YOUR SENDGRID PASSWORD !!!'
          }
        });
        var mailOptions = {
          to: user.email,
          from: 'passwordreset@demo.com',
          subject: 'Your password has been changed',
          text: 'Hello,\n\n' +
            'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          req.flash('success', 'Success! Your password has been changed.');
          done(err);
        });
      }
    ], function(err) {
      res.redirect('/');
    });
  });


router.get('/register', async (req, res, next) => {
    if (res.locals.currentUser) {
        console.log(res.locals.currentUser.username)
        const userGroupCurrentUser = await User.find({ username: res.locals.currentUser.username })//.populate('userType').exec()
        console.log(userGroupCurrentUser, 'usergroup')
    }

    const userGroup = await UserGroup.find({})
    // console.log(res.locals.currentUser)
    res.render('users/register', { title: 'User Manager', userGroup });
});


router.post('/register', async (req, res) => {
    console.log(req.body.usergroup)
    const newUser = new User({
        username: req.body.username,
        userType: req.body.usergroup,
        groupCompany: req.body.groupCompany,
        email: req.body.email
    })
    // console.log(newUser)
    User.register(newUser, req.body.password, function (err, newUser) {
        if (err) {
            // req.flash('error',err.message)
            console.log(err)
            res.redirect('/') //,{error: err.message})
        }
        else {
            console.log(newUser)
            passport.authenticate('local')(req, res, function () {
                // req.flash('success','Welcome to YelpCamp')
                res.redirect('/pm')
            })
        }
    })
})

router.get('/login', function (req, res) {
    res.render('users/login', { page: 'login' })
})
router.post('/login', passport.authenticate("local", {
    successRedirect: '/users/',
    failureRedirect: '/'
}), function (req, res) {
    
})

router.get('/logout', function (req, res) {
    // req.flash('success','Logged out of yelpcamp')
    req.logout();
    res.redirect('/login')
})

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next()
    else res.redirect('/users/login')
}

module.exports = router;
