import Image from 'next/image'
import {signIn, supabaseClient} from  '@/lib/supabaseClient'
import React from 'react';

export default function Home() {
  
  const [password, setPassword] = React.useState<string>('')
  const [email, setEmail] = React.useState<string>('')
  const [passwordVisble, setPasswordVisble] = React.useState<boolean>(false)

  const [user, setUser] = React.useState<any>(null)
  const [error, setError] = React.useState<any>(null)

  async function onClickSignIn() {
    const result = await signIn(
      supabaseClient, 
      email,
      password,
    )

    if (result.data) setUser(result.data)
    if (result.error) setError(result.error)
    console.log(result)
    console.log(error)
  }


  if (user) return <div>Welcome user</div>

  
  



  return (
    <div >


      <div className="relative mt-2 rounded-md shadow-sm m-9">
        <label htmlFor='username'>Email</label>
        <div className="relative mt-2 rounded-md shadow-sm">
          <input
            type="text"
            name="username"
            id="username"
            className="block w-full rounded-md border-0 py-1.5 pl-2 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="example@example.com"
            onChange = {(e) => {setEmail(e.target.value)}}
          />
        </div>
      </div>

      <div className="relative mt-2 rounded-md shadow-sm mx-9">
        <label htmlFor='password'>Password</label>
        <div className="relative mt-2 rounded-md shadow-sm">
          <input
            type={passwordVisble? "text": "password"}
            name="password"
            id="password"
            className="block w-full rounded-md border-0 py-1.5 pl-2 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="password"
            onChange={(e) => { setPassword(e.target.value) }}
          />
          <button className="absolute inset-y-0 right-3 flex items-center" onClick={()=>setPasswordVisble(!passwordVisble)}>
            x</button>
        </div>
      </div>


      <div className='mt-3 mx-9'>
        <button onClick={onClickSignIn}
        className="inline-flex items-center m-3 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"

      >Sign in</button>
        <button onClick={onClickSignIn}
          className="inline-flex items-center m-3 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"

        >Sign Up</button>
      </div>




    </div>
  )
}
