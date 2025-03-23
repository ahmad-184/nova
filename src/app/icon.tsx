import { ImageResponse } from "next/og";
import { ImageResponseOptions } from "next/server";

// Image metadata
const options: ImageResponseOptions = {
  width: 32,
  height: 32,
};

export const contentType = "image/png";

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 24,
          background: "#d6d3d1",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "black",
          borderRadius: "10px",
          fontWeight: "bolder",
        }}
      >
        N
      </div>
    ),
    { ...options }
  );
}
