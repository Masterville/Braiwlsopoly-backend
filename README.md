# monopolyGame

## Algunas suposiciones que se consideran relevantes
- Los endpoints han sido testeados para resistir todo tipo de entradas y validaciones de errores, por lo que deberían ser de tipo safe-use. También se hicieron validaciones de lógica más internos, por lo que esperamos cumplir con esto con la banda A, de una implementación extra.
- Además de eso, también se han creado los ferrocarriles, los servicios, las propiedades, con las características originales del monópoly, que solo puedes construir si tienes todos los colores, que solo puedes construir las casas en orden, hipotecarlas en orden, hipotecar una propiedad sin casa, etc... todo esto se ha logrado implementar exitosamente de forma idéntica al original.
- Lo único que no se implementó del monópoly fueron los eventos que se ocasionan al sacar de estar tarjetas de la fortuna y del cofre ya que requerían mayor tiempo de desarrollo, quizás con 2 o 3 días era suficiente pero con tantos exámenes aproximándose me fue practicamente imposible. Sin embargo, todo lo demás debería estar correctamente implementado siendo fiel al monópoly original.
- Existen variables tipo permanente y tipo temporal, las temporales son las que guardan datos que no son importantes y no se escriben en la base de datos, sin embargo, pueden ser relevantes para informar sobre procesos que están ocurriendo como los status, etc... que sirven al frontend. las variables que son escritas en piedra, osea en la base de datos, se encuentran contenidas en el método updateState, que basicamente cumple esa función.
- Se han implementado distintas interfaces de lógica, GameManager maneja la logica de creacion de objetos, utiliza también una instancia de CreateObjects y FindObjects para poder modularizar un poco más el código. DBManager maneja ya el tipo de acciones que interactúan de forma directa con la base de datos. los usuarios usan su propio administrador de acciones que es UsersManager.
- Los usuarios no tienen una representación con entidad, es la única entidad sin una entidad como tal.
- La seeder de MoldSquare es fundamental para rellenar el tablero, sin ejecutar esa seeder, el programa no funcionaría, por lo que es de suma relevancia para poder rellenar el tablero.
- Nose que mas consideraciones agregar, pero espero que todas las anteriores sean en cierto sentido útiles.
- Casi lo olvidaba, la direccion del backend es la siguiente: https://monopolygame-66k3.onrender.com.

## Instrucciones para poder ejecutar correctamente el backend
- Hola, para comenzar, en las semillas se genera un administrador por default que tiene acceso de admin, por lo que tiene la capacidad de crear juegos que es la "habilidad especial" por así decirlo de lo que pueden hacer, a diferencia de los usuarios normales.
Las credenciales de ese admin son las siguientes:

username: randall
mail: rfbiermann@uc.cl
password: fabrirandon
(Estos datos son generados por la semilla, pero puedes logearte usando estas credenciales).

Las credenciales son ficticias, no es que ese sea realmente mi contraseña de correo uc.

- Puedes hacer sign up de un nuevo usuario inventando nuevas credenciales para poder tener al menos 2 usuarios para poder hacer esto más interactivo.

- Luego de tener a los 2 usuarios registrados y logeados en el sitio web, ojo que hacer registro también implica logearse, simulando el comportamiento de sitios webs reales, como administrador, osea, usando el usuario con role admin que es el generado en la semilla, debes crear un juego usando el endpoint games/create, con eso crearás un juego pero solo eso ya que estará vacío, sin embargo, el juego reconoce quién fue el admin que lo creó, por lo que se actualizará la variable creadoPor con el valor de "randall" si usaste el admin generado en la semilla.

- Después, debes usar el endpoint games/join para poder unirte a la sala en la que deseas entrar, puedes usar al admin y luego a un usuario más para tener a 2 usuarios en una misma saa, a nosotros nos gusta usar como ejemplo al legendario pepito.

- Luego de tener una sala con 2 usuarios que se han unido, debes usar el endpoint /games/vote para poder votar si deseas comenzar la partida, cuando todos votaron que si quieren comenzar, entonces cualquiera que esté presente en la sala tiene la capacidad de comenzar el juego usando el endpoint /games/start, que ya les dará un numero de turno, para definir un orden, etc...

- Finalmente, se debe usar el endpoint games/action para poder jugar en el juego creado, que ya no será una sala, ahora se ha convertido en un juego jugable.

## Documentación de endpoints del usuario

