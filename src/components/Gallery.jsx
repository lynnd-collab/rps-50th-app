import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const GALLERY_PASSWORD = 'rps50'
const BUCKET = 'rps-gallery'
const TABLE = 'rps_photos'
const AUTH_KEY = 'rps_gallery_auth'
const AUTH_TTL = 86_400_000 // 24 hours in ms

function isVerified() {
  try {
    const stored = localStorage.getItem(AUTH_KEY)
    if (!stored) return false
    const { verified, timestamp } = JSON.parse(stored)
    return verified && Date.now() - timestamp < AUTH_TTL
  } catch {
    return false
  }
}

function saveVerified() {
  localStorage.setItem(AUTH_KEY, JSON.stringify({ verified: true, timestamp: Date.now() }))
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function CameraIcon() {
  return (
    <svg className="w-8 h-8 text-[#0C447C]/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

function CameraIcon2() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

function ChevronLeftIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
    </svg>
  )
}

function ChevronRightIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
    </svg>
  )
}

function Spinner() {
  return (
    <div className="flex justify-center py-10">
      <div className="w-7 h-7 border-2 border-[#0C447C]/20 border-t-[#0C447C] rounded-full animate-spin" />
    </div>
  )
}

// ─── Lightbox ─────────────────────────────────────────────────────────────────

function Lightbox({ photos, index, onClose, onPrev, onNext }) {
  const photo = photos[index]
  const touchStartX = useRef(null)
  const touchStartY = useRef(null)

  // Keyboard navigation
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape')      onClose()
      else if (e.key === 'ArrowLeft')  onPrev()
      else if (e.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, onPrev, onNext])

  // Lock body scroll while open
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  function handleTouchStart(e) {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }

  function handleTouchEnd(e) {
    if (touchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    const dy = e.changedTouches[0].clientY - touchStartY.current
    // Only swipe if more horizontal than vertical and past threshold
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      dx < 0 ? onNext() : onPrev()
    }
    touchStartX.current = null
    touchStartY.current = null
  }

  return (
    // Backdrop — click outside photo to close
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/85"
      style={{ zIndex: 200 }}
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
      >
        <XIcon />
      </button>

      {/* Prev arrow */}
      {photos.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev() }}
          aria-label="Previous photo"
          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
        >
          <ChevronLeftIcon />
        </button>
      )}

      {/* Photo + caption — stopPropagation so clicking photo doesn't close */}
      <div
        className="flex flex-col items-center w-full px-14"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={photo.photo_url}
          alt={photo.caption ?? 'Gallery photo'}
          className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl"
        />
        {photo.caption && (
          <p className="text-white text-sm mt-3 text-center max-w-xs leading-snug px-2">
            {photo.caption}
          </p>
        )}
      </div>

      {/* Next arrow */}
      {photos.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext() }}
          aria-label="Next photo"
          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
        >
          <ChevronRightIcon />
        </button>
      )}

      {/* Counter */}
      {photos.length > 1 && (
        <p className="absolute bottom-5 text-white/50 text-xs font-medium select-none">
          {index + 1} / {photos.length}
        </p>
      )}
    </div>
  )
}

// ─── PhotoCard ────────────────────────────────────────────────────────────────

