import { useEffect } from 'react'
import { AnimatePresence, motion as Motion } from 'framer-motion'

const Modal = ({ isOpen, onClose, title, children, contentClassName = '' }) => {
  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') onClose() }
    if (isOpen) document.addEventListener('keydown', fn)
    return () => document.removeEventListener('keydown', fn)
  }, [isOpen, onClose])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <Motion.div className="modal-overlay" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} onClick={onClose}>
          <Motion.div className={`modal-content ${contentClassName}`.trim()} initial={{ scale:0.92, y:20, opacity:0 }} animate={{ scale:1, y:0, opacity:1 }} exit={{ scale:0.92, y:20, opacity:0 }} transition={{ duration:0.2 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{title}</h2>
              <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
            </div>
            <div className="modal-body">{children}</div>
          </Motion.div>
        </Motion.div>
      )}
    </AnimatePresence>
  )
}

export default Modal
