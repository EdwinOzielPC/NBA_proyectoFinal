
// =========================================================================
// js/nba.js - Partidos en vivo (API-Ninjas) + Plantillas NBA con fotos
// =========================================================================

const API_URL = 'https://api.api-ninjas.com/v1/basketballgames';
// Pega aquí tu API Key gratuita de https://api-ninjas.com/
const API_KEY = 'FlfMGhRCXMqzPbDugwPxpYE3iZzuROrbBzifQmuz';

let partidosCargados = [];
let viendoFavoritos = false;

const LOGOS_NBA = {
    'Atlanta Hawks': 'https://cdn.nba.com/logos/nba/1610612737/primary/L/logo.svg',
    'Boston Celtics': 'https://cdn.nba.com/logos/nba/1610612738/primary/L/logo.svg',
    'Brooklyn Nets': 'https://cdn.nba.com/logos/nba/1610612751/primary/L/logo.svg',
    'Charlotte Hornets': 'https://cdn.nba.com/logos/nba/1610612766/primary/L/logo.svg',
    'Chicago Bulls': 'https://cdn.nba.com/logos/nba/1610612741/primary/L/logo.svg',
    'Cleveland Cavaliers': 'https://cdn.nba.com/logos/nba/1610612739/primary/L/logo.svg',
    'Dallas Mavericks': 'https://cdn.nba.com/logos/nba/1610612742/primary/L/logo.svg',
    'Denver Nuggets': 'https://cdn.nba.com/logos/nba/1610612743/primary/L/logo.svg',
    'Detroit Pistons': 'https://cdn.nba.com/logos/nba/1610612765/primary/L/logo.svg',
    'Golden State Warriors': 'https://cdn.nba.com/logos/nba/1610612744/primary/L/logo.svg',
    'Houston Rockets': 'https://cdn.nba.com/logos/nba/1610612745/primary/L/logo.svg',
    'Indiana Pacers': 'https://cdn.nba.com/logos/nba/1610612754/primary/L/logo.svg',
    'Los Angeles Clippers': 'https://cdn.nba.com/logos/nba/1610612746/primary/L/logo.svg',
    'Los Angeles Lakers': 'https://cdn.nba.com/logos/nba/1610612747/primary/L/logo.svg',
    'Memphis Grizzlies': 'https://cdn.nba.com/logos/nba/1610612763/primary/L/logo.svg',
    'Miami Heat': 'https://cdn.nba.com/logos/nba/1610612748/primary/L/logo.svg',
    'Milwaukee Bucks': 'https://cdn.nba.com/logos/nba/1610612749/primary/L/logo.svg',
    'Minnesota Timberwolves': 'https://cdn.nba.com/logos/nba/1610612750/primary/L/logo.svg',
    'New Orleans Pelicans': 'https://cdn.nba.com/logos/nba/1610612740/primary/L/logo.svg',
    'New York Knicks': 'https://cdn.nba.com/logos/nba/1610612752/primary/L/logo.svg',
    'Oklahoma City Thunder': 'https://cdn.nba.com/logos/nba/1610612760/primary/L/logo.svg',
    'Orlando Magic': 'https://cdn.nba.com/logos/nba/1610612753/primary/L/logo.svg',
    'Philadelphia 76ers': 'https://cdn.nba.com/logos/nba/1610612755/primary/L/logo.svg',
    'Phoenix Suns': 'https://cdn.nba.com/logos/nba/1610612756/primary/L/logo.svg',
    'Portland Trail Blazers': 'https://cdn.nba.com/logos/nba/1610612757/primary/L/logo.svg',
    'Sacramento Kings': 'https://cdn.nba.com/logos/nba/1610612758/primary/L/logo.svg',
    'San Antonio Spurs': 'https://cdn.nba.com/logos/nba/1610612759/primary/L/logo.svg',
    'Toronto Raptors': 'https://cdn.nba.com/logos/nba/1610612761/primary/L/logo.svg',
    'Utah Jazz': 'https://cdn.nba.com/logos/nba/1610612762/primary/L/logo.svg',
    'Washington Wizards': 'https://cdn.nba.com/logos/nba/1610612764/primary/L/logo.svg'
};

const FOTO_NBA_BASE = 'https://cdn.nba.com/headshots/nba/latest/1040x760';
const fotoJugador = (nbaId) => `${FOTO_NBA_BASE}/${nbaId}.png`;

function obtenerLogoEquipo(nombreEquipo) {
    if (!nombreEquipo) return 'https://cdn.nba.com/logos/leagues/logo-nba.svg';
    const texto = String(nombreEquipo).toLowerCase();
    const encontrado = Object.keys(LOGOS_NBA).find(k =>
        texto.includes(k.toLowerCase()) || k.toLowerCase().includes(texto)
    );
    return encontrado ? LOGOS_NBA[encontrado] : 'https://cdn.nba.com/logos/leagues/logo-nba.svg';
}

const PARTIDOS_RESPALDO = [
    {
        id: 'nba-2026-101',
        home_team: 'Los Angeles Lakers',
        away_team: 'Boston Celtics',
        home_score: 108,
        away_score: 104,
        status: 'LIVE',
        quarter: '4to Cuarto - 02:18',
        date: '2026-11-24',
        time: '20:30 HRS',
        arena: 'Crypto.com Arena, Los Ángeles',
        season: '2026-2027'
    },
    {
        id: 'nba-2026-102',
        home_team: 'Golden State Warriors',
        away_team: 'Denver Nuggets',
        home_score: 94,
        away_score: 97,
        status: 'LIVE',
        quarter: '3er Cuarto - 05:41',
        date: '2026-11-24',
        time: '21:00 HRS',
        arena: 'Chase Center, San Francisco',
        season: '2026-2027'
    }
];

