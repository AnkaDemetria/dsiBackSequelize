const config = require("config.json");
const mysql = require("mysql2/promise");
const { Sequelize } = require("sequelize");//import objet sequelize du module sequelize

module.exports = db = {};

initialize();//appel de la fonction initialize appelée plus bas dans le code

async function initialize() {
  // fonction asynchrone initialise la base de données en utilisant les paramètres extraits précédemment
  const { host, port, user, password, database } = config.database;
  const connection = await mysql.createConnection({
    host,
    port,
    user,
    password,
  });
  //Exécution d'une requête SQL pour créer la base de données si elle n’existe pas déjà
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);

  // création d'une instance de l’objet Sequelize en utilisant les paramètres de connexion à la base de données.
  const sequelize = new Sequelize(database, user, password, {
    dialect: "mysql",
  });

  // Initialisation  du modèle utilisateur en utilisant l’instance de l’objet Sequelize et ajout à l’objet exporté db.
  db.User = require("../users/user.model")(sequelize);

  // synchronisation de tous les modèles avec la base de données en utilisant la méthode .sync() de l’objet Sequelize.

  await sequelize.sync({ alter: true });
}
