import { createTranslation } from '@/i18n/server';
import { Metadata } from 'next';
import dynamic from 'next/dynamic';
const ChatComponent = dynamic(() => import('@/components/Generic/Chat/ChatComponent'), { ssr: false });

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await createTranslation();
  return {
    title: t('chat'),
  };
}

const ChatPage = () => {
  return <ChatComponent variant="page" />;
};

export default ChatPage;
