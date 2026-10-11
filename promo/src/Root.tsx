import React from "react";
import { Composition } from "remotion";
import { TahaddakPromo } from "./TahaddakPromo";
import { FPS, TahaddakGames, TOTAL_FRAMES } from "./TahaddakGames";

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
    </>
  );
};
