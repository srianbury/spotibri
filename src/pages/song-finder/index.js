import React, { useState, useEffect, useContext } from "react";
import { Link } from "gatsby";
import Layout from "../../components/layout";
import AuthenticationContext from "../../components/authenticationContext";
import requiresAuthentication from "../../components/requiresAuthentication";
import withErrorAndLoading from "../../components/withErrorAndLoading";
import withList from "../../components/withList";

const SongFinderContainer = () => {
  const auth = useContext(AuthenticationContext);
  const [playlistUrl, setPlaylistUrl] = useState(
    "https://api.spotify.com/v1/me/playlists?offset=0&limit=20"
  );
  const [playlistsData, setPlaylistsData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function read() {
      const response = await auth.authedFetch(playlistUrl);
      if (response.error) {
        setError(response.error);
      } else {
        setPlaylistsData(response.result);
      }
      window.scrollTo(0, 0);
    }
    read();
  }, [auth, playlistUrl]);

  return (
    <SongFinderView
      error={error}
      playlistsData={playlistsData}
      setPlaylistUrl={setPlaylistUrl}
    />
  );
};

const NoPlaylistsView = () => <div>No Playlists found.</div>;

const SongFinderView = ({ error, playlistsData, setPlaylistUrl }) => (
  <Layout title="Song Finder">
    <PlaylistsView
      error={error}
      loading={playlistsData === null}
      length={playlistsData ? playlistsData.items.length : null}
      empty={<NoPlaylistsView />}
      playlists={playlistsData ? playlistsData.items : null}
      goToPrevious={
        playlistsData && playlistsData.previous
          ? () => setPlaylistUrl(playlistsData.previous)
          : null
      }
      goToNext={
        playlistsData && playlistsData.next
          ? () => setPlaylistUrl(playlistsData.next)
          : null
      }
    />
  </Layout>
);

const PlaylistsViewBase = ({ playlists, goToPrevious, goToNext }) => (
  <div className="text-center">
    <ListPlaylistsView playlists={playlists} />
    <PaginationView goToPrevious={goToPrevious} goToNext={goToNext} />
  </div>
);
const PlaylistsView = withErrorAndLoading(withList(PlaylistsViewBase));

const ListPlaylistsView = ({ playlists }) => (
  <div>
    {playlists.map((playlist, index) => (
      <PlaylistView key={playlist.id} playlist={playlist} index={index} />
    ))}
  </div>
);

const PlaylistView = ({ playlist, index }) => (
  <div className="container row pt-1 pb-1">
    <div className="col-4 text-right">
      <Link to={`/playlist/?id=${playlist.id}`}>
        <img
          src={
            playlist && playlist.images && playlist.images[0]
              ? playlist.images[0].url
              : "https://i.pinimg.com/originals/7a/ec/a5/7aeca525afa2209807c15da821b2f2c6.png"
          }
          height="100px"
          width="100px"
          alt={playlist.name}
        />
      </Link>
    </div>
    <div className="col-8 text-left pl-0">
      <div>
        <h3>
          <Link to={`/playlist/?id=${playlist.id}`}>
            {index + 1}. {playlist.name}
          </Link>
        </h3>
        <p>{playlist.description}</p>
      </div>
    </div>
  </div>
);

const PaginationView = ({ goToPrevious, goToNext }) => (
  <div className="pt-1 pb-2">
    <button
      type="button"
      onClick={goToPrevious}
      disabled={!goToPrevious}
      className="btn btn-sm btn-secondary mr-1"
    >
      Prev
    </button>
    <button
      type="button"
      onClick={goToNext}
      disabled={!goToNext}
      className="btn btn-sm btn-secondary ml-1"
    >
      Next
    </button>
  </div>
);

export default requiresAuthentication(SongFinderContainer);
