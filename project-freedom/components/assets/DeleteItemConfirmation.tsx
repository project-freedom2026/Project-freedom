type DeleteItemConfirmationProps = {
  itemName: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function DeleteItemConfirmation({ itemName, onConfirm, onCancel }: DeleteItemConfirmationProps) {
  return (
    <div className="mt-3 rounded-xl border border-rose-500/40 bg-rose-500/10 p-3" role="alertdialog" aria-label={`Confirm removal of ${itemName}`}>
      <p className="text-sm text-rose-100">Remove <strong>{itemName}</strong> from this category?</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={onConfirm} className="rounded-lg bg-rose-500 px-3 py-2 text-xs font-semibold text-white hover:bg-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-400">Remove item</button>
        <button type="button" onClick={onCancel} className="rounded-lg border border-slate-600 px-3 py-2 text-xs text-slate-300 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400">Keep item</button>
      </div>
    </div>
  );
}
