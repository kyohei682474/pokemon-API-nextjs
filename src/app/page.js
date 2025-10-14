'use client'
import { useState, useEffect, useRef } from 'react';  
import useSWRInfinite from 'swr/infinite';

export default function Home() {
  const observerTarget = useRef(null);

  // getKey を追加（新規）
  const getKey = (pageIndex, previousPageData) => {
    if (previousPageData && !previousPageData.next) return null;
    return `https://pokeapi.co/api/v2/pokemon?limit=20&offset=${pageIndex * 20}`;
  };

  // fetcher
  const fetcher = async (url) => {
    const response = await fetch(url);
    const data = await response.json();
    
    const pokemonDetails = await Promise.all(
      data.results.map(async (pokemon) => {
        const res = await fetch(pokemon.url);
        return res.json();
      })
    );
    
    return {
      pokemons: pokemonDetails,
      next: data.next
    };
  };
  
  // useWRInfinite
  const { data, size, setSize, isLoading } = useSWRInfinite(
    getKey,
    fetcher,
    {
      revalidateFirstPage: false,
      revalidateAll: false,
    }
  );

  const pokemons = data ? data.flatMap(page => page.pokemons) : [];
  
  //まだデータがあるのか最終状態を取得
  const hasMore = data && data[data.length - 1]?.next;
  
  //読み込み中でまだデータがある時に
  const loadMore = () => {
    if(!isLoading && hasMore){
      setSize(size + 1);//sizeを増やすと次のページを取得する
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
          下にスクロールすると次々とポケモンが表示されます
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {pokemons.map((pokemon) => (
          <div
            key={pokemon.id}
            className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-4 flex flex-col items-center"
          >
            <img
              src={pokemon.sprites.front_default}
              alt={pokemon.name}
              className="w-24 h-24"
            />
            
            <div className="text-center mt-2">
              <p className="text-sm text-gray-500">No.{pokemon.id}</p>
              <h3 className="font-bold text-lg capitalize">{pokemon.name}</h3>
            </div>
            
            <div className="flex gap-2 mt-2">
              {pokemon.types.map((type) => (
                <span
                  key={type.type.name}
                  className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800"
                >
                  {type.type.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {isLoading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">ポケモンを探しています...</p>
        </div>
      )}

      {!hasMore && (
        <div className="text-center py-8">
          <p className="text-gray-600">すべてのポケモンを表示しました！</p>
        </div>
      )}

      <div ref={observerTarget} className="h-10"></div>
    </div>
  );
}