'use strict';

const express     = require('express');
const bodyParser  = require('body-parser');
const cors        = require('cors');
const path        = require('path');
require('dotenv').config();

const apiRoutes         = require('./routes/api.js');
const fccTestingRoutes  = require('./routes/fcctesting.js');
const runner            = require('./test-runner');

let app = express();

app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(cors({origin: '*'})); //For FCC testing purposes only

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Sample front-end
app.route('/:project/')
  .get(function (req, res, next) {
    res.sendFile(path.join(__dirname, 'views', 'issue.html'), function (err) {
      if (err) next(err);
    });
  });

//Index page (static HTML)
app.route('/')
  .get(function (req, res, next) {
    res.sendFile(path.join(__dirname, 'views', 'index.html'), function (err) {
      if (err) next(err);
    });
  });

//For FCC testing purposes
fccTestingRoutes(app);

//Routing for API 
apiRoutes(app);  
    
//404 Not Found Middleware
app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});

//Global Error Handler Middleware (Prevents serverless 500 FUNCTION_INVOCATION_FAILED crashes)
app.use(function(err, req, res, next) {
  console.error('Unhandled server error:', err);
  if (!res.headersSent) {
    res.status(500).type('text').send(err.message || 'Internal Server Error');
  }
});

//Start server only in non-serverless environments
if (!process.env.VERCEL) {
  const listener = app.listen(process.env.PORT || 3000, function () {
    console.log('Your app is listening on port ' + listener.address().port);
    if(process.env.NODE_ENV==='test') {
      console.log('Running Tests...');
      setTimeout(function () {
        try {
          runner.run();
        } catch(e) {
          console.log('Tests are not valid:');
          console.error(e);
        }
      }, 3500);
    }
  });

  listener.on('error', function (err) {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${process.env.PORT || 3000} is already in use. Continuing...`);
    } else {
      console.error(err);
    }
  });
}

module.exports = app; //for testing and serverless export
