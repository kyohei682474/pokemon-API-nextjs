import Image from 'next/image';

interface PokemonCardProps {
  name: string;
  imageUrl: string;
  id: number;
  types?: string[];
}

export default function PokemonCard({ name, imageUrl, id, types }: PokemonCardProps) {
  return (
    <div
      style={{
        border: '1px solid #d1d5db',
        borderRadius: '8px',
        padding: '16px',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        backgroundColor: 'white',
        transition: 'box-shadow 0.3s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)';
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '192px',
          marginBottom: '16px',
          backgroundColor: '#f9fafb',
          borderRadius: '8px',
          overflow: 'hidden',
        }}
      >
        <Image
          src={imageUrl}
          alt={`${name}の画像`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{ objectFit: 'contain', padding: '8px' }}
          loading="eager"
          unoptimized
        />
      </div>
      <h3
        style={{
          fontSize: '1.25rem',
          fontWeight: 'bold',
          textTransform: 'capitalize',
          textAlign: 'center',
          marginBottom: '8px',
          color: '#111827',
        }}
      >
        {name}
      </h3>
      <p
        style={{
          color: '#6b7280',
          textAlign: 'center',
          fontSize: '0.875rem',
          marginBottom: '8px',
        }}
      >
        No. {id}
      </p>
      {types && types.length > 0 && (
        <div
          style={{
            display: 'flex',
            gap: '8px',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          {types.map((type) => (
            <span
              key={type}
              style={{
                padding: '4px 12px',
                backgroundColor: '#dbeafe',
                color: '#1e40af',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: '600',
              }}
            >
              {type}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}