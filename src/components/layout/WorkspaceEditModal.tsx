/* ================================================================
   Fit — WorkspaceEditModal Component
   ================================================================ */

import { useState, useRef } from 'react';
import { useTranslation } from '../../i18n';
import type { Workspace } from '../../types';

interface WorkspaceEditModalProps {
  workspace: Workspace;
  onClose: () => void;
  onSave: (name: string, color: string, icon?: string) => void;
}

const COLOR_PRESETS = [
  { name: 'purple', hex: '#a88bc7', bg: '#362145', text: '#a88bc7' },
  { name: 'teal', hex: '#60b0a2', bg: '#164540', text: '#60b0a2' },
  { name: 'orange', hex: '#d4a857', bg: '#4c3b1a', text: '#d4a857' },
  { name: 'violet', hex: '#c97070', bg: '#4a2323', text: '#c97070' },
  { name: 'blue', hex: '#6fa3c9', bg: '#1b3b52', text: '#6fa3c9' },
  { name: 'green', hex: '#8cb87a', bg: '#27451c', text: '#8cb87a' },
];

export function WorkspaceEditModal({ workspace, onClose, onSave }: WorkspaceEditModalProps) {
  const [name, setName] = useState(workspace.name);
  const [selectedColor, setSelectedColor] = useState(workspace.color || '#60b0a2');
  const [icon, setIcon] = useState<string | undefined>(workspace.icon);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result && typeof event.target.result === 'string') {
          setIcon(event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSave = () => {
    if (!name.trim()) return;
    onSave(name.trim(), selectedColor, icon);
    onClose();
  };

  const matchedPreset = COLOR_PRESETS.find(p => p.hex === selectedColor);
  const previewBg = matchedPreset ? matchedPreset.bg : '#164540';
  const previewText = matchedPreset ? matchedPreset.text : '#60b0a2';

  return (
    <div className="modal-backdrop">
      <div className="edit-modal" onClick={e => e.stopPropagation()}>
        <div className="edit-modal__header">
          <div>
            <span className="edit-modal__title">Rename project</span>
            <span className="edit-modal__subtitle">Update the title for <span className="edit-modal__path">{workspace.path}</span></span>
          </div>
        </div>

        <div className="edit-modal__body">
          <div className="edit-modal__field">
            <label className="edit-modal__label">Project title</label>
            <input
              type="text"
              className="edit-modal__input"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Project name"
              autoFocus
            />
          </div>
        </div>

        <div className="edit-modal__footer">
          <button className="edit-modal__btn edit-modal__btn--cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            className="edit-modal__btn edit-modal__btn--save"
            onClick={handleSave}
            disabled={!name.trim()}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
