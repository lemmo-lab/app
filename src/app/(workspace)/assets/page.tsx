import { redirect } from 'next/navigation';

export default function AssetsRootRedirect() {
  redirect('/app/assets');
}