const JUGADORES_RESPALDO = [
    // Atlanta Hawks
    { name: 'Trae Young', team: 'Atlanta Hawks', position: 'G', height: '6-1', weight: '164', jersey: '11', age: 28, photo: fotoJugador(1629027) },
    { name: 'Jalen Johnson', team: 'Atlanta Hawks', position: 'F', height: '6-8', weight: '219', jersey: '1', age: 24, photo: fotoJugador(1630552) },
    { name: 'Zaccharie Risacher', team: 'Atlanta Hawks', position: 'F', height: '6-9', weight: '200', jersey: '10', age: 21, photo: fotoJugador(1642258) },
    { name: 'Dyson Daniels', team: 'Atlanta Hawks', position: 'G', height: '6-7', weight: '199', jersey: '5', age: 23, photo: fotoJugador(1630700) },
    { name: 'Onyeka Okongwu', team: 'Atlanta Hawks', position: 'F-C', height: '6-10', weight: '240', jersey: '17', age: 25, photo: fotoJugador(1630168) },

    // Boston Celtics
    { name: 'Jayson Tatum', team: 'Boston Celtics', position: 'F', height: '6-8', weight: '210', jersey: '0', age: 28, photo: fotoJugador(1628369) },
    { name: 'Jaylen Brown', team: 'Boston Celtics', position: 'G-F', height: '6-6', weight: '223', jersey: '7', age: 30, photo: fotoJugador(1627759) },
    { name: 'Derrick White', team: 'Boston Celtics', position: 'G', height: '6-4', weight: '190', jersey: '9', age: 32, photo: fotoJugador(1628401) },
    { name: 'Jrue Holiday', team: 'Boston Celtics', position: 'G', height: '6-4', weight: '205', jersey: '4', age: 36, photo: fotoJugador(201950) },
    { name: 'Kristaps Porzingis', team: 'Boston Celtics', position: 'F-C', height: '7-2', weight: '240', jersey: '8', age: 31, photo: fotoJugador(204001) },

    // Brooklyn Nets
    { name: 'Cam Thomas', team: 'Brooklyn Nets', position: 'G', height: '6-3', weight: '210', jersey: '24', age: 25, photo: fotoJugador(1630560) },
    { name: 'Cameron Johnson', team: 'Brooklyn Nets', position: 'F', height: '6-8', weight: '210', jersey: '2', age: 30, photo: fotoJugador(1629661) },
    { name: 'Nic Claxton', team: 'Brooklyn Nets', position: 'C', height: '6-11', weight: '215', jersey: '33', age: 27, photo: fotoJugador(1629651) },
    { name: 'Noah Clowney', team: 'Brooklyn Nets', position: 'F-C', height: '6-10', weight: '210', jersey: '21', age: 22, photo: fotoJugador(1641730) },

    // Charlotte Hornets
    { name: 'Brandon Miller', team: 'Charlotte Hornets', position: 'F', height: '6-7', weight: '200', jersey: '24', age: 24, photo: fotoJugador(1641706) },
    { name: 'Miles Bridges', team: 'Charlotte Hornets', position: 'F', height: '6-7', weight: '225', jersey: '0', age: 28, photo: fotoJugador(1628970) },
    { name: 'Mark Williams', team: 'Charlotte Hornets', position: 'C', height: '7-0', weight: '240', jersey: '5', age: 24, photo: fotoJugador(1631109) },
    { name: 'Tidjane Salaun', team: 'Charlotte Hornets', position: 'F', height: '6-9', weight: '207', jersey: '31', age: 21, photo: fotoJugador(1642275) },

    // Chicago Bulls
    { name: 'Coby White', team: 'Chicago Bulls', position: 'G', height: '6-5', weight: '195', jersey: '0', age: 26, photo: fotoJugador(1629632) },
    { name: 'Josh Giddey', team: 'Chicago Bulls', position: 'G', height: '6-8', weight: '216', jersey: '3', age: 24, photo: fotoJugador(1630581) },
    { name: 'Nikola Vucevic', team: 'Chicago Bulls', position: 'C', height: '6-10', weight: '260', jersey: '9', age: 36, photo: fotoJugador(202696) },
    { name: 'Matas Buzelis', team: 'Chicago Bulls', position: 'F', height: '6-10', weight: '209', jersey: '14', age: 22, photo: fotoJugador(1641824) },

    // Cleveland Cavaliers
    { name: 'Donovan Mitchell', team: 'Cleveland Cavaliers', position: 'G', height: '6-3', weight: '215', jersey: '45', age: 30, photo: fotoJugador(1628378) },
    { name: 'Darius Garland', team: 'Cleveland Cavaliers', position: 'G', height: '6-1', weight: '192', jersey: '10', age: 26, photo: fotoJugador(1629636) },
    { name: 'Evan Mobley', team: 'Cleveland Cavaliers', position: 'C', height: '6-11', weight: '215', jersey: '4', age: 25, photo: fotoJugador(1630596) },
    { name: 'Jarrett Allen', team: 'Cleveland Cavaliers', position: 'C', height: '6-9', weight: '243', jersey: '31', age: 28, photo: fotoJugador(1628386) },

    // Dallas Mavericks
    { name: 'Kyrie Irving', team: 'Dallas Mavericks', position: 'G', height: '6-2', weight: '195', jersey: '11', age: 34, photo: fotoJugador(202681) },
    { name: 'Anthony Davis', team: 'Dallas Mavericks', position: 'F-C', height: '6-10', weight: '253', jersey: '3', age: 33, photo: fotoJugador(203076) },
    { name: 'Klay Thompson', team: 'Dallas Mavericks', position: 'G', height: '6-6', weight: '220', jersey: '31', age: 36, photo: fotoJugador(202691) },
    { name: 'Dereck Lively II', team: 'Dallas Mavericks', position: 'C', height: '7-1', weight: '230', jersey: '2', age: 22, photo: fotoJugador(1641726) },
    { name: 'Cooper Flagg', team: 'Dallas Mavericks', position: 'F', height: '6-9', weight: '205', jersey: '32', age: 19, photo: fotoJugador(1642843) },

    // Denver Nuggets
    { name: 'Nikola Jokic', team: 'Denver Nuggets', position: 'C', height: '6-11', weight: '284', jersey: '15', age: 31, photo: fotoJugador(203999) },
    { name: 'Jamal Murray', team: 'Denver Nuggets', position: 'G', height: '6-4', weight: '215', jersey: '27', age: 29, photo: fotoJugador(1627750) },
    { name: 'Michael Porter Jr.', team: 'Denver Nuggets', position: 'F', height: '6-10', weight: '218', jersey: '1', age: 28, photo: fotoJugador(1629008) },
    { name: 'Aaron Gordon', team: 'Denver Nuggets', position: 'F', height: '6-8', weight: '235', jersey: '32', age: 31, photo: fotoJugador(203932) },
    { name: 'Christian Braun', team: 'Denver Nuggets', position: 'G', height: '6-6', weight: '220', jersey: '0', age: 25, photo: fotoJugador(1631128) },

    // Detroit Pistons
    { name: 'Cade Cunningham', team: 'Detroit Pistons', position: 'G', height: '6-6', weight: '220', jersey: '2', age: 25, photo: fotoJugador(1630595) },
    { name: 'Jaden Ivey', team: 'Detroit Pistons', position: 'G', height: '6-4', weight: '195', jersey: '23', age: 24, photo: fotoJugador(1631093) },
    { name: 'Jalen Duren', team: 'Detroit Pistons', position: 'C', height: '6-10', weight: '250', jersey: '0', age: 23, photo: fotoJugador(1631105) },
    { name: 'Ausar Thompson', team: 'Detroit Pistons', position: 'G-F', height: '6-7', weight: '205', jersey: '9', age: 23, photo: fotoJugador(1641709) },

    // Golden State Warriors
    { name: 'Stephen Curry', team: 'Golden State Warriors', position: 'G', height: '6-2', weight: '185', jersey: '30', age: 38, photo: fotoJugador(201939) },
    { name: 'Jimmy Butler', team: 'Golden State Warriors', position: 'F', height: '6-7', weight: '230', jersey: '10', age: 37, photo: fotoJugador(202710) },
    { name: 'Draymond Green', team: 'Golden State Warriors', position: 'F', height: '6-6', weight: '230', jersey: '23', age: 36, photo: fotoJugador(203110) },
    { name: 'Jonathan Kuminga', team: 'Golden State Warriors', position: 'F', height: '6-7', weight: '225', jersey: '00', age: 24, photo: fotoJugador(1630228) },
    { name: 'Brandin Podziemski', team: 'Golden State Warriors', position: 'G', height: '6-4', weight: '205', jersey: '2', age: 23, photo: fotoJugador(1641764) },

    // Houston Rockets
    { name: 'Alperen Sengun', team: 'Houston Rockets', position: 'C', height: '6-11', weight: '243', jersey: '28', age: 24, photo: fotoJugador(1630578) },
    { name: 'Jalen Green', team: 'Houston Rockets', position: 'G', height: '6-4', weight: '186', jersey: '4', age: 24, photo: fotoJugador(1630224) },
    { name: 'Amen Thompson', team: 'Houston Rockets', position: 'G-F', height: '6-7', weight: '200', jersey: '1', age: 23, photo: fotoJugador(1641708) },
    { name: 'Jabari Smith Jr.', team: 'Houston Rockets', position: 'F', height: '6-11', weight: '220', jersey: '10', age: 23, photo: fotoJugador(1631094) },
    { name: 'Tari Eason', team: 'Houston Rockets', position: 'F', height: '6-8', weight: '215', jersey: '17', age: 25, photo: fotoJugador(1631106) },

    // Indiana Pacers
    { name: 'Tyrese Haliburton', team: 'Indiana Pacers', position: 'G', height: '6-5', weight: '185', jersey: '0', age: 26, photo: fotoJugador(1630169) },
    { name: 'Pascal Siakam', team: 'Indiana Pacers', position: 'F', height: '6-8', weight: '245', jersey: '43', age: 32, photo: fotoJugador(1627783) },
    { name: 'Myles Turner', team: 'Indiana Pacers', position: 'C-F', height: '6-11', weight: '250', jersey: '33', age: 30, photo: fotoJugador(1626167) },
    { name: 'Bennedict Mathurin', team: 'Indiana Pacers', position: 'G-F', height: '6-5', weight: '210', jersey: '00', age: 24, photo: fotoJugador(1631097) },

    // Los Angeles Clippers
    { name: 'Kawhi Leonard', team: 'Los Angeles Clippers', position: 'F', height: '6-7', weight: '225', jersey: '2', age: 35, photo: fotoJugador(202695) },
    { name: 'James Harden', team: 'Los Angeles Clippers', position: 'G', height: '6-5', weight: '220', jersey: '1', age: 37, photo: fotoJugador(201935) },
    { name: 'Norman Powell', team: 'Los Angeles Clippers', position: 'G', height: '6-4', weight: '215', jersey: '24', age: 33, photo: fotoJugador(1626181) },
    { name: 'Ivica Zubac', team: 'Los Angeles Clippers', position: 'C', height: '7-0', weight: '240', jersey: '40', age: 29, photo: fotoJugador(1627826) },

    // Los Angeles Lakers
    { name: 'Luka Doncic', team: 'Los Angeles Lakers', position: 'G', height: '6-7', weight: '230', jersey: '77', age: 27, photo: fotoJugador(1629029) },
    { name: 'LeBron James', team: 'Los Angeles Lakers', position: 'F', height: '6-9', weight: '250', jersey: '23', age: 41, photo: fotoJugador(2544) },
    { name: 'Austin Reaves', team: 'Los Angeles Lakers', position: 'G', height: '6-5', weight: '197', jersey: '15', age: 28, photo: fotoJugador(1630559) },
    { name: 'Rui Hachimura', team: 'Los Angeles Lakers', position: 'F', height: '6-8', weight: '230', jersey: '28', age: 28, photo: fotoJugador(1629060) },
    { name: 'Dalton Knecht', team: 'Los Angeles Lakers', position: 'G-F', height: '6-6', weight: '215', jersey: '4', age: 25, photo: fotoJugador(1642261) },

    // Memphis Grizzlies
    { name: 'Ja Morant', team: 'Memphis Grizzlies', position: 'G', height: '6-2', weight: '174', jersey: '12', age: 27, photo: fotoJugador(1629630) },
    { name: 'Jaren Jackson Jr.', team: 'Memphis Grizzlies', position: 'F-C', height: '6-10', weight: '242', jersey: '13', age: 27, photo: fotoJugador(1628991) },
    { name: 'Desmond Bane', team: 'Memphis Grizzlies', position: 'G', height: '6-5', weight: '215', jersey: '22', age: 28, photo: fotoJugador(1630217) },
    { name: 'Zach Edey', team: 'Memphis Grizzlies', position: 'C', height: '7-4', weight: '305', jersey: '14', age: 24, photo: fotoJugador(1641744) },

    // Miami Heat
    { name: 'Bam Adebayo', team: 'Miami Heat', position: 'C-F', height: '6-9', weight: '255', jersey: '13', age: 29, photo: fotoJugador(1628389) },
    { name: 'Tyler Herro', team: 'Miami Heat', position: 'G', height: '6-5', weight: '195', jersey: '14', age: 26, photo: fotoJugador(1629639) },
    { name: 'Andrew Wiggins', team: 'Miami Heat', position: 'F', height: '6-7', weight: '197', jersey: '22', age: 31, photo: fotoJugador(203952) },
    { name: 'Jaime Jaquez Jr.', team: 'Miami Heat', position: 'G-F', height: '6-6', weight: '225', jersey: '11', age: 25, photo: fotoJugador(1631117) },

    // Milwaukee Bucks
    { name: 'Giannis Antetokounmpo', team: 'Milwaukee Bucks', position: 'F', height: '6-11', weight: '243', jersey: '34', age: 31, photo: fotoJugador(203507) },
    { name: 'Damian Lillard', team: 'Milwaukee Bucks', position: 'G', height: '6-2', weight: '195', jersey: '0', age: 36, photo: fotoJugador(203081) },
    { name: 'Kyle Kuzma', team: 'Milwaukee Bucks', position: 'F', height: '6-9', weight: '221', jersey: '18', age: 31, photo: fotoJugador(1628398) },
    { name: 'Bobby Portis', team: 'Milwaukee Bucks', position: 'F-C', height: '6-10', weight: '250', jersey: '9', age: 31, photo: fotoJugador(1626171) },

    // Minnesota Timberwolves
    { name: 'Anthony Edwards', team: 'Minnesota Timberwolves', position: 'G', height: '6-4', weight: '225', jersey: '5', age: 25, photo: fotoJugador(1630162) },
    { name: 'LaMelo Ball', team: 'Minnesota Timberwolves', position: 'G', height: '6-7', weight: '180', jersey: '1', age: 25, photo: fotoJugador(1630163) },
    { name: 'Rudy Gobert', team: 'Minnesota Timberwolves', position: 'C', height: '7-1', weight: '258', jersey: '27', age: 34, photo: fotoJugador(203497) },
    { name: 'Jaden McDaniels', team: 'Minnesota Timberwolves', position: 'F', height: '6-9', weight: '185', jersey: '3', age: 26, photo: fotoJugador(1630183) },
    { name: 'Naz Reid', team: 'Minnesota Timberwolves', position: 'C-F', height: '6-9', weight: '264', jersey: '11', age: 27, photo: fotoJugador(1629675) },

    // New Orleans Pelicans
    { name: 'Zion Williamson', team: 'New Orleans Pelicans', position: 'F', height: '6-6', weight: '284', jersey: '1', age: 26, photo: fotoJugador(1629627) },
    { name: 'Dejounte Murray', team: 'New Orleans Pelicans', position: 'G', height: '6-5', weight: '180', jersey: '5', age: 30, photo: fotoJugador(1627749) },
    { name: 'Trey Murphy III', team: 'New Orleans Pelicans', position: 'F', height: '6-8', weight: '206', jersey: '25', age: 26, photo: fotoJugador(1630530) },
    { name: 'Herb Jones', team: 'New Orleans Pelicans', position: 'F', height: '6-7', weight: '206', jersey: '2', age: 28, photo: fotoJugador(1630529) },

    // New York Knicks
    { name: 'Jalen Brunson', team: 'New York Knicks', position: 'G', height: '6-2', weight: '190', jersey: '11', age: 30, photo: fotoJugador(1628973) },
    { name: 'Karl-Anthony Towns', team: 'New York Knicks', position: 'C-F', height: '7-0', weight: '248', jersey: '32', age: 31, photo: fotoJugador(1626157) },
    { name: 'Mikal Bridges', team: 'New York Knicks', position: 'F', height: '6-6', weight: '209', jersey: '25', age: 30, photo: fotoJugador(1628969) },
    { name: 'OG Anunoby', team: 'New York Knicks', position: 'F', height: '6-7', weight: '240', jersey: '8', age: 29, photo: fotoJugador(1628384) },
    { name: 'Josh Hart', team: 'New York Knicks', position: 'G', height: '6-4', weight: '215', jersey: '3', age: 31, photo: fotoJugador(1628404) },

    // Oklahoma City Thunder
    { name: 'Shai Gilgeous-Alexander', team: 'Oklahoma City Thunder', position: 'G', height: '6-6', weight: '195', jersey: '2', age: 28, photo: fotoJugador(1628983) },
    { name: 'Jalen Williams', team: 'Oklahoma City Thunder', position: 'G-F', height: '6-5', weight: '211', jersey: '8', age: 25, photo: fotoJugador(1631114) },
    { name: 'Chet Holmgren', team: 'Oklahoma City Thunder', position: 'C-F', height: '7-1', weight: '208', jersey: '7', age: 24, photo: fotoJugador(1631096) },
    { name: 'Isaiah Hartenstein', team: 'Oklahoma City Thunder', position: 'C-F', height: '7-0', weight: '250', jersey: '55', age: 28, photo: fotoJugador(1628392) },

    // Orlando Magic
    { name: 'Paolo Banchero', team: 'Orlando Magic', position: 'F', height: '6-10', weight: '250', jersey: '5', age: 24, photo: fotoJugador(1631094) },
    { name: 'Franz Wagner', team: 'Orlando Magic', position: 'F', height: '6-10', weight: '220', jersey: '22', age: 25, photo: fotoJugador(1630532) },
    { name: 'Jalen Suggs', team: 'Orlando Magic', position: 'G', height: '6-5', weight: '205', jersey: '4', age: 25, photo: fotoJugador(1630591) },
    { name: 'Wendell Carter Jr.', team: 'Orlando Magic', position: 'C-F', height: '6-10', weight: '270', jersey: '34', age: 27, photo: fotoJugador(1628976) },

    // Philadelphia 76ers
    { name: 'Joel Embiid', team: 'Philadelphia 76ers', position: 'C-F', height: '7-0', weight: '280', jersey: '21', age: 32, photo: fotoJugador(203954) },
    { name: 'Tyrese Maxey', team: 'Philadelphia 76ers', position: 'G', height: '6-2', weight: '200', jersey: '0', age: 26, photo: fotoJugador(1630178) },
    { name: 'Paul George', team: 'Philadelphia 76ers', position: 'F', height: '6-8', weight: '220', jersey: '8', age: 36, photo: fotoJugador(202331) },
    { name: 'Jared McCain', team: 'Philadelphia 76ers', position: 'G', height: '6-3', weight: '195', jersey: '20', age: 22, photo: fotoJugador(1642272) },

    // Phoenix Suns
    { name: 'Kevin Durant', team: 'Phoenix Suns', position: 'F', height: '6-11', weight: '240', jersey: '35', age: 38, photo: fotoJugador(201142) },
    { name: 'Devin Booker', team: 'Phoenix Suns', position: 'G', height: '6-6', weight: '206', jersey: '1', age: 30, photo: fotoJugador(1626164) },
    { name: 'Bradley Beal', team: 'Phoenix Suns', position: 'G', height: '6-4', weight: '207', jersey: '3', age: 33, photo: fotoJugador(203078) },
    { name: 'Nick Richards', team: 'Phoenix Suns', position: 'C', height: '7-0', weight: '245', jersey: '2', age: 28, photo: fotoJugador(1630208) },

    // Portland Trail Blazers
    { name: 'Anfernee Simons', team: 'Portland Trail Blazers', position: 'G', height: '6-3', weight: '200', jersey: '1', age: 27, photo: fotoJugador(1629014) },
    { name: 'Scoot Henderson', team: 'Portland Trail Blazers', position: 'G', height: '6-3', weight: '206', jersey: '00', age: 22, photo: fotoJugador(1630703) },
    { name: 'Shaedon Sharpe', team: 'Portland Trail Blazers', position: 'G', height: '6-5', weight: '200', jersey: '17', age: 23, photo: fotoJugador(1631101) },
    { name: 'Deni Avdija', team: 'Portland Trail Blazers', position: 'F', height: '6-9', weight: '240', jersey: '8', age: 25, photo: fotoJugador(1630166) },

    // Sacramento Kings
    { name: 'Domantas Sabonis', team: 'Sacramento Kings', position: 'F-C', height: '6-10', weight: '240', jersey: '11', age: 30, photo: fotoJugador(1627734) },
    { name: 'DeMar DeRozan', team: 'Sacramento Kings', position: 'G-F', height: '6-6', weight: '220', jersey: '10', age: 37, photo: fotoJugador(201942) },
    { name: 'Zach LaVine', team: 'Sacramento Kings', position: 'G', height: '6-5', weight: '200', jersey: '8', age: 31, photo: fotoJugador(203897) },
    { name: 'Keegan Murray', team: 'Sacramento Kings', position: 'F', height: '6-8', weight: '225', jersey: '13', age: 26, photo: fotoJugador(1631099) },

    // San Antonio Spurs
    { name: 'Victor Wembanyama', team: 'San Antonio Spurs', position: 'C', height: '7-4', weight: '210', jersey: '1', age: 22, photo: fotoJugador(1641705) },
    { name: 'De\'Aaron Fox', team: 'San Antonio Spurs', position: 'G', height: '6-3', weight: '185', jersey: '4', age: 28, photo: fotoJugador(1628368) },
    { name: 'Stephon Castle', team: 'San Antonio Spurs', position: 'G', height: '6-6', weight: '215', jersey: '5', age: 22, photo: fotoJugador(1642264) },
    { name: 'Devin Vassell', team: 'San Antonio Spurs', position: 'G-F', height: '6-5', weight: '200', jersey: '24', age: 26, photo: fotoJugador(1630170) },

    // Toronto Raptors
    { name: 'Scottie Barnes', team: 'Toronto Raptors', position: 'F-G', height: '6-7', weight: '237', jersey: '4', age: 25, photo: fotoJugador(1630567) },
    { name: 'Brandon Ingram', team: 'Toronto Raptors', position: 'F', height: '6-8', weight: '190', jersey: '3', age: 29, photo: fotoJugador(1627742) },
    { name: 'RJ Barrett', team: 'Toronto Raptors', position: 'F-G', height: '6-6', weight: '214', jersey: '9', age: 26, photo: fotoJugador(1629628) },
    { name: 'Immanuel Quickley', team: 'Toronto Raptors', position: 'G', height: '6-2', weight: '190', jersey: '5', age: 27, photo: fotoJugador(1630193) },

    // Utah Jazz
    { name: 'Lauri Markkanen', team: 'Utah Jazz', position: 'F-C', height: '7-0', weight: '240', jersey: '23', age: 29, photo: fotoJugador(1628374) },
    { name: 'Collin Sexton', team: 'Utah Jazz', position: 'G', height: '6-3', weight: '190', jersey: '2', age: 27, photo: fotoJugador(1629012) },
    { name: 'Walker Kessler', team: 'Utah Jazz', position: 'C', height: '7-0', weight: '245', jersey: '24', age: 25, photo: fotoJugador(1631117) },
    { name: 'Keyonte George', team: 'Utah Jazz', position: 'G', height: '6-4', weight: '185', jersey: '3', age: 23, photo: fotoJugador(1641718) },

    // Washington Wizards
    { name: 'Jordan Poole', team: 'Washington Wizards', position: 'G', height: '6-4', weight: '194', jersey: '13', age: 27, photo: fotoJugador(1629673) },
    { name: 'Alex Sarr', team: 'Washington Wizards', position: 'C', height: '7-0', weight: '205', jersey: '20', age: 21, photo: fotoJugador(1642259) },
    { name: 'Bilal Coulibaly', team: 'Washington Wizards', position: 'G-F', height: '6-8', weight: '195', jersey: '0', age: 22, photo: fotoJugador(1641731) },
    { name: 'Khris Middleton', team: 'Washington Wizards', position: 'F', height: '6-7', weight: '222', jersey: '32', age: 35, photo: fotoJugador(203114) }
];

