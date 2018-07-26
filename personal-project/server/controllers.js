const bcrypt = require('bcrypt-nodejs');

module.exports = {
    get_user_unicorns: (req, res) => {
        const dbInstance = req.app.get('db');
        const userId = req.session.userid;

        dbInstance.get_user_unicorns([userId])
            .then(unicorns => {
                console.log(unicorns)
                res.status(200).send(unicorns)
            })
            .catch(err => {
                console.log(err)
                res.status(500).send({errorMessage: "Oops! Something went wrong."})
            })
    },
    create_user: (req, res) => {
        const dbInstance = req.app.get('db');
        const {username, password} = req.body;

        //Encrypting password
        bcrypt.hash(password, null, null, function(err, hash){
            //All of this is what was working before I tried using bcrypt, except I swapped out "hash" for "password in the argument array"
            dbInstance.create_user([username, hash])
            .then(createdUser => {
                req.session.userid = createdUser[0].id
                console.log(req.session.userid)
                res.status(200).send(createdUser);
            })
            .catch(err => {
                res.status(500).send({errorMessage: "Oops! Something went wrong"});
                console.log(err)
            });
        })
    },
    
    login: (req, res) => {
        const dbInstance = req.app.get('db');
        const {username, password} = req.body;
        //I need to pull this "hash" argument from the database using the username
        dbInstance.get_password([username])
            .then( hash => {
                let myHash = hash[0].password
                console.log(myHash)
                bcrypt.compare(password, myHash, function(err, response){
                    if(response){
                        dbInstance.get_user([username, myHash])
                            .then(user => {
                                req.session.userid = user[0].id
                                console.log(req.session)
                                res.status(200).send(user);
                            })
                            .catch(err => {
                                res.status(500).send({errorMessage: "Oops! Something went wrong"});
                                console.log(err)
                        });
                    } else {
                        console.log("The password thing didn't work")
                        res.status(500).send({errorMessage: "Oops! Something went wrong"});
                    }
                })
            })
            .catch(err => {
                res.status(500).send({errorMessage: "Oops! Something went wrong"});
                console.log(err)
        });
        
    },
    get_unicorn: (req, res) => {
        const dbInstance = req.app.get('db');
        const unicornId = parseInt(req.params.id);
  
        dbInstance.get_unicorn(unicornId)
            .then( unicorn => {
                console.log(unicorn)
                res.status(200).send( unicorn )
            })
            .catch( err => {
                res.status(500).send({errorMessage: "Oops! Something went wrong. Our engineers have been informed!"});
                console.log(err)
            } );
    },
    logout: (req, res, next) => {
        req.session.destroy();
        console.log(req.session)
        console.log('You successfully logged out!')
        res.status(200).send(req.session);
    },
    create_unicorn: (req, res) => {
        const dbInstance = req.app.get('db');
        const {name, file_name, user_id} = req.body;

        dbInstance.create_unicorn([name, file_name, user_id])
            .then(createdUnicorn => {
                res.status(200).send(createdUnicorn);
            })
            .catch(err => {
                res.status(500).send({errorMessage: "Oops! Something went wrong"});
                console.log(err)
            });
    },
    edit_unicorn: (req, res) => {
        const dbInstance = req.app.get('db');
        const {name, file_name, id} = req.body;

        dbInstance.edit_unicorn([name, file_name, id])
            .then(editedUnicorn => {
                res.status(200).send(editedUnicorn);
            })
            .catch(err => {
                res.status(500).send({errorMessage: "Oops! Something went wrong"});
                console.log(err)
            });
    },
    delete_unicorn: (req, res) => {
        const dbInstance = req.app.get('db');
        const unicornId = parseInt(req.params.id);
        console.log(unicornId)

        dbInstance.delete_unicorn([unicornId])
            .then(deletedUnicorn => {
                res.status(200).send(deletedUnicorn);
            })
            .catch(err => {
                res.status(500).send({errorMessage: "Oops! Something went wrong"});
                console.log(err)
            });
    },
    edit_user_current_unicorn: (req, res) => {
        const dbInstance = req.app.get('db');
        const unicornId = parseInt(req.params.id);
        const userId = req.session.userid;

        dbInstance.edit_user_current_unicorn([unicornId, userId])
            .then(editedUser => {
                res.status(200).send(editedUser);
            })
            .catch(err => {
                res.status(500).send({errorMessage: "Oops! Something went wrong"});
                console.log(err)
            });
    },
    all_usernames: (req, res) => {
        const dbInstance = req.app.get('db');

        dbInstance.get_all_usernames()
            .then(usernames => {
                console.log(usernames)
                res.status(200).send(usernames)
            })
            .catch(err => {
                console.log(err)
                res.status(500).send({errorMessage: "Oops! Something went wrong."})
            })
    },
    current_user: (req, res) => {
            const dbInstance = req.app.get('db');
            const userId = req.session.userid;
            console.log(userId)
            dbInstance.current_user([userId])
                .then( user => {
                    console.log(user)
                    res.status(200).send( user )
                })
                .catch( err => {
                    res.status(500).send({errorMessage: "Oops! Something went wrong. Our engineers have been informed!"});
                    console.log(err)
                } );
        },

}