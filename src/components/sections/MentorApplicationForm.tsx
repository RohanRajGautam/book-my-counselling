'use client'

import { useRef, useState, useMemo } from 'react'
import { ChevronDown, Search, UploadCloud } from 'lucide-react'

const FIELDS = ['Technology', 'Business', 'Design', 'Healthcare', 'Marketing', 'Something']

export default function MentorApplicationForm() {
  const [form, setForm] = useState({ fullName: '', linkedinUrl: '' })
  const [field, setField] = useState('Technology')
  const [fieldQuery, setFieldQuery] = useState('Technology')
  const [isFieldOpen, setIsFieldOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const fileInputRef = useRef<HTMLInputElement>(null)

  const filteredFields = useMemo(
    () => FIELDS.filter((f) => f.toLowerCase().includes(fieldQuery.toLowerCase())),
    [fieldQuery]
  )

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!form.fullName.trim()) newErrors.fullName = 'Full name is required'
    if (!/^https?:\/\/(www\.)?linkedin\.com\/.+$/i.test(form.linkedinUrl)) {
      newErrors.linkedinUrl = 'Invalid LinkedIn URL'
    }
    if (!file) {
      newErrors.cv = 'CV is required'
    } else if (file.size > 5 * 1024 * 1024) {
      newErrors.cv = 'Max 5MB file size'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      console.log({ ...form, field, file })
    }
  }

  return (
    <section className="min-h-screen bg-[#f8f9ff] px-4 py-30">
      <form
        onSubmit={handleSubmit}
        className="mx-auto w-full max-w-[520px] rounded-lg bg-white px-7 py-10 shadow-[0_18px_45px_rgba(18,28,42,0.08)] sm:px-8"
      >
        <div className="mb-6 text-center">
          <h1 className="font-[family-name:var(--font-headline)] text-[34px] font-bold text-[#121c2a] sm:text-[40px]">
            Apply to join our Mentor Community
          </h1>
          <p className="mx-auto mt-5 max-w-[390px] text-base text-[#737686]">
            Share your expertise and guide the next generation of professionals.
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-bold text-[#1f2533]">Full Name</label>
            <input
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              className="h-12 w-full rounded-md border border-[#cfd4df] px-4 outline-none focus:border-[#004ac6] focus:ring-2 focus:ring-[#004ac6]/20"
            />
            {errors.fullName && <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-[#1f2533]">LinkedIn URL</label>
            <input
              value={form.linkedinUrl}
              onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })}
              className="h-12 w-full rounded-md border border-[#cfd4df] px-4 outline-none focus:border-[#004ac6] focus:ring-2 focus:ring-[#004ac6]/20"
            />
            {errors.linkedinUrl && (
              <p className="mt-1 text-sm text-red-500">{errors.linkedinUrl}</p>
            )}
          </div>

          <div className="relative">
            <label className="mb-2 block text-sm font-bold text-[#1f2533]">Field of Interest</label>
            <div className="relative">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#737686]" />
              <input
                value={fieldQuery}
                onFocus={() => setIsFieldOpen(true)}
                onBlur={() => setTimeout(() => setIsFieldOpen(false), 200)}
                onChange={(e) => {
                  setFieldQuery(e.target.value)
                  setIsFieldOpen(true)
                }}
                className="h-12 w-full rounded-md border border-[#cfd4df] px-10 outline-none focus:border-[#004ac6] focus:ring-2 focus:ring-[#004ac6]/20"
              />
              <button
                type="button"
                onClick={() => setIsFieldOpen(!isFieldOpen)}
                className="absolute top-1/2 right-3 -translate-y-1/2"
              >
                <ChevronDown className={`h-4 w-4 transition ${isFieldOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {isFieldOpen && (
              <div className="absolute z-10 mt-2 max-h-48 w-full overflow-auto rounded-lg border border-[#cfd4df] bg-white p-1 shadow-lg">
                {filteredFields.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      setField(item)
                      setFieldQuery(item)
                      setIsFieldOpen(false)
                    }}
                    className={`h-10 w-full rounded-md px-3 text-left text-sm ${field === item ? 'bg-[#eef2f7] font-semibold text-[#1f2533]' : 'text-[#4b4f5c] hover:bg-[#f6f8fc]'}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-[#1f2533]">CV Upload</label>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault()
                setFile(e.dataTransfer.files?.[0] || null)
              }}
              className="flex h-[180px] w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#cfd4df] bg-[#fbfcff] transition hover:border-[#004ac6]"
            >
              <UploadCloud className="mb-3 h-8 w-8 text-[#737686]" />
              <span className="px-4 text-sm text-[#656b78]">
                {file ? file.name : 'Drag and drop your CV here, or click to select'}
              </span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="hidden"
            />
            {errors.cv && <p className="mt-2 text-center text-sm text-red-500">{errors.cv}</p>}
          </div>

          <button
            type="submit"
            className="h-14 w-full rounded-lg bg-[#1557d6] text-base font-bold text-white shadow-md transition hover:bg-[#0f49bd]"
          >
            Submit Application
          </button>
        </div>
      </form>
    </section>
  )
}
