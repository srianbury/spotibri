import React, { useState, useEffect, useContext } from "react";
import Layout from "../../components/layout";
import AuthenticationContext from "../../components/authenticationContext";
import requiresAuthentication from "../../components/requiresAuthentication";
import { Link } from "gatsby";

// const limit = 20;
const SongFinder = () => {
  const { user } = useContext(AuthenticationContext);
  // const [offset, setOffset] = useState(0)
  const [playlistUrl, setPlaylistUrl] = useState(
    "https://api.spotify.com/v1/me/playlists?offset=0&limit=20"
  );
  const [playlistsData, setPlaylistsData] = useState(null);

  useEffect(() => {
    async function read() {
      const response = await fetch(playlistUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.access_token}`,
        },
      });
      const result = await response.json();
      console.log({ result });
      setPlaylistsData(cur => ({
        ...cur,
        ...result,
        items:
          cur && cur.items ? [...cur.items, ...result.items] : result.items,
      }));
    }
    read();
  }, [user.access_token, playlistUrl]);
  return (
    <Layout title="Song Finder">
      {playlistsData === null ? (
        <div>Loading</div>
      ) : (
        <Playlists
          playlists={playlistsData.items}
          loadMore={
            playlistsData.next
              ? () => {
                  setPlaylistUrl(playlistsData.next);
                }
              : null
          }
        />
      )}
    </Layout>
  );
};

const Playlists = ({ playlists, loadMore }) => (
  <div>
    {playlists.length === 0 ? (
      <div>No Playlists Found.</div>
    ) : (
      <ListPlayLists playlists={playlists} loadMore={loadMore} />
    )}
  </div>
);

const ListPlayLists = ({ playlists, loadMore }) => (
  <div>
    {playlists.map((playlist, index) => (
      <div key={playlist.id}>
        <hr />
        <h3>
          {index + 1}. {playlist.name}
        </h3>
        <p>{playlist.description}</p>
        {playlist.images[0] ? (
          <img
            src={playlist.images[0].url}
            height="100px"
            alt={playlist.name}
          />
        ) : null}
        <Link to={`/playlist/?id=${playlist.id}`}>Use this playlist</Link>
      </div>
    ))}
    {loadMore ? (
      <button type="button" onClick={() => loadMore()}>
        Load More
      </button>
    ) : (
      <div>No more playlists.</div>
    )}
  </div>
);

export default requiresAuthentication(SongFinder);
