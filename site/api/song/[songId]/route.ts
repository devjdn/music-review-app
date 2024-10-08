import { getSpotifyAccessToken } from "@/api/access-token";

export const fetchTrack = async ({songId}: {songId: string}) => {
    const accessToken = await getSpotifyAccessToken();

    const response = await fetch(`https://api.spotify.com/v1/tracks/${songId}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        }
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error(`Error fetching track: ${response.status} ${response.statusText} ${errorBody}`);
        throw new Error(`Error fetching track: ${response.status} ${response.statusText} ${errorBody}`);
    }

    const data = await response.json();
    return data;
}

const musixmatchApiKey = process.env.MUSIXMATCH_KEY;

interface SongProps {
    songName: string;
    songArtist: string;
}

export const fetchLyrics = async ({songName, songArtist}: SongProps) => {
    const songSearchResponse = await fetch(`https://api.musixmatch.com/ws/1.1/track.search?apikey=${musixmatchApiKey}&q_track=${encodeURIComponent(songName)}&q_artist=${encodeURIComponent(songArtist)}&f_has_lyrics=1`);

    if(!songSearchResponse.ok) {
        const errorBody = await songSearchResponse.text();
        console.error(`Error fetching track: ${songSearchResponse.status} ${songSearchResponse.statusText} ${errorBody}`);
        throw new Error(`Error fetching track: ${songSearchResponse.status} ${songSearchResponse.statusText} ${errorBody}`);
    }

    const searchItem = await songSearchResponse.json();
    const trackId = searchItem.message.body.track_list[0]?.track.track_id;

    if(!trackId){
        return null;
    }

    console.log(songSearchResponse);

    const lyricsResponse = await fetch(`https://api.musixmatch.com/ws/1.1/track.lyrics.get?apikey=${musixmatchApiKey}&track_id=${trackId}`);

    if(!lyricsResponse.ok) {
        const errorBody = await lyricsResponse.text();
        console.error(`Error fetching track: ${lyricsResponse.status} ${lyricsResponse.statusText} ${errorBody}`);
        throw new Error(`Error fetching track: ${lyricsResponse.status} ${lyricsResponse.statusText} ${errorBody}`);
    }

    console.log(lyricsResponse);

    const data = await lyricsResponse.json();
    return data;
}