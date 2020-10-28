import React, { useState, useEffect, useContext } from "react";
import { Link } from "gatsby";
import Layout from "../../components/layout";
import AuthenticationContext from "../../components/authenticationContext";
import requiresAuthentication from "../../components/requiresAuthentication";
import withErrorAndLoading from "../../components/withErrorAndLoading";

const SongFinder = () => {
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
    <Layout title="Song Finder">
      <SongFinderViewWithErrorAndLoading
        error={error}
        loading={playlistsData === null}
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
};

const SongFinderView = ({ playlists, goToPrevious, goToNext }) => (
  <Playlists
    playlists={playlists}
    goToPrev={goToPrevious}
    goToNext={goToNext}
  />
);
const SongFinderViewWithErrorAndLoading = withErrorAndLoading(SongFinderView);

const Playlists = ({ playlists, goToPrev, goToNext }) => (
  <div>
    {playlists.length === 0 ? (
      <div>No Playlists Found.</div>
    ) : (
      <>
        <ListPlayLists playlists={playlists} />
        <Pagination goToPrev={goToPrev} goToNext={goToNext} />
      </>
    )}
  </div>
);

const Pagination = ({ goToPrev, goToNext }) => (
  <div className="ta-c mt-2">
    <button
      type="button"
      onClick={goToPrev}
      disabled={!goToPrev}
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

const ListPlayLists = ({ playlists }) => (
  <div>
    {playlists.map((playlist, index) => (
      <div key={playlist.id} className="pure-g" style={{ paddingTop: "10px" }}>
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
              <Link
                to={`/playlist/?id=${playlist.id}`}
                style={{ color: "black" }}
              >
                {index + 1}. {playlist.name}
              </Link>
            </h3>
            <p>{playlist.description}</p>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default requiresAuthentication(SongFinder);
