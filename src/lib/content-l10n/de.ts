import type { ContentL10n } from "./types";
export const de: ContentL10n = {
  "les-jours-de-camille": {
    tagline: "Ein vergessener Brief zwischen den Seiten eines gebrauchten Buches.",
    synopsis: "Camille arbeitet in einer kleinen unabhängigen Buchhandlung in Montmartre. Beim Sortieren einer Kiste mit gebrauchten Büchern findet sie einen alten Brief, der nie abgeschickt wurde. Ihre Neugier führt sie durch das Viertel — vom Café an der Ecke bis zum Samstagsmarkt — und bringt unerwartete Verbindungen zwischen den Nachbarn ans Licht.",
    setting: "Montmartre, Paris — steile Gassen, Eckcafés und eine Buchhandlung namens « La Page Tournée ».",
    culturalContext: "Cafés im Viertel, unabhängige Buchhandlungen, Straßenmärkte, Pariser Alltag, lockere Gespräche und Redewendungen.",
    characters: [
      ["Buchhändlerin", "Aufmerksam und etwas schüchtern. Sie liebt gebrauchte Bücher, weil sie die Geschichten anderer Leser bewahren."],
      ["Inhaber der Buchhandlung", "Er kennt das Viertel seit fünfzig Jahren und spricht langsam, immer mit einer Anekdote."],
      ["Camilles Freundin", "Baristin im Café des Abbesses, praktisch und witzig. Sie schickt viel zu lange Sprachnachrichten."],
      ["Blumenhändlerin auf dem Markt", "Sie verkauft seit Jahrzehnten Blumen in der Rue Lepic. Vielleicht weiß sie etwas über den Brief."],
    ],
    episodes: {
      "la-lettre": {
        intro: "Ein ruhiger Morgen in der Buchhandlung und eine unerwartete Entdeckung.",
        context: "Camille öffnet die Buchhandlung um neun Uhr. Monsieur Bernard hat ihr eine Kiste mit gebrauchten Büchern zum Sortieren hingestellt.",
        vocab: ["die Buchhandlung (nicht: die Bibliothek!)", "ein gebrauchtes Buch, Antiquariatsbuch", "die Theke, der Ladentisch", "der Briefumschlag", "die Briefmarke", "zögern"],
        expr: ["zehn vor neun (8:50 Uhr)", "Das gehört mir nicht", "Ich denke nur daran"],
        grammar: [
          ["Präsens der Verben auf -er", "Die meisten französischen Verben enden auf -er und folgen demselben Muster: je -e, tu -es, il/elle -e, nous -ons, vous -ez, ils -ent. Camille erzählt ihren Tag im Präsens."],
          ["Verneinung mit ne… pas", "Die französische Verneinung umschließt das konjugierte Verb: ne + Verb + pas. Vor einem Vokal wird ne zu n'."],
        ],
        culture: [
          ["Unabhängige Buchhandlungen", "Frankreich schützt unabhängige Buchhandlungen mit der « loi Lang » (1981), die eine Buchpreisbindung für neue Bücher festlegt. Deshalb gibt es in Vierteln wie Montmartre noch kleine Läden, deren Buchhändler die Kundschaft mit Namen kennen."],
          ["Die Rue Lepic", "Eine gewundene Straße, die den Hügel von Montmartre hinaufführt, bekannt für ihren Straßenmarkt, Bäckereien und kleine Läden. Hier wohnen Menschen — sie ist nicht nur etwas für Touristen."],
        ],
        prompt: ["Camilles Tagebuch", "Schreib auf Französisch in der Ich-Form, als wärst du Camille. Verwende das Präsens und mindestens eine Verneinung (ne… pas). Erzähl von deinen Gefühlen und deinem Plan für den nächsten Tag."],
      },
      "message-ines": {
        intro: "Camille erzählt ihrer Freundin alles. Die Antwort kommt als Sprachnachricht.",
        context: "Noch am selben Abend schickt Camille Inès ein Foto des Umschlags. Am nächsten Morgen bekommt sie eine lange Sprachnachricht.",
        vocab: ["hallo, hi (sehr umgangssprachlich)", "Kaffee mit cremig aufgeschäumter Milch", "der Chef, der Inhaber", "das Fenster", "warten (auf)"],
        expr: ["Das ist voll… / total… (locker, unter Freunden)", "Kurz gesagt / Na ja, jedenfalls", "Es ist viel los", "Küsschen (Abschied unter Freunden)"],
        grammar: [
          ["Präsens + depuis (Dauer)", "Für eine Handlung, die in der Vergangenheit begonnen hat und noch andauert, nimmt das Französische wie das Deutsche das Präsens + depuis: « il attend depuis des années » = er wartet seit Jahren."],
          ["Nahe Zukunft und Vorschläge", "Gesprochen dient das Präsens oft für Vorschläge: « Samedi, tu passes au café ? ». Man kann auch aller + Infinitiv verwenden: « On va aller au marché »."],
        ],
        culture: [
          ["Sprachnachrichten und lockerer Ton", "Unter Freunden wird gesprochenes Französisch kürzer und weicher: « coucou », « bref », « trop + Adjektiv ». Das Pronomen « on » ersetzt im Gespräch fast immer « nous »."],
          ["Die Stammgäste im Café", "Viele Cafés im Viertel haben ihre « habitués »: Gäste, die immer zur selben Zeit am selben Tisch sitzen. Der Kellner kennt die Bestellung, ohne zu fragen. Das Café ist eine Verlängerung des Wohnzimmers."],
        ],
        prompt: ["Inès antworten", "Schreib Inès eine lockere Nachricht auf Französisch. Beginne mit « coucou » oder einem anderen Gruß, stell zwei Fragen und verabschiede dich umgangssprachlich."],
      },
      "marche-lepic": {
        intro: "Auf dem Markt in der Rue Lepic erkennt Madame Leroux einen Namen.",
        context: "Samstagmorgen. Camille und Inès gehen zwischen Käse, Obst und Blumen über den Markt bis zum Stand von Madame Leroux.",
        vocab: ["der Markt, der Wochenmarkt", "ein kleiner Laden", "gegenüber", "der Hut", "weggehen, abreisen"],
        expr: ["Haben Sie kurz Zeit? (höfliche Bitte)", "meine Liebe (liebevoll, von einer älteren Person)", "Hier, bitte (beim Überreichen)"],
        grammar: [
          ["Passé composé mit être", "Verben der Bewegung wie partir, arriver, aller bilden die Vergangenheit mit être — ähnlich wie im Deutschen mit „sein“. Das Partizip richtet sich nach dem Subjekt: elle est partie."],
          ["Tu und vous", "Camille siezt Madame Leroux aus Respekt; die Blumenhändlerin duzt sie, was bei einer älteren, vertrauten Person üblich ist."],
        ],
        culture: [
          ["Straßenmärkte", "Paris hat über 70 Lebensmittelmärkte. Samstags auf den Markt zu gehen ist ein Ritual: mit den Händlern plaudern, Käse probieren, Obst der Saison aussuchen."],
          ["Zuerst grüßen", "In Frankreich gilt es als unhöflich, einen Händler anzusprechen, ohne « Bonjour » zu sagen. Erst der Gruß, dann die Bitte."],
        ],
        prompt: ["Und nach dem Markt?", "Schreib die Geschichte auf Französisch in der dritten Person weiter. Verwende mindestens zwei Verben im passé composé (mit avoir oder être). Bleib den Figuren treu."],
      },
    },
  },
  "zwischen-den-strassen": {
    tagline: "Ein altes Foto und eine Stadt, die sich ständig verändert.",
    synopsis: "Lukas studiert Architektur in Berlin. Für ein Uni-Projekt über Viertel im Wandel streift er mit seinem Skizzenbuch durch Prenzlauer Berg. Auf einem Flohmarkt findet er ein altes Foto einer Straße, die heute nicht mehr so aussieht — und beschließt herauszufinden, wer darauf zu sehen ist.",
    setting: "Berlin — Prenzlauer Berg, die gelbe U-Bahn, Altbauten mit Hinterhöfen und der Mauerpark am Sonntag.",
    culturalContext: "Deutscher Alltag, öffentlicher Nahverkehr, Architektur, Bäckereien, Studentenleben und lokale Traditionen.",
    characters: [
      ["Architekturstudent", "Er zeichnet alles, was er sieht. Pünktlich, neugierig und etwas zerstreut, sobald er ein schönes Gebäude entdeckt."],
      ["Bäckerin", "Sie hat seit zwanzig Jahren eine Bäckerei in der Kastanienallee und kennt alle Nachbarn beim Namen."],
      ["Kommilitone", "Lukas' Projektpartner. Er fotografiert lieber, als zu zeichnen."],
      ["Langjähriger Bewohner", "Er wohnt seit 1970 im selben Haus. Vielleicht erkennt er das Foto."],
    ],
    episodes: {
      "das-foto": {
        intro: "Ein Sonntag im Mauerpark und ein Fund in einer Kiste mit alten Fotos.",
        context: "Lukas braucht Material für sein Projekt „Stadt im Wandel“. Er geht auf den Flohmarkt im Mauerpark.",
        vocab: ["Markt für gebrauchte und alte Dinge", "großer Behälter, oft aus Holz oder Pappe", "die hintere Seite eines Blattes oder Fotos", "die Vorderseite eines Gebäudes", "Tafel mit einer Aufschrift, z. B. über einem Laden", "ohne Verkehrsmittel gehen, laufen"],
        expr: ["Ich mag das — die Sache ist das Subjekt, die Person steht im Dativ", "Feste Wendung für Bildbeschreibungen", "Die Stadt verändert sich (Titel des Uni-Projekts)"],
        grammar: [
          ["Verbzweitstellung", "Im Aussagesatz steht das konjugierte Verb immer an Position 2. Beginnt der Satz mit einer Zeit- oder Ortsangabe, steht das Subjekt nach dem Verb (Inversion)."],
          ["Trennbare Verben", "Bei Verben wie aufstehen oder anschauen wandert das Präfix im Hauptsatz ans Satzende."],
        ],
        culture: [
          ["Der Mauerpark", "Der Park liegt auf dem ehemaligen Grenzstreifen der Berliner Mauer. Sonntags gibt es hier einen großen Flohmarkt und Karaoke unter freiem Himmel."],
          ["Sonntagsruhe", "Die meisten Geschäfte sind sonntags geschlossen (Ladenschluss). Flohmärkte, Parks und Cafés sind deshalb voll — und eingekauft wird am Samstag."],
        ],
        prompt: ["Das Foto beschreiben", "Beschreib die Szene auf Deutsch. Verwende „Auf dem Foto sieht man…“ und achte auf das Verb an zweiter Stelle. Du darfst Details erfinden."],
      },
      "in-der-baeckerei": {
        intro: "Lukas betritt die Bäckerei, das Foto in der Tasche.",
        context: "Montag, 7:30 Uhr. Vor der Vorlesung geht Lukas in die Bäckerei in der Kastanienallee. Frau Yilmaz steht hinter der Theke.",
        vocab: ["Berliner Wort für Brötchen", "nicht vor Ort essen oder trinken, sondern mitnehmen", "mit Scheinen und Münzen bezahlen", "die Etage eines Hauses", "in einem höheren Stockwerk"],
        expr: ["Typische Frage hinter der Theke", "So nennt man den Preis", "Höfliche Entschuldigung"],
        grammar: [
          ["Akkusativ mit Artikeln", "Das direkte Objekt steht im Akkusativ. Nur das Maskulinum ändert sich: der → den, ein → einen."],
          ["Modalverben: können, dürfen", "Das Modalverb steht an Position 2 (in Fragen an Position 1), das Vollverb im Infinitiv am Satzende."],
        ],
        culture: [
          ["Brötchen, Schrippe, Semmel", "Das Brötchen hat regionale Namen: Schrippe in Berlin, Semmel in Bayern und Österreich, Brötchen allgemein. Frühstück mit frischen Brötchen ist eine starke Tradition."],
          ["Bargeld", "Viele kleine Läden bevorzugen noch Bargeld („nur bar“). Schilder wie „Kartenzahlung ab 10 €“ sind verbreitet."],
        ],
        prompt: ["Lukas trifft Herrn Krüger", "Schreib einen Dialog auf Deutsch zwischen Lukas und Herrn Krüger. Verwende „Sie“ (förmlich), mindestens ein Modalverb und eine Frage mit „Kennen Sie…?“."],
      },
      "herr-krueger": {
        intro: "Herr Krüger öffnet die Tür nicht — aber er hinterlässt eine Nachricht.",
        context: "Lukas hat einen Zettel mit seiner Nummer in den Briefkasten im dritten Stock geworfen. Am Abend bekommt er eine Sprachnachricht.",
        vocab: ["kleines Stück Papier für eine Notiz", "darauf warten, dass jemand kommt", "an einen anderen Ort umziehen", "das Ende der DDR und die Wiedervereinigung (1989–90)", "genau zur verabredeten Zeit"],
        expr: ["So meldet man sich am Telefon", "Nachmittagspause mit Kaffee und Kuchen", "Abschiedsgruß am Telefon (statt „Auf Wiedersehen“)"],
        grammar: [
          ["Perfekt (gesprochene Vergangenheit)", "Im Gespräch verwendet man meist das Perfekt: haben/sein + Partizip II am Satzende. Verben der Ortsveränderung bilden es mit sein."],
          ["Nebensatz mit wenn", "Nach wenn steht das konjugierte Verb am Ende des Nebensatzes."],
        ],
        culture: [
          ["Kaffee und Kuchen", "Gegen 15 Uhr, besonders am Wochenende, treffen sich viele Familien zu Kaffee und selbstgebackenem Kuchen. Jemanden dazu einzuladen, ist ein Zeichen von Vertrauen."],
          ["Pünktlichkeit", "Pünktlich zu sein ist ein Zeichen von Respekt. Wer sich mehr als fünf Minuten verspätet, sagt in der Regel vorher Bescheid."],
          ["Prenzlauer Berg nach 1989", "Das Viertel im ehemaligen Ost-Berlin wurde nach der Wiedervereinigung stark saniert. Viele alte Bewohner zogen wegen steigender Mieten weg — ein häufiges Streitthema in der Stadt."],
        ],
        prompt: ["Viertel im Wandel", "Schreib auf Deutsch und vergleiche ein Viertel deiner Stadt mit Prenzlauer Berg. Verwende mindestens zwei Verben im Perfekt und einen Satz mit „wenn“."],
      },
    },
  },
};