function obtenerPartidosFavoritos(usuario) {
    return JSON.parse(localStorage.getItem(`nba_favs_${usuario}`)) || [];
}

function guardarPartidosFavoritos(usuario, lista) {
    localStorage.setItem(`nba_favs_${usuario}`, JSON.stringify(lista));
    actualizarContadorFavoritos(usuario);
}

function actualizarContadorFavoritos(usuario) {
    const badge = document.getElementById('badgeFavs');
    if (badge) {
        badge.textContent = obtenerPartidosFavoritos(usuario).length;
    }
}

function registrarConsultaApi() {
    const actuales = parseInt(localStorage.getItem('nba_consultas_api')) || 0;
    localStorage.setItem('nba_consultas_api', actuales + 1);
}

function extraerTexto(campo, respaldo) {
    if (!campo) return respaldo;
    if (typeof campo === 'string') return campo;
    if (typeof campo === 'object') {
        return campo.name || campo.full_name || campo.team_name || campo.title || respaldo;
    }
    return String(campo);
}

function extraerMarcador(campo) {
    if (campo === null || campo === undefined) return 0;
    if (typeof campo === 'number') return campo;
    if (typeof campo === 'string') return Number(campo) || 0;
    if (typeof campo === 'object') {
        return campo.score ?? campo.points ?? campo.total ?? 0;
    }
    return 0;
}

