const express = require("express");
const router = express.Router();
const Joi = require("joi");//permet de définir schémas :structure attendue des données,règles à appliquer.
const validateRequest = require("_middleware/validate-request");//fction appelée pour valider requête en utilisant schéma
const Role = require("_helpers/role");
const userService = require("./user.service");
const jwt = require("jsonwebtoken");
const authenticateToken = require("_middleware/token");


// Définition des routes pour gérer les requêtes HTTP entrantes (avec leurs endpoints et URL)

router.get("/", authenticateToken, getAll);
router.get("/:id", authenticateToken, getById);
router.post("/", authenticateToken, createSchema, create);
router.put("/:id", authenticateToken, updateSchema, update);
router.delete("/:id", authenticateToken, _delete);

// Fonctions de rappel pour chaque route en utilisant userService (fichier user.service.js)

function getAll(req, res, next) {
  userService
    .getAll()
    .then((users) => res.json(users))
    .catch(next);
}

function getById(req, res, next) {
  userService
    .getById(req.params.id)
    .then((user) => res.json(user))
    .catch(next);
}

function create(req, res, next) {
  userService
    .create(req.body)
    .then(() => res.json({ message: "User created" }))
    .catch(next);
}

function update(req, res, next) {
  userService
    .update(req.params.id, req.body)
    .then(() => res.json({ message: "User updated" }))
    .catch(next);
}

function _delete(req, res, next) {
  userService
    .delete(req.params.id)
    .then(() => res.json({ message: "User deleted" }))
    .catch(next);
}

// Fonctions des schémas de validation pour les routes create et update

function createSchema(req, res, next) {
  const schema = Joi.object({
    title: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    role: Joi.string().valid(Role.Admin, Role.User).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
  });
  validateRequest(req, next, schema);
}

function updateSchema(req, res, next) {
  const schema = Joi.object({
    title: Joi.string().empty(""),
    firstName: Joi.string().empty(""),
    lastName: Joi.string().empty(""),
    role: Joi.string().valid(Role.Admin, Role.User).empty(""),
    email: Joi.string().email().empty(""),
    password: Joi.string().min(6).empty(""),
    confirmPassword: Joi.string().valid(Joi.ref("password")).empty(""),
  }).with("password", "confirmPassword");
  validateRequest(req, next, schema);
}
//Export de la fonction router pour utilisation dans d'autres fichiers
module.exports = router;
