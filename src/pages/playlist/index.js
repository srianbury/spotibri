import React, { useState, useEffect, useContext } from "react";
import Layout from "../../components/layout";
import { useQueryParam } from "use-query-params";
import AuthenticationContext from "../../components/authenticationContext";
import requiresAuthentication from "../../components/requiresAuthentication";

async function checkIfContains(track, url, searchString) {
  const response = await fetch(url);
  const result = await response.json();
  if (result.soup.includes(searchString)) {
    return track.id;
  }
  return null;
}

async function findMatches(tracks, searchTerm) {
  // https://www.google.com/search?q=alaska+by+maggie+rogers+lyrics
  let promises = [];

  tracks.forEach(({ track }) => {
    const { name } = track;
    const artists = track.artists.map(artist => artist.name).join(" and ");
    const search = `https://beautyrest.herokuapp.com/v1/soup?url=https://www.google.com/search?q=${name} by ${artists} lyrics`;
    promises = [...promises, checkIfContains(track, search, searchTerm)];
  });

  const searchResults = await Promise.all(promises);
  return searchResults.filter(node => node !== null);
}

const Playlist = () => {
  const auth = useContext(AuthenticationContext);
  const playlistId = useQueryParam("id")[0];
  const [playlistData, setPlaylistData] = useState(null);
  const [matches, setMatches] = useState(null);
  const [matchesOnly, setMathcesOnly] = useState(false);

  async function _findMatches(tracks, searchTerm, cb) {
    const results = await findMatches(tracks, searchTerm);
    setMatches(results);
    cb();
  }

  useEffect(() => {
    async function read() {
      const response = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks?market=from_token&fields=items(track(id%2Cname%2Cartists.name%2Calbum(name%2Cimages)))&limit=100&offset=0`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.user.access_token}`,
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
          <LyricLookerUpper
            handleSearch={(searchTerm, cb) =>
              _findMatches(playlistData, searchTerm, cb)
            }
          />
          <PlaylistDetails
            tracks={
              matches && matchesOnly
                ? playlistData.filter(({ track }) => matches.includes(track.id))
                : playlistData
            }
            matches={matches}
            matchesOnly={matchesOnly}
            setMathcesOnly={setMathcesOnly}
          />
        </>
      )}
    </Layout>
  );
};

const LyricLookerUpper = ({ handleSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searching, setSearching] = useState(false);

  function handleClick() {
    setSearching(true);
    handleSearch(searchTerm, () => {
      setSearching(false);
    });
  }

  return (
    <div>
      <h3>LyricLookerUpper</h3>
      <label htmlFor="search">Search</label>
      <input
        disabled={searching}
        name="search"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        placeholder="Search"
      />
      <button type="button" onClick={handleClick} disabled={searching}>
        Search
      </button>
      {searching ? <p>This may take a moment</p> : null}
    </div>
  );
};

const PlaylistDetails = ({ tracks, matches, matchesOnly, setMathcesOnly }) => {
  return (
    <div>
      {matches ? (
        <>
          <input
            name="matches-only"
            type="checkbox"
            checked={matchesOnly}
            onChange={() => setMathcesOnly(prev => !prev)}
          />
          <label htmlFor="matches-only">Matches only</label>
        </>
      ) : null}
      {tracks.map(({ track }, index) => (
        <div key={track.id}>
          <div>{index + 1}.</div>
          <div>Name: {track.name}</div>
          <div>
            Artists: {track.artists.map(artist => artist.name).join(", ")}
          </div>
          <div>Album: {track.album.name}</div>
          <div>
            Match?{" "}
            {matches ? (matches.includes(track.id) ? "YESSS" : "no :(") : "N/A"}
          </div>
          <div>
            <img
              src={track.album.images[0].url}
              alt={track.album.name}
              height="100"
            />
          </div>
          <hr />
        </div>
      ))}
    </div>
  );
};

export default requiresAuthentication(Playlist);