function normalizarPartidoApi(item, index) {
    const estadoRaw = extraerTexto(item.status, '').toUpperCase();
    let estado = 'SCHEDULED';
    if (estadoRaw.includes('LIVE') || estadoRaw.includes('IN PROGRESS') || estadoRaw.includes('Q') || estadoRaw.includes('ACTIVE')) {
        estado = 'LIVE';
    } else if (estadoRaw.includes('FINAL') || estadoRaw.includes('FINISHED') || estadoRaw.includes('END')) {
        estado = 'FINAL';
    }

    const homeScore = extraerMarcador(item.home_score ?? item.score_home ?? item.home_team_score);
    const awayScore = extraerMarcador(item.away_score ?? item.score_away ?? item.away_team_score);

    if (estado === 'SCHEDULED' && (homeScore > 0 || awayScore > 0)) {
        estado = 'LIVE';
    }

    return {
        id: item.id || `api-nba-${index}`,
        home_team: extraerTexto(item.home_team ?? item.team_home ?? item.home, 'Equipo Local'),
        away_team: extraerTexto(item.away_team ?? item.team_away ?? item.away, 'Equipo Visitante'),
        home_score: homeScore,
        away_score: awayScore,
        status: estado,
        quarter: extraerTexto(item.status ?? item.quarter, estado === 'SCHEDULED' ? 'Programado' : estado),
        date: extraerTexto(item.date, new Date().toISOString().split('T')[0]),
        time: extraerTexto(item.time, '20:00 HRS'),
        arena: extraerTexto(item.arena ?? item.venue ?? item.location, 'Arena Oficial NBA'),
        season: extraerTexto(item.season ?? item.league, 'NBA')
    };
}

