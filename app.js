//Utilisation de fonction et import de modules
const { app, port } = require("./server");
const path = require("./routes");
const cors = require("cors");


//Ajout du middleware cors
app.use(cors());


//Configuration des routes de l'application
path.articlesPath(app);
path.mediasPath(app);
path.loginPath(app);


//Utilisation méthode listen de l'objet app: démarrage du serveur
app.listen(port, () => {
  console.log("Server listening on port " + port);
});
