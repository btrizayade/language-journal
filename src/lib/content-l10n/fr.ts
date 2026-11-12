import type { ContentL10n } from "./types";
export const fr: ContentL10n = {
  "les-jours-de-camille": {
    tagline: "Une lettre oubliée entre les pages d'un livre d'occasion.",
    synopsis: "Camille travaille dans une petite librairie indépendante à Montmartre. En triant un carton de livres d'occasion, elle trouve une vieille lettre jamais envoyée. Sa curiosité la mène à travers le quartier — du café du coin au marché du samedi — et révèle des liens inattendus entre les voisins.",
    setting: "Montmartre, Paris — rues en pente, cafés de quartier et une librairie nommée « La Page Tournée ».",
    culturalContext: "Cafés de quartier, librairies indépendantes, marchés de rue, quotidien parisien, conversations familières et expressions de tous les jours.",
    characters: [
      ["Libraire", "Observatrice et un peu timide, elle adore les livres d'occasion parce qu'ils gardent les histoires d'autres lecteurs."],
      ["Propriétaire de la librairie", "Il connaît le quartier depuis cinquante ans et parle lentement, toujours avec une anecdote."],
      ["Amie de Camille", "Barista au Café des Abbesses, pratique et drôle, elle envoie des messages vocaux beaucoup trop longs."],
      ["Fleuriste du marché", "Elle vend des fleurs rue Lepic depuis des décennies. Elle sait peut-être quelque chose sur la lettre."],
    ],
    episodes: {
      "la-lettre": {
        intro: "Une matinée calme à la librairie et une découverte inattendue.",
        context: "Camille ouvre la librairie à neuf heures. Monsieur Bernard lui a laissé un carton de livres d'occasion à trier.",
        vocab: ["magasin où l'on vend des livres (≠ la bibliothèque, où on les emprunte)", "livre qui a déjà eu un propriétaire", "meuble où le commerçant sert les clients", "pochette de papier pour une lettre", "petite vignette collée pour payer l'envoi", "ne pas savoir quoi décider, attendre avant d'agir"],
        expr: ["8 h 50 — on compte les minutes avant l'heure", "Cela ne m'appartient pas", "Je pense uniquement à cela (ne… que = seulement)"],
        grammar: [
          ["Le présent des verbes en -er", "La plupart des verbes français se terminent en -er et suivent le même modèle : je -e, tu -es, il/elle -e, nous -ons, vous -ez, ils -ent. Camille raconte sa journée au présent."],
          ["La négation ne… pas", "La négation encadre le verbe conjugué : ne + verbe + pas. Devant une voyelle, ne devient n'. À l'oral, le ne disparaît souvent, mais à l'écrit il reste obligatoire."],
        ],
        culture: [
          ["Les librairies indépendantes", "La France protège les librairies indépendantes grâce à la « loi Lang » (1981), qui fixe le prix des livres neufs. C'est pourquoi des quartiers comme Montmartre gardent de petites librairies où le libraire connaît ses clients par leur nom."],
          ["La rue Lepic", "Une rue sinueuse qui monte la butte Montmartre, connue pour son marché, ses boulangeries et ses petits commerces. C'est une rue d'habitants, pas seulement de touristes."],
        ],
        prompt: ["Le journal de Camille", "Écris en français, à la première personne, comme si tu étais Camille. Utilise le présent et au moins une négation (ne… pas). Parle de tes émotions et de ton projet pour le lendemain."],
      },
      "message-ines": {
        intro: "Camille raconte tout à son amie. La réponse arrive sous forme de message vocal.",
        context: "Le soir même, Camille envoie une photo de l'enveloppe à Inès. Le lendemain matin, elle reçoit un long message vocal.",
        vocab: ["salut (très familier)", "café avec du lait chaud mousseux", "le propriétaire, le chef", "ouverture vitrée dans un mur", "rester jusqu'à l'arrivée de quelqu'un ou de quelque chose"],
        expr: ["C'est très… (familier, entre amis)", "Pour résumer / enfin", "Il y a beaucoup de gens", "Formule d'au revoir affectueuse entre amis"],
        grammar: [
          ["Le présent + depuis", "Pour une action commencée dans le passé qui continue aujourd'hui, le français utilise le présent + depuis : « il attend depuis des années ». On n'emploie pas le passé composé ici."],
          ["Futur proche et propositions", "À l'oral, le présent sert à proposer : « Samedi, tu passes au café ? ». On peut aussi utiliser aller + infinitif : « On va aller au marché »."],
        ],
        culture: [
          ["Messages vocaux et registre familier", "Entre amis, le français parlé raccourcit et adoucit : « coucou », « bref », « trop + adjectif ». Le pronom « on » remplace presque toujours « nous » dans la conversation."],
          ["Les habitués du café", "Beaucoup de cafés de quartier ont leurs « habitués » : des clients qui viennent toujours à la même heure, à la même table. Le serveur connaît la commande sans demander. Le café prolonge le salon."],
        ],
        prompt: ["Répondre à Inès", "Écris un message familier en français à Inès. Commence par « coucou » ou une autre salutation, pose deux questions et termine par une formule d'au revoir familière."],
      },
      "marche-lepic": {
        intro: "Au marché de la rue Lepic, Madame Leroux reconnaît un nom.",
        context: "Samedi matin. Camille et Inès traversent le marché, entre fromages, fruits et fleurs, jusqu'au stand de Madame Leroux.",
        vocab: ["lieu où des marchands vendent en plein air", "petit magasin", "de l'autre côté de la rue", "accessoire que l'on porte sur la tête", "quitter un lieu, s'en aller"],
        expr: ["Demande polie pour parler à quelqu'un", "Terme affectueux, souvent employé par une personne plus âgée", "Formule pour donner quelque chose à quelqu'un"],
        grammar: [
          ["Le passé composé avec être", "Les verbes de mouvement comme partir, arriver, aller forment le passé composé avec être, et le participe passé s'accorde avec le sujet : elle est partie."],
          ["Tu et vous", "Camille vouvoie Madame Leroux par respect ; la fleuriste la tutoie, ce qui est courant de la part d'une personne plus âgée et familière."],
        ],
        culture: [
          ["Les marchés de rue", "Paris compte plus de 70 marchés alimentaires. Aller au marché le samedi est un rituel : discuter avec les marchands, goûter les fromages, choisir les fruits de saison."],
          ["Saluer avant tout", "En France, s'adresser à un commerçant sans dire « Bonjour » est perçu comme impoli. D'abord la salutation, ensuite la demande."],
        ],
        prompt: ["Et après le marché ?", "Continue l'histoire en français, à la troisième personne. Utilise au moins deux verbes au passé composé (avec avoir ou être). Garde des personnages cohérents."],
      },
    },
  },
  "zwischen-den-strassen": {
    tagline: "Une vieille photographie et une ville qui ne cesse de changer.",
    synopsis: "Lukas étudie l'architecture à Berlin. Pour un projet universitaire sur les quartiers en mutation, il parcourt Prenzlauer Berg avec son carnet de croquis. Dans un marché aux puces, il trouve une vieille photo d'une rue qui n'existe plus telle qu'elle était — et décide de découvrir qui y figurait.",
    setting: "Berlin — Prenzlauer Berg, le U-Bahn jaune, de vieux immeubles avec cours intérieures et le Mauerpark le dimanche.",
    culturalContext: "Vie quotidienne allemande, transports en commun, architecture, boulangeries, vie étudiante et traditions locales.",
    characters: [
      ["Étudiant en architecture", "Il dessine tout ce qu'il voit. Ponctuel, curieux et un peu distrait dès qu'il croise un beau bâtiment."],
      ["Boulangère", "Elle tient une boulangerie dans la Kastanienallee depuis vingt ans. Elle connaît le nom de tous les voisins."],
      ["Camarade de promo", "Partenaire de projet de Lukas. Il préfère la photographie au dessin."],
      ["Ancien habitant", "Il habite le même immeuble depuis 1970. Il reconnaîtra peut-être la photo."],
    ],
    episodes: {
      "das-foto": {
        intro: "Un dimanche au Mauerpark et une trouvaille dans une boîte de vieilles photos.",
        context: "Lukas cherche du matériel pour son projet « Stadt im Wandel ». Il va au marché aux puces du Mauerpark.",
        vocab: ["le marché aux puces", "la caisse, la boîte", "le verso, le dos", "la façade", "le panneau, l'enseigne", "aller à pied"],
        expr: ["Ça me plaît (le sujet est la chose qui plaît)", "Sur la photo, on voit…", "La ville en mutation"],
        grammar: [
          ["Le verbe en deuxième position", "Dans une phrase déclarative allemande, le verbe conjugué est toujours en 2e position. Si la phrase commence par un complément de temps ou de lieu, le sujet passe après le verbe."],
          ["Les verbes à particule séparable", "Des verbes comme aufstehen ou anschauen se séparent : la particule part à la fin de la phrase."],
        ],
        culture: [
          ["Le Mauerpark", "Le parc se trouve sur l'ancienne bande frontalière du Mur de Berlin. Aujourd'hui, le dimanche, il accueille un grand marché aux puces et un karaoké en plein air."],
          ["Le dimanche, jour de repos", "En Allemagne, la plupart des magasins ferment le dimanche (Ladenschluss). Les marchés aux puces, les parcs et les cafés sont donc pleins — et il faut faire ses courses le samedi."],
        ],
        prompt: ["Décrire la photographie", "Décris la scène en allemand. Utilise « Auf dem Foto sieht man… » et fais attention au verbe en deuxième position. Tu peux imaginer des détails."],
      },
      "in-der-baeckerei": {
        intro: "Lukas entre dans la boulangerie, la photo dans la poche.",
        context: "Lundi, 7 h 30. Avant les cours, Lukas passe à la boulangerie de la Kastanienallee. Frau Yilmaz est derrière le comptoir.",
        vocab: ["le petit pain (mot berlinois)", "à emporter", "payer en espèces", "l'étage", "en haut, là-haut"],
        expr: ["Qu'est-ce que je vous sers ? (au comptoir)", "Ça fait… (pour annoncer le prix)", "Je suis désolée"],
        grammar: [
          ["L'accusatif et les articles", "Le complément d'objet direct se met à l'accusatif. Seul le masculin change : der → den, ein → einen."],
          ["Les verbes de modalité : können, dürfen", "Le verbe de modalité se place en 2e position (ou en 1re dans une question) et le verbe principal va à la fin, à l'infinitif."],
        ],
        culture: [
          ["Brötchen, Schrippe, Semmel", "Le petit pain a des noms régionaux : Schrippe à Berlin, Semmel en Bavière et en Autriche, Brötchen dans l'usage général. Le petit-déjeuner avec du pain frais est une tradition forte."],
          ["L'argent liquide", "Beaucoup de petits commerces allemands préfèrent encore les espèces (« nur bar »). On voit souvent des panneaux « Kartenzahlung ab 10 € » (carte acceptée à partir de 10 €)."],
        ],
        prompt: ["Lukas rencontre Herr Krüger", "Écris un dialogue en allemand entre Lukas et Herr Krüger. Utilise « Sie » (vouvoiement), au moins un verbe de modalité et une question avec « Kennen Sie…? »."],
      },
      "herr-krueger": {
        intro: "Herr Krüger n'ouvre pas la porte — mais il laisse un message.",
        context: "Lukas a laissé un mot avec son numéro dans la boîte aux lettres du troisième étage. Le soir, il reçoit un message vocal.",
        vocab: ["le petit mot, le bout de papier", "attendre (quelqu'un)", "déménager (loin)", "le « tournant » (chute du Mur, 1989–90)", "ponctuel"],
        expr: ["Ici… (au téléphone)", "café et gâteau, la pause de l'après-midi", "Au revoir (au téléphone)"],
        grammar: [
          ["Le Perfekt (passé de l'oral)", "À l'oral, l'allemand utilise le Perfekt : haben/sein + participe passé à la fin. Les verbes de déplacement se construisent avec sein."],
          ["La subordonnée avec wenn", "Après wenn (quand/si), le verbe conjugué part à la fin de la subordonnée."],
        ],
        culture: [
          ["Kaffee und Kuchen", "Vers 15 h, surtout le week-end, beaucoup de familles allemandes se retrouvent autour d'un café et d'un gâteau maison. Y inviter quelqu'un est une marque de confiance."],
          ["La ponctualité", "Arriver à l'heure est une marque de respect. Un retard de plus de cinq minutes se signale généralement à l'avance."],
          ["Prenzlauer Berg après 1989", "Ce quartier de l'ancien Berlin-Est a été largement rénové après la réunification. Beaucoup d'anciens habitants sont partis avec la hausse des loyers — un sujet de débat fréquent dans la ville."],
        ],
        prompt: ["Des quartiers qui changent", "Écris en allemand en comparant un quartier de ta ville avec Prenzlauer Berg. Utilise au moins deux verbes au Perfekt et une phrase avec « wenn »."],
      },
    },
  },
};
