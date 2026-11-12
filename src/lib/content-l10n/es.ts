import type { ContentL10n } from "./types";
export const es: ContentL10n = {
  "les-jours-de-camille": {
    tagline: "Una carta olvidada entre las páginas de un libro de segunda mano.",
    synopsis: "Camille trabaja en una pequeña librería independiente de Montmartre. Al ordenar una caja de libros de segunda mano, encuentra una carta antigua que nunca se envió. La curiosidad la lleva por las calles del barrio — del café de la esquina al mercado del sábado — y revela conexiones inesperadas entre los vecinos.",
    setting: "Montmartre, París — calles empinadas, cafés de esquina y una librería llamada « La Page Tournée ».",
    culturalContext: "Cafés de barrio, librerías independientes, mercados callejeros, la rutina parisina, conversaciones informales y expresiones cotidianas.",
    characters: [
      ["Librera", "Observadora y algo tímida, adora los libros usados porque guardan las historias de otros lectores."],
      ["Dueño de la librería", "Conoce el barrio desde hace cincuenta años y habla despacio, siempre con una anécdota."],
      ["Amiga de Camille", "Barista en el Café des Abbesses, práctica y divertida; manda audios demasiado largos."],
      ["Florista del mercado", "Vende flores en la Rue Lepic desde hace décadas. Quizá sepa algo de la carta."],
    ],
    episodes: {
      "la-lettre": {
        intro: "Una mañana tranquila en la librería y un descubrimiento inesperado.",
        context: "Camille abre la librería a las nueve. Monsieur Bernard le ha dejado una caja de libros de segunda mano para ordenar.",
        vocab: ["la librería (¡no la biblioteca!)", "un libro de segunda mano", "el mostrador", "un sobre", "un sello", "dudar, vacilar"],
        expr: ["las nueve menos diez (8:50)", "No es mío / no me pertenece", "No pienso en otra cosa"],
        grammar: [
          ["Presente de los verbos en -er", "La mayoría de los verbos franceses terminan en -er y siguen el mismo modelo: je -e, tu -es, il/elle -e, nous -ons, vous -ez, ils -ent. Camille narra su día en presente."],
          ["La negación ne… pas", "En francés la negación rodea al verbo: ne + verbo + pas. Delante de vocal, ne se convierte en n'."],
        ],
        culture: [
          ["Librerías independientes", "Francia protege las librerías independientes con la « loi Lang » (1981), que fija el precio de los libros nuevos. Por eso barrios como Montmartre conservan pequeñas librerías cuyos libreros conocen a los clientes por su nombre."],
          ["La Rue Lepic", "Una calle sinuosa que sube la colina de Montmartre, conocida por su mercado, sus panaderías y sus pequeños comercios. Es una calle de vecinos, no solo de turistas."],
        ],
        prompt: ["El diario de Camille", "Escribe en francés, en primera persona, como si fueras Camille. Usa el presente y al menos una negación (ne… pas). Habla de tus emociones y de tu plan para el día siguiente."],
      },
      "message-ines": {
        intro: "Camille se lo cuenta todo a su amiga. La respuesta llega en forma de audio.",
        context: "Esa misma noche, Camille le manda a Inès una foto del sobre. A la mañana siguiente recibe un largo mensaje de voz.",
        vocab: ["hola (muy informal)", "café con leche cremosa", "el dueño / el jefe", "la ventana", "esperar"],
        expr: ["Es súper… (informal, entre amigos)", "En fin / total", "Hay mucha gente", "Besos (despedida entre amigos)"],
        grammar: [
          ["Presente + depuis × il y a + duración", "Presente + depuis indica una acción que empezó en el pasado y continúa: « il attend depuis des années » = lleva años esperando. Il y a + duración, con un tiempo pasado (passé composé), dice hace cuánto ocurrió un hecho terminado: « j'ai trouvé la lettre il y a deux jours » = encontré la carta hace dos días. No son intercambiables."],
          ["Futuro próximo y propuestas", "En la lengua hablada, el presente sirve para proponer: « Samedi, tu passes au café ? ». También se usa aller + infinitivo: « On va aller au marché »."],
        ],
        culture: [
          ["Audios y registro informal", "Entre amigos, el francés hablado se acorta y se suaviza: « coucou », « bref », « trop + adjetivo ». El pronombre « on » sustituye casi siempre a « nous » en la conversación."],
          ["Los habituales del café", "Muchos cafés de barrio tienen sus « habitués »: clientes que llegan siempre a la misma hora y se sientan en la misma mesa. El camarero conoce el pedido sin preguntar. El café es una prolongación del salón de casa."],
        ],
        prompt: ["Responder a Inès", "Escribe un mensaje informal en francés para Inès. Usa « coucou » u otro saludo, haz dos preguntas y termina con una despedida informal."],
      },
      "marche-lepic": {
        intro: "En el mercado de la Rue Lepic, Madame Leroux reconoce un nombre.",
        context: "Sábado por la mañana. Camille e Inès cruzan el mercado entre quesos, frutas y flores hasta el puesto de Madame Leroux.",
        vocab: ["el mercado", "una tienda pequeña", "enfrente", "un sombrero", "irse, marcharse"],
        expr: ["¿Tiene un minuto? (petición educada)", "cariño, guapa (afectuoso, de una persona mayor)", "Toma / Aquí tienes (al entregar algo)"],
        grammar: [
          ["Passé composé con être", "Los verbos de movimiento como partir, arriver o aller forman el pasado con être, y el participio concuerda con el sujeto: elle est partie."],
          ["Tu y vous", "Camille trata de « vous » a Madame Leroux por respeto; la florista la tutea, algo habitual en una persona mayor y cercana."],
        ],
        culture: [
          ["Los mercados callejeros", "París tiene más de 70 mercados de alimentación. Ir al mercado el sábado es un ritual: charlar con los vendedores, probar quesos, elegir fruta de temporada."],
          ["Primero, saludar", "En tiendas, puestos y cafés franceses — como el mercado de la Rue Lepic — se espera un « Bonjour » antes de cualquier pedido; saltárselo suele sonar brusco. Por eso Camille saluda a Madame Leroux antes de hablar de la carta."],
        ],
        prompt: ["¿Y después del mercado?", "Continúa la historia en francés, en tercera persona. Usa al menos dos verbos en passé composé (con avoir o être). Mantén la coherencia de los personajes."],
      },
    },
  },
  "zwischen-den-strassen": {
    tagline: "Una fotografía antigua y una ciudad que nunca deja de cambiar.",
    synopsis: "Lukas estudia arquitectura en Berlín. Para un proyecto universitario sobre barrios en transformación, recorre Prenzlauer Berg con su cuaderno de dibujo. En un mercadillo encuentra una foto antigua de una calle que ya no es como era — y decide averiguar quién aparecía en ella.",
    setting: "Berlín — Prenzlauer Berg, el U-Bahn amarillo, edificios antiguos con patios interiores y el Mauerpark los domingos.",
    culturalContext: "Vida cotidiana alemana, transporte público, arquitectura, panaderías, vida universitaria y tradiciones locales.",
    characters: [
      ["Estudiante de arquitectura", "Dibuja todo lo que ve. Puntual, curioso y algo distraído cuando encuentra un edificio bonito."],
      ["Panadera", "Tiene una panadería en la Kastanienallee desde hace veinte años. Sabe el nombre de todos los vecinos."],
      ["Compañero de carrera", "Compañero de proyecto de Lukas. Prefiere la fotografía al dibujo."],
      ["Vecino de toda la vida", "Vive en el mismo edificio desde 1970. Quizá reconozca la fotografía."],
    ],
    episodes: {
      "das-foto": {
        intro: "Un domingo en el Mauerpark y un hallazgo en una caja de fotos antiguas.",
        context: "Lukas necesita material para su proyecto 'Stadt im Wandel'. Va al mercadillo del Mauerpark.",
        vocab: ["el mercadillo, el rastro", "la caja", "el reverso, el dorso", "la fachada", "el letrero, el cartel", "ir a pie, caminar"],
        expr: ["Me gusta (lit.: eso me agrada)", "En la foto se ve…", "Ciudad en transformación"],
        grammar: [
          ["El verbo en segunda posición", "En la oración afirmativa alemana, el verbo conjugado va siempre en 2.ª posición. Si la frase empieza con un complemento de tiempo o lugar, el sujeto va después del verbo."],
          ["Verbos separables", "Verbos como aufstehen o anschauen se separan: el prefijo va al final de la oración."],
        ],
        culture: [
          ["El Mauerpark", "El parque está donde pasaba la franja fronteriza del Muro de Berlín. Hoy, los domingos, acoge un gran mercadillo y karaoke al aire libre."],
          ["Domingo de descanso", "En toda Alemania la mayoría de las tiendas cierra los domingos; las reglas exactas las fija cada estado (en Berlín, la Ladenöffnungsgesetz). Panaderías, tiendas de estación y Spätis suelen abrir. Por eso, en un domingo como el de Lukas, mercadillos y parques se llenan."],
        ],
        prompt: ["Describir la fotografía", "Describe la escena en alemán. Usa « Auf dem Foto sieht man… » y presta atención al verbo en segunda posición. Puedes imaginar detalles."],
      },
      "in-der-baeckerei": {
        intro: "Lukas entra en la panadería con la foto en el bolsillo.",
        context: "Lunes, 7:30. Antes de clase, Lukas pasa por la panadería de la Kastanienallee. Frau Yilmaz está detrás del mostrador.",
        vocab: ["el panecillo (palabra berlinesa)", "para llevar", "pagar en efectivo", "el piso, la planta", "arriba"],
        expr: ["¿Qué le pongo? (en el mostrador)", "Son… (al decir el precio)", "Lo siento"],
        grammar: [
          ["Acusativo con artículos", "El complemento directo va en acusativo. Solo cambia el masculino: der → den, ein → einen."],
          ["Verbos modales: können, dürfen", "El modal va en 2.ª posición (o 1.ª en preguntas) y el verbo principal va al final en infinitivo."],
        ],
        culture: [
          ["Brötchen, Schrippe, Semmel", "El panecillo tiene nombres regionales: Schrippe en Berlín, Semmel en Baviera y Austria, Brötchen en el uso general. Desayunar con pan recién hecho es una tradición muy arraigada."],
          ["Pagar en efectivo", "El pago con tarjeta ha crecido mucho, pero algunas panaderías, Spätis y puestos pequeños — como el de Frau Yilmaz — aún aceptan solo efectivo (« nur bar ») o piden un mínimo para tarjeta. Conviene preguntar, como hace Lukas."],
        ],
        prompt: ["Lukas conoce a Herr Krüger", "Escribe un diálogo en alemán entre Lukas y Herr Krüger. Usa « Sie » (trato formal), al menos un verbo modal y una pregunta con « Kennen Sie…? »."],
      },
      "herr-krueger": {
        intro: "Herr Krüger no abre la puerta — pero deja un mensaje.",
        context: "Lukas dejó una nota con su número en el buzón del tercer piso. Por la noche recibe un mensaje de voz.",
        vocab: ["la nota, el papelito", "esperar (a alguien)", "mudarse (lejos)", "el 'cambio' (caída del Muro, 1989–90)", "puntual"],
        expr: ["Soy… / Habla… (al teléfono)", "café y pastel, la merienda", "Hasta luego (al teléfono)"],
        grammar: [
          ["Perfekt (el pasado hablado)", "En la conversación, el alemán usa el Perfekt: haben/sein + participio al final. Los verbos de cambio de lugar usan sein."],
          ["Subordinada con wenn", "Después de wenn (cuando/si), el verbo conjugado va al final de la oración."],
        ],
        culture: [
          ["Kaffee und Kuchen", "Hacia las 15 h, sobre todo los fines de semana, muchas familias alemanas se reúnen para tomar café y pastel casero. Invitar a alguien es un gesto de confianza."],
          ["Puntualidad", "Llegar a la hora es una muestra de respeto. Los retrasos de más de cinco minutos suelen avisarse con antelación."],
          ["Prenzlauer Berg después de 1989", "El barrio, en el antiguo Berlín Este, se renovó a fondo tras la reunificación. Muchos vecinos de siempre se fueron por la subida de los alquileres — un tema de debate frecuente en la ciudad."],
        ],
        prompt: ["Barrios que cambian", "Escribe en alemán comparando un barrio de tu ciudad con Prenzlauer Berg. Usa al menos dos verbos en Perfekt y una frase con « wenn »."],
      },
    },
  },
};
