$(document).ready(function () {
  //Seleccionamos todo el menu principal
  var labelNumeroJugadors = $("#labelNumeroJugadores");
  var numeroJugadores = $("#cantidadJugadores");
  var pantallaJugador = $("#pantallaJugador");
  var pulsadores = $("#pulsadoresDados");
  pulsadores.hide();//Escondemos los pulsadores

  numeroJugadores.change(function () {
    var cantidadJugadores = parseInt(numeroJugadores.val()); //recogemos el valor del select cuando cada vez que se seleccione una opción distinta
    var display = ""; //Limpiamos el div creado anteriormente por si quieren elegir de nuevo los jugadores
    for (i = 0; i < cantidadJugadores; i++) { //Mediante un bucle nuestro código html tantas veces como el valor del select de jugadores
      console.log("jugador" + i);
      display +=
        "<div class='cajaJugador'" +
        "<h4>Jugador " +
        (i + 1) +
        " : </h4>" +
        "<br />" +
        "<label  for='jugadores'>Elige Avatar:   </label>" +
        "<select name='jugadores' id='avatar'>" +
        "<option value='gato'> Gato Astronauta</option>" +
        "<option value='perro'>Perro Astronauta</option>" +
        "<option value='oso'>Oso Astronauta</option>" +
        "<option value='tiburon'>Tiburon Astronauta</option>" +
        "</select>" +
        "<br />" +
        "<label for='jugadores'>Elige color ficha:    </label>" +
        "<select name='jugadores' id='colorFicha'>" +
        "<option value='rojo'>Rojo</option>" +
        "<option value='azul'>Azul</option>" +
        "<option value='amarillo'>Amarillo</option>" +
        "<option value='verde'>Verde</option>" +
        "</select>" +
        "<div id='iconosJugadoeres'>" +
        "<img class=avatarImagen src='img/avatarGato.jpg' alt='gato' />" +
        "<img class=avatarImagen src='img/avatarPerro.jpg' alt='perro' />" +
        "<img class=avatarImagen src='img/avatarOso.jpg' alt='oso' />" +
        "<img class=avatarImagen src='img/avatarTiburon.png' alt='tiburon'/>" +
        "</div>" +
        "</div>";
    };
    pantallaJugador[0].innerHTML = display; //Imprimimos en nuestro html el bucle de código generado
  });

  var empezar = $("#start");
  var playCancion = $("#playCancionInicial");
  empezar.click(function () { //Cuando hagamos click en el botón empezar se generará todo el proceso del juego
    playCancion[0].play(); //Iniciamos la conción que tendrmes de fondo al jugar
    var jugadores = []; //Creamos un array de jugadores donde cada uno de ellos contendrá los atributos necesarios
    var cajaJugador = $(".cajaJugador");
    cajaJugador.each(function (index, elemento) { //Generamos un bucle para que recoja los valores que incorpore cada jugador
      var jugador = { //Cremaos el objeto que ira dentro del array
        numero: index + 1,
        dado: index + 1,
        avatar: $(elemento).find('select[id="avatar"]').val(), // Recogemos el valor del select dentro de la caja del jugador actual
        colorFicha: $(elemento).find('select[id="colorFicha"]').val(),
      };
      jugadores.push(jugador); //Añadimos los objetos al array
    });
  
    empezar.hide(); //Escondemos todos las secciones de eleccion del jugador
    cajaJugador.hide();
    numeroJugadores.hide();
    labelNumeroJugadors.hide();
    pulsadores.hide();

    var pantallaPulsadores = ""; //Ponemos a 0 pantallaPulsadores para que se reinicie
    var cajaPulsadores = $("#cajaPulsadores");

    jugadores.forEach(function (jugador) { //Generamos un bucle donde recorremos el array y pasamos por parametro los objetos, de esta manera se genera una seccion nueva por cada objeto
      console.log("el jugador" + jugador.numero);
      pantallaPulsadores +=
        "<div  class=seccionJugador id=jugador" +
        jugador.numero +
        ">" +
        iconosJugadores(jugador) +
        "<div   id=botonDado>" +
        "<button class='botonesDado' id='dado" +
        jugador.dado +
        "'>Mover Ficha" +
        "</button>" +
        "<button class='botonesDado' id='imagenDado" +
        jugador.numero +
        "'>Lanzar Dado jugador" +
        jugador.numero +
        "</button>" +
        "<div id='cajaDado" +
        jugador.numero +
        "'>" +
        "</div>" +
        "</div>" +
        "</div>" +
        "<button  class='botonesReiniciar' id='reiniciar" +
        jugador.dado +
        "'>Reiniciar</button>";
    });
    cajaPulsadores.html(pantallaPulsadores); //Imprimimos en nuestro html la secciones generadas

    mostrarFichas(jugadores.length); //Mediante la función mostrarFichas se verán en nuestro tablero las fuichas de cada jugador

    jugadores.forEach(function (jugador) { //Realizamos un bucle en el array de jugadores
      coloresJugadores(jugador); // Mediante la función coloresJugadores cambiamos el el estilo de la ficha de cada jugador
      lanzamientoDado(jugador.numero); // mediante la función lanzamiento dado se ejecutará todo la interacción de los jugadores con el juego
    });
  });

  //Funciones

  //Interacción del jugador
  function lanzamientoDado(numeroDado) {
    var dado = $("#dado" + numeroDado); //Seleccionamos todas las secciones que necesitamos para crear las funcionalidades necesarias
    var imagenDado = $("#imagenDado" + numeroDado);
    var cajaDado = $("#cajaDado" + numeroDado);
    var ficha = $("#ficha" + numeroDado);
    var reiniciar = $("#reiniciar" + numeroDado);
    var posicionActual = 0;

    imagenDado.click(function () { //Cuando demos click en imagen dado generaremos una imagen aleatoria , donde nos muestra el número de posiciones que tendremos que avanzar
      console.log("hago clic en imagen dado");
      var aleatorio = numeroAleatorio();
      var imagenSrc = "/img/cara" + aleatorio + ".png";
      cajaDado.html("<img class='imagenDado' src='" + imagenSrc + "'>");
    });

    dado.click(function () {  //Cuando demos click en dado moveremos la ficha hacia diferentes direcciones dependiendo de su posición
      var playCancionGanador = $("#playCancionGanador"); //Generamos la variable para a posterior inicializar la canción
      posicionActual += 105; // A la posición inicial le vamos sumando 105 pixeles en cada click
      if (posicionActual <= 525) {   //sumamos 105 en caso de que posicion actual sea 525 y moveremos la ficha hacia la derecha
        ficha.animate({ left: "+=105" }, 800);
      } else if (posicionActual > 525 && posicionActual <= 945) { //Actuamos de la misma manera pero moviendo la ficha hacia arriba
        ficha.animate({ bottom: "+=105" }, 800);
      } else if (posicionActual > 945 && posicionActual <= 1365) { //En este caso tenemos que restar para ir a la izquierda
        ficha.animate({ left: "-=105" }, 800);
      } else if (posicionActual > 1365 && posicionActual <= 1680) { //De la misma manera, restamos para ir hacia abajo
        ficha.animate({ bottom: "-=105" }, 800);
      } else if (posicionActual > 1365 && posicionActual <= 1995) {
        ficha.animate({ left: "+=105" }, 800);
      } else if (posicionActual > 1365 && posicionActual <= 2205) {
        ficha.animate({ bottom: "+=105" }, 800);
      } else if (posicionActual > 2205 && posicionActual <= 2415) {
        ficha.animate({ left: "-=105" }, 800);
      } else if (posicionActual > 2417 && posicionActual <= 2520) {
        ficha.animate({ bottom: "-=105" }, 800);
      } else if (posicionActual > 2520 && posicionActual <= 3000) {
        ficha.animate({ left: "+=105" }, 800, function () { //Realizamos una fincion para que se anime antes de que salte el alert
          playCancion[0].pause(); //Pausamos la canción inicial de fondo
          playCancionGanador[0].play(); //Activamos la canción del ganador
          alert(
            "¡FELICIDADES! Jugador " +
              numeroDado +
              ", eres el ganador de la conquista del espacio!!"
          );
        });
      };
    });
    console.log(posicionActual); //controlamos la posición mediante un console.log

    reiniciar.click(function () { //Cuando demos click en reiniciar la ficha ira a su posición inicial
      
      posicionActual = 0;
      ficha.animate({ left: posicionActual }, 800); //Generamos la animación a 0 en horizontal
      ficha.animate({ bottom: posicionActual }, 800); //Generamos la animación a 0 en vertical
      console.log("la posicion actual es" + posicionActual);
    });
  }

  //Funciones
  //Generador número aleatoreo
  function numeroAleatorio() { // Generamos un número entero aleatorio del 1 al 6
    var min = 1;
    var max = 6;
    var numeroAleatorio = Math.floor(Math.random() * (max - min + 1)) + min;
    console.log("el numero aleatorio es" + numeroAleatorio);
    return numeroAleatorio;
  }

  //Generador de iconos
  function iconosJugadores(jugador) {
    console.log(jugador.avatar);
    var imagenAvatar = ""; //Reiniciamos el valor de imagenAvatar
    switch (
      jugador.avatar //mediante el parámetro jugador podemos acceder al valor avatar y dependiendo de el se le asiganrá una imagen u otra
    ) {
      case "gato":
        imagenAvatar =
          "<img class='avatarImagen' src='img/avatarGato.jpg' alt='gato' />";
        break;
      case "perro":
        imagenAvatar =
          "<img class='avatarImagen' src='img/avatarPerro.jpg' alt='perro' />";
        break;
      case "oso":
        imagenAvatar =
          "<img class='avatarImagen' src='img/avatarOso.jpg' alt='oso' />";
        break;
      case "tiburon":
        imagenAvatar =
          "<img class='avatarImagen' src='img/avatarTiburon.png' alt='tiburon' />";
        break;
    }
    return imagenAvatar;
  }

  //Generador colores
  function coloresJugadores(jugador) {
    console.log(jugador.colorFicha); //controlamos que color de ficha tiene el objeto
    var colorFicha = $("#ficha" + jugador.numero); //Seleccionamos el elemento ficha y le asociamos el número de ficha del objeto
    switch (
      jugador.colorFicha //Dependiendo el valor que contenga el objeto le asociaremos un estilo css
    ) {
      case "rojo":
        colorFicha.css("background-color", "rgba(247, 113, 113, 0.93)");
        break;
      case "azul":
        colorFicha.css("background-color", "rgb(82, 82, 228)");
        break;
      case "amarillo":
        colorFicha.css("background-color", "rgb(225, 225, 123");
        break;
      case "verde":
        colorFicha.css("background-color", "rgb(148, 236, 148)");
        break;
    }
    return colorFicha;
  }

  //Generador de fichas
  function mostrarFichas(numeroJugadores) {
    var numeroFichas = $("#boxFichas");
    var fichas = ""; //Reiniciamos el valor de ficha
    for (i = 1; i <= numeroJugadores; i++) { //Mediante un bucle asociado al parámetro que nos dira el número de jugadores incluimos un html donde se visualizarán nuestras fichas
      fichas += "<div class='ficha' id='ficha" + i + "'></div>";
    numeroFichas.html(fichas); //Imprimimos nuestro html
  };
};
});