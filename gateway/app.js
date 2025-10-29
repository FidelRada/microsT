var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var cors = require('cors');

const proxy = require('express-http-proxy');
const { verifyToken, addUserHeader } = require('./middleware/auth');
const authRouter = require('./routes/auth');

// Routers de la API
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors({
  origin: '*', // Permitir solicitudes desde cualquier origen
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
})); 

// Rutas de la API con autenticación
app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use('/auth', authRouter); //para login y logout

//RUTAS de microservicios
const INSCRIPCION_SERVICE_URL = "http://app:3001"; // Cambiar localhost por el nombre del servicio
const CURSOS_SERVICE_URL = "http://cursos:3002"; // Cambiar localhost por el nombre del servicio

// Proxy para Microservicio de Inscripción (Acceso Público, NO requiere Auth)
// Ejemplo: El catálogo de inscripciones es visible para todos.
app.use('/api/curso', proxy(CURSOS_SERVICE_URL), (req, res) => {
  // Aquí puedes agregar lógica adicional si es necesario
  console.log('Petición proxy a /api/curso');
});

app.use('/api/inscripcion', proxy(INSCRIPCION_SERVICE_URL), (req, res) => {
  // Aquí puedes agregar lógica adicional si es necesario
  console.log('Petición proxy a /api/inscripcion');
});


/*/ Proxy para Microservicio de INSCRIPCIÓN (Acceso Protegido)
// Todas las peticiones a /api/inscripcion primero pasan por 'verifyToken'.
app.use('/api/inscripcion', verifyToken, proxy(INSCRIPCION_SERVICE_URL, {
  // Esta función intercepta la petición *después* de la verificación de token
  // y añade el encabezado X-User-ID para el microservicio interno.
  proxyReqOptDecorator: addUserHeader,
}));
*/
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