async function cargarPartidosNBA() {
    const loader = document.getElementById('loader');
    const contenedor = document.getElementById('contenedorPartidos');
    const estadoBadge = document.getElementById('estadoApiBadge');

    loader.classList.remove('d-none');
    contenedor.innerHTML = '';
    registrarConsultaApi();

    const fechaSeleccionada = document.getElementById('inputFecha').value;
    const equipoBuscado = document.getElementById('inputEquipo').value.trim();

    const params = new URLSearchParams();
    params.append('league', 'nba');

    if (fechaSeleccionada) {
        params.append('date', fechaSeleccionada);
    } else if (!equipoBuscado) {
        const hoy = new Date().toISOString().split('T')[0];
        params.append('date', hoy);
    }
    if (equipoBuscado) {
        params.append('team', equipoBuscado);
    }

    try {
        if (!API_KEY || API_KEY === 'TU_API_KEY_AQUI') {
            throw new Error('Falta poner tu API_KEY real en js/nba.js');
        }

        const respuesta = await fetch(`${API_URL}?${params.toString()}`, {
            method: 'GET',
            headers: {
                'X-Api-Key': API_KEY
            }
        });

        if (!respuesta.ok) {
            const errorTexto = await respuesta.text();
            throw new Error(`HTTP ${respuesta.status}: ${errorTexto}`);
        }

        const datos = await respuesta.json();
        console.log('Respuesta real API-Ninjas:', datos);

        if (Array.isArray(datos)) {
            partidosCargados = datos.map((p, i) => normalizarPartidoApi(p, i));
            estadoBadge.className = 'badge bg-success py-2 px-3';
            estadoBadge.textContent = '● Conectado a API-Ninjas NBA';
        } else {
            partidosCargados = [...PARTIDOS_RESPALDO];
            estadoBadge.className = 'badge bg-primary py-2 px-3';
            estadoBadge.textContent = 'Cartelera NBA Actualizada';
        }
    } catch (error) {
        console.error('Error real al consultar API-Ninjas:', error);
        partidosCargados = [...PARTIDOS_RESPALDO];
        estadoBadge.className = 'badge bg-danger py-2 px-3';
        estadoBadge.textContent = `Error API: ${error.message}`;
    } finally {
        loader.classList.add('d-none');
        aplicarFiltrosYRenderizar();
    }
}

