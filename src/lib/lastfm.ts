import { z } from "zod";

const API_KEY = import.meta.env.LASTFM_API_KEY;

export const getLastFmUser = async () => {
  const response = await fetch(
    `https://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=notbytehead&api_key=${API_KEY}&format=json`
  ).then((res) => res.json());

  const { user } = z
    .object({
      user: z.object({
        name: z.string(),
        realname: z.string().nullable(),
        country: z.string().nullable(),
        playcount: z.string(),
        artist_count: z.string(),
        track_count: z.string(),
        album_count: z.string(),
        image: z.array(
          z.object({
            "#text": z.string(),
            size: z.string(),
          })
        ),
        url: z.string(),
      }),
    })
    .parse(response);
  return user;
};

export const getRecentTracks = async (limit: number) => {
  const response = await fetch(
    `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=notbytehead&api_key=${API_KEY}&format=json&limit=${limit}`
  ).then((res) => res.json());

  const { recenttracks } = z
    .object({
      recenttracks: z.object({
        track: z.array(
          z.object({
            name: z.string(),
            url: z.string(),
            artist: z.object({ "#text": z.string() }),
            album: z.object({ "#text": z.string() }),
            date: z
              .object({
                "#text": z.string(),
              })
              .optional(),
            image: z.array(
              z.object({
                "#text": z.string(),
              })
            ),
            "@attr": z
              .object({
                nowplaying: z.string().optional(),
              })
              .optional(),
          })
        ),
      }),
    })
    .parse(response);
  return recenttracks.track;
};
