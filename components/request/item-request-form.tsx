"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { CheckCircle2, ImagePlus, Loader2, Send, X } from "lucide-react";
import { whatsappNumber } from "@/lib/commerce";
import { prepareRequestPhoto } from "@/lib/request-photo-client";

const MAX_PHOTOS = 3;

interface Picked {
  id: string;
  blob: Blob;
  preview: string;
}

interface Done {
  reference: string;
  phone: string;
  whatsapp: string;
}

export function ItemRequestForm({ settings }: { settings: Record<string, string> }) {
  const [photos, setPhotos] = useState<Picked[]>([]);
  const [status, setStatus] = useState<"idle" | "preparing" | "sending">("idle");
  const [error, setError] = useState("");
  const [photoError, setPhotoError] = useState("");
  const [done, setDone] = useState<Done | null>(null);
  const requestId = useRef("");
  const latest = useRef<Picked[]>([]);
  const heading = useRef<HTMLHeadingElement>(null);
  const busy = status !== "idle";

  useEffect(() => {
    latest.current = photos;
  }, [photos]);
  useEffect(() => () => latest.current.forEach((photo) => URL.revokeObjectURL(photo.preview)), []);
  useEffect(() => {
    if (done) heading.current?.focus();
  }, [done]);

  async function pick(event: ChangeEvent<HTMLInputElement>) {
    const chosen = Array.from(event.currentTarget.files ?? []);
    event.currentTarget.value = ""; // lets the same photo be chosen again after removing it
    if (!chosen.length) return;
    setPhotoError("");
    const room = MAX_PHOTOS - photos.length;
    if (chosen.length > room) setPhotoError(`You can send up to ${MAX_PHOTOS} photos. The extra photos were not added.`);
    setStatus("preparing");
    const added: Picked[] = [];
    for (const file of chosen.slice(0, room)) {
      try {
        const blob = await prepareRequestPhoto(file);
        added.push({ id: crypto.randomUUID(), blob, preview: URL.createObjectURL(blob) });
      } catch (e) {
        setPhotoError(e instanceof Error ? e.message : "This photo could not be added.");
      }
    }
    setPhotos((current) => [...current, ...added].slice(0, MAX_PHOTOS));
    setStatus("idle");
  }

  function remove(id: string) {
    const gone = photos.find((photo) => photo.id === id);
    if (gone) URL.revokeObjectURL(gone.preview);
    setPhotos((current) => current.filter((photo) => photo.id !== id));
    setPhotoError("");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    if (!photos.length) {
      setError("Add at least one photo of the part.");
      return;
    }
    setError("");
    setStatus("sending");
    if (!requestId.current) requestId.current = crypto.randomUUID();
    const data = new FormData(event.currentTarget);
    data.set("requestId", requestId.current);
    photos.forEach((photo, index) => data.append("photo", photo.blob, `photo-${index + 1}.jpg`));
    try {
      const response = await fetch("/api/item-requests", { method: "POST", body: data });
      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.success) throw new Error(result?.error || "We could not send your request. Please try again.");
      const number = whatsappNumber(settings.whatsapp || settings.phone || "");
      const lines = [`Hello! I just sent a photo of a part I need through your website (${result.reference}).`, ...(result.photoUrls ?? [])];
      setDone({
        reference: result.reference,
        phone: String(data.get("phone") ?? ""),
        whatsapp: number ? `https://wa.me/${number}?text=${encodeURIComponent(lines.join("\n"))}` : "",
      });
      photos.forEach((photo) => URL.revokeObjectURL(photo.preview));
      setPhotos([]);
      requestId.current = "";
    } catch (e) {
      setError(e instanceof Error ? e.message : "We could not send your request. Please try again.");
    }
    setStatus("idle");
  }

  return (
    <div className="sf-contact-grid">
      <div>
        <div className="sf-page-head">
          <h1>
            Can’t find a part?
            <br />
            Send us a photo.
          </h1>
          <p lang="bn">ওয়েবসাইটে আপনার দরকারি পার্টস না পেলে তার ছবি পাঠান। আমরা দেখে আপনাকে জানিয়ে দেব।</p>
          <p>
            If a part isn’t listed on our website, send us a photo. We’ll check if we have it or can get it, and get
            back to you on your phone number.
          </p>
        </div>
        <ol className="sf-request-steps">
          <li>
            <span aria-hidden="true">1</span>
            Take a clear photo of the part. Include any numbers printed on it.
          </li>
          <li>
            <span aria-hidden="true">2</span>
            Add your name and phone number.
          </li>
          <li>
            <span aria-hidden="true">3</span>
            We check and reply to you.
          </li>
        </ol>
      </div>
      <div className="sf-contact-panel">
        {done ? (
          <div className="sf-request-done" role="status">
            <CheckCircle2 size={42} aria-hidden="true" />
            <h2 ref={heading} tabIndex={-1}>
              Thanks, we have your photo.
            </h2>
            <p lang="bn">ধন্যবাদ! আপনার ছবি পেয়েছি। আমরা দেখে আপনার ফোন নম্বরে যোগাযোগ করব।</p>
            <p>
              Your reference is <strong>{done.reference}</strong>. We’ll check and get back to you on {done.phone}.
            </p>
            {done.whatsapp && (
              <a className="sf-btn" href={done.whatsapp} target="_blank" rel="noopener noreferrer">
                Continue on WhatsApp
              </a>
            )}
            <button type="button" className="sf-btn sf-btn-secondary" onClick={() => setDone(null)}>
              Send another part
            </button>
          </div>
        ) : (
          <>
            <h2>Send your photos</h2>
            {error && (
              <p role="alert" className="sf-error">
                {error}
              </p>
            )}
            <form onSubmit={submit} className="sf-form">
              <div className="sf-field" role="group" aria-labelledby="request-photos">
                <span id="request-photos">
                  Photos of the part <small>(1 to {MAX_PHOTOS})</small>
                </span>
                <div className="sf-photo-grid">
                  {photos.map((photo, index) => (
                    <div key={photo.id} className="sf-photo-thumb">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={photo.preview} alt={`Photo ${index + 1} of the part`} />
                      <button type="button" className="sf-photo-remove" aria-label={`Remove photo ${index + 1}`} onClick={() => remove(photo.id)} disabled={busy}>
                        <X size={14} aria-hidden="true" />
                      </button>
                    </div>
                  ))}
                  {photos.length < MAX_PHOTOS && (
                    <label className="sf-photo-add">
                      <input type="file" accept="image/*" multiple onChange={pick} disabled={busy} />
                      {status === "preparing" ? <Loader2 size={22} className="animate-spin" aria-hidden="true" /> : <ImagePlus size={22} aria-hidden="true" />}
                      <span>{status === "preparing" ? "Preparing…" : photos.length ? "Add another" : "Add photos"}</span>
                    </label>
                  )}
                </div>
                {photoError && (
                  <p role="alert" className="sf-error">
                    {photoError}
                  </p>
                )}
              </div>
              <div className="sf-form-pair">
                <label className="sf-field">
                  Your name
                  <input name="name" autoComplete="name" required maxLength={100} placeholder="Full name" />
                </label>
                <label className="sf-field">
                  Phone / WhatsApp number
                  <input name="phone" type="tel" inputMode="tel" autoComplete="tel" required placeholder="01XXXXXXXXX" />
                </label>
              </div>
              <label className="sf-field">
                <span>
                  What is it? <small>(optional)</small>
                </span>
                <textarea name="note" rows={3} maxLength={1000} placeholder="Part number, name, or where you saw it" />
              </label>
              <input className="sf-hp" type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
              <button type="submit" className="sf-btn" disabled={busy || !photos.length}>
                {status === "sending" ? <Loader2 size={17} className="animate-spin" aria-hidden="true" /> : <Send size={17} aria-hidden="true" />}
                {status === "sending" ? "Sending…" : "Send photos"}
              </button>
              <p className="sf-results-note">
                We use your photo and number only to check availability and reply to you. Photos are resized before
                sending, and any location data is removed.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
