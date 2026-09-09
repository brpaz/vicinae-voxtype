import {
  Action,
  ActionPanel,
  Color,
  Icon,
  List,
  showToast,
  Toast,
} from '@vicinae/api';
import { useCallback, useEffect, useState } from 'react';
import type { VoxtypeStatus } from './types';
import {
  cancelRecording,
  getStatus,
  startRecording,
  stopRecording,
  toggleRecording,
} from './utils/voxtype';

const POLL_INTERVAL_MS = 2000;

function statusColor(cls: string): Color {
  if (cls === 'recording') return Color.Red;
  if (cls === 'idle') return Color.Green;
  return Color.Orange;
}

function statusIcon(cls: string): Icon {
  if (cls === 'recording') return Icon.CircleFilled;
  return Icon.Microphone;
}

export default function Command() {
  const [status, setStatus] = useState<VoxtypeStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      setStatus(await getStatus());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const timer = setInterval(refresh, POLL_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [refresh]);

  const run = useCallback(
    async (title: string, action: () => Promise<void>) => {
      try {
        await action();
        showToast({ style: Toast.Style.Success, title });
        await refresh();
      } catch (err) {
        showToast({
          style: Toast.Style.Failure,
          title: `Failed: ${title}`,
          message: err instanceof Error ? err.message : String(err),
        });
      }
    },
    [refresh]
  );

  if (error) {
    return (
      <List>
        <List.EmptyView
          icon={Icon.Warning}
          title="Could not reach Voxtype"
          description={error}
          actions={
            <ActionPanel>
              <Action
                title="Retry"
                icon={Icon.ArrowClockwise}
                onAction={refresh}
              />
            </ActionPanel>
          }
        />
      </List>
    );
  }

  const isRecording = status?.class === 'recording';

  return (
    <List isLoading={loading} navigationTitle="Voxtype Status">
      {status && (
        <List.Item
          title={isRecording ? 'Recording' : 'Idle'}
          subtitle={status.tooltip.split('\n')[0]}
          icon={{
            source: statusIcon(status.class),
            tintColor: statusColor(status.class),
          }}
          accessories={[
            { tag: { value: status.class, color: statusColor(status.class) } },
            ...(status.model ? [{ text: status.model }] : []),
            ...(status.backend ? [{ text: status.backend }] : []),
          ]}
          actions={
            <ActionPanel>
              {isRecording ? (
                <>
                  <Action
                    title="Stop and Transcribe"
                    icon={Icon.StopFilled}
                    onAction={() => run('Stopped recording', stopRecording)}
                  />
                  <Action
                    title="Cancel Recording"
                    icon={Icon.XMarkCircle}
                    style="destructive"
                    onAction={() => run('Recording cancelled', cancelRecording)}
                  />
                </>
              ) : (
                <Action
                  title="Start Recording"
                  icon={Icon.Microphone}
                  onAction={() => run('Recording started', startRecording)}
                />
              )}
              <Action
                title="Toggle Recording"
                icon={Icon.Switch}
                shortcut={{ modifiers: ['cmd'], key: 't' }}
                onAction={() => run('Recording toggled', toggleRecording)}
              />
              <Action
                title="Refresh"
                icon={Icon.ArrowClockwise}
                shortcut={{ modifiers: ['cmd'], key: 'r' }}
                onAction={refresh}
              />
            </ActionPanel>
          }
        />
      )}
    </List>
  );
}
