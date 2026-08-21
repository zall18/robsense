import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function Home() {
  const cookieStore = await cookies();
  const hasSeenOnboarding = cookieStore.get('hasSeenOnboarding');
  
  if (hasSeenOnboarding) {
    redirect('/warga/peta');
  } else {
    redirect('/warga/onboarding');
  }
}
