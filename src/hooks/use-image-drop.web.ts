import { useEffect } from 'react';

/** เว็บ: วางรูป (⌘V / Ctrl+V) หรือลากรูปมาวางที่ไหนก็ได้บนหน้า → ส่ง URL ของรูปไปให้สแกน */
export function useImageDrop(onImage: (uri: string) => void, enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    const pick = (files?: FileList | null) => {
      const file = Array.from(files ?? []).find((item) => item.type.startsWith('image/'));
      if (file) onImage(URL.createObjectURL(file));
      return Boolean(file);
    };
    const onPaste = (event: ClipboardEvent) => {
      if (pick(event.clipboardData?.files)) event.preventDefault();
    };
    const onDragOver = (event: DragEvent) => event.preventDefault();
    const onDrop = (event: DragEvent) => {
      event.preventDefault();
      pick(event.dataTransfer?.files);
    };

    window.addEventListener('paste', onPaste);
    window.addEventListener('dragover', onDragOver);
    window.addEventListener('drop', onDrop);
    return () => {
      window.removeEventListener('paste', onPaste);
      window.removeEventListener('dragover', onDragOver);
      window.removeEventListener('drop', onDrop);
    };
  }, [enabled, onImage]);
}
