// Sets de música que el host puede elegir.
//  - artists: se busca cada artista en iTunes
//  - country: tienda de iTunes ('US' o 'MX'); cambia qué catálogo regresa
//  - from / to: solo se aceptan canciones con año de lanzamiento dentro de este rango
//    (también descarta reediciones, cuya fecha suele no ser la original)

export const SETS = {
    mezcla: {
        label: 'Mezcla de todo',
        desc: 'Varias décadas, mayormente en inglés',
        country: 'US',
        artists: [
            'Elvis Presley', 'The Beatles', 'The Rolling Stones', 'Bob Dylan', 'Queen',
            'Led Zeppelin', 'Pink Floyd', 'ABBA', 'Bee Gees', 'Fleetwood Mac',
            'Michael Jackson', 'Madonna', 'Prince', 'Whitney Houston', 'Bon Jovi',
            'Guns N\' Roses', 'Nirvana', 'Oasis', 'Backstreet Boys', 'Spice Girls',
            'Britney Spears', 'Eminem', 'Shakira', 'Coldplay', 'Beyoncé',
            'Rihanna', 'Maroon 5', 'Bruno Mars', 'Adele', 'Ed Sheeran',
            'Taylor Swift', 'Dua Lipa', 'The Weeknd', 'Bad Bunny', 'Maná',
            'Soda Stereo', 'Luis Miguel', 'Juan Gabriel', 'Selena', 'Café Tacvba',
        ],
    },

    indie_kids: {
        label: 'Indie Kids',
        desc: 'Indie rock, alternative y clásicos de la escena independiente',
        country: 'US',
        artists: [
            'The Smiths', 'The Cure', 'Pixies', 'Sonic Youth', 'Pavement',
            'Belle and Sebastian', 'Modest Mouse', 'The Strokes', 'Interpol',
            'Yeah Yeah Yeahs', 'The White Stripes', 'Arctic Monkeys', 'Franz Ferdinand',
            'The Libertines', 'Bloc Party', 'LCD Soundsystem', 'MGMT', 'Phoenix',
            'Vampire Weekend', 'Tame Impala', 'The xx', 'Beach House', 'Grizzly Bear',
            'Fleet Foxes', 'Bon Iver', 'Mac DeMarco', 'The National', 'Foals',
            'The 1975', 'Glass Animals', 'Wet Leg',
        ],
    },

    hipster_anthems: {
        label: 'Hipster Anthems',
        desc: 'Cult classics, blog-era favorites y canciones alternativas',
        country: 'US',
        artists: [
            'Talking Heads', 'Devo', 'Roxy Music', 'Brian Eno', 'The Velvet Underground',
            'Nick Drake', 'David Byrne', 'The B-52s', 'The Jesus and Mary Chain',
            'My Bloody Valentine', 'The Stone Roses', 'Primal Scream', 'Pulp',
            'Blur', 'Beck', 'The Flaming Lips', 'Of Montreal', 'Animal Collective',
            'TV on the Radio', 'Broken Social Scene', 'M83', 'Caribou',
            'Hot Chip', 'Grimes', 'Blood Orange', 'Unknown Mortal Orchestra',
            'Father John Misty', 'Perfume Genius', 'Japanese Breakfast', 'Big Thief',
        ],
    },

    dancefloor: {
        label: 'Dancefloor',
        desc: 'Disco, house, electronic y pop para bailar',
        country: 'US',
        artists: [
            'Donna Summer', 'Chic', 'Kool & The Gang', 'Earth, Wind & Fire',
            'Bee Gees', 'Gloria Gaynor', 'ABBA', 'Madonna', 'Depeche Mode',
            'New Order', 'Pet Shop Boys', 'Technotronic', 'The Prodigy',
            'The Chemical Brothers', 'Fatboy Slim', 'Daft Punk', 'Justice',
            'The Knife', 'Robyn', 'Calvin Harris', 'Disclosure', 'Kavinsky',
            'Deadmau5', 'Skrillex', 'Röyksopp', 'Jamie xx', 'Fred again..',
            'Peggy Gou', 'Purple Disco Machine', 'Charli XCX',
        ],
    },

    sad_hours: {
        label: 'Sad Hours',
        desc: 'Melancolía, heartbreak y canciones para mirar por la ventana',
        country: 'US',
        artists: [
            'Nick Drake', 'Joni Mitchell', 'Elliott Smith', 'Jeff Buckley',
            'Mazzy Star', 'Radiohead', 'Fiona Apple', 'Portishead', 'Damien Rice',
            'Bright Eyes', 'Sufjan Stevens', 'Iron & Wine', 'Bon Iver',
            'The National', 'Daughter', 'Lana Del Rey', 'Frank Ocean',
            'James Blake', 'Lorde', 'The xx', 'Phoebe Bridgers', 'Mitski',
            'SZA', 'Cigarettes After Sex', 'Joji', 'Mac Miller', 'Billie Eilish',
            'Adrianne Lenker', 'Sampha', 'Clairo',
        ],
    },

    latin_alternative: {
        label: 'Latin Alternative',
        desc: 'Rock en español, indie latino y clásicos alternativos',
        country: 'MX',
        artists: [
            'Soda Stereo', 'Gustavo Cerati', 'Caifanes', 'Café Tacvba',
            'Maldita Vecindad', 'Los Fabulosos Cadillacs', 'Aterciopelados',
            'Los Tres', 'Babasónicos', 'Andrés Calamaro', 'Fito Páez',
            'Enanitos Verdes', 'Zoé', 'Porter', 'Hello Seahorse!',
            'Julieta Venegas', 'Natalia Lafourcade', 'Carla Morrison',
            'Mon Laferte', 'Javiera Mena', 'Dënver', 'Bomba Estéreo',
            'Systema Solar', 'Vetusta Morla', 'Love of Lesbian',
            'León Larregui', 'Little Jesus', 'Technicolor Fabrics',
            'Silvana Estrada', 'Ed Maverick',
        ],
    },

    pop_culture: {
        label: 'Pop Culture',
        desc: 'Grandes himnos pop que todo el mundo conoce',
        country: 'US',
        artists: [
            'Madonna', 'Michael Jackson', 'Janet Jackson', 'Whitney Houston',
            'Cyndi Lauper', 'George Michael', 'Cher', 'Mariah Carey',
            'Spice Girls', 'Britney Spears', 'Christina Aguilera', 'Jennifer Lopez',
            'Justin Timberlake', 'Kylie Minogue', 'Rihanna', 'Lady Gaga',
            'Katy Perry', 'Kesha', 'Beyoncé', 'Ariana Grande', 'Taylor Swift',
            'Miley Cyrus', 'Demi Lovato', 'Selena Gomez', 'Dua Lipa',
            'The Weeknd', 'Harry Styles', 'Olivia Rodrigo', 'Sabrina Carpenter',
            'Chappell Roan', 'Charli XCX',
        ],
    },

    emo_never_dies: {
        label: 'Emo Never Dies',
        desc: 'Emo, pop-punk, scene y rock adolescente',
        country: 'US',
        artists: [
            'Sunny Day Real Estate', 'Jimmy Eat World', 'Dashboard Confessional',
            'Taking Back Sunday', 'Brand New', 'The Used', 'My Chemical Romance',
            'Fall Out Boy', 'Panic! At The Disco', 'Paramore', 'AFI',
            'Hawthorne Heights', 'Thursday', 'Saosin', 'Silverstein',
            'Death Cab for Cutie', 'Blink-182', 'Green Day', 'Sum 41',
            'Good Charlotte', 'Simple Plan', 'New Found Glory', 'Yellowcard',
            'All Time Low', 'Pierce The Veil', 'Sleeping With Sirens',
            'A Day To Remember', 'Twenty One Pilots', 'Machine Gun Kelly',
            'Waterparks', 'The Story So Far',
        ],
    },

    rap_and_rnb: {
        label: 'Rap & R&B',
        desc: 'Hip-hop, R&B y sonidos que definieron distintas generaciones',
        country: 'US',
        artists: [
            'Run-D.M.C.', 'Public Enemy', 'N.W.A.', 'A Tribe Called Quest',
            'Wu-Tang Clan', 'Nas', 'The Notorious B.I.G.', '2Pac',
            'Missy Elliott', 'Lauryn Hill', 'Outkast', 'Jay-Z',
            'Eminem', '50 Cent', 'Kanye West', 'Lil Wayne', 'Drake',
            'Kendrick Lamar', 'J. Cole', 'Tyler, The Creator', 'A$AP Rocky',
            'Travis Scott', 'Childish Gambino', 'Frank Ocean', 'Usher',
            'Aaliyah', 'Erykah Badu', 'D\'Angelo', 'The Weeknd',
            'SZA', 'Anderson .Paak',
        ],
    },

    rock_mexicano: {
        label: 'Rock Nacional',
        desc: 'Rock mexicano desde los clásicos hasta la nueva ola',
        country: 'MX',
        artists: [
            'El Tri', 'Caifanes', 'Café Tacvba', 'Maldita Vecindad',
            'Fobia', 'La Lupita', 'Molotov', 'Jaguares',
            'Zurdok', 'Cuca', 'Panteón Rococó', 'Zoé',
            'Porter', 'DLD', 'Enjambre', 'Hello Seahorse!',
            'Austin TV', 'Reyno', 'Camilo Séptimo', 'Little Jesus',
            'Technicolor Fabrics', 'Odisseo', 'Siddhartha',
            'Los Daniels', 'Los Bunkers',
        ],
    },

    reggaeton_y_perreo: {
        label: 'Perreo',
        desc: 'Reggaetón, urbano latino y hits de antro',
        country: 'MX',
        artists: [
            'Daddy Yankee', 'Don Omar', 'Wisin & Yandel',
            'Tego Calderón', 'Ivy Queen', 'Plan B',
            'J Balvin', 'Bad Bunny', 'Ozuna', 'Maluma',
            'Karol G', 'Rauw Alejandro', 'Feid',
            'Jhayco', 'Myke Towers', 'Anuel AA',
            'Arcángel', 'Calle 13', 'Nicky Jam',
            'De La Ghetto', 'Cazzu', 'Peso Pluma',
            'Bellakath', 'El Bogueto', 'Yeri Mua',
            'Dani Flow',
        ],
    },

    regional_mexicano: {
        label: 'Regional Mexicano',
        desc: 'Banda, norteño, corridos y música para la peda',
        country: 'MX',
        artists: [
            'Vicente Fernández', 'Antonio Aguilar', 'Joan Sebastian',
            'Los Tigres del Norte', 'Los Tucanes de Tijuana',
            'Intocable', 'Banda El Recodo', 'Banda MS',
            'Julión Álvarez', 'Calibre 50', 'Gerardo Ortiz',
            'Christian Nodal', 'Carín León', 'Grupo Firme',
            'Natanael Cano', 'Junior H', 'Peso Pluma',
            'Fuerza Regida', 'Eslabon Armado', 'Marca MP',
            'Grupo Frontera', 'Edén Muñoz', 'Ariel Camacho',
            'Los Ángeles Azules', 'Los Ángeles de Charly',
        ],
    },

    pop_mexicano: {
        label: 'Pop Mexicano',
        desc: 'Pop en español que sonó en todas las fiestas',
        country: 'MX',
        artists: [
            'Luis Miguel', 'Paulina Rubio', 'Thalía',
            'OV7', 'Kabah', 'Belinda', 'RBD',
            'Anahí', 'Gloria Trevi', 'Alejandra Guzmán',
            'Yuri', 'Timbiriche', 'Mijares',
            'Emmanuel', 'Cristian Castro', 'Reik',
            'Camila', 'Sin Bandera', 'Jesse & Joy',
            'Ha*Ash', 'Paty Cantú', 'Danna Paola',
            'Natalia Lafourcade', 'Ximena Sariñana',
            'Carla Morrison', 'Matisse',
        ],
    },

    mexico_indie: {
        label: 'Indie Mexa',
        desc: 'La escena indie mexicana, alternativa y melancólica',
        country: 'MX',
        artists: [
            'Porter', 'Zoé', 'Hello Seahorse!',
            'Little Jesus', 'Siddhartha', 'Enjambre',
            'Technicolor Fabrics', 'Dënver', 'Reyno',
            'Camilo Séptimo', 'Odisseo', 'Clubz',
            'Disco Bahía', 'Girl Ultra', 'Ed Maverick',
            'Daniel Quién', 'Bratty', 'Silvana Estrada',
            'Kevin Kaarl', 'NSQK', 'Depresión Sonora',
            'Mint Field', 'Margaritas Podridas',
            'Los Blenders', 'Ramona', 'Y La Bamba',
        ],
    },

    fiesta_mexicana: {
        label: 'Fiesta Mexicana',
        desc: 'Las canciones que te sabes aunque no quieras',
        country: 'MX',
        artists: [
            'Juan Gabriel', 'José José', 'Rocío Dúrcal',
            'Paquita la del Barrio', 'Ana Gabriel',
            'Los Ángeles Azules', 'Sonora Santanera',
            'Rigo Tovar', 'Chico Che', 'Lupita D’Alessio',
            'Vicente Fernández', 'Pedro Infante',
            'Los Bukis', 'Marco Antonio Solís',
            'Los Temerarios', 'Grupo Bryndis',
            'Bronco', 'Los Yonic\'s', 'Guardianes del Amor',
            'Selena', 'Intocable', 'Aarón y Su Grupo Ilusión',
            'La Sonora Dinamita', 'Grupo Cañaveral',
        ],
    },
};


