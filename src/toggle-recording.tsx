import { closeMainWindow, showHUD } from '@vicinae/api';
import { getStatus, toggleRecording } from './utils/voxtype';

export default async function Command() {
  try {
    const status = await getStatus();
    const willStop = status.class === 'recording';

    // Only the transition into "stop" produces typed/pasted output, so only
    // that one needs focus restored to the window active before Vicinae
    // opened — voxtype types/pastes into the focused window.
    if (willStop) await closeMainWindow();

    await toggleRecording();
    await showHUD('Voxtype recording toggled');
  } catch (err) {
    await showHUD(
      `Failed to toggle recording — ${err instanceof Error ? err.message : String(err)}`
    );
  }
}
