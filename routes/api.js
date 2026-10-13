'use strict';

const issueStore = require('../services/issueStore');

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      const project = req.params.project;
      const result = issueStore.get(project, req.query);
      return res.json(result);
    })
    
    .post(function (req, res){
      const project = req.params.project;
      const result = issueStore.create(project, req.body);
      return res.json(result);
    })
    
    .put(function (req, res){
      const project = req.params.project;
      const result = issueStore.update(project, req.body);
      return res.json(result);
    })
    
    .delete(function (req, res){
      const project = req.params.project;
      const result = issueStore.delete(project, req.body._id);
      return res.json(result);
    });
    
};
