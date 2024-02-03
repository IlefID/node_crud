const express= require("express");
const router = express.Router();
const User =require('../models/users');
const multer = require('multer');

const fs = require("fs");
//image upload
var storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null, "./uploads");
    },
    filename: function(req,file,cb){
        cb(null, file.fieldname +"_"+ Date.now()+"_"+ file.originalname);
    },
});

var upload = multer({
    storage: storage
}).single("image");

// insert an user into database route
router.post("/add", upload, async (req, res) => {
    try {
        const newUser = new User({
            nom: req.body.nom,
            prenom: req.body.prenom,
            email: req.body.email,
            telephone: req.body.telephone,
            image: req.file.filename,
        });

        await newUser.save();  

        req.session.message = {
            type: 'success',
            message: 'Utilisateur ajouté avec succès !'
        };
        res.redirect('/');
    } catch (err) {
        res.json({ message: err.message, type: 'danger' });
    }
});


// Get all users route
/**router.get("/",(req,res) =>{
    User.find().exec((err, users) => {
        if(err)
        {
            res.json({ message: err.message});
        }
        else{
            res.render('index',{
                title:'Home Page',
                users: users,
            })
        }
    })
});*/
router.get("/", async (req, res) => {
    try {
        const users = await User.find().exec(); 
        res.render('index', { title: 'Home Page', users });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});
/**router.get("/",(req,res) =>{
    res.render('index',{title:'Home Page'})
});*/

// edit an user route
router.get("/edit/:id", async (req, res) => {
    try {
        let id = req.params.id;
        const user = await User.findById(id).exec();

        if (user == null) {
            res.redirect("/");
        } else {
            res.render("edit_users", {
                title: "Edit User",
                user: user,
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

//update user route
router.post("/update/:id", upload, async (req, res) => {
    try {
        let id = req.params.id;
        let new_image = "";

        if (req.file) {
            new_image = req.file.filename;
            try {
                fs.unlinkSync("./uploads/" + req.body.old_image);
            } catch (err) {
                console.log(err);
            }
        } else {
            new_image = req.body.old_image;
        }

        const result = await User.findByIdAndUpdate(
            id,
            {
                nom: req.body.nom,
                prenom: req.body.prenom,
                email: req.body.email,
                telephone: req.body.telephone,
                image: new_image,
            },
            { new: true } 
        ).exec();

        req.session.message = {
            type: 'success',
            message: 'User updated successfully!',
        };
        res.redirect("/");
    } catch (err) {
        console.error(err);
        res.json({ message: err.message, type: 'danger' });
    }
});

//delete user route 
router.get('/delete/:id', async (req, res) => {
    try {
        let id = req.params.id;

        const result = await User.findByIdAndDelete(id).exec();

        if (result.image != '') {
            try {
                fs.unlinkSync('./uploads/' + result.image);
            } catch (err) {
                console.log(err);
            }
        }

        req.session.message = {
            type: "info",
            message: "User deleted successfully!",
        };
        res.redirect("/");
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

router.get("/add",(req,res) =>{
    res.render('add_users',{title:'Add Users'})
});

module.exports = router;






































// recherche par nom ou par prenom dans la base 

/* router.get("/about", async (req, res) => {
    try {
        let nom = req.query.nom || '';
        let prenom = req.query.prenom || '';

        nom = nom.trim();
        prenom = prenom.trim();

        if (!nom && !prenom) {
            // Si ni le nom ni le prénom n'ont été saisis, affichez une page vide ou un message.
            return res.render('search', { users: [], searchTerm: nom + ' ' + prenom });
        }

        const results = await User.find({
            $or: [
                { nom: { $regex: nom, $options: 'i' } },
                { prenom: { $regex: prenom, $options: 'i' } }
            ]
        });

        // Utilisez une vue partielle pour renvoyer seulement le contenu des résultats
        res.render('search', { users: results, searchTerm: nom + ' ' + prenom }, (err, html) => {
            if (err) {
                res.json({ message: err.message, type: 'danger' });
            } else {
                // Renvoyer le contenu HTML des résultats au client
                res.send(html);
            }
        });
    } catch (err) {
        res.json({ message: err.message, type: 'danger' });
    }
});

//recherche(vrai)
/**router.get('/recherche', async(req,res)=>{
    try{
        let nom=req.body.nom;
        let prenom=req.body.prenom;

        if (!nom && !prenom) {
            res.send("page vide");
        }
        else{
            await User.find({  $or: [{ nom: { $regex: nom } },{ prenom: { $regex: prenom} } ]}).then((resultat) =>{
                res.send(resultat);
            });
           /* req.session.message = {
                type: 'success',
                message: 'la liste des utilisateur'
            };
            res.redirect('/recherche');
            
        }        
    }
    catch(err)
    {
        console.log(err);
    }
});*/

//recherche 22222222
/*router.get('/about', async(req,res)=>{
    try{
        let nom=req.body.nom;
        let prenom=req.body.prenom;

        const result = await User.find({ $or: [{ nom: { $regex: nom } },{ prenom: { $regex: prenom} } ]}).exec();
        res.render('/search', { title: 'Page de recherche', result});
        
        
        /*if (!nom && !prenom) {
            res.send("page vide");
        }
        else
        {
            const result = await User.find({ $or: [{ nom: { $regex: nom } },{ prenom: { $regex: prenom} } ]}).exec();
            res.render('search', { title: 'Page de recherche', result}); 
        };

    }       
    catch(err)
    {
        console.log(err);
    }
});*/