// Initialisation et import de modules
const bcrypt = require("bcryptjs");
const db = require("_helpers/db");//permet au module d'accéder au modèle de la base de données

//Utilisation méthodes asynchrones
async function getAll() {
  return await db.User.findAll();//renvoie tous les utilisateurs de la base de données
}

async function getById(id) {
  return await getUser(id);//renvoie un utilisateur spécifique par son id
}


async function create(params) {
  // création nouvel utilisateur si email non enregistré déjà
  if (await db.User.findOne({ where: { email: params.email } })) {
    throw 'Email "' + params.email + '" is already registered';
  }
  const user = new db.User(params);

  // Hachage du password (en utilisant fction hash() du module bcrypt)
  user.passwordHash = await bcrypt.hash(params.password, 10);

  // Enregistrement de l'utilisateur dans la base de données
  await user.save();
}


async function update(id, params) {
  const user = await getUser(id);

  // mise à jour utilisateur existant
  const emailChanged = params.email && user.email !== params.email;
  if (
    emailChanged &&
    (await db.User.findOne({ where: { email: params.email } }))
  ) {
    throw 'Email "' + params.email + '" is already registered';
  }

  // si nouveau password: il est hâché et stocké dans passwordHash
  if (params.password) {
    params.passwordHash = await bcrypt.hash(params.password, 10);
  }

  // Copie des params dans objet utilisateur et enregistrement base de données
  Object.assign(user, params);
  await user.save();
}


async function _delete(id) {
  //suppression utilisateur en fonction de son id
  const user = await getUser(id);
  await user.destroy();
}

// Fonction helper: recherche utilisateur par id

async function getUser(id) {
  const user = await db.User.findByPk(id);
  if (!user) throw "User not found";
  return user;
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: _delete,
};
