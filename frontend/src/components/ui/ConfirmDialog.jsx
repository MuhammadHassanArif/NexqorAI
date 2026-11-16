import { Modal } from "./Modal";
import { Button } from "./Button";
import { Alert } from "./Alert";

// "Are you sure?" window, used before deleting something.
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  loading = false,
  error = "",
}) {
  return (
    <Modal
      open={open}
      onClose={loading ? () => {} : onClose}
      title={title}
      description={description}
      className="max-w-md"
    >
      <Alert message={error} />
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button variant="outline" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          loading={loading}
          className="bg-danger text-white shadow-none hover:bg-danger/90"
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}