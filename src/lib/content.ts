import camilleCover from "@/assets/cover-camille.jpg";
import lukasCover from "@/assets/cover-lukas.jpg";

export type Format = "reading" | "listening" | "watching";
export type ActivityType =
  | "reflexao" | "perspectiva" | "continuacao" | "descricao"
  | "dialogo" | "carta" | "resumo" | "comparacao";

export const ACTIVITY_LABEL: Record<ActivityType, string> = {
  reflexao: "Reflexão pessoal",
  perspectiva: "Pela voz da personagem",
  continuacao: "Continuar a história",
  descricao: "Descrever uma cena",
  dialogo: "Escrever um diálogo",
  carta: "Carta ou mensagem",
  resumo: "Resumir os acontecimentos",
  comparacao: "Comparação cultural",
};

export const FORMAT_LABEL: Record<Format, string> = {
  reading: "Leitura",
  listening: "Escuta",
  watching: "Vídeo",
};

export interface Vocab { term: string; translation: string; example: string }
export interface Episode {
  id: string;
  number: number;
  title: string;
  intro: string;
  context: string;
  minutes: number;
  format: Format;
  mediaUrl?: string;
  documentLabel?: string;
  body?: string[];
  transcript?: { speaker: string; line: string }[];
  vocabulary: Vocab[];
  expressions: { term: string; meaning: string }[];
  grammar: { title: string; explanation: string; examples: string[] }[];
  culture: { title: string; text: string }[];
  prompt: {
    type: ActivityType;
    title: string;
    prompt: string;
    instructions: string;
    words: [number, number];
  };
}
export interface Character { name: string; age?: number; role: string; description: string; main?: boolean }
export interface Journal {
  id: string;
  title: string;
  language: string;
  languageCode: string;
  level: string;
  cover: string;
  tagline: string;
  synopsis: string;
  setting: string;
  culturalContext: string;
  accent: "lavender" | "sage";
  characters: Character[];
  episodes: Episode[];
}

