import { getSpotifyAccessToken } from "@/api/access-token";

interface ArtistProps {
    artistId: string;
}

export const fetchArtistProfile = async ({artistId}: ArtistProps) => {
    const accessToken = await getSpotifyAccessToken();
    const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        }
    });
    if(!response.ok) {
        const errorBody = await response.text();
        console.error(`Error fetching Artist profile: ${response.status} ${response.statusText} ${errorBody}`);
        throw new Error(`Error fetching Artist profile: ${response.status} ${response.statusText} ${errorBody}`)
    }

    const data = await response.json();
    return data;
}