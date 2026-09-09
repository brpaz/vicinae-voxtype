import { closeMainWindow, showHUD, showToast, Toast } from '@vicinae/api';
import { getStatus, toggleRecording } from './utils/voxtype';

export default async function Command() {
  let willStop = false;
  try {
    const status = await getStatus();
    willStop = status.class === 'recording';

    // Only the transition into "stop" produces typed/pasted output, so only
    // that one needs focus restored to the window active before Vicinae
    // opened — voxtype types/pastes into the focused window. showHUD itself
    // closes the window as a side effect, so it's only used on that path;
    // showToast is used otherwise to keep the launcher open.
    if (willStop) {
      await closeMainWindow();
      await toggleRecording();
      await showHUD('Voxtype recording toggled');
    } else {
      await toggleRecording();
      await showToast({
        style: Toast.Style.Success,
        title: 'Voxtype recording toggled',
      });
    }
  } catch (err) {
    const message = `Failed to toggle recording — ${err instanceof Error ? err.message : String(err)}`;
    if (willStop) {
      await showHUD(message);
    } else {
      await showToast({ style: Toast.Style.Failure, title: message });
    }
  }
}
