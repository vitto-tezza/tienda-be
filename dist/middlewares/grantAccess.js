"use strict";Object.defineProperty(exports, "__esModule", {value: true});var _roles = require('../roles');

const grantAccess = (action, resource) => {
  return async (req, res, next) => {
    const permission = _roles.roles.can(req.payload.role)[action](resource);

    if (!permission.granted) {
      return res.status(403).json({ error: "No tienes permiso para realizar esta acción." });
    }

    next();
  };
};

exports. default = grantAccess;