function PhotoCard({ photo, index, confirmDeleteId, setConfirmDeleteId, setLightboxIndex, handleDelete, deleting }) {
  return (
    <div className="relative rounded-xl overflow-hidden bg-white border border-gray-100 shadow-sm">
      <img
        src={photo.photo_url}
        alt={photo.caption ?? 'Gallery photo'}
        className="w-full aspect-square object-cover cursor-pointer"
        loading="lazy"
        onClick={() => confirmDeleteId !== photo.id && setLightboxIndex(index)}
      />
      {photo.caption && (
        <p className="text-xs text-gray-600 px-2 py-1.5 leading-snug">{photo.caption}</p>
      )}
      {confirmDeleteId !== photo.id && (
        <button
          onClick={() => setConfirmDeleteId(photo.id)}
          aria-label="Delete photo"
          className="absolute top-1.5 right-1.5 w-7 h-7 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
        >
          <TrashIcon />
        </button>
      )}
      {confirmDeleteId === photo.id && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/60 rounded-xl p-2">
          <p className="text-white text-xs font-semibold text-center leading-tight">Delete this photo?</p>
          <div className="flex gap-2">
            <button
              onClick={() => handleDelete(photo)}
              disabled={deleting}
              className="px-3 py-1 text-xs font-bold bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors"
            >
              {deleting ? '…' : 'Yes'}
            </button>
            <button
              onClick={() => setConfirmDeleteId(null)}
              disabled={deleting}
              className="px-3 py-1 text-xs font-bold bg-white text-gray-700 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors"
            >
              No
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Gallery ──────────────────────────────────────────────────────────────────

export default function Gallery() {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [verified, setVerified] = useState(() => isVerified())
  // mode: 'idle' | 'password' | 'upload'
  const [mode, setMode] = useState('idle')
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState(false)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [caption, setCaption] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const fileInputRef = useRef(null)
  const gridScrollRef = useRef(null)
  const [gridPage, setGridPage] = useState(0)

  const pageCount = Math.ceil(photos.length / 2)

  function scrollToPage(p) {
    if (!gridScrollRef.current) return
    gridScrollRef.current.scrollTo({ left: p * gridScrollRef.current.clientWidth, behavior: 'smooth' })
    setGridPage(p)
  }

  useEffect(() => {
    async function diagnose() {
      console.log('[Gallery] VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL)
      console.log('[Gallery] ANON_KEY prefix (first 20 chars):', import.meta.env.VITE_SUPABASE_ANON_KEY?.slice(0, 20))
      console.log('[Gallery] BUCKET constant:', BUCKET)

      // Auth state diagnostics
      const raw = localStorage.getItem(AUTH_KEY)
      console.log('[Gallery] localStorage raw value for', AUTH_KEY, ':', raw)
      try {
        if (raw) {
          const parsed = JSON.parse(raw)
          const age = Date.now() - parsed.timestamp
          console.log('[Gallery] auth parsed:', parsed)
          console.log('[Gallery] age (ms):', age, '| TTL (ms):', AUTH_TTL, '| still valid:', age < AUTH_TTL)
        }
      } catch (e) {
        console.warn('[Gallery] failed to parse auth value:', e)
      }
      console.log('[Gallery] isVerified() result:', isVerified())
      console.log('[Gallery] verified state (React):', verified)

      const { data: buckets, error } = await supabase.storage.listBuckets()
      if (error) console.error('[Gallery] listBuckets error:', error)
      else console.log('[Gallery] available buckets:', buckets.map(b => `"${b.name}" (id: ${b.id})`))
    }
    diagnose()
    fetchPhotos()
  }, [])

  useEffect(() => {
    return () => { if (preview) URL.revokeObjectURL(preview) }
  }, [preview])

  async function fetchPhotos() {
    setLoading(true)
    const { data, error } = await supabase
      .from(TABLE)
      .select('id, photo_url, caption, created_at')
      .order('created_at', { ascending: false })
    if (!error) setPhotos(data ?? [])
    setLoading(false)
  }

  function handlePasswordSubmit(e) {
    e.preventDefault()
    if (password === GALLERY_PASSWORD) {
      saveVerified()
      setVerified(true)
      setMode('upload')
      setPasswordError(false)
      setPassword('')
    } else {
      setPasswordError(true)
    }
  }

  function handleFileChange(e) {
    const chosen = e.target.files?.[0]
    if (!chosen) return
    setFile(chosen)
    if (preview) URL.revokeObjectURL(preview)
    setPreview(URL.createObjectURL(chosen))
  }

  async function handleUpload(e) {
    e.preventDefault()
    if (!file) return
    setUploading(true)
    setUploadError(null)
    try {
      const ext = file.name.split('.').pop().toLowerCase()
      const filename = `${Date.now()}.${ext}`
      console.log('[Gallery] uploading to bucket:', BUCKET, 'filename:', filename)
      const { data: storageData, error: storageErr } = await supabase.storage
        .from(BUCKET)
        .upload(filename, file, { contentType: file.type, upsert: false })
      console.log('[Gallery] storage result:', { storageData, storageErr })
      if (storageErr) throw storageErr

      const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(filename)
      console.log('[Gallery] public URL:', publicUrl)

      const { data: dbData, error: dbErr } = await supabase
        .from(TABLE)
        .insert({ photo_url: publicUrl, caption: caption.trim() || null })
      console.log('[Gallery] db insert result:', { dbData, dbErr })
      if (dbErr) throw dbErr

      setFile(null)
      setPreview(null)
      setCaption('')
      if (fileInputRef.current) fileInputRef.current.value = ''
      setMode('idle')
      await fetchPhotos()
    } catch (err) {
      console.error('[Gallery] upload error (full object):', err)
      setUploadError(err.message || 'Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  async function handleDelete(photo) {
    setDeleting(true)
    try {
      const { error: dbErr } = await supabase.from(TABLE).delete().eq('id', photo.id)
      if (dbErr) throw dbErr
      // Remove from local state immediately — no need to refetch
      setPhotos(prev => prev.filter(p => p.id !== photo.id))
      setConfirmDeleteId(null)
    } catch (err) {
      console.error('[Gallery] delete error:', err)
    } finally {
      setDeleting(false)
    }
  }

  function cancel() {
    setMode('idle')
    setPassword('')
    setPasswordError(false)
    setFile(null)
    setPreview(null)
    setCaption('')
    setUploadError(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const closeLightbox = useCallback(() => setLightboxIndex(null), [])
  const prevPhoto = useCallback(() =>
    setLightboxIndex(i => (i - 1 + photos.length) % photos.length), [photos.length])
  const nextPhoto = useCallback(() =>
    setLightboxIndex(i => (i + 1) % photos.length), [photos.length])

  return (
    <section className="mt-2">
      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          photos={photos}
          index={lightboxIndex}
          onClose={closeLightbox}
          onPrev={prevPhoto}
          onNext={nextPhoto}
        />
      )}

      {/* Section header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[#0C447C] text-lg font-bold">Gallery</h2>
        {mode === 'idle' && (
          <button
            onClick={() => setMode(verified ? 'upload' : 'password')}
            className="flex items-center gap-1.5 text-sm font-semibold text-white bg-[#0C447C] px-3 py-1.5 rounded-lg hover:bg-[#1a5a9e] active:bg-[#083460] transition-colors"
          >
            <CameraIcon2 />
            Add Photo
          </button>
        )}
        {mode !== 'idle' && (
          <button onClick={cancel} className="text-sm font-medium text-gray-500 hover:text-gray-700">
            Cancel
          </button>
        )}
      </div>

      {/* Password prompt */}
      {mode === 'password' && (
        <form
          onSubmit={handlePasswordSubmit}
          className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-4"
        >
          <p className="text-sm font-medium text-gray-700 mb-3">Enter password to add a photo:</p>
          <div className="flex gap-2">
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setPasswordError(false) }}
              placeholder="Password"
              autoFocus
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C447C]/30"
            />
            <button
              type="submit"
              className="bg-[#0C447C] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#1a5a9e] transition-colors"
            >
              Go
            </button>
          </div>
          {passwordError && (
            <p className="text-xs text-red-500 mt-2 font-medium">Incorrect password.</p>
          )}
        </form>
      )}

      {/* Upload form */}
      {mode === 'upload' && (
        <form
          onSubmit={handleUpload}
          className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-4 space-y-3"
        >
          <p className="text-sm font-semibold text-[#0C447C]">Add a photo to the gallery</p>
          <label className="block">
            <span className="text-xs font-medium text-gray-600 mb-1 block">Photo</span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required
              className="block w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#0C447C]/10 file:text-[#0C447C] hover:file:bg-[#0C447C]/20"
            />
          </label>
          {preview && (
            <img src={preview} alt="Preview" className="w-full max-h-48 object-cover rounded-lg border border-gray-100" />
          )}
          <label className="block">
            <span className="text-xs font-medium text-gray-600 mb-1 block">Caption (optional)</span>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Add a caption…"
              maxLength={200}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C447C]/30"
            />
          </label>
          {uploadError && <p className="text-xs text-red-500 font-medium">{uploadError}</p>}
          <button
            type="submit"
            disabled={uploading || !file}
            className="w-full bg-[#0C447C] text-white text-sm font-bold py-2.5 rounded-lg hover:bg-[#1a5a9e] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {uploading ? 'Uploading…' : 'Upload Photo'}
          </button>
        </form>
      )}

      {/* Photo grid */}
      {loading ? (
        <Spinner />
      ) : photos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <CameraIcon />
          <p className="text-sm font-medium text-[#0C447C]/50 mt-3">
            No photos yet — check back soon!
          </p>
        </div>
      ) : photos.length <= 4 ? (
        // Static 2-column grid for 4 or fewer photos
        <div className="grid grid-cols-2 gap-3">
          {photos.map((photo, i) => (
            <PhotoCard
              key={photo.id}
              photo={photo}
              index={i}
              confirmDeleteId={confirmDeleteId}
              setConfirmDeleteId={setConfirmDeleteId}
              setLightboxIndex={setLightboxIndex}
              handleDelete={handleDelete}
              deleting={deleting}
            />
          ))}
        </div>
      ) : (
        // Horizontally scrollable 2-at-a-time for 5+ photos
        <div className="relative">
          <div
            ref={gridScrollRef}
            className="flex overflow-x-auto snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            onScroll={(e) => {
              const el = e.currentTarget
              setGridPage(Math.round(el.scrollLeft / el.clientWidth))
            }}
          >
            {Array.from({ length: pageCount }).map((_, pi) => (
              <div key={pi} className="flex-shrink-0 w-full grid grid-cols-2 gap-3 snap-start pr-0">
                {photos.slice(pi * 2, pi * 2 + 2).map((photo, offset) => (
                  <PhotoCard
                    key={photo.id}
                    photo={photo}
                    index={pi * 2 + offset}
                    confirmDeleteId={confirmDeleteId}
                    setConfirmDeleteId={setConfirmDeleteId}
                    setLightboxIndex={setLightboxIndex}
                    handleDelete={handleDelete}
                    deleting={deleting}
                  />
                ))}
              </div>
            ))}
          </div>

          {/* Prev arrow */}
          {gridPage > 0 && (
            <button
              onClick={() => scrollToPage(gridPage - 1)}
              aria-label="Previous photos"
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-8 h-8 flex items-center justify-center rounded-full bg-white shadow border border-gray-100 text-[#0C447C] hover:bg-gray-50 transition-colors"
              style={{ zIndex: 10 }}
            >
              <ChevronLeftIcon />
            </button>
          )}

          {/* Next arrow */}
          {gridPage < pageCount - 1 && (
            <button
              onClick={() => scrollToPage(gridPage + 1)}
              aria-label="Next photos"
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 w-8 h-8 flex items-center justify-center rounded-full bg-white shadow border border-gray-100 text-[#0C447C] hover:bg-gray-50 transition-colors"
              style={{ zIndex: 10 }}
            >
              <ChevronRightIcon />
            </button>
          )}

          {/* Page dots */}
          <div className="flex justify-center gap-1.5 mt-3">
            {Array.from({ length: pageCount }).map((_, i) => (
              <button
                key={i}
                onClick={() => scrollToPage(i)}
                aria-label={`Page ${i + 1}`}
                className="w-1.5 h-1.5 rounded-full transition-colors"
                style={{ backgroundColor: i === gridPage ? '#0C447C' : '#d1d5db' }}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
