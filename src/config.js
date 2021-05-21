import { SHAPES } from './components/Shape';

const level1 = {
    prizes: [
        {
            name: '100 mondmaskers',
            url: 'https://www.bol.com/nl/p/3laags-wegwerp-mondkapjes-50-stuks-niet-medisch/9300000002383984/',
        },
        {
            name: 'Lego gift cards',
            url: 'https://www.lego.com/en-us/page/static/gift-cards/give',
        },
        {
            name: 'Cinematickets Kinepolis',
            url: 'https://shop.kinepolis.be/nl',
        },
        {
            name: 'Tafeltennis-set',
            url: 'https://www.bol.com/nl/p/rucanor-tafeltennisset/9200000019258412/',
        },
        {
            name: 'Kubb set',
            url: 'https://www.bol.com/nl/p/outdoor-play-kubb-game/9200000022663906',
        },
        {
            name: 'Wijnpakket Gervinum',
            url: 'https://www.gervinum.be/',
        },
        {
            name: 'Badmintonset',
            url: 'https://www.decathlon.be/nl/p/badmintonnet-easy-set-3-m/_/R-p-300055',
        },
        { 
            name: 'Catan - Bordspel',
            url: 'https://www.bol.com/nl/p/catan-basisspel/1004004012362052',
        },
        {
            name: 'Dominion - Kaartspel',
            url: 'https://www.bol.com/nl/p/dominion-basisspel-kaartspel/9200000080798542',
        },
        {
            name: 'Broodbakmachine',
            url: 'https://www.bol.com/nl/p/inventum-bm55-broodbakmachine/9200000025955257',
        },
        {
            name: 'Durbuy Adventure Day',
            url: 'https://www.adventure-valley.be/nl/pass/adventure-pass',
        },
        {
            name: 'Voetbal goal',
            url: 'https://www.bol.com/nl/p/2x-voetbalgoals-voetbaldoelen-90-x-59-x-61-cm-inklapbaar-vouwbaar-buitenspeelgoed-buiten-spelen-sporten-sportief-speelgoed-voetballen-voetbaldoelen-voetbalgoals/9300000001426832',
        },
        {
            name: 'Ticket Bobbejaanland',
            url: 'https://www.bobbejaanland.be/plan-je-bezoek/tickets',
        },
        {
            name: 'Trui met boodschap',
            url: 'https://antwerponly.com/collections',
        },
        {
            name: 'Bongobon: Glamping',
            url: 'https://www.bongo.be/nl/cadeaubonnen/weekendje-weg-overnachten/glamping-884583.html',
            big: true,
        },
        {
            name: 'Luxe boottocht in Gent (10pers)',
            url: 'https://www.minervaboten.be/en/gift-voucher/',
            big: true,
        },
        { 
            name: 'JBL Bluetooth speakers',
            url: 'https://www.coolblue.be/nl/product/818429/jbl-charge-4-zwart.html',
            big: true,
        },
        {
            name: 'Good Beer Spa - Gift card',
            url: 'https://goodbeerspa.com/shop/giftvoucher-for-a-beer-spa-session-for-2-people-in-1-jacuzzi/',
            big: true,
        },
        {
            name: 'Blue Yeti Mic',
            url: 'https://www.coolblue.be/nl/product/754197/blue-yeti-blackout.html',
            big: true,
        },
        {
            name: 'Alpaca wandeling',
            url: 'https://www.alpacaboerderij.be/activiteit/4/Korte-Alpacawandeling',
            big: true,
        },
    ],
    extraQuestion: 'Maak het langst mogelijke woord met letterkoekjes.',
};

