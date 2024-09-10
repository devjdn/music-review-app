import { fetchPlaylistTracks, PlaylistProps } from "@/api/[playlistId]/route";
import { Playlist } from "@/lib/global";
import { GridContainer, GridHeader, GridList, GridRow } from "@/components/playlist-grid/playlist-grid";
import { Clock } from 'lucide-react';

export default async function PlaylistTracksPage({params}: {params: { playlistId: string; }}) {
  const { playlistId } = params;
  const playlist: Playlist = await fetchPlaylistTracks({ playlistId });
  const playlistName = playlist.name;
  const trackCount = playlist.tracks.total;
  const playlistOwner = playlist.owner.display_name;
  const playlistDescription = playlist.description;

  return (
    <section className="playlist playlist-id">
      <GridContainer>
        <header className="playlist-header">
          <img src={playlist.images[0].url}/>
          <div className="playlist-info">
              <h3>{playlistName}</h3>
              <strong>{playlistOwner} &middot; {trackCount} tracks</strong>
              <p>{playlistDescription}</p>
          </div>
        </header>
        <GridHeader/>
        <GridList>
          {playlist.tracks.items.map((track, trackIndex) => (
            track.track && (
              <GridRow key={trackIndex}>
                <div className="grid-col">
                  <img loading="lazy" src={track.track.album.images[0]?.url} alt={track.track.name} />
                  <div className="info">
                    <p>{track.track.name}</p>
                    <p>{track.track.artists[0]?.name}</p>
                  </div>
                </div>
                <div className="grid-col">
                  <p>{track.track.album.name}</p>
                </div>
                <div className="grid-col">
                  <p>{formatDuration(track.track.duration_ms)}</p>
                </div>
              </GridRow>
            )
          ))}
        </GridList>
      </GridContainer>
    </section>
  );
}

function formatDuration(durationMs: number): string {
  const minutes = Math.floor(durationMs / 60000);
  const seconds = Math.floor((durationMs % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
