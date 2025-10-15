'use client'
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import useSWRInfinite from 'swr/infinite';

export default function Home() {
  const PAGE_SIZE = 20;
  const observerTarget = useRef(null);

  const getKey = (pageIndex, previousPageData) => {
    if (previousPageData && !previousPageData.next) return null;
    return `https://pokeapi.co/api/v2/pokemon?limit=20&offset=${pageIndex * PAGE_SIZE}`;
  };

  const fetcher = async (url) => {
    const response = await fetch(url);
    const data = await response.json();
    
    // シンプルに必要な情報だけ
    const pokemons = data.results.map((pokemon) => {
      const id = parseInt(pokemon.url.split('/').slice(-2, -1)[0]);
      
      return {
        id: id,
        name: pokemon.name,
        sprites: {
          front_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
        }
        // types は削除（不要）
      };
    });
    
    return {
      pokemons: pokemons,
      next: data.next
    };
  };

  const { data, size, setSize, isLoading } = useSWRInfinite(
    getKey,
    fetcher,
    {
      revalidateFirstPage: false,
      revalidateAll: false,
    }
  );

  const pokemons = data ? data.flatMap(page => page.pokemons) : [];
  const hasMore = data && data[data.length - 1]?.next;

  const loadMore = () => {
    if (!isLoading && hasMore) {
      setSize(size + 1);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [isLoading, hasMore, size]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto mb-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-2">
          ポケモン図鑑 🎮
        </h1>
        <p className="text-center text-gray-600">
          {pokemons.length} 匹表示中
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {pokemons.map((pokemon) => (
          <div
            key={pokemon.id}
            className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-4 flex flex-col items-center"
          >
            <Image
              src={pokemon.sprites.front_default}
              alt={pokemon.name}
              width={500}
              height={500}
              // className="w-24 h-24"
            />
            
            <div className="text-center mt-2">
              <p className="text-sm text-gray-500">No.{pokemon.id}</p>
              <h3 className="font-bold text-lg capitalize">{pokemon.name}</h3>
            </div>
            
            {/* タイプ表示部分を完全削除 */}
          </div>
        ))}
      </div>

      {isLoading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      )}

      {!hasMore && !isLoading && (
        <div className="text-center py-8">
          <p className="text-gray-600">すべてのポケモンを表示しました！</p>
        </div>
      )}

      <div ref={observerTarget} className="h-10" />
    </div>
  );
}