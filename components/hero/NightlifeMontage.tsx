const clips = [
  { name: "dancefloor", className: "montage-frame montage-frame-a" },
  { name: "bar-conversation", className: "montage-frame montage-frame-b" },
  { name: "friends-dancing", className: "montage-frame montage-frame-c" },
  { name: "city-crowd", className: "montage-frame montage-frame-d" },
];

export function NightlifeMontage() {
  return <div className="nightlife-montage" aria-hidden="true">
    {clips.map((clip) => <div className={clip.className} key={clip.name}>
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        poster={`/media/nightlife/source/${clip.name}.jpg`}
      >
        <source src={`/media/nightlife/source/${clip.name}.mp4`} type="video/mp4" />
      </video>
    </div>)}
    <div className="montage-vignette" />
    <div className="montage-grain" />
  </div>;
}