// Álbumes recopilatorios: su fecha suele no ser la del lanzamiento original
const COMPILATION = /greatest|best of|hits|collection|essential|anthology|compilation|karaoke|tribute/i;

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

export const listSets = () =>
    Object.entries(SETS).map(([id, s]) => ({ id, label: s.label, desc: s.desc }));

export async function getRandomTrack(setId = 'mezcla') {
    const set = SETS[setId];
    if (!set) throw new Error(`Set desconocido: ${setId}`);
    const from = set.from ?? -Infinity;
    const to = set.to ?? Infinity;

    for (let attempt = 0; attempt < 8; attempt++) {
        const artist = pick(set.artists);

        const url = new URL('https://itunes.apple.com/search');
        url.search = new URLSearchParams({
            term: artist,
            media: 'music',
            entity: 'song',
            limit: '100',
            country: set.country ?? 'US',
        });

        const res = await fetch(url);
        if (!res.ok) throw new Error(`Error de iTunes: ${res.status}`);
        const { results } = await res.json();

        const valid = results.filter((r) => {
            if (!r.previewUrl || !r.releaseDate) return false;
            if (!r.artistName.toLowerCase().includes(artist.toLowerCase())) return false;
            if (COMPILATION.test(r.collectionName ?? '')) return false;
            const year = new Date(r.releaseDate).getUTCFullYear();
            return year >= from && year <= to;
        });
        if (!valid.length) continue; // reintenta con otro artista

        const t = pick(valid);
        const track = {
            id: t.trackId,
            name: t.trackName,
            artist: t.artistName,
            year: new Date(t.releaseDate).getUTCFullYear(), // la respuesta correcta
            previewUrl: t.previewUrl, // MP3/AAC de ~30 s
        };
        console.log(setId, track);
        return track;
    }
    throw new Error('No se encontró una canción, intenta de nuevo');
}
