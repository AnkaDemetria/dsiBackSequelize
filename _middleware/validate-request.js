function validateRequest(req, next, schema) {
  //Création d'un objet options pour configurer le comportement de la validation. Cet objet a trois propriétés:
  const options = {
    abortEarly: false, // include all errors
    //propriété abortEarly est définie sur false, ce qui signifie que la validation ne s’arrêtera pas à la première erreur rencontrée, mais continuera jusqu’à ce que toutes les erreurs soient trouvées
    allowUnknown: true, // ignore unknown props
    //propriétés inconnues (c’est-à-dire celles qui ne sont pas définies dans le schéma) dans le corps de la requête seront ignorées 
    stripUnknown: true, // propriétés inconnues seront supprimées du corps de la requête après la validation
  };
  
  const { error, value } = schema.validate(req.body, options);
  if (error) {
    next(`Validation error: ${error.details.map((x) => x.message).join(", ")}`);
  } else {
    req.body = value;
    next();
  }
}

module.exports = validateRequest;
