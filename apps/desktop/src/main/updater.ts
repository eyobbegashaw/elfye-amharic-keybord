import { app } from 'electron';

export interface UpdateCheckResult {
  currentVersion: string;
  latestVersion: string | null;
  updateAvailable: boolean;
  releaseUrl: string | null;
  releaseNotes: string | null;
  checkedAt: string;
  error?: string;
}

const GITHUB_RELEASE_URL = 'https://api.github.com/repos/elfye/elfye/releases/latest';

function compareSemver(a: string, b: string): number {
  const pa = a.replace(/^v/, '').split('.').map((n) => parseInt(n, 10) || 0);
  const pb = b.replace(/^v/, '').split('.').map((n) => parseInt(n, 10) || 0);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const da = pa[i] ?? 0;
    const db = pb[i] ?? 0;
    if (da > db) return 1;
    if (da < db) return -1;
  }
  return 0;
}

export async function checkForUpdates(): Promise<UpdateCheckResult> {
  const currentVersion = app.getVersion() || '1.0.0';
  const checkedAt = new Date().toISOString();

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(GITHUB_RELEASE_URL, {
      headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'Elfye-Desktop' },
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (!response.ok) {
      return {
        currentVersion,
        latestVersion: null,
        updateAvailable: false,
        releaseUrl: null,
        releaseNotes: null,
        checkedAt,
        error: `Release server returned HTTP ${response.status}`,
      };
    }

    const data = (await response.json()) as {
      tag_name?: string;
      html_url?: string;
      body?: string;
    };

    const latestVersion = data.tag_name?.replace(/^v/, '') ?? currentVersion;
    const updateAvailable = compareSemver(latestVersion, currentVersion) > 0;

    return {
      currentVersion,
      latestVersion,
      updateAvailable,
      releaseUrl: data.html_url ?? null,
      releaseNotes: data.body ?? null,
      checkedAt,
    };
  } catch (err) {
    return {
      currentVersion,
      latestVersion: null,
      updateAvailable: false,
      releaseUrl: null,
      releaseNotes: null,
      checkedAt,
      error: err instanceof Error ? err.message : 'Unable to reach update server (offline).',
    };
  }
}
