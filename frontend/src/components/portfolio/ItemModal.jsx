import Modal from '../ui/Modal.jsx';
import { renderMarkdown } from '../../utils/markdown.js';

export default function ItemModal({ item, open, onClose }) {
  const gallery = Array.isArray(item.gallery) ? item.gallery : [];
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={item.modal_title || item.title}
      subtitle={item.modal_subtitle}
    >
      <div dangerouslySetInnerHTML={{ __html: renderMarkdown(item.modal_content) }} />
      {gallery.length > 0 ? (
        <div className="gallery">
          {gallery.map((image, index) => (
            <img key={`${image.url}-${index}`} src={image.url} alt={image.alt || ''} />
          ))}
        </div>
      ) : null}
    </Modal>
  );
}