function aplicarFiltrosYRenderizar() {
    let sesion = { user: 'fan_demo' };
    try {
        if (typeof verificarSesion === 'function') {
            const s = verificarSesion();
            if (s) sesion = s;
        }
    } catch (e) {}

    const contenedor = document.getElementById('contenedorPartidos');
    const textoEquipo = document.getElementById('inputEquipo').value.trim().toLowerCase();
    const estadoFiltro = document.getElementById('selectEstado').value;
    const favs = obtenerPartidosFavoritos(sesion.user);

    let listaBase = viendoFavoritos ? favs : partidosCargados;

    const filtrados = listaBase.filter(p => {
        const coincideEquipo = textoEquipo === '' ||
            p.home_team.toLowerCase().includes(textoEquipo) ||
            p.away_team.toLowerCase().includes(textoEquipo);

        const coincideEstado = estadoFiltro === 'TODOS' || p.status === estadoFiltro;
        return coincideEquipo && coincideEstado;
    });

    contenedor.innerHTML = '';

    if (filtrados.length === 0) {
        contenedor.innerHTML = `
            <div class="col-12">
                <div class="alert alert-light border text-center rounded-4 p-5 shadow-sm">
                    <h5 class="fw-bold mb-1">No se encontraron partidos para esta búsqueda</h5>
                    <p class="text-muted small mb-0">Prueba eligiendo otra fecha en el calendario o buscando otro equipo de la NBA.</p>
                </div>
            </div>`;
        return;
    }

    filtrados.forEach(partido => {
        const esFavorito = favs.some(f => f.id === partido.id);
        const logoLocal = obtenerLogoEquipo(partido.home_team);
        const logoVisita = obtenerLogoEquipo(partido.away_team);

        let badgeEstado = `<span class="badge bg-secondary">🕒 ${partido.time}</span>`;
        if (partido.status === 'LIVE') {
            badgeEstado = `<span class="badge badge-live">🔴 EN VIVO • ${partido.quarter}</span>`;
        } else if (partido.status === 'FINAL') {
            badgeEstado = `<span class="badge bg-dark">FINALIZADO</span>`;
        }

        const claseFav = esFavorito
            ? 'btn btn-warning btn-sm w-100 fw-bold mt-2 btn-fav'
            : 'btn btn-outline-warning text-dark btn-sm w-100 mt-2 btn-fav';

        const textoFav = esFavorito ? '★ Quitar de Mis Partidos' : '☆ Seguir Partido';

        const col = document.createElement('div');
        col.className = 'col-md-6 col-lg-4';
        col.innerHTML = `
            <div class="card card-nba h-100 shadow-sm overflow-hidden">
                <div class="card-header bg-white border-bottom d-flex justify-content-between align-items-center py-3">
                    ${badgeEstado}
                    <small class="text-muted fw-bold">${partido.date}</small>
                </div>
                <div class="card-body d-flex flex-column justify-content-between">
                    <div class="my-2">
                        <!-- Equipo Local -->
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <div class="d-flex align-items-center gap-2">
                                <img src="${logoLocal}" alt="${partido.home_team}" width="38" height="38" class="team-logo" style="object-fit: contain;">
                                <div>
                                    <span class="fw-bold d-block">${partido.home_team}</span>
                                    <small class="text-muted">Local</small>
                                </div>
                            </div>
                            <span class="fs-3 fw-bold score-num ${partido.status === 'SCHEDULED' ? 'text-muted' : 'text-dark'}">
                                ${partido.status === 'SCHEDULED' ? '-' : partido.home_score}
                            </span>
                        </div>

                        <!-- Equipo Visitante -->
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="d-flex align-items-center gap-2">
                                <img src="${logoVisita}" alt="${partido.away_team}" width="38" height="38" class="team-logo" style="object-fit: contain;">
                                <div>
                                    <span class="fw-bold d-block">${partido.away_team}</span>
                                    <small class="text-muted">Visitante</small>
                                </div>
                            </div>
                            <span class="fs-3 fw-bold score-num ${partido.status === 'SCHEDULED' ? 'text-muted' : 'text-dark'}">
                                ${partido.status === 'SCHEDULED' ? '-' : partido.away_score}
                            </span>
                        </div>
                    </div>

                    <div class="pt-3 border-top mt-3">
                        <small class="text-muted d-block mb-2 text-truncate">📍 ${partido.arena}</small>
                        <button type="button" class="btn btn-dark btn-sm w-100 rounded-3 btn-detalle">
                            Ver Horario y Detalles
                        </button>
                        <button type="button" class="${claseFav}">
                            ${textoFav}
                        </button>
                    </div>
                </div>
            </div>
        `;

        col.querySelector('.btn-detalle').addEventListener('click', () => abrirModalPartido(partido));
        col.querySelector('.btn-fav').addEventListener('click', () => alternarFavoritoPartido(partido));

        contenedor.appendChild(col);
    });
}

