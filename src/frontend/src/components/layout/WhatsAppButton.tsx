import { useQuery } from '@tanstack/react-query';
import { useActor } from '../../hooks/useActor';
import { Loader2 } from 'lucide-react';

export default function WhatsAppButton() {
  const { actor, isFetching: actorFetching } = useActor();

  const { data: whatsappLink, isLoading } = useQuery<string>({
    queryKey: ['whatsappLink'],
    queryFn: async () => {
      if (!actor) return '';
      return actor.getWhatsAppLink();
    },
    enabled: !!actor && !actorFetching,
  });

  // Don't show button if no WhatsApp number is configured or still loading
  if (isLoading || !whatsappLink || whatsappLink === 'https://wa.me/') {
    return null;
  }

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-[#25D366]/50"
      style={{ backgroundColor: '#25D366' }}
      aria-label="Contact us on WhatsApp"
    >
      <img
        src="/assets/generated/whatsapp-icon.dim_64x64.png"
        alt="WhatsApp"
        className="w-8 h-8"
      />
    </a>
  );
}
