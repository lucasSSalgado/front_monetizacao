'use client'

import { useEffect, useState } from 'react'
import { NfeResponse, Busca } from '../types/type'

export default function ResultsPage() {
  const [originalResults, setOriginalResults] = useState<NfeResponse[]>([])
  const [includeKeywords, setIncludeKeywords] = useState<string[]>([])
  const [excludeKeywords, setExcludeKeywords] = useState<string[]>([])
  const [currentIncludeKeyword, setCurrentIncludeKeyword] = useState('')
  const [currentExcludeKeyword, setCurrentExcludeKeyword] = useState('')

  useEffect(() => {
    const storedResults = sessionStorage.getItem('searchResults')
    const storedQuery = sessionStorage.getItem('searchQuery')

    if (storedResults) {
      let parsedResults 
      try {
        parsedResults = JSON.parse(storedResults)
        setOriginalResults(parsedResults)

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setOriginalResults([])
      }
    }

    if (storedQuery) {
      const parsedKeywords = JSON.parse(storedQuery)
      setIncludeKeywords(parsedKeywords)
    }
  }, [])

  const handleAddIncludeKeyword = () => {
    if (currentIncludeKeyword && !includeKeywords.includes(currentIncludeKeyword)) {
      setIncludeKeywords([...includeKeywords, currentIncludeKeyword])
      setCurrentIncludeKeyword('')
    }
  }

  const handleRemoveIncludeKeyword = (keywordToRemove: string) => {
    setIncludeKeywords(includeKeywords.filter(keyword => keyword !== keywordToRemove))
  }

  const handleAddExcludeKeyword = () => {
    if (currentExcludeKeyword && !excludeKeywords.includes(currentExcludeKeyword)) {
      setExcludeKeywords([...excludeKeywords, currentExcludeKeyword])
      setCurrentExcludeKeyword('')
    }
  }

  const handleRemoveExcludeKeyword = (keywordToRemove: string) => {
    setExcludeKeywords(excludeKeywords.filter(keyword => keyword !== keywordToRemove))
  }

  const handleNewSearch = async () => {
    const busca: Busca = {
      termosInclude: includeKeywords.map(k => [k]),
      termosExclude: excludeKeywords,
      periodo: ["2024-12-25", "2025-07-17"]
    };

    const t = await fetch('http://localhost:8080/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(busca)
    });

    let r
    try {
      r = await t.json()
      setOriginalResults(r);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setOriginalResults([])
    }
    
    sessionStorage.setItem('searchResults', JSON.stringify(r));
    sessionStorage.setItem('searchQuery', JSON.stringify(includeKeywords));
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-1/4 bg-gray-100 p-4">
        <h2 className="text-lg font-semibold mb-4">Adicionar Filtros</h2>
        <div className="mb-4">
          <label htmlFor="include" className="block text-sm font-medium text-gray-700">Include Keywords</label>
          <div className="flex mt-1">
            <input
              type="text"
              id="include"
              value={currentIncludeKeyword}
              onChange={(e) => setCurrentIncludeKeyword(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            <button onClick={handleAddIncludeKeyword} className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md">Add</button>
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="exclude" className="block text-sm font-medium text-gray-700">Exclude Keywords</label>
          <div className="flex mt-1">
            <input
              type="text"
              id="exclude"
              value={currentExcludeKeyword}
              onChange={(e) => setCurrentExcludeKeyword(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            <button onClick={handleAddExcludeKeyword} className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md">Add</button>
          </div>
        </div>
        <button 
            onClick={handleNewSearch}
            className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
            Nova Busca
        </button>
      </div>

      <div className="w-3/4 p-4">
        <div className="flex items-center mb-4">
            <h1 className="text-2xl font-bold">Search Results for:</h1>
            <div className="ml-4 flex flex-wrap gap-2">
                {includeKeywords.map((keyword, index) => (
                    <div key={index} className="flex items-center bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
                        <span>{keyword}</span>
                        <button onClick={() => handleRemoveIncludeKeyword(keyword)} className="ml-2 text-red-500 hover:text-red-700">x</button>
                    </div>
                ))}
            </div>
        </div>
        <div className="flex items-center mb-4">
            <h2 className="text-xl font-bold">Excluding:</h2>
            <div className="ml-4 flex flex-wrap gap-2">
                {excludeKeywords.map((keyword, index) => (
                    <div key={index} className="flex items-center bg-red-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
                        <span>{keyword}</span>
                        <button onClick={() => handleRemoveExcludeKeyword(keyword)} className="ml-2 text-red-500 hover:text-red-700">x</button>
                    </div>
                ))}
            </div>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GTIN</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data de Emissão</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preço</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Município</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NCM</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {originalResults && originalResults.length > 0 && originalResults.map((result, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">{result.gtin}</td>
                <td className="px-6 py-4 whitespace-nowrap">{`${result.dtEmissao}`}</td>
                <td className="px-6 py-4 whitespace-nowrap">{result.description}</td>
                <td className="px-6 py-4 whitespace-nowrap">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(result.price)}</td>
                <td className="px-6 py-4 whitespace-nowrap">{result.municipio}</td>
                <td className="px-6 py-4 whitespace-nowrap">{result.ncm}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
