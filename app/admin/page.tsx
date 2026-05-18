'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { ADMIN_PASSWORD } from '@/lib/admin'

type MediaItem = {
  id: number
  title: string
  story: string
  location: string
  keywords: string[]
  media_url: string
  media_type: string
  taken_time: string
}

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(false)

  const [mediaList, setMediaList] = useState<MediaItem[]>([])

  const [title, setTitle] = useState('')
  const [story, setStory] = useState('')
  const [location, setLocation] = useState('')
  const [keywords, setKeywords] = useState('')
  const [takenTime, setTakenTime] = useState('')

  const [files, setFiles] = useState<File[]>([])

  const [uploading, setUploading] = useState(false)

  // 搜索
  const [search, setSearch] = useState('')

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsLogin(true)
      loadMedia()
    } else {
      alert('密码错误')
    }
  }

  const loadMedia = async () => {
    const { data, error } = await supabase
      .from('media')
      .select('*')
      .order('id', { ascending: false })

    if (!error && data) {
      setMediaList(data)
    }
  }

  useEffect(() => {
    if (isLogin) {
      loadMedia()
    }
  }, [isLogin])

  // 拖拽上传
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()

    const droppedFiles = Array.from(e.dataTransfer.files)

    setFiles((prev) => [...prev, ...droppedFiles])
  }

  // 选择文件
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files) return

    const selected = Array.from(e.target.files)

    setFiles((prev) => [...prev, ...selected])
  }

  // 批量上传
  const handleUpload = async () => {
    if (files.length === 0) {
      return alert('请选择文件')
    }

    setUploading(true)

    try {
      for (const file of files) {

        const fileExt =
          file.name.split('.').pop()

        const fileName =
          `${Date.now()}-${Math.random()}.${fileExt}`

        // 上传storage
        const { error: uploadError } =
          await supabase
            .storage
            .from('media')
            .upload(fileName, file)

        if (uploadError) {
          console.error(uploadError)
          continue
        }

        // 获取公开地址
        const { data: publicData } =
          supabase
            .storage
            .from('media')
            .getPublicUrl(fileName)

        const publicUrl =
          publicData.publicUrl

        // 写数据库
        const { error: dbError } =
          await supabase
            .from('media')
            .insert({
              title:
                title || file.name,

              story,

              location,

              keywords:
                keywords
                  .split(',')
                  .map(k => k.trim()),

              media_url: publicUrl,

              media_type:
                file.type.startsWith('video')
                  ? 'video'
                  : 'image',

              taken_time:
                takenTime || new Date()
            })

        if (dbError) {
          console.error(dbError)
        }
      }

      alert('上传完成')

      setFiles([])

      setTitle('')
      setStory('')
      setLocation('')
      setKeywords('')
      setTakenTime('')

      loadMedia()

    } catch (err) {
      console.error(err)
      alert('上传失败')
    } finally {
      setUploading(false)
    }
  }

  // 删除
  const handleDelete = async (
    item: MediaItem
  ) => {

    const ok = confirm(
      `确定永久删除《${item.title}》？`
    )

    if (!ok) return

    try {

      const fileName =
        item.media_url.split('/').pop()

      if (fileName) {
        await supabase
          .storage
          .from('media')
          .remove([fileName])
      }

      await supabase
        .from('media')
        .delete()
        .eq('id', item.id)

      loadMedia()

    } catch (err) {
      console.error(err)
      alert('删除失败')
    }
  }

  // 编辑
  const handleEdit = async (
    item: MediaItem
  ) => {

    const newTitle =
      prompt('新标题', item.title)

    if (newTitle === null) return

    const newStory =
      prompt('新故事', item.story)

    if (newStory === null) return

    await supabase
      .from('media')
      .update({
        title: newTitle,
        story: newStory
      })
      .eq('id', item.id)

    loadMedia()
  }

  // 搜索过滤
  const filteredMedia =
    mediaList.filter((item) => {

      const text = `
        ${item.title}
        ${item.story}
        ${item.location}
        ${item.keywords?.join(' ')}
        ${item.taken_time}
      `.toLowerCase()

      return text.includes(
        search.toLowerCase()
      )
    })

  // 登录页
  if (!isLogin) {
    return (
      <main className="p-10 max-w-md mx-auto space-y-4">

        <h1 className="text-3xl font-bold">
          管理员登录
        </h1>

        <input
          type="password"
          placeholder="请输入管理员密码"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="border p-3 rounded w-full"
        />

        <button
          onClick={handleLogin}
          className="bg-black text-white px-5 py-3 rounded w-full"
        >
          登录
        </button>

      </main>
    )
  }

  return (
    <main className="p-10 space-y-10">

      {/* 上传区 */}
      <div className="space-y-4">

        <h1 className="text-3xl font-bold">
          上传照片 / 视频
        </h1>

        <input
          type="text"
          placeholder="标题"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
          className="border p-3 rounded w-full"
        />

        <textarea
          placeholder="故事"
          value={story}
          onChange={(e) =>
            setStory(e.target.value)
          }
          className="border p-3 rounded w-full"
        />

        <input
          type="text"
          placeholder="地点"
          value={location}
          onChange={(e) =>
            setLocation(e.target.value)
          }
          className="border p-3 rounded w-full"
        />

        <input
          type="text"
          placeholder="关键词（逗号分隔）"
          value={keywords}
          onChange={(e) =>
            setKeywords(e.target.value)
          }
          className="border p-3 rounded w-full"
        />

        <input
          type="date"
          value={takenTime}
          onChange={(e) =>
            setTakenTime(e.target.value)
          }
          className="border p-3 rounded w-full"
        />

        {/* 拖拽区域 */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="
            border-2
            border-dashed
            rounded-xl
            p-10
            text-center
            bg-gray-50
          "
        >
          <p className="text-lg">
            拖拽照片/视频到这里
          </p>

          <p className="text-gray-500 mt-2">
            支持批量上传
          </p>

          <input
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleFileChange}
            className="mt-5"
          />
        </div>

        {/* 文件预览 */}
        <div className="grid md:grid-cols-5 gap-4">

          {files.map((file, index) => {

            const url =
              URL.createObjectURL(file)

            return (
              <div
                key={index}
                className="border rounded overflow-hidden"
              >

                {file.type.startsWith('image') ? (
                  <img
                    src={url}
                    className="w-full h-40 object-cover"
                  />
                ) : (
                  <video
                    src={url}
                    className="w-full h-40 object-cover"
                  />
                )}

                <div className="p-2 text-sm truncate">
                  {file.name}
                </div>

              </div>
            )
          })}

        </div>

        <button
          onClick={handleUpload}
          disabled={uploading}
          className="
            bg-blue-500
            text-white
            px-6
            py-3
            rounded-xl
          "
        >
          {uploading
            ? '上传中...'
            : `上传 ${files.length} 个文件`}
        </button>

      </div>

      {/* 搜索 */}
      <div className="space-y-4">

        <h2 className="text-3xl font-bold">
          内容管理
        </h2>

        <input
          type="text"
          placeholder="
搜索标题 / 地点 / 时间 / 关键词
"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="border p-3 rounded w-full"
        />

      </div>

      {/* 列表 */}
      <div className="
        grid
        md:grid-cols-3
        gap-6
      ">

        {filteredMedia.map((item) => (

          <div
            key={item.id}
            className="
              border
              rounded-xl
              overflow-hidden
              bg-white
            "
          >

            {item.media_type === 'image' ? (

              <img
                src={item.media_url}
                onError={(e) => {
                  e.currentTarget.style.display =
                    'none'
                }}
                className="
                  w-full
                  h-72
                  object-cover
                "
              />

            ) : (

              <video
                src={item.media_url}
                controls
                className="
                  w-full
                  h-72
                  object-cover
                "
              />

            )}

            <div className="p-4 space-y-2">

              <h3 className="font-bold text-xl">
                {item.title}
              </h3>

              <p className="text-gray-600">
                {item.story}
              </p>

              <p className="text-sm text-gray-400">
                {item.location}
              </p>

              <p className="text-sm text-gray-400">
                {item.taken_time}
              </p>

              <div className="
                flex
                gap-3
                pt-2
              ">

                <button
                  onClick={() =>
                    handleEdit(item)
                  }
                  className="
                    bg-yellow-500
                    text-white
                    px-4
                    py-2
                    rounded
                  "
                >
                  编辑
                </button>

                <button
                  onClick={() =>
                    handleDelete(item)
                  }
                  className="
                    bg-red-500
                    text-white
                    px-4
                    py-2
                    rounded
                  "
                >
                  删除
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

    </main>
  )
}