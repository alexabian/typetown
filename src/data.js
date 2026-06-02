export const STORAGE_KEY = 'typetown_v2';

export const ANIMALS = [
  {id:'chick',    emoji:'🐥', name:'Baby Chick',    rarity:'common',    price:5},
  {id:'rabbit',   emoji:'🐰', name:'Fluffy Bunny',  rarity:'common',    price:6},
  {id:'duckling', emoji:'🐤', name:'Duckling',      rarity:'common',    price:7},
  {id:'cat',      emoji:'🐱', name:'Kitten',        rarity:'common',    price:8},
  {id:'hamster',  emoji:'🐹', name:'Hamster',       rarity:'common',    price:9},
  {id:'dog',      emoji:'🐶', name:'Puppy',         rarity:'common',    price:10},
  {id:'turtle',   emoji:'🐢', name:'Baby Turtle',   rarity:'common',    price:12},
  {id:'snail',    emoji:'🐌', name:'Garden Snail',  rarity:'common',    price:14},
  {id:'lamb',     emoji:'🐑', name:'Little Lamb',   rarity:'uncommon',  price:20},
  {id:'piglet',   emoji:'🐷', name:'Piglet',        rarity:'uncommon',  price:22},
  {id:'cow',      emoji:'🐮', name:'Spotty Cow',    rarity:'uncommon',  price:25},
  {id:'frog',     emoji:'🐸', name:'Pond Frog',     rarity:'uncommon',  price:28},
  {id:'hedgehog', emoji:'🦔', name:'Hedgehog',      rarity:'uncommon',  price:32},
  {id:'owl',      emoji:'🦉', name:'Wise Owl',      rarity:'uncommon',  price:35},
  {id:'fox',      emoji:'🦊', name:'Baby Fox',      rarity:'uncommon',  price:38},
  {id:'deer',     emoji:'🦌', name:'Fawn',          rarity:'uncommon',  price:40},
  {id:'panda',    emoji:'🐼', name:'Panda Cub',     rarity:'rare',      price:50},
  {id:'koala',    emoji:'🐨', name:'Koala',         rarity:'rare',      price:55},
  {id:'penguin',  emoji:'🐧', name:'Penguin',       rarity:'rare',      price:60},
  {id:'flamingo', emoji:'🦩', name:'Flamingo',      rarity:'rare',      price:65},
  {id:'parrot',   emoji:'🦜', name:'Rainbow Parrot',rarity:'rare',      price:70},
  {id:'swan',     emoji:'🦢', name:'White Swan',    rarity:'rare',      price:75},
  {id:'otter',    emoji:'🦦', name:'Sea Otter',     rarity:'rare',      price:80},
  {id:'unicorn',  emoji:'🦄', name:'Unicorn',       rarity:'legendary', price:100},
  {id:'dragon',   emoji:'🐲', name:'Baby Dragon',   rarity:'legendary', price:120},
  {id:'phoenix',  emoji:'🦅', name:'Phoenix',       rarity:'legendary', price:150},
  {id:'narwhal',  emoji:'🦄', name:'Narwhal',       rarity:'legendary', price:170},
  {id:'axolotl',  emoji:'🦎', name:'Axolotl',       rarity:'legendary', price:200},
  {id:'sunflower', emoji:'🌻', name:'Sunflower',     rarity:'common',    price:8},
  {id:'tulip',     emoji:'🌷', name:'Pink Tulip',    rarity:'common',    price:9},
  {id:'daisy',     emoji:'🌼', name:'Daisy',         rarity:'common',    price:11},
  {id:'rose',      emoji:'🌹', name:'Red Rose',      rarity:'uncommon',  price:24},
  {id:'cherry',    emoji:'🌸', name:'Cherry Blossom',rarity:'uncommon',  price:30},
  {id:'lotus',     emoji:'🪷', name:'Lotus Flower',  rarity:'rare',      price:58},
  {id:'bouquet',   emoji:'💐', name:'Magic Bouquet', rarity:'legendary', price:115},
  {id:'icecream',  emoji:'🍦', name:'Ice Cream',     rarity:'common',    price:7},
  {id:'donut',     emoji:'🍩', name:'Sprinkle Donut',rarity:'common',    price:12},
  {id:'lollipop',  emoji:'🍭', name:'Rainbow Lolly', rarity:'uncommon',  price:26},
  {id:'cake',      emoji:'🎂', name:'Birthday Cake', rarity:'uncommon',  price:36},
  {id:'cupcake',   emoji:'🧁', name:'Cupcake',       rarity:'rare',      price:62},
  {id:'candy',     emoji:'🍬', name:'Candy Bag',     rarity:'rare',      price:67},
  {id:'sweetbox',  emoji:'🍫', name:'Chocolate Box', rarity:'legendary', price:125},
  {id:'star2',     emoji:'⭐', name:'Lucky Star',    rarity:'common',    price:6},
  {id:'moon',      emoji:'🌙', name:'Crescent Moon', rarity:'uncommon',  price:22},
  {id:'planet',    emoji:'🪐', name:'Saturn',        rarity:'rare',      price:72},
  {id:'rocket',    emoji:'🚀', name:'Rocket Ship',   rarity:'rare',      price:78},
  {id:'gem',       emoji:'💎', name:'Crystal Gem',   rarity:'legendary', price:110},
  {id:'crown',     emoji:'👑', name:'Golden Crown',  rarity:'legendary', price:135},
  {id:'shooting',  emoji:'🌠', name:'Shooting Star', rarity:'legendary', price:160},
  {id:'rainbow2',  emoji:'🌈', name:'Rainbow',       rarity:'uncommon',  price:28},
  {id:'balloon',   emoji:'🎈', name:'Party Balloon', rarity:'common',    price:5},
  {id:'gift',      emoji:'🎁', name:'Mystery Gift',  rarity:'uncommon',  price:34},
  {id:'ribbon',    emoji:'🎀', name:'Pink Ribbon',   rarity:'common',    price:10},
  {id:'music',     emoji:'🎵', name:'Music Note',    rarity:'uncommon',  price:32},
  {id:'trophy',    emoji:'🏆', name:'Gold Trophy',   rarity:'rare',      price:75},
  {id:'magic',     emoji:'🪄', name:'Magic Wand',    rarity:'legendary', price:145},
];

