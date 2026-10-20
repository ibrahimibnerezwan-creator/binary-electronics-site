// Turso's HTTP endpoint sometimes drops a pooled socket (ECONNRESET / "socket hang up") under bursts,
// which used to surface as a failed page render. Replay such failures, but ONLY for pure reads:
// a dropped connection can arrive after the server already ran a write, so writes are never replayed.
const TRANSIENT = new Set(['ECONNRESET', 'EPIPE', 'ETIMEDOUT', 'UND_ERR_SOCKET'])
const ATTEMPTS = 3

// Hrana hands us a Request-like object. Its class can differ from ours once bundled, so only its plain fields are used.
type ReqLike = { url: string; method: string; headers: Headers; text(): Promise<string> }
type Send = (url: string, init: { method: string; headers: Record<string, string>; body?: string }) => Promise<Response>

const isTransient = (e: unknown) => {
  const err = e as { code?: string; cause?: { code?: string } } | undefined
  return TRANSIENT.has(err?.code ?? '') || TRANSIENT.has(err?.cause?.code ?? '')
}

// Hrana pipeline body: { requests: [{ type: 'execute', stmt: { sql } }, { type: 'close' }, ...] }
const isReadOnly = (body: string) => {
  try {
    const { requests } = JSON.parse(body) as { requests: { type: string; stmt?: { sql?: string } }[] }
    const stmts = requests.filter(r => r.type !== 'close')
    return stmts.length > 0 && stmts.every(r => r.type === 'execute' && /^\s*select\b/i.test(r.stmt?.sql ?? ''))
  } catch { return false }
}

export function retryReads(send: Send = (url, init) => fetch(url, init), backoffMs = 40) {
  return async (req: ReqLike): Promise<Response> => {
    const body = await req.text()
    const init = { method: req.method, headers: Object.fromEntries(req.headers.entries()), body: body || undefined }
    const readOnly = isReadOnly(body)
    for (let attempt = 1; ; attempt++) {
      try { return await send(req.url, init) }
      catch (e) {
        if (!readOnly || attempt >= ATTEMPTS || !isTransient(e)) throw e
        await new Promise(r => setTimeout(r, backoffMs * attempt))
      }
    }
  }
}
