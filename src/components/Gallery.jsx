import { useState, useEffect, useRef } from 'react'
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

function CameraIcon() {
  return (
    <svg className="w-8 h-8 text-[#0C447C]/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
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

export default function Gallery() {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  // mode: 'idle' | 'password' | 'upload'
  // If the device verified within the last 24h, go straight to upload on "Add Photo"
  const [verified, setVerified] = useState(() => isVerified())
  const [mode, setMode] = useState('idle')
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState(false)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [caption, setCaption] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState(null) // photo id awaiting confirmation
  const [deleting, setDeleting] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    async function diagnose() {
      console.log('[Gallery] VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL)
      console.log('[Gallery] ANON_KEY prefix (first 20 chars):', import.meta.env.VITE_SUPABASE_ANON_KEY?.slice(0, 20))
      console.log('[Gallery] BUCKET constant:', BUCKET)
      const { data: buckets, error } = await supabase.storage.listBuckets()
      if (error) {
        console.error('[Gallery] listBuckets error:', error)
      } else {
        console.log('[Gallery] available buckets:', buckets.map(b => `"${b.name}" (id: ${b.id})`))
      }
    }
    diagnose()
    fetchPhotos()
  }, [])

  // Clean up object URL when preview changes or component unmounts
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
      // Unique filename: timestamp + sanitised original name
      const ext = file.name.split('.').pop().toLowerCase()
      const filename = `${Date.now()}.${ext}`

      console.log('[Gallery] uploading to bucket:', BUCKET, 'filename:', filename)

      const { data: storageData, error: storageErr } = await supabase.storage
        .from(BUCKET)
        .upload(filename, file, { contentType: file.type, upsert: false })
      console.log('[Gallery] storage result:', { storageData, storageErr })
      if (storageErr) throw storageErr

      const { data: { publicUrl } } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(filename)
      console.log('[Gallery] public URL:', publicUrl)

      const { data: dbData, error: dbErr } = await supabase
        .from(TABLE)
        .insert({ photo_url: publicUrl, caption: caption.trim() || null })
      console.log('[Gallery] db insert result:', { dbData, dbErr })
      if (dbErr) throw dbErr

      // Reset and refresh
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
      // Extract the storage filename from the public URL
      // URL format: .../storage/v1/object/public/rps-gallery/<filename>
      const filename = photo.photo_url.split('/').pop()
      const { error: storageErr } = await supabase.storage.from(BUCKET).remove([filename])
      if (storageErr) console.error('[Gallery] storage delete error:', storageErr)

      const { error: dbErr } = await supabase.from(TABLE).delete().eq('id', photo.id)
      if (dbErr) throw dbErr

      setConfirmDeleteId(null)
      await fetchPhotos()
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

  return (
    <section className="mt-2">
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
          <button
            onClick={cancel}
            className="text-sm font-medium text-gray-500 hover:text-gray-700"
          >
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

          {/* File picker — accept="image/*" lets iPhone choose camera or library */}
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

          {/* Image preview */}
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-full max-h-48 object-cover rounded-lg border border-gray-100"
            />
          )}

          {/* Caption */}
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

          {uploadError && (
            <p className="text-xs text-red-500 font-medium">{uploadError}</p>
          )}

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
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {photos.map((photo) => (
            <div key={photo.id} className="relative rounded-xl overflow-hidden bg-white border border-gray-100 shadow-sm">
              <img
                src={photo.photo_url}
                alt={photo.caption ?? 'Gallery photo'}
                className="w-full aspect-square object-cover"
                loading="lazy"
              />
              {photo.caption && (
                <p className="text-xs text-gray-600 px-2 py-1.5 leading-snug">{photo.caption}</p>
              )}

              {/* Delete button — only shown to verified users */}
              {verified && confirmDeleteId !== photo.id && (
                <button
                  onClick={() => setConfirmDeleteId(photo.id)}
                  aria-label="Delete photo"
                  className="absolute top-1.5 right-1.5 w-7 h-7 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                >
                  <TrashIcon />
                </button>
              )}

              {/* Confirmation overlay */}
              {confirmDeleteId === photo.id && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/60 rounded-xl p-2">
                  <p className="text-white text-xs font-semibold text-center leading-tight">
                    Delete this photo?
                  </p>
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
          ))}
        </div>
      )}
    </section>
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