function alternarFavoritoPartido(partido) {
    let sesion = { user: 'fan_demo' };
    try {
        if (typeof verificarSesion === 'function') {
            const s = verificarSesion();
            if (s) sesion = s;
        }
    } catch (e) {}

    let favs = obtenerPartidosFavoritos(sesion.user);
    const existe = favs.some(f => f.id === partido.id);

    if (existe) {
        favs = favs.filter(f => f.id !== partido.id);
    } else {
        favs.push(partido);
    }

    guardarPartidosFavoritos(sesion.user, favs);
    aplicarFiltrosYRenderizar();
}

function abrirModalPartido(partido) {
    document.getElementById('modalLogoLocal').src = obtenerLogoEquipo(partido.home_team);
    document.getElementById('modalLogoVisita').src = obtenerLogoEquipo(partido.away_team);
    document.getElementById('modalTituloPartido').textContent = `${partido.home_team} vs ${partido.away_team}`;
    document.getElementById('modalSubtituloPartido').textContent = `${partido.date} • ${partido.time}`;
    document.getElementById('modalEquipoLocal').textContent = partido.home_team;
    document.getElementById('modalEquipoVisita').textContent = partido.away_team;
    document.getElementById('modalPuntosLocal').textContent = partido.status === 'SCHEDULED' ? '-' : partido.home_score;
    document.getElementById('modalPuntosVisita').textContent = partido.status === 'SCHEDULED' ? '-' : partido.away_score;
    document.getElementById('modalHorario').textContent = partido.quarter;
    document.getElementById('modalTemporada').textContent = `NBA (${partido.season})`;
    document.getElementById('modalFechaCompleta').textContent = `${partido.date} a las ${partido.time}`;
    document.getElementById('modalArena').textContent = partido.arena;
    document.getElementById('modalIdPartido').textContent = partido.id;

    const badgeContenedor = document.getElementById('modalEstadoBadge');
    if (partido.status === 'LIVE') {
        badgeContenedor.innerHTML = '<span class="badge badge-live fs-6">🔴 EN VIVO</span>';
    } else if (partido.status === 'FINAL') {
        badgeContenedor.innerHTML = '<span class="badge bg-secondary fs-6">FINALIZADO</span>';
    } else {
        badgeContenedor.innerHTML = '<span class="badge bg-primary fs-6">PRÓXIMO PARTIDO</span>';
    }

    const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('modalPartido'));
    modal.show();
}

// =========================================================================
// JUGADORES NBA (Plantillas 2026-2027 de los 30 equipos con foto)
// =========================================================================
async function cargarJugadoresNBA() {
    const loader = document.getElementById('loaderJugadores');
    const contenedor = document.getElementById('contenedorJugadores');
    const nombreInput = document.getElementById('inputNombreJugador').value.trim();
    const equipoInput = document.getElementById('inputEquipoJugador').value.trim();

    loader.classList.remove('d-none');
    contenedor.innerHTML = '';

    const jugadores = JUGADORES_RESPALDO.filter(j => {
        const matchNombre = !nombreInput || j.name.toLowerCase().includes(nombreInput.toLowerCase());
        const matchEquipo = !equipoInput || j.team.toLowerCase().includes(equipoInput.toLowerCase());
        return matchNombre && matchEquipo;
    });

    loader.classList.add('d-none');
    dibujarJugadores(jugadores);
}

