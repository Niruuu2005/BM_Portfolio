import Modal from './Modal'

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message }) => (
  <Modal isOpen={isOpen} onClose={onClose} title={title || 'Confirm Delete'}>
    <p className="text-muted" style={{ marginBottom: 'var(--space-6)' }}>
      {message || 'Are you sure? This action cannot be undone.'}
    </p>
    <div style={{ display:'flex', gap:'var(--space-3)', justifyContent:'flex-end' }}>
      <button className="btn btn-outline" onClick={onClose}>Cancel</button>
      <button className="btn btn-danger" onClick={onConfirm}>Delete</button>
    </div>
  </Modal>
)

export default ConfirmDialog
