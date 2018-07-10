module.exports = {
    // get_user_posts: (req, res) => {
    //     const dbInstance = req.app.get('db');
    //     //const userId = req.params.user_id;
    //     const userId = req.session.userid;
  
    //     dbInstance.get_user_posts([userId])
    //         .then( posts => {
    //             console.log(posts)
    //             res.status(200).send( posts )
    //         })
    //         .catch( err => {
    //             res.status(500).send({errorMessage: "Oops! Something went wrong. Our engineers have been informed!"});
    //             console.log(err)
    //         } );
    // },
    create_user: (req, res) => {
        const dbInstance = req.app.get('db');
        const {username, password} = req.body;

        dbInstance.create_user([username, password])
            .then(createdUser => {
                req.session.userid = createdUser[0].id
                console.log(req.session.userid)
                res.status(200).send(createdUser);
            })
            .catch(err => {
                res.status(500).send({errorMessage: "Oops! Something went wrong"});
                console.log(err)
            });
    },
    login: (req, res) => {
        const dbInstance = req.app.get('db');
        const {username, password} = req.body;

        dbInstance.get_user([username, password])
            .then(user => {
                req.session.userid = user[0].id
                console.log(req.session.userid)
                res.status(200).send(user);
            })
            .catch(err => {
                res.status(500).send({errorMessage: "Oops! Something went wrong"});
                console.log(err)
            });
    },
    // // get_house: (req, res) => {
    // //     const dbInstance = req.app.get('db');
    // //     const myId = parseInt(req.params.id);
  
    // //     dbInstance.get_house(myId)
    // //         .then( house => {
    // //             console.log(house)
    // //             res.status(200).send( house )
    // //         })
    // //         .catch( err => {
    // //             res.status(500).send({errorMessage: "Oops! Something went wrong. Our engineers have been informed!"});
    // //             console.log(err)
    // //         } );
    // // },
    
    logout: (req, res, next) => {
        req.session.destroy();
        res.status(200).send(req.session);
    }

}