function dibujarJugadores(jugadores) {
    const contenedor = document.getElementById('contenedorJugadores');
    contenedor.innerHTML = '';

    if (!jugadores || jugadores.length === 0) {
        contenedor.innerHTML = `
            <div class="col-12">
                <div class="alert alert-light border text-center rounded-4 p-5 shadow-sm">
                    <h5 class="fw-bold mb-1">No se encontraron jugadores</h5>
                    <p class="text-muted small mb-0">Prueba buscando por apellido o cualquiera de los 30 equipos (ej. Timberwolves, Lakers, Spurs, Celtics).</p>
                </div>
            </div>`;
        return;
    }

    jugadores.forEach(j => {
        const nombre = extraerTexto(j.name, 'Jugador NBA');
        const equipo = extraerTexto(j.team, 'Equipo NBA');
        const posicion = extraerTexto(j.position, 'N/D');
        const dorsal = j.jersey ? `#${extraerTexto(j.jersey, '-')}` : 'N/D';
        const estatura = j.height ? extraerTexto(j.height, '-') : 'N/D';
        const peso = j.weight ? `${extraerTexto(j.weight, '-')} lbs` : 'N/D';
        const edad = j.age ? `${extraerTexto(j.age, '-')} años` : 'N/D';
        const logoEquipo = obtenerLogoEquipo(equipo);
        const fotoUrl = j.photo || logoEquipo;

        const col = document.createElement('div');
        col.className = 'col-sm-6 col-lg-4';
        col.innerHTML = `
            <div class="card card-nba h-100 shadow-sm p-3">
                <div class="d-flex align-items-center justify-content-between border-bottom pb-3 mb-3">
                    <div class="d-flex align-items-center gap-3">
                        <img src="${fotoUrl}" alt="${nombre}" width="64" height="48"
                             class="rounded-3 bg-light border team-logo"
                             style="object-fit: cover; object-position: top;"
                             onerror="this.onerror=null;this.style.objectFit='contain';this.src='${logoEquipo}';">
                        <div>
                            <h6 class="fw-bold mb-0">${nombre}</h6>
                            <div class="d-flex align-items-center gap-1 mt-1">
                                <img src="${logoEquipo}" alt="${equipo}" width="16" height="16" style="object-fit: contain;">
                                <small class="text-muted">${equipo}</small>
                            </div>
                        </div>
                    </div>
                    <span class="badge bg-dark fs-6">${dorsal}</span>
                </div>

                <div class="row text-center small g-2">
                    <div class="col-3">
                        <div class="bg-light rounded-3 p-2">
                            <span class="text-muted d-block">Posición</span>
                            <strong>${posicion}</strong>
                        </div>
                    </div>
                    <div class="col-3">
                        <div class="bg-light rounded-3 p-2">
                            <span class="text-muted d-block">Altura</span>
                            <strong>${estatura}</strong>
                        </div>
                    </div>
                    <div class="col-3">
                        <div class="bg-light rounded-3 p-2">
                            <span class="text-muted d-block">Peso</span>
                            <strong>${peso}</strong>
                        </div>
                    </div>
                    <div class="col-3">
                        <div class="bg-light rounded-3 p-2">
                            <span class="text-muted d-block">Edad</span>
                            <strong>${edad}</strong>
                        </div>
                    </div>
                </div>
            </div>
        `;
        contenedor.appendChild(col);
    });
}

function cambiarVistaPrincipal(vista) {
    const secPartidos = document.getElementById('seccionPartidos');
    const secJugadores = document.getElementById('seccionJugadores');
    const btnTodos = document.getElementById('navTodos');
    const btnFavs = document.getElementById('navFavoritos');
    const btnJug = document.getElementById('navJugadores');
    const titulo = document.getElementById('tituloSeccion');

    btnTodos.classList.remove('active', 'fw-bold');
    btnFavs.classList.remove('active', 'fw-bold');
    btnJug.classList.remove('active', 'fw-bold');

    if (vista === 'JUGADORES') {
        secPartidos.classList.add('d-none');
        secJugadores.classList.remove('d-none');
        btnJug.classList.add('active', 'fw-bold');
        titulo.textContent = 'Jugadores y Plantillas NBA 2026-2027';
        cargarJugadoresNBA();
    } else {
        secJugadores.classList.add('d-none');
        secPartidos.classList.remove('d-none');
        viendoFavoritos = (vista === 'FAVORITOS');

        if (viendoFavoritos) {
            btnFavs.classList.add('active', 'fw-bold');
            titulo.textContent = 'Mis Partidos Guardados';
        } else {
            btnTodos.classList.add('active', 'fw-bold');
            titulo.textContent = 'Partidos y Marcadores en Vivo';
        }
        aplicarFiltrosYRenderizar();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    let sesion = { user: 'fan_demo', nombre: 'Fan' };
    try {
        if (typeof verificarSesion === 'function') {
            const s = verificarSesion();
            if (s) sesion = s;
        }
    } catch (e) {}

    const saludoEl = document.getElementById('saludoUsuario');
    if (saludoEl) {
        saludoEl.textContent = `Hola, ${sesion.nombre || sesion.user}`;
    }

    actualizarContadorFavoritos(sesion.user);
    cargarPartidosNBA();

    document.getElementById('formBusqueda').addEventListener('submit', (e) => {
        e.preventDefault();
        cargarPartidosNBA();
    });

    document.getElementById('selectEstado').addEventListener('change', aplicarFiltrosYRenderizar);
    document.getElementById('inputEquipo').addEventListener('input', aplicarFiltrosYRenderizar);

    document.getElementById('formJugadores').addEventListener('submit', (e) => {
        e.preventDefault();
        cargarJugadoresNBA();
    });
    document.getElementById('inputNombreJugador').addEventListener('input', cargarJugadoresNBA);
    document.getElementById('inputEquipoJugador').addEventListener('input', cargarJugadoresNBA);

    document.getElementById('btnActualizarMarcadores').addEventListener('click', () => {
        cargarPartidosNBA();
    });

    document.getElementById('navTodos').addEventListener('click', () => cambiarVistaPrincipal('TODOS'));
    document.getElementById('navFavoritos').addEventListener('click', () => cambiarVistaPrincipal('FAVORITOS'));
    document.getElementById('navJugadores').addEventListener('click', () => cambiarVistaPrincipal('JUGADORES'));
});