### POST /signup: endpoint encargado de registrar a un usuario en la base de datos.
recibe en el body como parámetros obligatorios:
- username: es el nombre del usuario
- mail: es el correo del usuario
- password: es la contraseña del usuario
### POST /login: endpoint encargado de hacer el login de un usuario
recibe en el body como parámetros obligatorios:
- mail: es el correo del usuario
- password: es la contraseña del usuario

## Documentación de endpoint de los juegos

### POST /games/create: endpoint encargado de crear un juego en la base de datos, solo los admin tenen autorización.
recibe en el body como parámetros obligatorios:
- NADA ya que los datos son sacados directamente el token del usuario logeado.

### GET /games/unfinished: endpoint encargado de retornar una lista de todos los juegos que no han finalizado.

### GET /games/:idGame: endpoint encargado de encontrar un juego por medio de su id de juego, retorna el juego que coincide con idGame entregado en la url.

### POST /games/join: endpoint encargado de unirse a un juego. Por lógica intena, se maneja que esto solo se pueda realizar si es que el juego NO ha comenzado entre otras validaciones.
recibe en el body como parámetros obligatorios:
- idGame: es un entero con el id del juego en el que desea unirse, el id debe existir, sino, habrá un error.
- nombrePlayer: es un nickname con un string que es un mote que usará el usuario para jugar en el juego, se realizan muchas validaciones internamente como que el largo no exceda una gran cantidad en el nick, etc...
### POST /games/vote: endpoint encargado de votar si se desea comenzar la partida, cuando un juego tiene como variable gameComenzado = false, le diremos que es una sala, por lo que la votación sirve para indicar si se desea comenzar la partida.
recibe en el body como parámetros obligatorios:
- idGame: es un entero con el id del juego en el que se desea votar, el id debe existir, sino, habrá un error.
- voteStart: es un booleano que indica si se desea comenzar la partida, es una variable tipo temporal, por lo que si se resetea el servidor, los usuarios deberán volver a votar.
### POST /games/start: endpoint encargado de comenzar la partida, para que esto sea factible, deben haber al menos 2 jugadores en la sala siempre se validará de que no supere la cantidad de 4, también, debe ocurrir de que todos los jugadores deben votar true en el endpoint anterior, si eso se cumple, si todos están de acuerdo con comenzar la partida, cualquier jugador puede invocar a este endpoint para empezar.
recibe en el body como parámetros obligatorios:
- idGame: es un entero con el id del juego en el que se desea comenzar.

### POST /games/leave: endpoint encargado de salir de una sala, para que esto sea factible, la partida debe tener como gameComenzado = false, sino, el usuario NO podrá salir de una partida ya inicializada.
recibe en el body como parámetros obligatorios:
- idGame: es un entero con el id del juego (sala) en el que se desea salir.

### POST /games/action: endpoint más importante ya que es el encargado de procsar las acciones que hace el jugador para poder lanzar dados, moverse, etc...
recibe en el body como parámetros obligatorios:
- idGame: es un entero con el id del juego en el que se desea jugar.
- action: es un string con el comando de la acción que se desea ejecutar en el juego.
- COMANDOS (seccion menu principal):
- movemap: sirve para lanzar los dados y desplazarse en el mapa.
- buildhouse: sirve para construir una casa, cuando se invoca, luego se solicita el id de la casa donde se desea construir, siempre y cuando existan elementos que cumplan la condición, sino, retornará una lista vacía.
- mortgagepossession: sirve para poder hipotecar una propiedad, funciona en términos de lógica igual al comando anterior.
- unmortgagepossession: sirve para deshipotecar una propiedad.
- endturn: sirve para terminar el turno
- COMANDOS (seccion comprar propiedad):
- buy: sirve para comprar la propiedad.
- nobuy: sirve para decidir no comprar la propiedad.
Toda esta información, se puede encontrar en GameConstans.js que es el archivo con todas las constantes del juego.

## Documentación de endpoint de los usuarios

### GET /users/all: endpoint encargado de retornar todos los usuarios que se encuentran en la base de datos, se puede apreciar su rol, password hasheada, etc... es de uso EXCLUSIVO para el admin.

### GET /users/player/:idGame: endpoint disponible para todos los usuarios, retorna el player del jugador que se ha logeado en un juego en específico. esto sirve para obtener la representación del user logeado que es el player en un determinado juego.

### GET /users/games: endpoint encargado de retornar todos los juegos en los que se encuentra el usuario del token, retorna todos los que no han terminado de ese usuario y donde el usuario se encuentre jugando.