//Import objet DataTypes du module Sequelize
const { DataTypes } = require("sequelize");

function model(sequelize) {
  const attributes = {
    email: { type: DataTypes.STRING, allowNull: false },
    passwordHash: { type: DataTypes.STRING, allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false },
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.STRING, allowNull: false },
  };

  //Définition des options du modèle utilisateur
  const options = {
    defaultScope: {//définit les attributs à exclure par défaut
      // exclu le password par defaut
      attributes: { exclude: ["passwordHash"] },
    },
    scopes: {//définit la portée pour les requêtes
      // inclu hash dans la portée
      withHash: { attributes: {} },
    },
  };

  //Utilisation de la méthode define() de l'objet sequelize (modèle "user" avec attributs et options)
  return sequelize.define("User", attributes, options);
}

module.exports = model;
