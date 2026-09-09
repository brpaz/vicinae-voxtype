import { showToast, Toast } from '@vicinae/api';
import { toggleRecording } from './utils/voxtype';

export default async function Command() {
  try {
    await toggleRecording();
    await showToast({
      style: Toast.Style.Success,
      title: 'Voxtype recording toggled',
    });
  } catch (err) {
    await showToast({
      style: Toast.Style.Failure,
      title: 'Failed to toggle recording',
      message: err instanceof Error ? err.message : String(err),
    });
  }
}
