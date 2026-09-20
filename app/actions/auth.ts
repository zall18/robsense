'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getAdminCredentials, createAdminToken } from '@/lib/auth';

export async function loginAdmin(formData: FormData) {
  const email = formData.get('email')?.toString().trim();
  const password = formData.get('password')?.toString();

  const { email: expectedEmail, password: expectedPassword } = getAdminCredentials();

  if (email === expectedEmail && password === expectedPassword) {
    const token = await createAdminToken();
    const cookieStore = await cookies();
    cookieStore.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    redirect('/admin');
  }

  return { error: 'Email atau kata sandi salah. Pastikan data akun valid.' };
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_token');
  redirect('/admin/login');
}
