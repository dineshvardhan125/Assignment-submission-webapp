'use client';

import { usePathname } from 'next/navigation';


export default function ConditionalNavbar() {
  const pathname = usePathname();
  
  // Don't show navbar on login and register pages
  const hideNavbar = pathname === '/login' || pathname === '/register';
  
  if (hideNavbar) return null;
  

}
