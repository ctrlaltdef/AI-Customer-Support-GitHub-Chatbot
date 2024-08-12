'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function Home() {
  const router = useRouter()

  const handleSignIn = () => {
    router.push('/signin')
  }

  const handleSignUp = () => {
    router.push('/signup')
  }
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="flex flex-col items-center mb-8">
        <Image
          src={'/botLogo.png'}
          alt='GitBot Logo'
          width={200}
          height={200}
          className='mb-4'
        />
        <h1 className="text-5xl font-bold text-[#000025] mb-4">Welcome to GitBot</h1>
        <p className="text-xl text-[#616161] text-center max-w-2xl">
          GitBot is your friendly assistant here to help you navigate both Git and GitHub. Whether you're a beginner or an experienced developer, GitBot is designed to make your experience with version control and repository management smoother and more enjoyable.
        </p>
      </div>
      <div className="flex space-x-4">
        <button
          onClick={handleSignIn}
          className="bg-[#05d307] text-white font-semibold py-2 px-4 rounded hover:bg-[#05001b]"
        >
          Sign In
        </button>
        <button
          onClick={handleSignUp}
          className="bg-[#ed1c24] text-white font-semibold py-2 px-4 rounded hover:bg-[#05001b]"
        >
          Sign Up
        </button>
      </div>
    </div>
  )
}