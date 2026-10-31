import { Music, VolumeX } from "lucide-react";
import { useLang } from "@/i18n/LangProvider";

export default function MusicToggle({ playing, onToggle }: { playing: boolean; onToggle: () => void }) {
  const { dict } = useLang();
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={playing}
      aria-label={playing ? dict.music.off : dict.music.on}
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full border border-gold-300 bg-white/90 text-gold-700 shadow-soft backdrop-blur transition hover:-translate-y-0.5 hover:bg-blush-50"
      style={{ marginBottom: "env(safe-area-inset-bottom)" }}
    >
      {playing ? (
        <Music className="h-5 w-5 animate-pulse motion-reduce:animate-none" aria-hidden="true" />
      ) : (
        <VolumeX className="h-5 w-5" aria-hidden="true" />
      )}
    </button>
  );
}