export const journals: Journal[] = [
  {
    id: "les-jours-de-camille",
    title: "Les jours de Camille",
    language: "Francês",
    languageCode: "fr",
    level: "A2",
    cover: camilleCover,
    accent: "lavender",
    tagline: "Uma carta esquecida entre as páginas de um livro usado.",
    synopsis:
      "Camille trabalha numa pequena livraria independente em Montmartre. Ao arrumar uma caixa de livros usados, encontra uma carta antiga, nunca enviada. A curiosidade a leva pelas ruas do bairro — do café da esquina ao mercado de sábado — e revela ligações inesperadas entre os vizinhos.",
    setting: "Montmartre, Paris — ruas íngremes, cafés de esquina e uma livraria chamada « La Page Tournée ».",
    culturalContext:
      "Cafés de bairro, livrarias independentes, mercados de rua, a rotina parisiense, conversas informais e expressões do dia a dia.",
    characters: [
      { name: "Camille Moreau", age: 26, main: true, role: "Livreira", description: "Observadora e um pouco tímida, adora livros usados porque guardam histórias de outros leitores." },
      { name: "Monsieur Bernard", age: 71, role: "Dono da livraria", description: "Conhece o bairro há cinquenta anos e fala devagar, sempre com uma anedota." },
      { name: "Inès", age: 27, role: "Amiga de Camille", description: "Barista no Café des Abbesses, prática e engraçada, manda mensagens de voz longas demais." },
      { name: "Madame Leroux", role: "Florista do mercado", description: "Vende flores na Rue Lepic há décadas. Talvez saiba algo sobre a carta." },
    ],
    episodes: [
      {
        id: "la-lettre",
        number: 1,
        title: "La lettre oubliée",
        intro: "Uma manhã tranquila na livraria e uma descoberta inesperada.",
        context: "Camille abre a livraria às nove horas. Monsieur Bernard deixou uma caixa de livros usados para ela organizar.",
        minutes: 12,
        format: "reading",
        documentLabel: "Diário de Camille · mardi 4 mars",
        body: [
          "Ce matin, j'arrive à la librairie à neuf heures moins dix. Il fait froid à Montmartre, mais le ciel est bleu. J'ouvre la porte, j'allume les lampes et je prépare un café.",
          "Monsieur Bernard a laissé une grande boîte sur le comptoir. Dedans, il y a des livres d'occasion : des romans, des poèmes, un vieux guide de Paris. Je les regarde un par un. J'adore ce moment. Chaque livre a déjà eu une autre vie.",
          "Dans un recueil de poèmes, je trouve une enveloppe jaune. Elle n'est pas fermée. Il n'y a pas de timbre. Sur l'enveloppe, quelqu'un a écrit : « Pour Hélène — rue Lepic ».",
          "J'hésite. Est-ce que je peux la lire ? Ce n'est pas à moi… Mais je suis curieuse. Je lis seulement la première ligne : « Chère Hélène, je t'attendrai au café, comme chaque samedi. » La lettre est datée de 1987.",
          "Quand Monsieur Bernard arrive, je lui montre l'enveloppe. Il sourit, puis il devient silencieux. « La rue Lepic… », dit-il. « Demande à Madame Leroux, au marché. Elle connaît tout le monde. »",
          "Ce soir, je ne pense qu'à ça. Qui est Hélène ? Et pourquoi cette lettre n'est-elle jamais partie ?",
        ],
        vocabulary: [
          { term: "la librairie", translation: "a livraria", example: "Je travaille dans une petite librairie." },
          { term: "un livre d'occasion", translation: "um livro usado", example: "J'achète souvent des livres d'occasion." },
          { term: "le comptoir", translation: "o balcão", example: "La boîte est sur le comptoir." },
          { term: "une enveloppe", translation: "um envelope", example: "Il y a une lettre dans l'enveloppe." },
          { term: "un timbre", translation: "um selo", example: "Il n'y a pas de timbre." },
          { term: "hésiter", translation: "hesitar", example: "J'hésite avant d'ouvrir la lettre." },
        ],
        expressions: [
          { term: "neuf heures moins dix", meaning: "dez para as nove (8h50)" },
          { term: "Ce n'est pas à moi", meaning: "Não é meu / não me pertence" },
          { term: "Je ne pense qu'à ça", meaning: "Só penso nisso" },
        ],
        grammar: [
          {
            title: "Presente do indicativo (verbos em -er)",
            explanation: "A maioria dos verbos franceses termina em -er e segue o mesmo padrão: je -e, tu -es, il/elle -e, nous -ons, vous -ez, ils -ent. Camille narra o dia no presente.",
            examples: ["J'arrive à neuf heures.", "Je regarde les livres.", "Il sourit."],
          },
          {
            title: "A negação ne… pas",
            explanation: "Em francês a negação envolve o verbo: ne + verbo + pas. Diante de vogal, ne vira n'.",
            examples: ["Elle n'est pas fermée.", "Ce n'est pas à moi."],
          },
        ],
        culture: [
          { title: "Livrarias independentes", text: "A França protege as livrarias independentes com a « loi Lang » (1981), que fixa o preço dos livros novos. Por isso, bairros como Montmartre ainda têm pequenas livrarias com livreiros que conhecem os clientes pelo nome." },
          { title: "A Rue Lepic", text: "Uma rua sinuosa que sobe a colina de Montmartre, conhecida pelo seu mercado de rua, padarias e pequenos comércios. É uma rua de moradores, não só de turistas." },
        ],
        prompt: {
          type: "perspectiva",
          title: "O diário de Camille",
          prompt: "Tu es Camille. Écris dans ton journal ce soir : qu'est-ce que tu ressens ? Que vas-tu faire demain ?",
          instructions: "Escreva em francês, na primeira pessoa, como se fosse Camille. Use o presente e pelo menos uma negação (ne… pas). Fale das suas emoções e do seu plano para o dia seguinte.",
          words: [60, 120],
        },
      },
      {
        id: "message-ines",
        number: 2,
        title: "Le message d'Inès",
        intro: "Camille conta tudo à amiga. A resposta chega em forma de mensagem de voz.",
        context: "Na mesma noite, Camille manda uma foto do envelope para Inès. Na manhã seguinte, recebe uma longa mensagem de voz.",
        minutes: 10,
        format: "listening",
        transcript: [
          { speaker: "Inès", line: "Coucou Camille ! Bon, j'ai vu ta photo… C'est trop mystérieux, ton histoire !" },
          { speaker: "Inès", line: "Écoute, j'ai une idée. Au café, il y a un client, un vieux monsieur. Il vient tous les samedis, toujours à la même table, près de la fenêtre." },
          { speaker: "Inès", line: "Il commande un café crème et il lit le journal. Il ne parle pas beaucoup, mais il est très gentil." },
          { speaker: "Inès", line: "Et le patron m'a dit une fois : « Lui, il attend quelqu'un depuis des années. » Bizarre, non ?" },
          { speaker: "Inès", line: "Bref. Samedi, tu passes au café vers dix heures ? On peut aller au marché ensemble après, pour voir Madame Leroux." },
          { speaker: "Inès", line: "Allez, je dois y aller, il y a du monde ! Bisous, à samedi !" },
        ],
        vocabulary: [
          { term: "coucou", translation: "oi (bem informal)", example: "Coucou ! Ça va ?" },
          { term: "un café crème", translation: "café com leite cremoso", example: "Un café crème, s'il vous plaît." },
          { term: "le patron", translation: "o dono / o chefe", example: "Le patron du café est sympa." },
          { term: "la fenêtre", translation: "a janela", example: "Il est assis près de la fenêtre." },
          { term: "attendre", translation: "esperar", example: "J'attends le bus." },
        ],
        expressions: [
          { term: "C'est trop…", meaning: "É muito… (informal, entre amigos)" },
          { term: "Bref", meaning: "Enfim / resumindo" },
          { term: "Il y a du monde", meaning: "Está cheio de gente" },
          { term: "Bisous", meaning: "Beijos (despedida entre amigos)" },
        ],
        grammar: [
          {
            title: "Il y a + duração (depuis)",
            explanation: "Para uma ação que começou no passado e continua, o francês usa o presente + depuis: « il attend depuis des années » = ele espera há anos.",
            examples: ["J'habite à Paris depuis trois ans.", "Il attend quelqu'un depuis des années."],
          },
          {
            title: "Futuro próximo e propostas",
            explanation: "Na fala, o presente serve para propor algo: « Samedi, tu passes au café ? ». Também se usa aller + infinitivo: « On va aller au marché ».",
            examples: ["Tu viens samedi ?", "On peut aller au marché."],
          },
        ],
        culture: [
          { title: "Mensagens de voz e registro informal", text: "Entre amigos, o francês falado encurta e suaviza: « coucou », « bref », « trop + adjetivo ». O pronome « on » substitui « nous » quase sempre na conversa." },
          { title: "Os habitués do café", text: "Muitos cafés de bairro têm seus « habitués »: clientes que vêm sempre à mesma hora e mesa. O garçom sabe o pedido sem perguntar. O café é uma extensão da sala de estar." },
        ],
        prompt: {
          type: "carta",
          title: "Responder a Inès",
          prompt: "Réponds au message d'Inès. Accepte (ou propose une autre heure) et pose-lui deux questions sur le vieux monsieur.",
          instructions: "Escreva uma mensagem informal em francês para Inès. Use « coucou » ou outra saudação, faça duas perguntas e termine com uma despedida informal.",
          words: [40, 90],
        },
      },
      {
        id: "marche-lepic",
        number: 3,
        title: "Samedi au marché",
        intro: "No mercado da Rue Lepic, Madame Leroux reconhece um nome.",
        context: "Sábado de manhã. Camille e Inès atravessam o mercado entre queijos, frutas e flores até a banca de Madame Leroux.",
        minutes: 8,
        format: "watching",
        transcript: [
          { speaker: "Camille", line: "Bonjour Madame ! Excusez-moi, vous avez une minute ?" },
          { speaker: "Mme Leroux", line: "Bonjour, ma belle. Pour toi, toujours. Tu veux des tulipes ? Elles sont magnifiques aujourd'hui." },
          { speaker: "Camille", line: "Peut-être après ! J'ai trouvé une lettre… pour une certaine Hélène, rue Lepic." },
          { speaker: "Mme Leroux", line: "Hélène ? … Hélène Garnier. Elle avait une petite boutique de chapeaux, juste là, en face." },
          { speaker: "Inès", line: "Elle habite toujours ici ?" },
          { speaker: "Mme Leroux", line: "Non. Elle est partie à Lyon en 1987. Très vite. Personne n'a compris pourquoi." },
          { speaker: "Camille", line: "En 1987… comme la lettre." },
          { speaker: "Mme Leroux", line: "Tiens. Prends ces tulipes. Et reviens me raconter, d'accord ?" },
        ],
        vocabulary: [
          { term: "le marché", translation: "a feira / o mercado", example: "Je vais au marché le samedi." },
          { term: "une boutique", translation: "uma loja pequena", example: "Elle avait une boutique de chapeaux." },
          { term: "en face", translation: "em frente", example: "La boulangerie est en face." },
          { term: "un chapeau", translation: "um chapéu", example: "Il porte un chapeau gris." },
          { term: "partir", translation: "partir, ir embora", example: "Elle est partie à Lyon." },
        ],
        expressions: [
          { term: "Vous avez une minute ?", meaning: "A senhora tem um minuto? (pedido educado)" },
          { term: "ma belle", meaning: "minha querida (carinhoso, de pessoa mais velha)" },
          { term: "Tiens", meaning: "Toma / Aqui está (ao entregar algo)" },
        ],
        grammar: [
          {
            title: "Passé composé com être",
            explanation: "Verbos de movimento como partir, arriver, aller formam o passado com être, e o particípio concorda com o sujeito: elle est partie.",
            examples: ["Elle est partie à Lyon.", "Ils sont arrivés hier."],
          },
          {
            title: "Tu e vous",
            explanation: "Camille usa « vous » com Madame Leroux por respeito; a florista responde com « tu », comum de uma pessoa mais velha e próxima.",
            examples: ["Vous avez une minute ?", "Tu veux des tulipes ?"],
          },
        ],
        culture: [
          { title: "Os mercados de rua", text: "Paris tem mais de 70 mercados alimentares. Ir à feira no sábado é um ritual: conversar com os vendedores, provar queijos, escolher frutas da estação." },
          { title: "Cumprimentar antes de tudo", text: "Na França, entrar numa conversa com um comerciante sem dizer « Bonjour » é considerado rude. Primeiro a saudação, depois o pedido." },
        ],
        prompt: {
          type: "continuacao",
          title: "E depois do mercado?",
          prompt: "Imagine la suite : Camille et Inès quittent le marché. Où vont-elles ? Que décident-elles de faire pour retrouver Hélène ?",
          instructions: "Continue a história em francês, na terceira pessoa. Use pelo menos dois verbos no passé composé (com avoir ou être). Mantenha as personagens coerentes.",
          words: [80, 150],
        },
      },
    ],
  },
  {
    id: "zwischen-den-strassen",
    title: "Zwischen den Straßen",
    language: "Alemão",
    languageCode: "de",
    level: "A2",
    cover: lukasCover,
    accent: "sage",
    tagline: "Uma fotografia antiga e uma cidade que nunca para de mudar.",
    synopsis:
      "Lukas estuda arquitetura em Berlim. Para um projeto da universidade sobre bairros em transformação, ele percorre Prenzlauer Berg com seu caderno de desenho. Num mercado de pulgas, encontra uma fotografia antiga de uma rua que já não existe como era — e decide descobrir quem estava nela.",
    setting: "Berlim — Prenzlauer Berg, o U-Bahn amarelo, prédios antigos com pátios internos e o Mauerpark aos domingos.",
    culturalContext:
      "Vida cotidiana alemã, transporte público, arquitetura, padarias, vida universitária e tradições locais.",
    characters: [
      { name: "Lukas Hoffmann", age: 24, main: true, role: "Estudante de arquitetura", description: "Desenha tudo o que vê. Pontual, curioso e um pouco distraído quando encontra um prédio bonito." },
      { name: "Frau Yilmaz", role: "Padeira", description: "Tem uma padaria na Kastanienallee há vinte anos. Sabe o nome de todos os vizinhos." },
      { name: "Jonas", age: 25, role: "Colega de curso", description: "Parceiro de projeto de Lukas. Prefere fotografia a desenho." },
      { name: "Herr Krüger", age: 78, role: "Antigo morador", description: "Mora no mesmo prédio desde 1970. Talvez reconheça a fotografia." },
    ],
    episodes: [
      {
        id: "das-foto",
        number: 1,
        title: "Das alte Foto",
        intro: "Um domingo no Mauerpark e uma descoberta numa caixa de fotos antigas.",
        context: "Lukas precisa de material para o projeto 'Stadt im Wandel'. Ele vai ao mercado de pulgas do Mauerpark.",
        minutes: 12,
        format: "reading",
        documentLabel: "Skizzenbuch von Lukas · Sonntag, 9. März",
        body: [
          "Heute ist Sonntag. Ich stehe um acht Uhr auf, trinke einen Kaffee und nehme die U2 bis Eberswalder Straße. Von dort gehe ich zu Fuß zum Mauerpark.",
          "Der Flohmarkt ist schon voll. Es gibt alte Möbel, Schallplatten, Fahrräder und viele Kisten mit Büchern. Ich suche Material für mein Uni-Projekt. Das Thema ist: „Stadt im Wandel“.",
          "An einem kleinen Stand finde ich eine Kiste mit alten Fotos. Die Verkäuferin sagt: „Ein Euro pro Foto.“ Ich schaue mir die Bilder an. Ein Foto gefällt mir sofort.",
          "Auf dem Foto sieht man eine Straße mit alten Häusern. Vor einer Tür steht eine Frau mit einem Kind. Über der Tür kann man ein Schild lesen: „Bäckerei“. Auf der Rückseite steht: „Kastanienallee, 1979“.",
          "Ich kaufe das Foto. Am Nachmittag gehe ich in die Kastanienallee. Ich suche das Haus. Die Fassade ist neu, aber die Tür ist noch da — und heute ist dort wieder eine Bäckerei!",
          "Morgen gehe ich hinein. Vielleicht weiß jemand etwas über die Frau auf dem Foto.",
        ],
        vocabulary: [
          { term: "der Flohmarkt", translation: "o mercado de pulgas", example: "Am Sonntag gehe ich auf den Flohmarkt." },
          { term: "die Kiste", translation: "a caixa", example: "In der Kiste sind alte Fotos." },
          { term: "die Rückseite", translation: "o verso", example: "Auf der Rückseite steht ein Datum." },
          { term: "die Fassade", translation: "a fachada", example: "Die Fassade ist frisch renoviert." },
          { term: "das Schild", translation: "a placa", example: "Auf dem Schild steht „Bäckerei“." },
          { term: "zu Fuß gehen", translation: "ir a pé", example: "Ich gehe zu Fuß zur Uni." },
        ],
        expressions: [
          { term: "Das gefällt mir", meaning: "Eu gosto disso (lit.: isso me agrada)" },
          { term: "Auf dem Foto sieht man…", meaning: "Na foto vê-se…" },
          { term: "Stadt im Wandel", meaning: "Cidade em transformação" },
        ],
        grammar: [
          {
            title: "Verbo na segunda posição",
            explanation: "Na frase afirmativa alemã, o verbo conjugado fica sempre na 2ª posição. Se a frase começa com tempo ou lugar, o sujeito vem depois do verbo.",
            examples: ["Heute ist Sonntag.", "Am Nachmittag gehe ich in die Kastanienallee."],
          },
          {
            title: "Verbos separáveis",
            explanation: "Verbos como aufstehen e anschauen se separam: o prefixo vai para o fim da frase.",
            examples: ["Ich stehe um acht Uhr auf.", "Ich schaue mir die Bilder an."],
          },
        ],
        culture: [
          { title: "O Mauerpark", text: "O parque fica onde passava a faixa da fronteira do Muro de Berlim. Hoje, aos domingos, recebe um grande mercado de pulgas e karaokê ao ar livre." },
          { title: "Domingo de descanso", text: "Na Alemanha, a maioria das lojas fecha aos domingos (Ladenschluss). Por isso, mercados de pulgas, parques e cafés ficam cheios — e é preciso fazer compras no sábado." },
        ],
        prompt: {
          type: "descricao",
          title: "Descrever a fotografia",
          prompt: "Beschreibe das Foto von 1979: Was sieht man? Wer ist die Frau? Was denkst du über das Kind?",
          instructions: "Descreva a cena em alemão. Use « Auf dem Foto sieht man… » e preste atenção ao verbo na segunda posição. Pode imaginar detalhes.",
          words: [50, 110],
        },
      },
      {
        id: "in-der-baeckerei",
        number: 2,
        title: "In der Bäckerei",
        intro: "Lukas entra na padaria com a foto no bolso.",
        context: "Segunda-feira, 7h30. Antes da aula, Lukas visita a padaria da Kastanienallee. Frau Yilmaz está atrás do balcão.",
        minutes: 9,
        format: "watching",
        transcript: [
          { speaker: "Frau Yilmaz", line: "Guten Morgen! Was darf's sein?" },
          { speaker: "Lukas", line: "Morgen! Zwei Schrippen und einen Kaffee zum Mitnehmen, bitte." },
          { speaker: "Frau Yilmaz", line: "Gerne. Das macht drei Euro zwanzig." },
          { speaker: "Lukas", line: "Kann ich mit Karte zahlen?" },
          { speaker: "Frau Yilmaz", line: "Leider nur bar. Tut mir leid." },
          { speaker: "Lukas", line: "Kein Problem. Und… darf ich Sie etwas fragen? Kennen Sie dieses Foto?" },
          { speaker: "Frau Yilmaz", line: "Oh! Das ist unser Haus! Aber 1979… da war ich noch nicht hier. Fragen Sie Herrn Krüger. Er wohnt oben, im dritten Stock." },
          { speaker: "Lukas", line: "Vielen Dank! Bis morgen!" },
        ],
        vocabulary: [
          { term: "die Schrippe", translation: "o pãozinho (em Berlim)", example: "Ich nehme zwei Schrippen." },
          { term: "zum Mitnehmen", translation: "para viagem", example: "Einen Kaffee zum Mitnehmen, bitte." },
          { term: "bar zahlen", translation: "pagar em dinheiro", example: "Hier kann man nur bar zahlen." },
          { term: "der Stock", translation: "o andar", example: "Er wohnt im dritten Stock." },
          { term: "oben", translation: "em cima, lá em cima", example: "Die Wohnung ist oben." },
        ],
        expressions: [
          { term: "Was darf's sein?", meaning: "O que vai ser? (no balcão)" },
          { term: "Das macht…", meaning: "Fica… / Dá… (ao dizer o preço)" },
          { term: "Tut mir leid", meaning: "Sinto muito" },
        ],
        grammar: [
          {
            title: "Acusativo com artigos",
            explanation: "O objeto direto vai para o acusativo. Só o masculino muda: der → den, ein → einen.",
            examples: ["Ich nehme einen Kaffee.", "Kennen Sie den Mann?"],
          },
          {
            title: "Verbos modais: können, dürfen",
            explanation: "O modal fica na 2ª posição (ou 1ª em perguntas) e o verbo principal vai no infinitivo para o fim.",
            examples: ["Kann ich mit Karte zahlen?", "Darf ich Sie etwas fragen?"],
          },
        ],
        culture: [
          { title: "Brötchen, Schrippe, Semmel", text: "O pãozinho tem nomes regionais: Schrippe em Berlim, Semmel na Baviera e na Áustria, Brötchen no uso geral. O café da manhã com pão fresco é uma tradição forte." },
          { title: "Dinheiro em espécie", text: "Muitos pequenos comércios alemães ainda preferem dinheiro (« nur bar »). É comum ver placas de « Kartenzahlung ab 10 €»." },
        ],
        prompt: {
          type: "dialogo",
          title: "Lukas encontra Herr Krüger",
          prompt: "Schreib einen Dialog: Lukas klingelt bei Herrn Krüger und zeigt ihm das Foto.",
          instructions: "Escreva um diálogo em alemão entre Lukas e Herr Krüger. Use « Sie » (formal), pelo menos um verbo modal e uma pergunta com « Kennen Sie…? ».",
          words: [60, 130],
        },
      },
      {
        id: "herr-krueger",
        number: 3,
        title: "Die Stimme von Herrn Krüger",
        intro: "Herr Krüger não abre a porta — mas deixa uma mensagem.",
        context: "Lukas deixou um bilhete na caixa de correio do terceiro andar com seu número. À noite, recebe uma mensagem de voz.",
        minutes: 10,
        format: "listening",
        transcript: [
          { speaker: "Herr Krüger", line: "Guten Abend, Herr Hoffmann. Hier spricht Krüger, aus der Kastanienallee." },
          { speaker: "Herr Krüger", line: "Ich habe Ihren Zettel gelesen. Entschuldigen Sie, ich mache nicht gern die Tür auf, wenn ich niemanden erwarte." },
          { speaker: "Herr Krüger", line: "Die Frau auf dem Foto heißt Marlene. Sie hatte die Bäckerei bis 1989. Das Kind ist ihre Tochter, Anna." },
          { speaker: "Herr Krüger", line: "Nach der Wende ist viel passiert. Die Häuser wurden renoviert, viele Leute sind weggezogen. Marlene auch." },
          { speaker: "Herr Krüger", line: "Ich habe noch eine Adresse von Anna. Kommen Sie am Samstag um drei Uhr zum Kaffee. Ich backe einen Kuchen." },
          { speaker: "Herr Krüger", line: "Und bitte: Seien Sie pünktlich. Auf Wiederhören." },
        ],
        vocabulary: [
          { term: "der Zettel", translation: "o bilhete, o papelzinho", example: "Ich schreibe meine Nummer auf einen Zettel." },
          { term: "erwarten", translation: "esperar (alguém), aguardar", example: "Ich erwarte heute Besuch." },
          { term: "wegziehen", translation: "mudar-se (para longe)", example: "Viele Leute sind weggezogen." },
          { term: "die Wende", translation: "a 'virada' (queda do Muro, 1989–90)", example: "Nach der Wende hat sich viel verändert." },
          { term: "pünktlich", translation: "pontual", example: "Bitte seien Sie pünktlich." },
        ],
        expressions: [
          { term: "Hier spricht…", meaning: "Aqui fala… (ao telefone)" },
          { term: "Kaffee und Kuchen", meaning: "café com bolo, o lanche da tarde" },
          { term: "Auf Wiederhören", meaning: "Até logo (ao telefone)" },
        ],
        grammar: [
          {
            title: "Perfekt (passado na fala)",
            explanation: "Na conversa, o alemão usa o Perfekt: haben/sein + particípio no fim. Verbos de mudança de lugar usam sein.",
            examples: ["Ich habe Ihren Zettel gelesen.", "Viele Leute sind weggezogen."],
          },
          {
            title: "Subordinada com wenn",
            explanation: "Depois de wenn (quando/se), o verbo conjugado vai para o fim da oração.",
            examples: ["…wenn ich niemanden erwarte.", "Wenn es regnet, nehme ich die U-Bahn."],
          },
        ],
        culture: [
          { title: "Kaffee und Kuchen", text: "Por volta das 15h, especialmente nos fins de semana, muitas famílias alemãs se reúnem para café e bolo caseiro. Convidar alguém para isso é um gesto de confiança." },
          { title: "Pontualidade", text: "Chegar na hora é sinal de respeito. Atrasos de mais de cinco minutos costumam ser avisados com antecedência." },
          { title: "Prenzlauer Berg depois de 1989", text: "O bairro, na antiga Berlim Oriental, passou por grande renovação após a reunificação. Muitos moradores antigos saíram com o aumento dos aluguéis — tema frequente de debate na cidade." },
        ],
        prompt: {
          type: "comparacao",
          title: "Bairros que mudam",
          prompt: "Vergleiche: Wie verändert sich ein Viertel in deiner Stadt? Gibt es ähnliche Geschichten wie in Prenzlauer Berg?",
          instructions: "Escreva em alemão comparando um bairro da sua cidade com Prenzlauer Berg. Use pelo menos dois verbos no Perfekt e uma frase com « wenn ».",
          words: [70, 140],
        },
      },
    ],
  },
];

export const getJournal = (id: string) => journals.find((j) => j.id === id);
export const getEpisode = (j: Journal, id: string) => j.episodes.find((e) => e.id === id);
export const languageCodes = Array.from(new Set(journals.map((j) => j.languageCode)));
export const countWords = (t: string) => (t.trim() ? t.trim().split(/\s+/).length : 0);
