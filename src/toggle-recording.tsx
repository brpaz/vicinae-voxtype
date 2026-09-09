import { closeMainWindow, showHUD } from '@vicinae/api';
import { toggleRecording } from './utils/voxtype';

export default async function Command() {
  // Close first so focus returns to the window that was active before
  // Vicinae opened — voxtype types/pastes into the focused window.
  await closeMainWindow();
  try {
    await toggleRecording();
    await showHUD('Voxtype recording toggled');
  } catch (err) {
    await showHUD(
      `Failed to toggle recording — ${err instanceof Error ? err.message : String(err)}`
    );
  }
}
