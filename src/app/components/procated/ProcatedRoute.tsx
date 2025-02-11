import { useRouter } from 'next/navigation';
import { useEffect } from 'react';


export default function ProcatedRoute ({children} : {children : React.ReactNode}) {
  const router = useRouter()

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    if(!isLoggedIn){
        router.push('/admin')
    }
  },[router])
  return <>
  {children}
  </>
}