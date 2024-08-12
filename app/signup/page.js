'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth'
import { auth } from '@/firebase.js'
import { getAuth, GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from 'firebase/auth'
import Image from 'next/image'

export default function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [theme, setTheme] = useState('dark') // Setting default theme to dark
  const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth)
  const router = useRouter()

  const handleSignUp = async () => {
    if (!email || !password) {
      alert('Please enter both email and password')
      return
    }

    try {
      const res = await createUserWithEmailAndPassword(email, password)
      console.log(res)
      setEmail('')
      setPassword('')
      router.push('/chat')
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        alert('Email already in use. Please sign in instead.')
      } else {
        console.error(error)
        alert('Error signing up. Please try again.')
      }
    }
  }

  const signInWithGoogle = async () => {
    const auth = getAuth()
    const provider = new GoogleAuthProvider()
    try {
      await signInWithPopup(auth, provider)
      router.push('/chat')
    } catch (error) {
      console.error("Error signing in with Google:", error)
    }
  }

  const signInWithGithub = async () => {
    const auth = getAuth()
    const provider = new GithubAuthProvider()
    try {
      await signInWithPopup(auth, provider)
      router.push('/chat')
    } catch (error) {
      console.error("Error signing in with GitHub:", error)
    }
  }

  const handleThemeChange = (e) => {
    setTheme(e.target.value)
  }

  const getThemeColors = () => {
    switch (theme) {
      case 'dark':
        return {
          primary: 'bg-[#00000a]',
          secondary: 'bg-[#000025]',
          accent: 'bg-[#05d307]',
          text: 'text-[#999999]',
          border: 'border-[#616161]'
        }
      case 'light':
        return {
          primary: 'bg-[#6f88a1]',
          secondary: 'bg-[#ed1c24]',
          accent: 'bg-[#05d307]',
          text: 'text-[#616161]',
          border: 'border-[#999999]'
        }
      default:
        return {
          primary: 'bg-[#00000a]',
          secondary: 'bg-[#000025]',
          accent: 'bg-[#05d307]',
          text: 'text-[#999999]',
          border: 'border-[#616161]'
        }
    }
  }

  const { primary, secondary, accent, text, border } = getThemeColors()

  return (
    <div className={`w-full h-screen flex flex-col md:flex-row ${primary} text-[#05001b] transition-all`}>
      <div className='relative md:w-1/2 w-full h-[50vh] md:h-full flex flex-col items-center justify-center p-4 bg-[#ffffff]'>
        <Image
          src={'/botLogo.png'}
          alt='Logo'
          width={200}
          height={200}
          className='mb-4'
        />
        <h1 className={`text-4xl font-bold mb-4 text-center`}>GitBot</h1>
        <p className={`text-xl font-semibold mb-4 text-center text-[#616161]`}>Your go-to assistant for Git and GitHub support.</p>
      </div>

      <div className={`md:w-1/2 w-full h-full bg-[#05001b] text-[#fff] flex flex-col border-t md:border-t-0 md:border-l ${border} p-8 md:p-20 justify-between items-center`}>
        <div className='w-full flex flex-col max-w-[400px]'>
          <div className='w-full flex flex-col mb-6'>
            <h3 className='text-3xl font-semibold mb-4 text-center'>Sign Up</h3>
            <p className='text-base font-semibold mb-2 text-center'>Hello! Enter your details to get started.</p>
          </div>

          <div className='w-full flex flex-col'>
            <input
              type="email"
              id="email"
              value={email}
              placeholder='Email'
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full py-3 bg-transparent my-2 border-b ${border} outline-none focus:border-${accent} transition-all`}
            />
            <input
              type="password"
              id="password"
              value={password}
              placeholder='Password'
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full py-3 bg-transparent my-2 border-b ${border} outline-none focus:border-${accent} transition-all`}
            />
          </div>

          <div className='w-full flex flex-col my-4'>
            <button onClick={handleSignUp} className={`w-full bg-[#fff] text-[#05001b] font-semibold rounded-md p-4 text-center flex items-center justify-center focus:outline-none hover:bg-opacity-90 transition-all`}>
              Sign Up
            </button>
          </div>

          <div className='w-full flex items-center justify-center relative py-2'>
            <p className={`text-lg absolute text-[#fff] px-2 pb-5`}>or</p>
          </div>

          <button onClick={signInWithGoogle} className={`w-full bg-white text-[#05001b] font-semibold border ${border} rounded-md p-4 text-center flex items-center justify-center focus:outline-none hover:bg-gray-50 transition-all mb-2`}>
            <Image src={'/google-icon.png'} width={20} height={20} className='mr-2' />
            Sign Up with Google
          </button>

          <button onClick={signInWithGithub} className={`w-full bg-white text-[#05001b] font-semibold border ${border} rounded-md p-4 text-center flex items-center justify-center focus:outline-none hover:bg-gray-50 transition-all`}>
            <Image src={'/github-icon.png'} width={20} height={20} className='mr-2' />
            Sign Up with GitHub
          </button>
        </div>

        <div className='w-full flex items-center justify-center mt-4'>
          <p className={`text-sm font-normal`}>Already have an account? <a href="/signin" className='font-semibold underline underline-offset-2 cursor-pointer'>Sign in</a></p>
        </div>
      </div>
    </div>
  )
}
