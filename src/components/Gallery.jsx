import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'

const GALLERY_PASSWORD = 'rps50'
const BUCKET = 'RPS-GALLERY'
const TABLE = 'rps_photos'

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
  const [mode, setMode] = useState('idle')
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState(false)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [caption, setCaption] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState(null)
  const fileInputRef = useRef(null)

  useEffect(() => { fetchPhotos() }, [])

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

      const { error: storageErr } = await supabase.storage
        .from(BUCKET)
        .upload(filename, file, { contentType: file.type, upsert: false })
      if (storageErr) throw storageErr

      const { data: { publicUrl } } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(filename)

      const { error: dbErr } = await supabase
        .from(TABLE)
        .insert({ photo_url: publicUrl, caption: caption.trim() || null })
      if (dbErr) throw dbErr

      // Reset and refresh
      setFile(null)
      setPreview(null)
      setCaption('')
      if (fileInputRef.current) fileInputRef.current.value = ''
      setMode('idle')
      await fetchPhotos()
    } catch (err) {
      setUploadError(err.message || 'Upload failed. Please try again.')
    } finally {
      setUploading(false)
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
            onClick={() => setMode('password')}
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
            <div key={photo.id} className="rounded-xl overflow-hidden bg-white border border-gray-100 shadow-sm">
              <img
                src={photo.photo_url}
                alt={photo.caption ?? 'Gallery photo'}
                className="w-full aspect-square object-cover"
                loading="lazy"
              />
              {photo.caption && (
                <p className="text-xs text-gray-600 px-2 py-1.5 leading-snug">{photo.caption}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

// Small camera icon for the button
function CameraIcon2() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}
