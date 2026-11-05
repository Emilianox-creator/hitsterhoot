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
