import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import type { VoxtypeStatus } from '../types';

const execFileAsync = promisify(execFile);

async function runVoxtype(args: string[]): Promise<string> {
  try {
    const { stdout } = await execFileAsync('voxtype', args);
    return stdout.trim();
  } catch (error) {
    const err = error as NodeJS.ErrnoException & {
      stdout?: string;
      stderr?: string;
    };
    if (err.code === 'ENOENT') {
      throw new Error('voxtype not found. Is Voxtype installed?');
    }
    throw new Error(err.stderr?.trim() || err.stdout?.trim() || err.message);
  }
}

export async function getStatus(): Promise<VoxtypeStatus> {
  const raw = await runVoxtype(['status', '--format', 'json', '--extended']);
  return JSON.parse(raw);
}

export async function startRecording(): Promise<void> {
  await runVoxtype(['record', 'start']);
}

export async function stopRecording(): Promise<void> {
  await runVoxtype(['record', 'stop']);
}

export async function toggleRecording(): Promise<void> {
  await runVoxtype(['record', 'toggle']);
}

export async function cancelRecording(): Promise<void> {
  await runVoxtype(['record', 'cancel']);
}

export async function checkForUpdate(): Promise<string> {
  return runVoxtype(['check-update']);
}
