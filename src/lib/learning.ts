import { countWords, type Episode } from "./content";
import type { Locale } from "./i18n";

type Text = readonly [string, string, string, string, string];
export const learningText = (text: Text, locale: Locale) => text[({ "pt-BR": 0, en: 1, fr: 2, de: 3, es: 4 } as const)[locale]];
export interface Question {
  type: "choice" | "boolean" | "sequence" | "cloze";
  prompt: string;
  options: string[];
  answer: number[];
  evidence: string;
  explanation: Text;
}
export interface Lesson { objectives: Text[]; questions: Question[] }
const q = (type: Question["type"], prompt: string, options: string[], answer: number[], evidence: string, explanation: Text): Question => ({ type, prompt, options, answer, evidence, explanation });

/** Questions and evidence are in the story language; guidance follows explanation preferences. */
export const lessons: Record<string, Lesson> = {
  "la-lettre": {
    objectives: [
      ["Identificar onde Camille encontra a carta e a quem ela se destina.", "Identify where Camille finds the letter and who it is for.", "Identifier où Camille trouve la lettre et sa destinataire.", "Erkennen, wo Camille den Brief findet und für wen er ist.", "Identificar dónde encuentra Camille la carta y a quién va dirigida."],
      ["Escrever como Camille usando o presente e ne… pas.", "Write as Camille using the present tense and ne… pas.", "Écrire comme Camille au présent avec ne… pas.", "Als Camille im Präsens mit ne… pas schreiben.", "Escribir como Camille usando el presente y ne… pas."],
    ],
    questions: [
      q("choice", "Où Camille trouve-t-elle l'enveloppe ?", ["Dans un recueil de poèmes.", "Au café.", "Au marché."], [0], "Dans un recueil de poèmes, je trouve une enveloppe jaune.", ["O envelope está dentro de um livro de poemas, não no café.", "The envelope is inside a poetry book, not at the café.", "L'enveloppe se trouve dans un livre de poèmes, pas au café.", "Der Umschlag liegt in einem Gedichtband, nicht im Café.", "El sobre está dentro de un libro de poemas, no en el café."]),
      q("boolean", "La lettre est destinée à Camille.", ["Vrai", "Faux"], [1], "Pour Hélène — rue Lepic", ["Hélène é a destinatária; Camille encontra a carta.", "Hélène is the recipient; Camille finds the letter.", "Hélène est la destinataire ; Camille trouve la lettre.", "Hélène ist die Empfängerin; Camille findet den Brief.", "Hélène es la destinataria; Camille encuentra la carta."]),
      q("sequence", "Remets les événements dans l'ordre.", ["Camille montre l'enveloppe à Monsieur Bernard.", "Camille ouvre la librairie.", "Camille trouve l'enveloppe."], [1, 2, 0], "J'ouvre la porte… je trouve une enveloppe… je lui montre l'enveloppe.", ["Ela abre a livraria, encontra o envelope e o mostra a Bernard.", "She opens the bookshop, finds the envelope and shows it to Bernard.", "Elle ouvre la librairie, trouve l'enveloppe et la montre à Bernard.", "Sie öffnet die Buchhandlung, findet den Umschlag und zeigt ihn Bernard.", "Abre la librería, encuentra el sobre y se lo muestra a Bernard."]),
      q("cloze", "Elle n'est ___ fermée.", ["pas", "plusieurs", "avec"], [0], "Elle n'est pas fermée.", ["Ne… pas envolve o verbo para formar a negação.", "Ne… pas surrounds the verb to form a negative.", "Ne… pas encadre le verbe pour former la négation.", "Ne… pas umschließt das Verb und bildet die Verneinung.", "Ne… pas rodea el verbo para formar la negación."]),
    ],
  },
  "message-ines": {
    objectives: [
      ["Identificar a rotina do cliente e o convite de Inès.", "Identify the customer's routine and Inès's invitation.", "Identifier les habitudes du client et l'invitation d'Inès.", "Die Gewohnheiten des Kunden und Inès' Einladung erkennen.", "Identificar la rutina del cliente y la invitación de Inès."],
      ["Reconhecer depuis e escrever uma resposta informal com duas perguntas.", "Recognize depuis and write an informal reply with two questions.", "Reconnaître depuis et écrire une réponse informelle avec deux questions.", "Depuis erkennen und eine informelle Antwort mit zwei Fragen schreiben.", "Reconocer depuis y escribir una respuesta informal con dos preguntas."],
    ],
    questions: [
      q("choice", "Quand le vieux monsieur vient-il au café ?", ["Tous les lundis.", "Tous les samedis.", "Tous les soirs."], [1], "Il vient tous les samedis, toujours à la même table, près de la fenêtre.", ["Inès descreve um hábito de sábado.", "Inès describes a Saturday habit.", "Inès décrit une habitude du samedi.", "Inès beschreibt eine Gewohnheit am Samstag.", "Inès describe una costumbre de los sábados."]),
      q("boolean", "Le monsieur parle beaucoup.", ["Vrai", "Faux"], [1], "Il ne parle pas beaucoup, mais il est très gentil.", ["Ele fala pouco, embora seja gentil.", "He speaks little, although he is kind.", "Il parle peu, même s'il est gentil.", "Er spricht wenig, ist aber freundlich.", "Habla poco, aunque es amable."]),
      q("sequence", "Quel est le programme proposé ?", ["Voir Madame Leroux.", "Passer au café vers dix heures.", "Aller au marché ensemble."], [1, 2, 0], "Tu passes au café vers dix heures ? On peut aller au marché ensemble après, pour voir Madame Leroux.", ["Primeiro o café, depois o mercado para ver a florista.", "First the café, then the market to see the florist.", "D'abord le café, puis le marché pour voir la fleuriste.", "Zuerst das Café, dann der Markt und die Blumenhändlerin.", "Primero el café, luego el mercado para ver a la florista."]),
      q("cloze", "Il attend quelqu'un ___ des années.", ["hier", "depuis", "demain"], [1], "Lui, il attend quelqu'un depuis des années.", ["Depuis indica que a espera começou antes e continua.", "Depuis means the waiting began earlier and continues.", "Depuis indique que l'attente a commencé avant et continue.", "Depuis zeigt, dass das Warten früher begann und noch andauert.", "Depuis indica que la espera empezó antes y continúa."]),
    ],
  },
  "marche-lepic": {
    objectives: [
      ["Identificar a profissão de Hélène e a cidade para onde foi.", "Identify Hélène's occupation and the city she moved to.", "Identifier le métier d'Hélène et sa ville de destination.", "Hélènes Beruf und ihren neuen Wohnort erkennen.", "Identificar la profesión de Hélène y la ciudad a la que se fue."],
      ["Reconhecer tu/vous e continuar a história com dois verbos no passado.", "Recognize tu/vous and continue the story with two past-tense verbs.", "Reconnaître tu/vous et continuer l'histoire avec deux verbes au passé.", "Tu/vous erkennen und die Geschichte mit zwei Verben in der Vergangenheit fortsetzen.", "Reconocer tu/vous y continuar la historia con dos verbos en pasado."],
    ],
    questions: [
      q("choice", "Quel commerce Hélène avait-elle ?", ["Un café.", "Une librairie.", "Une boutique de chapeaux."], [2], "Elle avait une petite boutique de chapeaux.", ["A florista identifica a antiga loja de chapéus.", "The florist identifies the former hat shop.", "La fleuriste identifie l'ancienne boutique de chapeaux.", "Die Blumenhändlerin nennt den früheren Hutladen.", "La florista identifica la antigua tienda de sombreros."]),
      q("boolean", "Hélène habite toujours rue Lepic.", ["Vrai", "Faux"], [1], "Non. Elle est partie à Lyon en 1987.", ["Ela foi para Lyon em 1987.", "She moved to Lyon in 1987.", "Elle est partie à Lyon en 1987.", "Sie zog 1987 nach Lyon.", "Se fue a Lyon en 1987."]),
      q("choice", "Pourquoi Camille dit-elle « En 1987… comme la lettre » ?", ["Elle compare les dates.", "Elle veut acheter des fleurs.", "Elle connaît déjà Hélène."], [0], "En 1987… comme la lettre.", ["O ano da partida coincide com a data da carta; o motivo ainda é desconhecido.", "The departure year matches the letter's date; the reason is still unknown.", "L'année du départ correspond à la date de la lettre ; la raison reste inconnue.", "Das Wegzugsjahr entspricht dem Briefdatum; der Grund bleibt unbekannt.", "El año de la partida coincide con la carta; el motivo sigue siendo desconocido."]),
      q("cloze", "Elle ___ partie à Lyon.", ["a", "est", "va"], [1], "Elle est partie à Lyon en 1987.", ["Partir usa être; partie concorda com elle.", "Partir uses être; partie agrees with elle.", "Partir se conjugue avec être ; partie s'accorde avec elle.", "Partir verwendet être; partie stimmt mit elle überein.", "Partir usa être; partie concuerda con elle."]),
    ],
  },
  "das-foto": {
    objectives: [
      ["Localizar a compra da foto e identificar as pistas no verso.", "Locate the photo purchase and identify the clues on its back.", "Situer l'achat de la photo et identifier les indices au verso.", "Den Fotokauf einordnen und die Hinweise auf der Rückseite erkennen.", "Localizar la compra de la foto e identificar las pistas del reverso."],
      ["Descrever a foto com o verbo na segunda posição.", "Describe the photo with the verb in second position.", "Décrire la photo avec le verbe en deuxième position.", "Das Foto mit dem Verb an zweiter Stelle beschreiben.", "Describir la foto con el verbo en segunda posición."],
    ],
    questions: [
      q("choice", "Wo kauft Lukas das Foto?", ["In einer Bäckerei.", "Auf dem Flohmarkt im Mauerpark.", "An der Universität."], [1], "Ich gehe… zum Mauerpark. Der Flohmarkt… Ich kaufe das Foto.", ["Ele compra a foto no mercado de pulgas do Mauerpark.", "He buys the photo at the Mauerpark flea market.", "Il achète la photo au marché aux puces du Mauerpark.", "Er kauft das Foto auf dem Flohmarkt im Mauerpark.", "Compra la foto en el mercadillo del Mauerpark."]),
      q("boolean", "Auf der Rückseite steht „Kastanienallee, 1979“.", ["Richtig", "Falsch"], [0], "Auf der Rückseite steht: „Kastanienallee, 1979“.", ["O verso fornece o lugar e o ano.", "The back provides the location and year.", "Le verso donne le lieu et l'année.", "Die Rückseite nennt Ort und Jahr.", "El reverso indica el lugar y el año."]),
      q("sequence", "Ordne die Ereignisse.", ["Lukas sucht das Haus in der Kastanienallee.", "Lukas fährt mit der U2.", "Lukas kauft das Foto."], [1, 2, 0], "…nehme die U2… Ich kaufe das Foto. Am Nachmittag gehe ich in die Kastanienallee.", ["O trajeto vem antes da compra; a busca acontece à tarde.", "The journey precedes the purchase; the search happens in the afternoon.", "Le trajet précède l'achat ; la recherche a lieu l'après-midi.", "Die Fahrt kommt vor dem Kauf; die Suche findet nachmittags statt.", "El trayecto precede a la compra; la búsqueda ocurre por la tarde."]),
      q("cloze", "Am Nachmittag ___ ich in die Kastanienallee.", ["ich", "gehe", "gehen"], [1], "Am Nachmittag gehe ich in die Kastanienallee.", ["Gehe ocupa a segunda posição, após o bloco de tempo.", "Gehe is in second position, after the time phrase.", "Gehe occupe la deuxième position après le groupe de temps.", "Gehe steht nach der Zeitangabe an zweiter Stelle.", "Gehe ocupa la segunda posición, después del bloque temporal."]),
    ],
  },
  "in-der-baeckerei": {
    objectives: [
      ["Identificar o pedido, o preço e a forma de pagamento.", "Identify the order, price and payment method.", "Identifier la commande, le prix et le moyen de paiement.", "Bestellung, Preis und Zahlungsweise erkennen.", "Identificar el pedido, el precio y la forma de pago."],
      ["Escrever um diálogo formal com um verbo modal.", "Write a formal dialogue with a modal verb.", "Écrire un dialogue formel avec un verbe modal.", "Einen höflichen Dialog mit einem Modalverb schreiben.", "Escribir un diálogo formal con un verbo modal."],
    ],
    questions: [
      q("choice", "Was bestellt Lukas?", ["Einen Kuchen.", "Zwei Schrippen und einen Kaffee.", "Drei Schrippen und Tee."], [1], "Zwei Schrippen und einen Kaffee zum Mitnehmen, bitte.", ["O pedido tem dois pãezinhos e um café para viagem.", "The order is two rolls and a takeaway coffee.", "Il commande deux petits pains et un café à emporter.", "Er bestellt zwei Brötchen und einen Kaffee zum Mitnehmen.", "Pide dos panecillos y un café para llevar."]),
      q("boolean", "Lukas kann mit Karte zahlen.", ["Richtig", "Falsch"], [1], "Leider nur bar. Tut mir leid.", ["Nesta padaria, o pagamento é só em dinheiro.", "This bakery accepts cash only.", "Cette boulangerie accepte seulement les espèces.", "In dieser Bäckerei kann man nur bar bezahlen.", "Esta panadería solo acepta efectivo."]),
      q("choice", "Wo wohnt Herr Krüger?", ["Im ersten Stock.", "In einem anderen Haus.", "Im dritten Stock."], [2], "Er wohnt oben, im dritten Stock.", ["Frau Yilmaz indica o terceiro andar do mesmo prédio.", "Frau Yilmaz points to the third floor of the same building.", "Frau Yilmaz indique le troisième étage du même immeuble.", "Frau Yilmaz nennt den dritten Stock desselben Hauses.", "Frau Yilmaz indica el tercer piso del mismo edificio."]),
      q("cloze", "Kann ich mit Karte ___?", ["zahlen", "zahle", "gezahlt"], [0], "Kann ich mit Karte zahlen?", ["Após o modal kann, zahlen fica no infinitivo no fim.", "After the modal kann, zahlen is an infinitive at the end.", "Après le modal kann, zahlen est à l'infinitif à la fin.", "Nach dem Modalverb kann steht zahlen im Infinitiv am Ende.", "Tras el modal kann, zahlen va en infinitivo al final."]),
    ],
  },
  "herr-krueger": {
    objectives: [
      ["Identificar Marlene, Anna e os detalhes do convite.", "Identify Marlene, Anna and the invitation details.", "Identifier Marlene, Anna et les détails de l'invitation.", "Marlene, Anna und die Einzelheiten der Einladung erkennen.", "Identificar a Marlene, Anna y los detalles de la invitación."],
      ["Comparar bairros usando o Perfekt e uma frase com wenn.", "Compare neighborhoods using the Perfekt and a clause with wenn.", "Comparer des quartiers avec le Perfekt et une phrase avec wenn.", "Stadtviertel mit dem Perfekt und einem wenn-Satz vergleichen.", "Comparar barrios usando el Perfekt y una frase con wenn."],
    ],
    questions: [
      q("choice", "Wer ist Anna?", ["Marlenes Tochter.", "Die Verkäuferin auf dem Flohmarkt.", "Lukas' Schwester."], [0], "Das Kind ist ihre Tochter, Anna.", ["Anna é a filha de Marlene e a criança da foto.", "Anna is Marlene's daughter and the child in the photo.", "Anna est la fille de Marlene et l'enfant sur la photo.", "Anna ist Marlenes Tochter und das Kind auf dem Foto.", "Anna es la hija de Marlene y la niña de la foto."]),
      q("boolean", "Herr Krüger erwartet Lukas am Sonntag.", ["Richtig", "Falsch"], [1], "Kommen Sie am Samstag um drei Uhr zum Kaffee.", ["O convite é para sábado às três, não domingo.", "The invitation is for Saturday at three, not Sunday.", "L'invitation est pour samedi à trois heures, pas dimanche.", "Die Einladung gilt für Samstag um drei, nicht Sonntag.", "La invitación es para el sábado a las tres, no el domingo."]),
      q("choice", "Warum hat Herr Krüger die Tür nicht geöffnet?", ["Er war in Lyon.", "Er öffnet nicht gern, wenn er niemanden erwartet.", "Er kennt die Straße nicht."], [1], "Ich mache nicht gern die Tür auf, wenn ich niemanden erwarte.", ["Ele explica que não gosta de abrir para visitas inesperadas.", "He explains he dislikes opening for unexpected visitors.", "Il explique qu'il n'aime pas ouvrir aux visiteurs inattendus.", "Er erklärt, dass er ungern unerwarteten Besuchern öffnet.", "Explica que no le gusta abrir a visitas inesperadas."]),
      q("cloze", "Ich habe Ihren Zettel ___.", ["lese", "gelesen", "lesen"], [1], "Ich habe Ihren Zettel gelesen.", ["O Perfekt usa habe com o particípio gelesen no fim.", "The Perfekt uses habe with the participle gelesen at the end.", "Le Perfekt utilise habe avec le participe gelesen à la fin.", "Das Perfekt besteht aus habe und dem Partizip gelesen am Ende.", "El Perfekt usa habe con el participio gelesen al final."]),
    ],
  },
};

export function checkAnswers(lesson: Lesson, answers: number[][]) {
  return lesson.questions.map((question, i) => question.answer.length === answers[i]?.length && question.answer.every((value, n) => value === answers[i]?.[n]));
}
export function lessonTiming(episode: Episode, readingWordsPerMinute = 90) {
  const words = countWords((episode.body ?? episode.transcript?.map((line) => line.line) ?? []).join(" "));
  const reading = Math.max(1, Math.ceil(words / readingWordsPerMinute));
  const practice = (lessons[episode.id]?.questions.length ?? 0) + Math.ceil(episode.prompt.words[1] / 12);
  return { words, reading, practice, total: (episode.mediaSeconds ? Math.ceil(episode.mediaSeconds / 60) : reading) + practice };
}