const level2 = {
    prizes: [
        {
            name: 'Ticket Plopsa-land',
            url: 'https://www.plopsalanddepanne.be/nl/tickets',
        },
        {
            name: 'Pandemic - Bordspel',
            url: 'https://www.bol.com/nl/p/pandemic-engelstalig-bordspel/9200000018019326/',
        },
        {
            name: 'Ticket Efteling',
            url: 'https://www.efteling.com/nl/park/informatie/toegangsprijzen',
        },
        {
            name: 'Vlogset',
            url: 'https://www.bol.com/nl/p/ringlamp-vlogset-compleet-verstelbaar-statief-tafel-statief-incl-telefoonhouder-8-inch-usb-tiktok-ringlight-flitser-ring-lamp-vlog-make-up-light-studiolamp-vloggen-tutorial/9300000004155333',
        },
        {
            name: 'Kanjam',
            url: 'https://www.bol.com/nl/p/kanjam-game-set/9200000022847660',
        },
        {
            name: 'Lego - Gift card',
            url: 'https://www.lego.com/en-us/page/static/gift-cards/give/physical',
        },
        { 
            name: 'Steam - Gift card',
            url: 'https://store.steampowered.com/digitalgiftcards/',
        },
        {
            name: 'Voetbal prentjes Panini',
            url: 'https://www.bol.com/nl/p/panini-uefa-euro-2020-tournament-edition-50-zakjes-doosje/9300000035508848',
        },
        {
            name: 'Netflix - Gift card ',
            url: 'https://startselect.com/be-nl/netflix',
        },
        {
            name: 'Bongobon: Verwen-moment voor twee',
            url: 'https://www.bongo.be/nl/cadeaubonnen/spa-en-wellness/verwenmoment-voor-twee-1052297.html',
        },
        {
            name: 'Darts',
            url: 'https://www.dartshopper.nl/winmau-blade-5-dartbord-2-sets-steeldarts.html',
        },
        {
            name: 'Wijnkoel-zak',
            url: 'https://www.cubicoolstore.com/en/',
        },
        {
            name: 'Soda-stream',
            url: 'https://www.bol.com/nl/p/sodastream-spirit-megapack-black-incl-3-flessen/9200000077986346/',
        },
        {
            name: 'Spikeball',
            url: 'https://www.bol.com/nl/p/spikeball-metaball-outdoor-indoor-spike-ball-speelset-spikeball-amerikaanse-sport-hit-bal-spel-outdoor-strandspel/9300000024968812',
        },
        { 
            name: 'Festival tent',
            url: 'https://www.decathlon.be/nl/p/buitentent-voor-quechua-tent-2-seconds-3-xl-fresh-black/_/R-p-304345',
        },
        {
            name: 'Airfryer',
            url: 'https://www.coolblue.be/nl/product/882488/philips-airfryer-xl-hd9263-90.html',
            big: true,
        },
        {
            name: 'Bongobon: Ballon-vaart',
            url: 'https://www.bongo.be/nl/cadeaubonnen/actie-en-avontuur/ballonvaart-bubbels-884196.html',
            big: true,
        },
        {
            name: 'Mini ballenbad',
            url: 'https://www.degeleflamingo.com/collections/ballenbadjes/products/misioo-ballenbad-xxl-vierkant-lichtgrijs-pre-order-levering-22-11',
            big: true,
        },
        {
            name: 'Steelstofzuiger',
            url: 'https://www.coolblue.be/nl/product/792925/aeg-cx7-2-35o.html',
            big: true,
        },
        {
            name: 'Airpods Pro',
            url: 'https://www.bol.com/nl/p/apple-airpods-pro/9200000123229147/',
            big: true,
        },
        {
            name: 'Massagegun',
            url: 'https://www.coolblue.be/nl/product/872227/tunturi-massage-gun.html',
            big: true,
        }
    ],
    extraQuestion: 'Maak een zolang mogelijke worst met een potje Play-Doh.',
};

