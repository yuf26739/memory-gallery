'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  // 已登录自动回首页
  useEffect(() => {
    checkLogin()
  }, [])

  const checkLogin = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (session) {
      router.replace('/')
    }
  }

  // 登录
  const login = async () => {
    if (!email || !password) {
      alert('请输入邮箱和密码')
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)

    if (error) {
      alert('邮箱或密码错误')
      return
    }

    router.replace('/')
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white flex items-center justify-center px-6">

      {/* 背景光效 */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="
            absolute
            top-[-200px]
            left-[-100px]
            w-[500px]
            h-[500px]
            rounded-full
            bg-white/10
            blur-3xl
          "
        />

        <div
          className="
            absolute
            bottom-[-200px]
            right-[-100px]
            w-[500px]
            h-[500px]
            rounded-full
            bg-white/10
            blur-3xl
          "
        />

        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* 登录卡片 */}
      <div
        className="
          relative
          z-10
          w-full
          max-w-md
          rounded-[40px]
          border
          border-white/10
          bg-white/10
          backdrop-blur-2xl
          shadow-2xl
          p-10
        "
      >
        {/* 顶部 */}
        <div className="text-center mb-10">

          {/* 小标题 */}
          <div
            className="
              text-white/40
              tracking-[0.5em]
              uppercase
              text-xs
              mb-4
            "
          >
            账号认证
          </div>

          {/* 标题 */}
          <h1
            className="
              text-5xl
              font-black
              tracking-[0.2em]
              mb-4
            "
          >
            cici&cuicui
          </h1>

          {/* 副标题 */}
          <p className="text-white/50 leading-7">
            进入私人记忆空间
            <br />
            每一段故事都值得被保存
          </p>
        </div>

        {/* 输入区域 */}
        <div className="flex flex-col gap-5">

          {/* 邮箱 */}
          <input
            type="email"
            placeholder="输入邮箱"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="
              h-14
              rounded-2xl
              bg-white/10
              border
              border-white/10
              px-5
              outline-none
              backdrop-blur-xl
              placeholder:text-white/30
              focus:border-white/40
              transition-all
            "
          />

          {/* 密码 */}
          <input
            type="password"
            placeholder="输入密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="
              h-14
              rounded-2xl
              bg-white/10
              border
              border-white/10
              px-5
              outline-none
              backdrop-blur-xl
              placeholder:text-white/30
              focus:border-white/40
              transition-all
            "
          />

          {/* 登录按钮 */}
          <button
            onClick={login}
            disabled={loading}
            className="
              mt-4
              h-14
              rounded-2xl
              bg-white
              text-black
              font-bold
              text-lg
              hover:scale-[1.03]
              active:scale-[0.98]
              transition-all
              duration-300
              shadow-2xl
            "
          >
            {loading ? '进入中...' : '登录'}
          </button>
        </div>

        {/* 底部 */}
        <div
          className="
            mt-8
            text-center
            text-white/30
            text-sm
            tracking-widest
          "
        >
            没有账号？联系 cici或cuicui 获取访问权限
        </div>
      </div>
    </main>
  )
}
