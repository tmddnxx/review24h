import { NextRequest, NextResponse } from 'next/server';
export {default} from 'next-auth/middleware'

export async function middleware(req: NextRequest) {
  
  const isLogin = await req.cookies.get('next-auth.session-token'); // 로그인 여부
 
  if(!isLogin){
    const url = new URL('/authentication/login', req.url);
    
    url.searchParams.set('isLogin', 'false');
  
    // 리다이렉트
    return NextResponse.redirect(url);
  }
 return NextResponse.next(); 
}


export const config = {
  matcher: ['/authentication/account/'],
}