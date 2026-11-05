// Artistas de varias décadas; el año sale de la fecha de lanzamiento que devuelve iTunes
const ARTISTS = [
    'Elvis Presley', 'The Beatles', 'The Rolling Stones', 'Bob Dylan', 'Queen',
    'Led Zeppelin', 'Pink Floyd', 'ABBA', 'Bee Gees', 'Fleetwood Mac',
    'Michael Jackson', 'Madonna', 'Prince', 'Whitney Houston', 'Bon Jovi',
    'Guns N\' Roses', 'Nirvana', 'Oasis', 'Backstreet Boys', 'Spice Girls',
    'Britney Spears', 'Eminem', 'Shakira', 'Coldplay', 'Beyoncé',
    'Rihanna', 'Maroon 5', 'Bruno Mars', 'Adele', 'Ed Sheeran',
    'Taylor Swift', 'Dua Lipa', 'The Weeknd', 'Bad Bunny', 'Maná',
    'Soda Stereo', 'Luis Miguel', 'Juan Gabriel', 'Selena', 'Café Tacvba',
];

// Álbumes recopilatorios: su fecha suele no ser la del lanzamiento original
const COMPILATION = /greatest|best of|hits|collection|essential|anthology|compilation|karaoke|tribute/i;

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

export async function getRandomTrack() {
    for (let attempt = 0; attempt < 5; attempt++) {
        const artist = pick(ARTISTS);

        const url = new URL('https://itunes.apple.com/search');
        url.search = new URLSearchParams({
            term: artist,
            media: 'music',
            entity: 'song',
            limit: '50',
            country: 'US',
        });

        const res = await fetch(url);
        if (!res.ok) throw new Error(`Error de iTunes: ${res.status}`);
        const { results } = await res.json();

        const valid = results.filter(
            (r) =>
                r.previewUrl &&
                r.releaseDate &&
                r.artistName.toLowerCase().includes(artist.toLowerCase()) &&
                !COMPILATION.test(r.collectionName ?? '')
        );
        if (!valid.length) continue; // reintenta con otro artista

        const t = pick(valid);
        return {
            id: t.trackId,
            name: t.trackName,
            artist: t.artistName,
            year: new Date(t.releaseDate).getUTCFullYear(), // la respuesta correcta
            previewUrl: t.previewUrl, // MP3/AAC de ~30 s
        };
    }
    throw new Error('No se encontró una canción, intenta de nuevo');
}