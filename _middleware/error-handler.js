//capturer et gérer les erreurs qui se produisent pendant l'exécution d'une application Node.js

function errorHandler(err, req, res, next) {
  //instuction switch qui teste différentes conditions 
  switch (true) {
    case typeof err === "string":
      // si l’erreur passée en paramètre est de type chaîne de caractères, alors la fonction vérifie si l’erreur se termine par “not found” et définit un code d’état HTTP en conséquence (404 si c’est le cas, 400 sinon)
      //sinon la fonction renvoie une réponse JSON avec un code d’état HTTP 500 et le message d’erreur.
      const is404 = err.toLowerCase().endsWith("not found");
      const statusCode = is404 ? 404 : 400;
      return res.status(statusCode).json({ message: err });
    default:
      return res.status(500).json({ message: err.message });
  }
}

module.exports = errorHandler;
