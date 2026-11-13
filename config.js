// =====================================================
// config.js  —  HIER PAS JE ALLES AAN (geen code nodig)
// =====================================================
// Nieuwe vraag toevoegen: kopieer een regel in QUESTIONS en pas aan.
//   vraag        = de vraag
//   image        = bestandsnaam van de afbeelding ("" = geen afbeelding)
//   antwoorden   = lijst met antwoorden
//   correctIndex = welk antwoord goed is (0 = eerste, 1 = tweede, ...)
//   uitleg       = (optioneel) uitleg na het antwoord; gebruik een regel
//                  die met "- " begint voor een opsomming.

const TEXTS = {
  pageTitle: "🍂 De Oma Herfst Quiz 🍁",
  heading: "De Oma Herfst Quiz",
  whoAreYou: "Wie ben jij?",
  chooseNote: "Kies jezelf en start wanneer je klaar bent",
  noRushNote: "Je krijgt alle tijd, geen haast.",
  changeNote: "Je kunt je antwoord altijd nog aanpassen, ook als je teruggaat. (Niet vals spelen!)",
  startBtn: "START DE QUIZ",
  backBtn: "Terug",
  nextBtn: "VOLGENDE",
  resultBtn: "RESULTAAT",
  correct: "✅ Goed!",
  wrong: "❌ Fout!",
  correctAnswerLabel: "Juiste antwoord:",
  explanationLabel: "Uitleg:",
  unanswered: "Niet beantwoord",
  scoreTitle: "🍁 Herfst Quiz 2025 Score Overzicht",
  // {name}, {good} en {bad} worden automatisch ingevuld
  resultLine: "{name}, je had {good} goed en {bad} fout 🍂"
};

const IMAGES = {
  intro: "fam.jpg",    // foto op het startscherm
  result: "xmas.gif"   // foto op het eindscherm (hernoem gerust, bv. "herfst.jpg")
};

// Regels per speler. Alles wat je weglaat, komt uit defaultRules.
const DEFAULT_RULES = {
  mustAnswer: true,          // eerst antwoorden voordat je door mag
  lockSeconds: 5,            // wachttijd na antwoorden (0 = geen)
  hideNextWhileLocked: false,// true = knop is onzichtbaar tijdens wachttijd
  canChangeAnswer: true,     // antwoord later nog aanpassen?
  fadeImage: true,           // afbeelding langzaam laten verschijnen
  fadeSeconds: 7.7,          // duur van het verschijnen
  fadeDelaySeconds: 0,       // wachttijd voordat het verschijnen begint
  speak: false               // Standaard niet voorlezen
};

const PLAYERS = [
  { name: "Kaj",     photo: "kaj.gif",     rules: { speak: true } },
  { name: "Luuk",    photo: "luuk.gif",    rules: { speak: true } }, // Luuk krijgt hier ook zijn eigen regels met speak: true
  { name: "Ilonka",  photo: "ilonka.gif" },
  { name: "Carmen",  photo: "carmen.gif" },
  { name: "Ferran",  photo: "ferran.gif",  rules: { mustAnswer: false, lockSeconds: 0, fadeImage: false } },
  { name: "Richard", photo: "richard.gif" }
];

