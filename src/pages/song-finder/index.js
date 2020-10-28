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
  <>
    <ListPlaylistsView playlists={playlists} />
    <PaginationView goToPrevious={goToPrevious} goToNext={goToNext} />
  </>
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
  <div className="pure-g" style={{ paddingTop: "10px" }}>
    <div className="pure-u-1-3 text-align-end">
      {playlist.images[0] ? (
        <Link
          to={`/playlist/?id=${playlist.id}`}
          style={{ textDecoration: "none" }}
        >
          <img
            src={playlist.images[0].url}
            height="100px"
            alt={playlist.name}
          />
        </Link>
      ) : null}
    </div>
    <div className="pure-u-2-3">
      <div className="margin-left-20">
        <h3>
          <Link to={`/playlist/?id=${playlist.id}`} style={{ color: "black" }}>
            {index + 1}. {playlist.name}
          </Link>
        </h3>
        <p>{playlist.description}</p>
      </div>
    </div>
  </div>
);

const PaginationView = ({ goToPrevious, goToNext }) => (
  <div className="ta-c mt-2">
    <button
      type="button"
      onClick={goToPrevious}
      disabled={!goToPrevious}
      className="mr-1"
    >
      Prev
    </button>
    <button
      type="button"
      onClick={goToNext}
      disabled={!goToNext}
      className="ml-1"
    >
      Next
    </button>
  </div>
);

export default requiresAuthentication(SongFinderContainer);
