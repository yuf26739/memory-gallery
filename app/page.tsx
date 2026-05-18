'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type MediaItem = {
  id: number
  media_url: string
  media_type: 'image' | 'video'
}

export default function HomePage() {
  const router = useRouter()

  const [mediaList, setMediaList] = useState<MediaItem[]>([])
  const [current, setCurrent] = useState<MediaItem | null>(null)

  // 检查登录
  useEffect(() => {
    checkUser()
  }, [])

  // 获取媒体
  useEffect(() => {
    fetchMedia()
  }, [])

  // 随机切换背景
  useEffect(() => {
    if (!mediaList.length) return

    const randomItem =
      mediaList[Math.floor(Math.random() * mediaList.length)]

    setCurrent(randomItem)

    // 图片5秒切换
    if (randomItem.media_type === 'image') {
      const timer = setTimeout(() => {
        const next =
          mediaList[Math.floor(Math.random() * mediaList.length)]

        setCurrent(next)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [mediaList, current])

  // 检查用户是否登录
  const checkUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push('/login')
    }
  }

  // 获取媒体
  const fetchMedia = async () => {
    const { data } = await supabase
      .from('media')
      .select('*')

    if (data) {
      setMediaList(data)
    }
  }

  // 随机跳转
  const handleRandomJump = () => {
    if (!mediaList.length) return

    const random =
      mediaList[Math.floor(Math.random() * mediaList.length)]

    window.location.href = `/media/${random.id}`
  }

  return (
    <main className="relative h-screen overflow-hidden bg-black text-white">

      {/* 背景 */}
      <div className="absolute inset-0">
        {current?.media_type === 'image' ? (
          <img
            src={current.media_url}
            className="
              w-full
              h-full
              object-cover
              blur-2xl
              scale-110
              opacity-50
              transition-all
              duration-1000
            "
          />
        ) : (
          <video
            src={current?.media_url}
            autoPlay
            muted
            onEnded={() => {
              const next =
                mediaList[
                  Math.floor(Math.random() * mediaList.length)
                ]

              setCurrent(next)
            }}
            className="
              w-full
              h-full
              object-cover
              blur-2xl
              scale-110
              opacity-50
            "
          />
        )}

        {/* 黑色遮罩 */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* 中间内容 */}
      <div
        className="
          relative
          z-10
          h-full
          flex
          flex-col
          items-center
          justify-center
        "
      >
        {/* 标题 */}
        <h1
          className="
            text-5xl
            md:text-7xl
            font-black
            tracking-widest
            mb-10
          "
        >
          史诗雷霆秘密相册
        </h1>

        {/* 扭蛋按钮 */}
        <button
          onClick={handleRandomJump}
          className="
            group
            relative
            w-44
            h-44
            rounded-full
            bg-white/10
            backdrop-blur-2xl
            border
            border-white/20
            shadow-2xl
            hover:scale-110
            transition-all
            duration-500
          "
        >
          <div
            className="
              absolute
              inset-0
              rounded-full
              bg-white/10
              blur-xl
              opacity-50
            "
          />

          <div
            className="
              relative
              z-10
              h-full
              flex
              items-center
              justify-center
              text-2xl
              font-bold
            "
          >
            戳他打开
          </div>
        </button>
      </div>

      {/* 左下管理员 */}
      <Link
        href="/admin"
        className="
          fixed
          left-5
          bottom-5
          z-20
          px-5
          py-3
          rounded-full
          bg-white/10
          backdrop-blur-xl
          border border-white/20
          hover:bg-white/20
          transition
        "
      >
        管理员
      </Link>

      {/* 右下相册 */}
      <Link
        href="/gallery"
        className="
          fixed
          right-5
          bottom-5
          z-20
          px-5
          py-3
          rounded-full
          bg-white/10
          backdrop-blur-xl
          border border-white/20
          hover:bg-white/20
          transition
        "
      >
        相册库
      </Link>
    </main>
  )
}