export const TASKS_LIDIA = [
  {type:'letters',    badge:'Letters',      title:'Alphabet Section',  prompt:'Type this letter for your report:',       points:3},
  {type:'spelling',   badge:'Spelling',     title:'Words Section',     prompt:'Spell this word for your report:',        points:5},
  {type:'count_by5',  badge:'Count by 5s',  title:'Number Patterns',   prompt:'Count by 5s — what number comes next?',   points:6},
  {type:'count_by10', badge:'Count by 10s', title:'Number Patterns',   prompt:'Count by 10s — what number comes next?',  points:6},
  {type:'clock',      badge:'Clock',        title:'Time Section',      prompt:'What time does the clock show?',          points:7},
  {type:'counting',   badge:'Counting',     title:'Counting Section',  prompt:'Count and type the total:',               points:4},
  {type:'free',       badge:'Free Typing',  title:'Notes Section',     prompt:'Write anything — your important notes:',  points:2},
];

export const TASKS_NEREA = [
  {type:'letters_easy', badge:'Letters',     title:'Letter Fun',        prompt:'Press the big letter you see!',        points:2},
  {type:'counting_easy',badge:'Counting',    title:'Counting Fun',      prompt:'How many? Type the number!',           points:3},
  {type:'free',         badge:'Free Typing', title:'Fun Notes',         prompt:'Type anything — you are amazing!',     points:1},
];

export const WORDS = ['cat','dog','sun','cup','hat','pen','bag','ant','egg','jam','log','map','net','owl','pin','red','big','run','sit','hop'];
export const EMOJIS_COUNT = ['🍎','⭐','🌸','🐱','🎈','🍦','🐥','💛','🦋','🌺','🍓','🌻','🍩','🌙','🎀','🍭','🌈','🎊','🍋','🚀','🌷','🎁','🫐','🍄','🏠','🎵','🌍','🍰','🐝','🎸','🌮','🎃','🦄','💎','🧁','🌊','🪐','🍕','⚡','🎯','🌵','🦩','🍇','🎠','🌟'];
export const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
export const SPARKS_PRAISE = ['Amazing work! 🌟','You are SO smart! 💖','Brilliant! ⭐','Keep going superstar! 🦋','The office loves you! 🌸','Perfect! 🎉','Wow wow WOW! ✨','Outstanding! 🌈'];
export const SPARKS_ENCOURAGE = ['Oops! Try again superstar 💕','Almost! You can do it! 🌟','So close! Give it another go 🎀'];
export const BREAK_MSGS = [
  {emoji:'🌟', title:'5 in a row!',       sub:'You are unstoppable! Take a tiny breather ☕'},
  {emoji:'🔥', title:"You're on fire!",    sub:'5 more done! Your brain deserves a rest 🧠💖'},
  {emoji:'🎉', title:'Superstar moment!',  sub:'5 correct! Sparks is SO proud of you! 🦋✨'},
  {emoji:'🌸', title:'Incredible work!',   sub:'Time for a mini break — you earned it! 💕'},
  {emoji:'🏆', title:'Champion alert!',    sub:'Keep this up and you\'ll own the whole farm! 🐾'},
];
