export default function Button(
  {
    type = "submit",
    variant,
    callback,
    text,
    disabled = false,
    fullWidth = false,
    largeFont = false,
  }: {
    type?: "button" | "submit";
    callback?: () => void;
    variant: "primary" | "secondary" | "ghost" | "danger";
    text: string;
    disabled?: boolean;
    fullWidth?: boolean;
    largeFont?: boolean;
  }
) {
  let btnClass = "rounded-lg disabled:opacity-60 disabled:cursor-not-allowed";


  if (variant === "primary") {
    btnClass += " bg-uzg-500 px-3 py-2 text-black"
  }

  if (variant === "secondary") {
    btnClass += " border-board-line bg-board-soft px-3 py-2 text-uzg-400 hover:border-uzg-500"
  }

  if (variant === "ghost") {
    btnClass += " border border-board-line bg-transparent px-2 py-1 text-uzg-400 hover:border-uzg-500"
  }

  if (variant === "danger") {
    btnClass += " border border-red-900/50 bg-transparent px-2 py-1 text-red-300 hover:border-red-500"
  }

  if (fullWidth) {
    btnClass += " w-full";
  }

  if (!largeFont) {
    btnClass += " text-sm";
  }

  if (type === "button" && callback) {
    return (
      <button type="button" onClick={callback} disabled={disabled} className={btnClass}>
        {text}
      </button>
    );
  }

  return (
    <button disabled={disabled} className={btnClass}>
      {text}
    </button>
  );
}