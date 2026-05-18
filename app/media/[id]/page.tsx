import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default async function MediaDetail({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const { data } = await supabase
    .from('media')
    .select('*')
    .eq('id', id)
    .single()

  if (!data) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        未找到内容
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">
      
      {/* 背景 */}
      <div
        className="fixed inset-0 bg-cover bg-center scale-110 blur-3xl opacity-30"
        style={{
          backgroundImage: `url(${data.media_url})`,
        }}
      />

      {/* 顶部按钮 */}
      <div className="fixed top-5 left-5 z-50 flex gap-3">
        <Link
          href="/gallery"
          className="
            px-5 py-2
            rounded-full
            backdrop-blur-xl
            bg-white/10
            border border-white/20
            hover:bg-white/20
            transition
          "
        >
          返回相册
        </Link>

        <Link
          href="/"
          className="
            px-5 py-2
            rounded-full
            backdrop-blur-xl
            bg-white/10
            border border-white/20
            hover:bg-white/20
            transition
          "
        >
          返回首页
        </Link>
      </div>

      {/* 主体 */}
      <div
        className="
          relative z-10
          min-h-screen
          flex
          flex-col
          items-center
          justify-center
          px-4
          py-24
        "
      >
        {/* 图片/视频区域 */}
        <div
          className="
            w-full
            max-w-7xl
            flex
            flex-col
            items-center
          "
        >
          {data.media_type === 'image' ? (
            <img
              src={data.media_url}
              alt={data.title}
              className="
                w-auto
                max-w-full
                max-h-[82vh]
                object-contain
                rounded-3xl
                shadow-2xl
              "
            />
          ) : (
            <video
              src={data.media_url}
              controls
              autoPlay
              className="
                w-full
                max-w-6xl
                max-h-[82vh]
                rounded-3xl
                shadow-2xl
              "
            />
          )}

          {/* 信息卡片 */}
          <div
            className="
              mt-6
              w-full
              max-w-5xl
              rounded-3xl
              bg-white/10
              backdrop-blur-2xl
              border border-white/20
              p-6
              md:p-8
              shadow-2xl
            "
          >
            {/* 标题 */}
            <h1
              className="
                text-3xl
                md:text-5xl
                font-bold
                mb-6
              "
            >
              {data.title || '未命名'}
            </h1>

            {/* 信息 */}
            <div
              className="
                grid
                md:grid-cols-2
                gap-5
                text-white/90
              "
            >
              <div>
                <p className="text-sm text-white/60 mb-1">
                  拍摄时间
                </p>

                <p className="text-lg">
                  {data.taken_time
                    ? new Date(data.taken_time).toLocaleString()
                    : '未知'}
                </p>
              </div>

              <div>
                <p className="text-sm text-white/60 mb-1">
                  地点
                </p>

                <p className="text-lg">
                  {data.location || '未知'}
                </p>
              </div>
            </div>

            {/* 故事 */}
            <div className="mt-8">
              <p className="text-sm text-white/60 mb-2">
                故事
              </p>

              <p
                className="
                  leading-8
                  text-lg
                  text-white/95
                  whitespace-pre-wrap
                "
              >
                {data.story || '暂无故事'}
              </p>
            </div>

            {/* 关键词 */}
            <div className="mt-8">
              <p className="text-sm text-white/60 mb-3">
                关键词
              </p>

              <div className="flex flex-wrap gap-3">
                {data.keywords?.map((keyword: string) => (
                  <span
                    key={keyword}
                    className="
                      px-4 py-2
                      rounded-full
                      bg-white/10
                      border border-white/20
                      backdrop-blur-xl
                      text-sm
                    "
                  >
                    #{keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}