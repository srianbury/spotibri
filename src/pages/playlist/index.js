import React, { useState, useEffect, useContext } from "react";
import Layout from "../../components/layout";
import { useQueryParam } from "use-query-params";
import AuthenticationContext from "../../components/authenticationContext";

const Playlist = () => {
  const { user } = useContext(AuthenticationContext);
  const playlistId = useQueryParam("id")[0];
  const [playlistData, setPlaylistData] = useState(null);

  useEffect(() => {
    async function read() {
      const response = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks?market=from_token&fields=items(track(id%2Cname%2Cartists.name%2Calbum.name))&limit=100&offset=0`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.auth.access_token}`,
          },
        }
      );
      const result = await response.json();
      setPlaylistData(result.items);
    }
    read();
  }, [playlistId]);

  return (
    <Layout title="Playlist">
      {playlistData === null ? (
        <div>Loading</div>
      ) : (
        <>
          <LyricLookerUpper tracks={playlistData} />
          <PlaylistDetails tracks={playlistData} />
        </>
      )}
    </Layout>
  );
};

async function checkIfContains(track, url, searchString) {
  const response = await fetch(url);
  const result = await response.json();
  if (result.soup.includes(searchString)) {
    return track.id;
  }
  return null;
}

const LyricLookerUpper = ({ tracks }) => {
  const searchString = "through icy streams";
  let [matches, setMatches] = useState([]);

  useEffect(() => {
    async function findMatch() {
      // https://www.google.com/search?q=alaska+by+maggie+rogers+lyrics
      let promises = [];

      tracks.forEach(({ track }) => {
        const { name } = track;
        const artists = track.artists.map(artist => artist.name).join(" and ");
        const search = `https://beautyrest.herokuapp.com/v1/soup?url=https://www.google.com/search?q=${name} by ${artists} lyrics`;
        promises = [...promises, checkIfContains(track, search, searchString)];
      });

      const searchResults = await Promise.all(promises);
      console.log({ searchResults });
    }
    findMatch();
  }, []);

  return <div>LyricLookerUpper</div>;
};

const PlaylistDetails = ({ tracks }) => {
  console.log({ tracks });
  return (
    <div>
      {tracks.map(({ track }, index) => (
        <div key={track.id}>
          <div>{index + 1}.</div>
          <div>Name: {track.name}</div>
          <div>
            Artists: {track.artists.map(artist => artist.name).join(", ")}
          </div>
          <div>Album: {track.album.name}</div>
          <hr />
        </div>
      ))}
    </div>
  );
};

export default Playlist;
