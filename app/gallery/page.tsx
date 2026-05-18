'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

type MediaItem = {
  id: number
  title: string
  media_url: string
  media_type: 'image' | 'video'
  taken_time: string
  location: string
  keywords: string[]
}

export default function GalleryPage() {
  const [media, setMedia] = useState<MediaItem[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchMedia()
  }, [])

  const fetchMedia = async () => {
    const { data } = await supabase
      .from('media')
      .select('*')
      .order('taken_time', { ascending: false })

    if (data) {
      setMedia(data)
    }
  }

  // 搜索过滤
  const filteredMedia = media.filter((item) => {
    const text =
      `
      ${item.title}
      ${item.location}
      ${item.keywords?.join(' ')}
      `
        .toLowerCase()

    return text.includes(search.toLowerCase())
  })

  return (
    <main className="min-h-screen bg-black text-white">
      
      {/* 背景 */}
      <div className="fixed inset-0 bg-gradient-to-br from-zinc-900 via-black to-zinc-950" />

      {/* 顶部 */}
      <div
        className="
          sticky
          top-0
          z-50
          backdrop-blur-2xl
          bg-black/30
          border-b
          border-white/10
        "
      >
        <div
          className="
            max-w-7xl
            mx-auto
            px-4
            py-4
            flex
            flex-col
            md:flex-row
            gap-4
            items-center
            justify-between
          "
        >
          {/* 标题 */}
          <h1
            className="
              text-3xl
              md:text-4xl
              font-black
              tracking-widest
            "
          >
            相册
          </h1>

          {/* 搜索 */}
          <input
            type="text"
            placeholder="搜索地点 / 标题 / 关键词"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              w-full
              md:w-96
              px-5
              py-3
              rounded-2xl
              bg-white/10
              backdrop-blur-xl
              border
              border-white/10
              outline-none
              focus:border-white/30
              transition
            "
          />

          {/* 返回首页 */}
          <Link
            href="/"
            className="
              px-5
              py-3
              rounded-2xl
              bg-white/10
              border
              border-white/10
              backdrop-blur-xl
              hover:bg-white/20
              transition
            "
          >
            返回首页
          </Link>
        </div>
      </div>

      {/* 内容 */}
      <div
        className="
          relative
          z-10
          max-w-7xl
          mx-auto
          px-4
          py-10
        "
      >
        {/* 瀑布流 */}
        <div
          className="
            columns-1
            sm:columns-2
            lg:columns-3
            xl:columns-4
            gap-5
            space-y-5
          "
        >
          {filteredMedia.map((item) => (
            <Link
              key={item.id}
              href={`/media/${item.id}`}
              className="
                group
                relative
                block
                overflow-hidden
                rounded-3xl
                bg-white/5
                border
                border-white/10
                backdrop-blur-xl
                break-inside-avoid
              "
            >
              {/* 图片 */}
              {item.media_type === 'image' ? (
                <img
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                  src={item.media_url}
                  loading="lazy"
                  className="
                    w-full
                    object-cover
                    transition-all
                    duration-700
                    group-hover:scale-105
                  "
                />
              ) : (
                <video
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                  src={item.media_url}
                  muted
                  autoPlay
                  loop
                  playsInline
                  className="
                    w-full
                    object-cover
                    transition-all
                    duration-700
                    group-hover:scale-105
                  "
                />
              )}

              {/* 遮罩 */}
              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-t
                  from-black/80
                  via-black/10
                  to-transparent
                  opacity-0
                  group-hover:opacity-100
                  transition
                  duration-500
                "
              />

              {/* 信息 */}
              <div
                className="
                  absolute
                  bottom-0
                  left-0
                  right-0
                  p-5
                  translate-y-10
                  opacity-0
                  group-hover:translate-y-0
                  group-hover:opacity-100
                  transition-all
                  duration-500
                "
              >
                <h2 className="text-xl font-bold">
                  {item.title || '未命名'}
                </h2>

                <p className="text-sm text-white/70 mt-1">
                  {item.location || '未知地点'}
                </p>

                <p className="text-xs text-white/50 mt-2">
                  {item.taken_time
                    ? new Date(item.taken_time).toLocaleDateString()
                    : ''}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* 空状态 */}
        {!filteredMedia.length && (
          <div className="text-center py-32 text-white/40 text-xl">
            没有找到内容
          </div>
        )}
      </div>
    </main>
  )
}