// =====================================================
// ❓ VRAGEN
// =====================================================
const QUESTIONS = [
{ 
    vraag: "Hoe oud is één Oma geworden?", 
    image: "", 
    antwoorden: ["63", "64", "62", "46"], 
    correctIndex: 1, 
    uitleg: "Oma is 64 jaar geworden! 🎂" 
  },
  { 
    vraag: "Welke sport doet één oma?", 
    image: "", 
    antwoorden: ["Dansen", "Zwemmen", "Fietsen", "Tennis"], 
    correctIndex: 0, 
    uitleg: "Oma houdt van dansen! 💃" 
  },
  { vraag: "Een hiervan kan niet met één lijn getekend worden. Welke is het?", image:"vraag5.png", antwoorden:["A", "B", "C", "D"], correctIndex: 2, uitleg:"Probeer maar"},
   { vraag:"Wat is de waarde van de banaan?", image:"fruit2.jpg", antwoorden:["5","6","7","8"], correctIndex:2, uitleg:"Druiven zijn 22. 22 − 15 = 7, dus de banaan is 7." },
  { vraag:"Wat is het juiste antwoord?", image:"fruit1.jpg", antwoorden:["18","19","20","21"], correctIndex:2, uitleg:"Uit de sommen volgt: sinaasappel = 9 en ananas = 11. Samen is dat 20." },

  { 
  vraag: "Als je het bovenste bouwplaat dichtvouwt tot een kubus, welke van de onderstaande kubussen is dan juist?", 
  image: "vraag2.png", 
  antwoorden: ["Kubus A", "Kubus B", "Kubus C", "Kubus D"], 
  correctIndex: 1, 
  uitleg: "Kubus B is de juiste weergave wanneer je het net van de kubus correct dichtvouwt!" 
},

  { vraag:"Welk dier staat bekend als de koning van de jungle?", image:"", antwoorden:["Olifant","Leeuw","Tijger","Giraffe"], correctIndex:1, uitleg:"De leeuw wordt vaak de koning van de dieren genoemd 🦁" },
  { vraag:"Hoeveel poten heeft een insect?", image:"", antwoorden:["4","6","8","10"], correctIndex:1, uitleg:"Insecten hebben altijd zes poten 🐜" },
  { vraag:"Wat is het grootste landdier ter wereld?", image:"", antwoorden:["Neushoorn","Nijlpaard","Olifant","Giraf"], correctIndex:2, uitleg:"De Afrikaanse olifant is het grootste landdier 🐘" },
  { vraag:"Welk dier slaapt vaak ondersteboven?", image:"", antwoorden:["Vleermuis","Papegaai","Eekhoorn","Vos"], correctIndex:0, uitleg:"Vleermuizen hangen ondersteboven aan hun poten 🦇" },
  { vraag:"Bij welke sport gebruik je een shuttle?", image:"", antwoorden:["Tennis","Badminton","Squash","Volleybal"], correctIndex:1, uitleg:"Bij badminton sla je met een racket een shuttle heen en weer 🏸" },
{ vraag:"Wat zijn dit?", image:"takis.jpg", antwoorden:["Doritos","Takis","Cheetos","Pringles"], correctIndex:1, uitleg:"Takis zijn pittige snacks, oome Ferran wilt ze al lang proberen." },
  { vraag:"Wat zijn dit?", image:"knikkers.jpg", antwoorden:["Kauwgomballen","IJsballetjes","Knikkers","Kralen"], correctIndex:2, uitleg:"Klassiek speelgoed, (helaas) nooit meer terug in de trend gekomen." },
  { vraag:"Wat is dit?", image:"fidgetspinner.jpg", antwoorden:["Slinky","Voetbal","Draaiketting","Fidget spinner"], correctIndex:3, uitleg:"Fidget spinners waren ineens overal." },
{ vraag:"Hoeveel nullen heeft een miljoen?", image:"", antwoorden:["4","5","6","7"], correctIndex:2, uitleg:"Een miljoen schrijf je als 1.000.000 🔢" },  { vraag:"Wat gebeurt er bij buitenspel?", image:"buitenspel.jpg", antwoorden:["Vrije trap","Inworp","Spel wordt afgefloten","Penalty"], correctIndex:2, uitleg:"Bij buitenspel fluit de scheidsrechter het spel af. En wat gebeurt er dan...?" },
  { vraag:"Welke voetbalclub is dit?", image:"juventus.jpg", antwoorden:["Ajax","Juventus","FC Barcelona","Real Madrid"], correctIndex:1, uitleg:"Dit is Juventus, een van de bekendste clubs van Italië." },
  { vraag:"Welke voetbalclub is dit?", image:"fcutrecht.jpg", antwoorden:["FC Groningen","Real Madrid","FC Utrecht","FC Barcelona"], correctIndex:2, uitleg:"Dit is FC UUUUUUUUUUtrecht 😄" },
  { vraag:"Waar staat TOP Oss voor?", image:"toposs.jpg", antwoorden:["Trots Op Oss","Toppers Oss","Tot Ons Profijt Oss","Tot Ons Plezier Oss"], correctIndex:3, uitleg:"Leuk weetje: TOP Oss begon als TOP (1928), was FC Oss (2009–2018) en is weer TOP Oss." },
  { vraag:"Wie is dit?", image:"creeper.jpg", antwoorden:["Mario","Sonic","Pikachu","Creeper"], correctIndex:3, uitleg:"Dit is een Creeper uit Minecraft. Pas op… 💥 Hij explodeert" },
{ vraag:"Hoe heet de sneeuwpop uit Frozen?", image:"", antwoorden:["Sven","Kristoff","Olaf","Hans"], correctIndex:2, uitleg:"Olaf droomt ervan om in de zomer te leven ☃️" },
{ vraag:"Welke kleur heeft de bekende Nintendo-personage Luigi?", image:"", antwoorden:["Rood","Blauw","Groen","Geel"], correctIndex:2, uitleg:"Luigi draagt meestal groen en is de broer van Mario 🎮" },
  { vraag:"Wie is dit?", image:"haai.jpg", antwoorden:["Reagea Shark","Sharktale","Tralalero tralala","Jaws"], correctIndex:2, uitleg:"Dit is ‘Tralalero tralala’ — ook zo’n bekende meme/AI-afbeelding." },
{ vraag:"Welke kleur krijg je als je blauw en geel mengt?", image:"vraag6.jpg", antwoorden:["Paars","Groen","Oranje","Bruin"], correctIndex:1, uitleg:"Blauw en geel samen maken groen 🎨" },  { vraag:"In welke film speelde hij?", image:"zac.jpg", antwoorden:["Harry Potter","High School Musical","Gooise Vrouwen","Camp Rock"], correctIndex:1, uitleg:"Mama Carmen wilt deze films graag kijken. Zac Efron werd mega bekend door High School Musical." },
  { vraag:"In welke film speelde hij?", image:"david.jpg", antwoorden:["Dukes of Hazzard","Flodder","The Godfather","Spongebob Squarepants"], correctIndex:3, uitleg:"In de eerste SpongeBob-film komt David Hasselhoff (als zichzelf) te hulp." },
{ vraag:"Wat is de hoofdstad van Australië?", image:"", antwoorden:["Sydney","Melbourne","Canberra","Perth"], correctIndex:2, uitleg:"Veel mensen denken Sydney, maar Canberra is de hoofdstad 🇦🇺" },{ vraag:"Wat is zwaarder: een kilo veren of een kilo stenen?", image:"", antwoorden:["Veren","Stenen","Even zwaar","Dat verschilt"], correctIndex:2, uitleg:"Een kilo is een kilo! Ze wegen precies evenveel 😁" },{ vraag:"Hoe lang duurt een normale voetbalwedstrijd zonder extra tijd?", image:"", antwoorden:["60 minuten","75 minuten","90 minuten","100 minuten"], correctIndex:2, uitleg:"Een voetbalwedstrijd bestaat uit twee helften van 45 minuten ⏱️" }, 
 { 
  vraag: "Wat is de hoofdstad van Zwitserland?", 
  image: "", 
  antwoorden: ["Zürich", "Genève", "Bern", "St. Gallen"], 
  correctIndex: 2, 
  uitleg: "Veel mensen denken aan Zürich of Genève, maar Bern is de hoofdstad van Zwitserland 🇨🇭 (en St. Gallen is een andere mooie Zwitserse stad!)" 
},
{ 
  vraag: "Wat is de officiële hoofdstad van Nederland?", 
  image: "", 
  antwoorden: ["Rotterdam", "Den Haag", "Utrecht", "Amsterdam"], 
  correctIndex: 3, 
  uitleg: "Amsterdam is de hoofdstad van Nederland, hoewel de regering in Den Haag zit 🇳🇱" 
}

];
