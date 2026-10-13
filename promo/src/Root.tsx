import React from "react";
import { Composition } from "remotion";
import { TahaddakPromo } from "./TahaddakPromo";
import { FPS, TahaddakGames, TOTAL_FRAMES } from "./TahaddakGames";
import { EanaPromo, totalFrames } from "./eana/EanaPromo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="TahaddakPromo"
        component={TahaddakPromo}
        durationInFrames={1050}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="TahaddakGames"
        component={TahaddakGames}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="EanaPromo-AR"
        component={EanaPromo}
        durationInFrames={totalFrames("ar")}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ lang: "ar" as const }}
      />
      <Composition
        id="EanaPromo-EN"
        component={EanaPromo}
        durationInFrames={totalFrames("en")}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ lang: "en" as const }}
      />
    </>
  );
};
