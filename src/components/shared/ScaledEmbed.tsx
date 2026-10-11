import { useEffect, useRef, useState, type ComponentProps } from 'react';

type EmbedProps = Omit<ComponentProps<'iframe'>, 'className' | 'style'>;

/* Below this width Google Drive's player crops its poster, so it is drawn at this width and scaled down */
const DRIVE_MIN_WIDTH = 480;
const DRIVE_MIN_HEIGHT = (DRIVE_MIN_WIDTH * 9) / 16;

function isDriveUrl(url: string | undefined) {
  if (!url) return false;
  try {
    return new URL(url).hostname === 'drive.google.com';
  } catch {
    return false;
  }
}

/*
 * Drive iframe for a 16:9 slot that already has its size (the parent keeps `aspect-video`, so nothing shifts).
 * From 480px of width up it fills the slot as any other embed; below that it renders the player at 480x270 and
 * scales it down from the top-left corner, which keeps Drive's own layout intact.
 */
function DriveEmbed(props: EmbedProps) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number | null>(null);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(box);
    return () => observer.disconnect();
  }, []);

  const scale = width !== null && width < DRIVE_MIN_WIDTH ? width / DRIVE_MIN_WIDTH : null;

  return (
    <div ref={boxRef} className="size-full overflow-hidden">
      <iframe
        {...props}
        className={scale === null ? 'size-full' : undefined}
        style={
          scale === null
            ? undefined
            : {
                width: DRIVE_MIN_WIDTH,
                height: DRIVE_MIN_HEIGHT,
                transform: `scale(${scale})`,
                transformOrigin: '0 0',
              }
        }
      />
    </div>
  );
}

/** Video iframe that fills its 16:9 slot. Only Google Drive embeds get the scaling; the rest keep the plain markup */
export function ScaledEmbed(props: EmbedProps) {
  return isDriveUrl(props.src) ? <DriveEmbed {...props} /> : <iframe {...props} className="size-full" />;
}
