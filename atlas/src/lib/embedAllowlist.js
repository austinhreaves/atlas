const ALLOWED_HOSTS = new Set(['phet.colorado.edu'])

export function validateEmbedUrl(rawUrl) {
  if (typeof rawUrl !== 'string' || rawUrl.trim().length === 0) {
    return { ok: false, reason: 'URL must be a non-empty string.' }
  }

  let parsed
  try {
    parsed = new URL(rawUrl)
  } catch {
    return { ok: false, reason: 'URL must be a valid absolute URL.' }
  }

  if (parsed.protocol !== 'https:') {
    return { ok: false, reason: 'Only HTTPS embeds are allowed.' }
  }

  if (!ALLOWED_HOSTS.has(parsed.hostname)) {
    return { ok: false, reason: `Host is not allowlisted: ${parsed.hostname}` }
  }

  return { ok: true, normalizedUrl: parsed.toString() }
}

export function isEmbedUrlAllowed(rawUrl) {
  return validateEmbedUrl(rawUrl).ok
}

