'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function loginAdmin(formData: FormData) {
  const email = formData.get('email');
  const password = formData.get('password');

  // Dummy login for MVP
  if (email && password === 'admin123') {
    const cookieStore = await cookies();
    cookieStore.set('admin_token', 'valid-admin-session', { httpOnly: true, path: '/' });
    redirect('/admin');
  }

  return { error: 'Email atau kata sandi salah' };
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_token');
  redirect('/admin/login');
}
