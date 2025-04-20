import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const DateFormatter = ({ date }) => {
  const formattedDate = format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: ptBR });
  const relativeTime = formatDistanceToNow(new Date(date), { locale: ptBR, addSuffix: true });

  return (
    <div>
      <div>{formattedDate}</div>
      <div style={{ fontSize: '0.8em', color: '#666' }}>{relativeTime}</div>
    </div>
  );
};

export default DateFormatter;