import React, { useState, useEffect, useContext } from "react";
import Layout from "../../components/layout";
import { useQueryParam } from "use-query-params";
import AuthenticationContext from "../../components/authenticationContext";
import requiresAuthentication from "../../components/requiresAuthentication";
import withErrorAndLoading from "../../components/withErrorAndLoading";
import { PlayerProvider, Player, PlayerContext } from "./player";

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

async function fetchAll(accessToken, url) {
  let allTracks = [];
  while (url) {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const result = await response.json();
    const tracks = result.items;
    allTracks.push(...tracks);
    url = result.next;
  }
  return allTracks;
}

const PlaylistContainer = () => {
  const auth = useContext(AuthenticationContext);
  const playlistId = useQueryParam("id")[0];
  const [playlistData, setPlaylistData] = useState(null);
  const [matches, setMatches] = useState(null);
  const [matchesOnly, setMatchesOnly] = useState(false);

  async function _findMatches(tracks, searchTerm, cb) {
    const results = await findMatches(tracks, searchTerm);
    setMatches(results);
    cb();
  }

  useEffect(() => {
    async function read() {
      const allTracks = await fetchAll(
        auth.user.access_token,
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks?market=from_token&fields=next,items(track(id%2Cname%2Cartists.name%2Cpreview_url%2Calbum(name%2Cimages)))&limit=100&offset=0`
      );
      setPlaylistData(allTracks);
    }
    read();
  }, [auth.user.access_token, playlistId]);

  return (
    <Layout title="Lyric Looker Upper">
      <PlayerProvider>
        <PlaylistView
          error={null}
          loading={playlistData === null}
          _findMatches={_findMatches}
          matches={matches}
          playlistData={playlistData}
          matchesOnly={matchesOnly}
          setMatchesOnly={setMatchesOnly}
        />
        <Player />
      </PlayerProvider>
    </Layout>
  );
};

const PlaylistViewBase = ({
  _findMatches,
  matches,
  playlistData,
  matchesOnly,
  setMatchesOnly,
}) => (
  <div style={{ display: "flex", justifyContent: "center" }}>
    <div style={{ width: "100%", marginBottom: "80px" }}>
      <LyricLookerUpperContainer
        handleSearch={(searchTerm, cb) =>
          _findMatches(playlistData, searchTerm, cb)
        }
      />
      <PlaylistDetailsContainer
        tracks={
          matches && matchesOnly
            ? playlistData.filter(({ track }) => matches.includes(track.id))
            : playlistData
        }
        matches={matches}
        matchesOnly={matchesOnly}
        setMatchesOnly={setMatchesOnly}
      />
    </div>
  </div>
);
const PlaylistView = withErrorAndLoading(PlaylistViewBase);

const LyricLookerUpperContainer = ({ handleSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searching, setSearching] = useState(false);

  function handleClick() {
    setSearching(true);
    handleSearch(searchTerm, () => {
      setSearching(false);
    });
  }

  return (
    <LyricLookerUpperView
      searching={searching}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      handleClick={handleClick}
    />
  );
};

const LyricLookerUpperView = ({
  searching,
  searchTerm,
  setSearchTerm,
  handleClick,
}) => (
  <div style={{ display: "flex", justifyContent: "center" }}>
    <div style={{ marginBottom: "20px", textAlign: "center" }}>
      <form className="pure-form pure-form-stacked">
        <label htmlFor="lyric-search">Search</label>
        <input
          disabled={searching}
          name="lyric-search"
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{ width: "100%" }}
          placeholder="Search"
        />
        <button
          type="submit"
          onClick={handleClick}
          disabled={searching}
          className="pure-button pure-button-primary"
        >
          Search
        </button>
      </form>
      {searching ? <p>This will take a moment</p> : null}
    </div>
  </div>
);

const PlaylistDetailsContainer = ({
  tracks,
  matches,
  matchesOnly,
  setMatchesOnly,
}) => {
  const { setPreview } = useContext(PlayerContext);

  return (
    <PlaylistDetailsView
      matchesOnly={matchesOnly}
      matches={matches}
      setMatchesOnly={setMatchesOnly}
      setPreview={setPreview}
      tracks={tracks}
    />
  );
};

const PlaylistDetailsView = ({
  matchesOnly,
  matches,
  setMatchesOnly,
  tracks,
  setPreview,
}) => (
  <div>
    <div style={{ textAlign: "center" }}>
      <input
        name="matches-only"
        type="checkbox"
        checked={matchesOnly}
        disabled={!matches}
        onChange={() => setMatchesOnly(prev => !prev)}
      />
      <label htmlFor="matches-only" style={{ marginLeft: "5px" }}>
        Show matches only
      </label>
      {matches ? <NumMatchesView num={matches.length} /> : null}
    </div>
    {tracks.map(({ track }, index) => (
      <div key={track.id} style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ width: "80%" }}>
          <div>
            <hr />
            <div>{index + 1}.</div>
            <div>Name: {track.name}</div>
            <div>
              Artists: {track.artists.map(artist => artist.name).join(", ")}
            </div>
            <div>Album: {track.album.name}</div>
            <div>
              Match:{" "}
              {matches
                ? matches.includes(track.id)
                  ? "YESSS"
                  : "no :("
                : "N/A"}
            </div>
            <div>
              <img
                src={track.album.images[0].url}
                alt={track.album.name}
                height="100"
              />
            </div>
            {track.preview_url ? (
              <button
                type="button"
                onClick={() => setPreview(track.preview_url)}
              >
                Preview
              </button>
            ) : null}
          </div>
        </div>
      </div>
    ))}
  </div>
);

const NumMatchesView = ({ num }) => {
  if (num === 0) {
    return <div>No matches :( try adjusting your search.</div>;
  }

  if (num === 1) {
    return <div>{num} match.</div>;
  }

  return <div>{num} matches.</div>;
};

export default requiresAuthentication(PlaylistContainer);