const level3 = {
    prizes: [
        {
            name: 'Mini-keuken voor de kindjes',
            url: 'https://www.ikea.com/be/nl/p/duktig-keukentje-berken-60319972',
        },
        { 
            name: 'Wijn abbonement',
            url: 'https://ourdailybottle.com/pages/gifting',
        },
        {
            name: 'Nespresso Machine',
            url: 'https://www.coolblue.be/nl/product/832739/magimix-nespresso-essenza-mini-zwart.html',
        },
        {
            name: 'HelloFresh cadeaubon',
            url: 'https://www.hellofresh.be/gift',
        },
        {
            name: 'Pizza set',
            url: 'https://www.bol.com/nl/p/tristar-pz-9154-pizza-festa-4-pizza-gourmetset/9200000131445037',
        },
        {
            name: 'Arduino Starter Kit',
            url: 'https://www.bol.com/nl/p/arduino-starter-kit/9200000058177387/',
        },
        {
            name: 'Raspberry Pi Kit',
            url: 'https://www.sossolutions.nl/retro-game-console-emulator-met-raspberry-pi-4-model-b-2gb-4gb',
        },
        {
            name: 'Voetbaltruitje Rode Duivels',
            url: 'https://shop.rbfa.be/match/home',
        },
        {
            name: 'Disney+ jaarabonnement',
            url: 'https://www.disneyplus.com/en-be',
        },
        {
            name: 'Skateboard',
            url: 'https://www.stokedboardshop.be/products/helvetica-neue-aqua-8-0-complete-skateboard',
        },
        {
            name: 'Lego - Gift card',
            url: 'https://www.lego.com/en-us/page/static/gift-cards/give/physical',
        },
        {
            name: 'Logitech Wireless Mouse',
            url: 'https://www.logitech.com/en-us/products/mice/mx-master-3-mac-wireless-mouse.910-005693.html',
        },
        {
            name: 'The Jane (2p) - Waarde-bon',
            url: 'https://www.thejaneantwerp.com/eng/shop',
            big: true,
        },
        {
            name: 'Dinner on the lake',
            url: 'https://dinneronthelake.com/reservations',
            big: true,
        },
        {
            name: 'Ikea - Waardebon',
            url: 'https://www.ikea.com/be/nl/customer-service/shopping-at-ikea/ikea-cadeaupas-pub6f712fb1',
            big: true,
        },
        {
            name: 'Coolblue - Waardebon',
            url: 'https://www.coolblue.be/nl/cadeaubonnen/prijs:-250?sorteren=hoogste-prijs',
            big: true,
        },
        {
            name: 'Nintendo Switch',
            big: true,
            url: 'https://www.bol.com/nl/p/nintendo-switch-lite-console-grijs/9200000116374158',
        },
        {
            name: 'Tafeltennis tafel',
            url: 'https://www.bol.com/nl/p/buffalo-basic-indoor-tafeltennis-tafel-blauw/9200000022086363',
            big: true,
        },
    ],
    extraQuestion: 'Zet zoveel mogelijk wasknijpers op jullie gezicht',
}

const superJackpot = {
    prizes: [
        {
            name: 'Green Egg BBQ',
            big: true,
            url: 'https://www.coolblue.be/nl/product/508616/big-green-egg-mini.html',
        },
        {
            name: 'PS5',
            big: true,
            url: 'https://www.coolblue.be/nl/product/865866/playstation-5.html',
        },
        {
            name: 'VR Bril',
            big: true,
            url: 'https://www.coolblue.nl/product/867994/oculus-quest-2-256gb.html',
        },
        {
            name: 'Elektrische step',
            big: true,
            url: 'https://www.mediamarkt.nl/nl/product/_pro-mounts-urbmob-f9-1670674.html',
        },
        {
            name: 'Opblaasbare Jacuzzi',
            big: true,
            url: 'https://www.toppy.nl/product/14486/1177/spa/opblaasbare-jacuzzi/netspa-canyon-opblaasbare-jacuzzi-4-persoons.html',
        },
        {
            name: 'Airfryer',
            url: 'https://www.coolblue.be/nl/product/882488/philips-airfryer-xl-hd9263-90.html',
        },
        {
            name: 'Alpacawandeling',
            url: 'https://www.alpacaboerderij.be/activiteit/4/Korte-Alpacawandeling',
        },
        {
            name: 'Blue Yeti Mic',
            url: 'https://www.coolblue.be/nl/product/754197/blue-yeti-blackout.html',
        },
        {
            name: 'Good Beer Spa - Gift card',
            url: 'https://goodbeerspa.com/shop/giftvoucher-for-a-beer-spa-session-for-2-people-in-1-jacuzzi/',
        },
        { 
            name: 'JBL Bluetooth speakers',
            url: 'https://www.coolblue.be/nl/product/818429/jbl-charge-4-zwart.html',
        },
        {
            name: 'Luxe boottocht in Gent (10pers)',
            url: 'https://www.minervaboten.be/en/gift-voucher/',
        },
        {
            name: 'Bongobon: Glamping',
            url: 'https://www.bongo.be/nl/cadeaubonnen/weekendje-weg-overnachten/glamping-884583.html',
        },
    ],
};

export default {
    level1,
    level2,
    level3,
    superJackpot
};
