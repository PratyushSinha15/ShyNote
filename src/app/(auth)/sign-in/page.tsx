'use client'
import { useSession, signIn, signOut } from "next-auth/react"
//default loading screen


export default function component() {
  //here we are using the useSession hook to get the session object from the next auth
  const { data: session, status } = useSession();
  //if the session is loading then we will return a loading screen
  if(status === "loading") return <div>Loading...</div>
  //if the session is present then we will return the user details
  if(session){
    return (
      <div>
        <h1>Welcome {session.user.email}</h1>
        <button className="bg-white border rounded-lg ml-5 p-2" onClick={()=>signOut()}>Sign Out</button>
      </div>
    )
  }
  return (
    <div>
      <h1>Not Signed in</h1>
      <button className="bg-white text-black border rounded-lg ml-5 p-2" onClick={()=>signIn()}>Sign In</button>
    </div>
  )
}
