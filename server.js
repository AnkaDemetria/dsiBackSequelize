//Initialisation des bibliothèques utilisées de NodeJS et importation de ces modules,
// initialisation du port
require("rootpath")();
const express = require("express");
const cors = require("cors");//permet de spéciier quelles origines peuvent accéder aux ressources
const multer = require("multer");
const mysql = require("mysql");
const app = express();
const errorHandler = require("_middleware/error-handler");
const port = 3004;

/* Création des constantes pour utiliser le serveur https */
const fs = require("fs");
const path = require("path");
const https = require("https");
 
/* Récupération de la clé privée et du certificat ( dans le dossier certificate) */
const key = fs.readFileSync(path.join(__dirname, 'certificate', 'server.key'));
const cert = fs.readFileSync(path.join(__dirname, 'certificate', 'server.cert'));
 
const options = { key, cert };
 
/* Création serveur HTTPS */
https.createServer(options, app).listen(3004, () => {
  console.log('App is running ! Go to https://localhost:3004');
});

// Initialisation constante app et Utilisation de la méthode use (d'Express)
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// api routes
app.use("/users", require("./users/user.controller"));
app.use("/login", require("./routes/login"));

// Utilisation gestionnaire d'erreurs
app.use(errorHandler);


//création connexion à la base de données
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  port: 3306,
  database: "dsimed",
});

// Connexion à la base de données
db.connect((err) => {
  if (err) throw err;
  console.log("Connecté à la base de données");
});

// Configuration du stockage Multer (facilite gestion fichiers téléchargés)
const storage = multer.diskStorage({
  destination: "uploads/",
  upload: (req, fichier, cb) => {
    //  Générer un nom de fichier unique en ajoutant un horodatage au nom de fichier d’origine
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + extension);
  },
});

// Création d'une instance Multer avec la configuration de stockage
const upload = multer({ storage: storage });

// Définition d'un itinéraire pour le téléchargement de fichiers
app.post("/upload", upload.single("file"), (req, res) => {
  //  Obtenir les détails du fichier téléchargé
  const file = req.file;

  // Insertion du chemin d’accès au fichier dans la base de données
  const filePath = file.path;
  db.query(
    "INSERT INTO media_files (file_path) VALUES (?)",
    [filePath],
    (err, result) => {
      if (err) {
        console.error(err);
        res
          .status(500)
          .send(
            "Erreur lors de l’insertion d’un fichier dans la base de données"
          );
      } else {
        res.send("Fichier téléchargé et inséré dans la base de données");
      }
    }
  );
});

module.exports = { app, port, db };
