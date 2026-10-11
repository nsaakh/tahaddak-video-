import React from "react";
import { Composition } from "remotion";
import { TahaddakPromo } from "./TahaddakPromo";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="TahaddakPromo"
      component={TahaddakPromo}
      durationInFrames={1050}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};
